"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
    RefreshCw,
} from "lucide-react";

import type {
    LatLngBoundsExpression,
} from "leaflet";

import * as zarr from "zarrita";

const DEFAULT_PALETTE = [
    "#30123b",
    "#4145ab",
    "#2a7bde",
    "#1ac7c2",
    "#7ad151",
    "#fde725",
    "#fdae32",
    "#f1602d",
    "#a50026",
];

interface ZarrArrayNode {
    shape: readonly number[];
    dimensionNames?: readonly (string | null)[];
    attrs?: Record<string, unknown>;
    fillValue?: unknown;
}

interface LoadedZarrDataset {
    variableArray: ZarrArrayNode;
    timeValues: Array<number | bigint | string>;
    timeLabels: string[];
    latValues: number[];
    lonValues: number[];
    variableDimensions: string[];
    frameCount: number;
    bounds: LatLngBoundsExpression;
    scaleFactor: number;
    addOffset: number;
    fillValues: Set<number>;
}

interface CachedFrame {
    url: string;
    lastUsed: number;
}

export interface UseZarrAnimationOptions {
    url: string;
    variableName: string;
    latName?: string;
    lonName?: string;
    timeName?: string;
    minValue: number;
    maxValue: number;
    palette?: string[];
    frameDurationMs?: number;
    opacity?: number;
    cacheSize?: number;
    enabled?: boolean;
}

export interface ZarrAnimationController {
    frameUrl: string | null;
    bounds: LatLngBoundsExpression | null;
    frameIndex: number;
    frameCount: number;
    currentTimeLabel: string;
    isPlaying: boolean;
    isLoadingMetadata: boolean;
    isLoadingFrame: boolean;
    error: string | null;
    opacity: number;
    frameDurationMs: number;
    palette: string[];
    minValue: number;
    maxValue: number;
    setFrameIndex: (index: number) => void;
    setOpacity: (value: number) => void;
    setFrameDurationMs: (value: number) => void;
    togglePlaying: () => void;
    play: () => void;
    pause: () => void;
    reload: () => void;
}

function isRecord(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function asNumber(
    value: unknown,
    fallback: number
): number {
    return typeof value === "number" &&
        Number.isFinite(value)
        ? value
        : fallback;
}

function readNumberAttribute(
    attrs: Record<string, unknown> | undefined,
    key: string,
    fallback: number
): number {
    return asNumber(attrs?.[key], fallback);
}

function collectFillValues(
    arrayNode: ZarrArrayNode
): Set<number> {
    const candidates = [
        arrayNode.fillValue,
        arrayNode.attrs?._FillValue,
        arrayNode.attrs?.missing_value,
    ];

    const values = new Set<number>();

    for (const candidate of candidates) {
        if (
            typeof candidate === "number" &&
            Number.isFinite(candidate)
        ) {
            values.add(candidate);
        }
    }

    return values;
}

function normalizeDimensionNames(
    arrayNode: ZarrArrayNode
): string[] {
    const directNames =
        arrayNode.dimensionNames
            ?.filter(
                (name): name is string =>
                    typeof name === "string" &&
                    name.length > 0
            ) ?? [];

    if (
        directNames.length ===
        arrayNode.shape.length
    ) {
        return directNames;
    }

    const attrsDimensions =
        arrayNode.attrs?._ARRAY_DIMENSIONS;

    if (
        Array.isArray(attrsDimensions) &&
        attrsDimensions.every(
            (name) => typeof name === "string"
        )
    ) {
        return attrsDimensions as string[];
    }

    return [];
}

function toNumberArray(
    data: ArrayLike<unknown>
): number[] {
    return Array.from(
        { length: data.length },
        (_, index) => Number(data[index])
    );
}

function coordinateBounds(
    values: number[]
): [number, number] {
    if (values.length === 0) {
        throw new Error(
            "La coordenada espacial está vacía"
        );
    }

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    if (values.length === 1) {
        return [minimum - 0.5, maximum + 0.5];
    }

    const step = Math.abs(
        values[1] - values[0]
    );

    const padding =
        Number.isFinite(step) && step > 0
            ? step / 2
            : 0;

    return [
        minimum - padding,
        maximum + padding,
    ];
}

function decodeCfTimeValue(
    value: number | bigint | string,
    units: unknown
): string {
    if (typeof value === "string") {
        const parsed = Date.parse(value);

        return Number.isFinite(parsed)
            ? new Date(parsed).toISOString()
            : value;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
        return String(value);
    }

    if (typeof units === "string") {
        const match = units.match(
            /^\s*(nanoseconds?|microseconds?|milliseconds?|seconds?|minutes?|hours?|days?)\s+since\s+(.+)$/i
        );

        if (match) {
            const unit = match[1].toLowerCase();
            const baseTime = Date.parse(
                match[2].trim().replace(" ", "T")
            );

            const multipliers: Record<string, number> = {
                nanosecond: 1e-6,
                nanoseconds: 1e-6,
                microsecond: 1e-3,
                microseconds: 1e-3,
                millisecond: 1,
                milliseconds: 1,
                second: 1_000,
                seconds: 1_000,
                minute: 60_000,
                minutes: 60_000,
                hour: 3_600_000,
                hours: 3_600_000,
                day: 86_400_000,
                days: 86_400_000,
            };

            if (Number.isFinite(baseTime)) {
                return new Date(
                    baseTime +
                    numericValue *
                    multipliers[unit]
                ).toISOString();
            }
        }
    }

    if (Math.abs(numericValue) > 1e16) {
        return new Date(
            numericValue / 1e6
        ).toISOString();
    }

    if (Math.abs(numericValue) > 1e13) {
        return new Date(
            numericValue / 1e3
        ).toISOString();
    }

    if (Math.abs(numericValue) > 1e11) {
        return new Date(
            numericValue
        ).toISOString();
    }

    return String(value);
}

function hexToRgb(
    hex: string
): [number, number, number] {
    const normalized = hex
        .replace("#", "")
        .trim();

    const expanded =
        normalized.length === 3
            ? normalized
                .split("")
                .map((character) =>
                    `${character}${character}`
                )
                .join("")
            : normalized;

    const parsed = Number.parseInt(
        expanded,
        16
    );

    if (!Number.isFinite(parsed)) {
        return [0, 0, 0];
    }

    return [
        (parsed >> 16) & 255,
        (parsed >> 8) & 255,
        parsed & 255,
    ];
}

function interpolatePalette(
    value: number,
    minimum: number,
    maximum: number,
    palette: string[]
): [number, number, number, number] {
    if (!Number.isFinite(value)) {
        return [0, 0, 0, 0];
    }

    const safePalette =
        palette.length >= 2
            ? palette
            : DEFAULT_PALETTE;

    const normalized = Math.min(
        1,
        Math.max(
            0,
            (value - minimum) /
            Math.max(maximum - minimum, 1e-12)
        )
    );

    const scaled =
        normalized *
        (safePalette.length - 1);

    const lowerIndex = Math.floor(scaled);
    const upperIndex = Math.min(
        lowerIndex + 1,
        safePalette.length - 1
    );

    const localRatio = scaled - lowerIndex;

    const lower = hexToRgb(
        safePalette[lowerIndex]
    );

    const upper = hexToRgb(
        safePalette[upperIndex]
    );

    return [
        Math.round(
            lower[0] +
            (upper[0] - lower[0]) *
            localRatio
        ),
        Math.round(
            lower[1] +
            (upper[1] - lower[1]) *
            localRatio
        ),
        Math.round(
            lower[2] +
            (upper[2] - lower[2]) *
            localRatio
        ),
        220,
    ];
}

async function canvasToObjectUrl(
    canvas: HTMLCanvasElement
): Promise<string> {
    const blob = await new Promise<Blob>(
        (resolve, reject) => {
            canvas.toBlob(
                (createdBlob) => {
                    if (!createdBlob) {
                        reject(
                            new Error(
                                "No fue posible convertir el frame a PNG"
                            )
                        );
                        return;
                    }

                    resolve(createdBlob);
                },
                "image/png"
            );
        }
    );

    return URL.createObjectURL(blob);
}

async function renderFrame(
    loaded: LoadedZarrDataset,
    frameIndex: number,
    options: {
        variableName: string;
        timeName: string;
        latName: string;
        lonName: string;
        minimum: number;
        maximum: number;
        palette: string[];
        signal: AbortSignal;
    }
): Promise<string> {
    const selectionByDimension: Record<
        string,
        number | null
    > = {};

    for (const dimension of
        loaded.variableDimensions) {
        if (dimension === options.timeName) {
            selectionByDimension[dimension] =
                frameIndex;
        } else if (
            dimension === options.latName ||
            dimension === options.lonName
        ) {
            selectionByDimension[dimension] =
                null;
        } else {
            selectionByDimension[dimension] = 0;
        }
    }

    const selection = zarr.select(
        loaded.variableArray as any,
        selectionByDimension
    );

    const region = await zarr.get(
        loaded.variableArray as any,
        selection,
        {
            signal: options.signal,
        }
    );

    const remainingDimensions =
        loaded.variableDimensions.filter(
            (dimension) =>
                selectionByDimension[dimension] ===
                null
        );

    const latAxis =
        remainingDimensions.indexOf(
            options.latName
        );

    const lonAxis =
        remainingDimensions.indexOf(
            options.lonName
        );

    if (latAxis < 0 || lonAxis < 0) {
        throw new Error(
            `La variable ${options.variableName} no produjo un frame lat/lon bidimensional`
        );
    }

    const width = loaded.lonValues.length;
    const height = loaded.latValues.length;

    const canvas =
        document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext(
        "2d",
        {
            alpha: true,
        }
    );

    if (!context) {
        throw new Error(
            "Canvas 2D no está disponible"
        );
    }

    const imageData =
        context.createImageData(
            width,
            height
        );

    const latDescending =
        loaded.latValues.length < 2 ||
        loaded.latValues[0] >
        loaded.latValues[
        loaded.latValues.length - 1
        ];

    const lonAscending =
        loaded.lonValues.length < 2 ||
        loaded.lonValues[0] <
        loaded.lonValues[
        loaded.lonValues.length - 1
        ];

    const shape = region.shape;
    const stride = region.stride;
    const data = region.data as ArrayLike<unknown>;

    for (let y = 0; y < height; y += 1) {
        const sourceLatIndex = latDescending
            ? y
            : height - 1 - y;

        for (let x = 0; x < width; x += 1) {
            const sourceLonIndex = lonAscending
                ? x
                : width - 1 - x;

            const coordinates = new Array(
                shape.length
            ).fill(0);

            coordinates[latAxis] =
                sourceLatIndex;
            coordinates[lonAxis] =
                sourceLonIndex;

            let sourceIndex = 0;

            for (
                let axis = 0;
                axis < coordinates.length;
                axis += 1
            ) {
                sourceIndex +=
                    coordinates[axis] *
                    stride[axis];
            }

            const rawValue = Number(
                data[sourceIndex]
            );

            const outputIndex =
                (y * width + x) * 4;

            if (
                !Number.isFinite(rawValue) ||
                loaded.fillValues.has(rawValue)
            ) {
                imageData.data[outputIndex + 3] = 0;
                continue;
            }

            const value =
                rawValue * loaded.scaleFactor +
                loaded.addOffset;

            const [red, green, blue, alpha] =
                interpolatePalette(
                    value,
                    options.minimum,
                    options.maximum,
                    options.palette
                );

            imageData.data[outputIndex] = red;
            imageData.data[outputIndex + 1] =
                green;
            imageData.data[outputIndex + 2] =
                blue;
            imageData.data[outputIndex + 3] =
                alpha;
        }
    }

    context.putImageData(
        imageData,
        0,
        0
    );

    return canvasToObjectUrl(canvas);
}

function resolveZarrUrl(
    value: string
): URL {
    /*
     * Es importante terminar en "/".
     *
     * Así Zarrita resuelve:
     * .zmetadata
     * .zgroup
     * variables/.zarray
     * chunks
     *
     * dentro de result.zarr y no en la raíz.
     */
    const normalizedValue =
        value.endsWith("/")
            ? value
            : `${value}/`;

    return new URL(
        normalizedValue,
        window.location.origin
    );
}

export function useZarrAnimation({
    url,
    variableName,
    latName = "lat",
    lonName = "lon",
    timeName = "time",
    minValue,
    maxValue,
    palette = DEFAULT_PALETTE,
    frameDurationMs: initialFrameDuration = 900,
    opacity: initialOpacity = 0.72,
    cacheSize = 8,
    enabled = true,
}: UseZarrAnimationOptions): ZarrAnimationController {
    const datasetRef = useRef<
        LoadedZarrDataset | null
    >(null);

    const frameCacheRef = useRef<
        Map<number, CachedFrame>
    >(new Map());

    const frameAbortRef = useRef<
        AbortController | null
    >(null);

    const [frameUrl, setFrameUrl] =
        useState<string | null>(null);

    const [bounds, setBounds] =
        useState<LatLngBoundsExpression | null>(
            null
        );

    const [frameIndexState, setFrameIndexState] =
        useState(0);

    const [frameCount, setFrameCount] =
        useState(0);

    const [timeLabels, setTimeLabels] =
        useState<string[]>([]);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [isLoadingMetadata, setIsLoadingMetadata] =
        useState(false);

    const [isLoadingFrame, setIsLoadingFrame] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [opacity, setOpacityState] =
        useState(initialOpacity);

    const [frameDurationMs, setFrameDurationState] =
        useState(initialFrameDuration);

    const [reloadVersion, setReloadVersion] =
        useState(0);

    const clearFrameCache = useCallback(() => {
        for (const cached of
            frameCacheRef.current.values()) {
            URL.revokeObjectURL(cached.url);
        }

        frameCacheRef.current.clear();
    }, []);

    useEffect(() => {
        if (!enabled) {
            setIsPlaying(false);
            setFrameUrl(null);
            setBounds(null);
            setFrameCount(0);
            datasetRef.current = null;
            clearFrameCache();
            return;
        }

        const controller =
            new AbortController();

        const loadMetadata = async () => {
            try {
                setIsLoadingMetadata(true);
                setError(null);
                setIsPlaying(false);
                setFrameUrl(null);
                setFrameIndexState(0);
                clearFrameCache();

                const absoluteZarrUrl =
                    resolveZarrUrl(url);

                console.log(
                    "[Zarr] Abriendo:",
                    absoluteZarrUrl.href
                );

                const baseStore =
                    new zarr.FetchStore(
                        absoluteZarrUrl
                    );

                const store =
                    await zarr.withMaybeConsolidatedMetadata(
                        baseStore
                    );
                const root = await zarr.open(
                    store,
                    {
                        kind: "group",
                    }
                );

                const [
                    variableArray,
                    latArray,
                    lonArray,
                    timeArray,
                ] = await Promise.all([
                    zarr.open(
                        root.resolve(variableName),
                        {
                            kind: "array",
                        }
                    ),
                    zarr.open(
                        root.resolve(latName),
                        {
                            kind: "array",
                        }
                    ),
                    zarr.open(
                        root.resolve(lonName),
                        {
                            kind: "array",
                        }
                    ),
                    zarr.open(
                        root.resolve(timeName),
                        {
                            kind: "array",
                        }
                    ),
                ]);

                const [
                    latRegion,
                    lonRegion,
                    timeRegion,
                ] = await Promise.all([
                    zarr.get(latArray, null, {
                        signal: controller.signal,
                    }),
                    zarr.get(lonArray, null, {
                        signal: controller.signal,
                    }),
                    zarr.get(timeArray, null, {
                        signal: controller.signal,
                    }),
                ]);

                if (controller.signal.aborted) {
                    return;
                }

                const variableDimensions =
                    normalizeDimensionNames(
                        variableArray as unknown as ZarrArrayNode
                    );

                if (
                    variableDimensions.length !==
                    variableArray.shape.length
                ) {
                    throw new Error(
                        `La variable ${variableName} no contiene nombres de dimensiones válidos`
                    );
                }

                for (const requiredDimension of [
                    timeName,
                    latName,
                    lonName,
                ]) {
                    if (
                        !variableDimensions.includes(
                            requiredDimension
                        )
                    ) {
                        throw new Error(
                            `La variable ${variableName} no contiene la dimensión ${requiredDimension}`
                        );
                    }
                }

                const latValues = toNumberArray(
                    latRegion.data as ArrayLike<unknown>
                );

                const lonValues = toNumberArray(
                    lonRegion.data as ArrayLike<unknown>
                );

                const timeValues = Array.from(
                    {
                        length:
                            (timeRegion.data as ArrayLike<unknown>)
                                .length,
                    },
                    (_, index) =>
                        (timeRegion.data as ArrayLike<unknown>)[
                        index
                        ] as number | bigint | string
                );

                const timeLabels = timeValues.map(
                    (value) =>
                        decodeCfTimeValue(
                            value,
                            isRecord(timeArray.attrs)
                                ? timeArray.attrs.units
                                : undefined
                        )
                );

                const timeDimensionIndex =
                    variableDimensions.indexOf(
                        timeName
                    );

                const frameCount = Number(
                    variableArray.shape[
                    timeDimensionIndex
                    ]
                );

                const [south, north] =
                    coordinateBounds(latValues);

                const [west, east] =
                    coordinateBounds(lonValues);

                const arrayNode =
                    variableArray as unknown as ZarrArrayNode;

                const loadedDataset: LoadedZarrDataset = {
                    variableArray: arrayNode,
                    timeValues,
                    timeLabels,
                    latValues,
                    lonValues,
                    variableDimensions,
                    frameCount,
                    bounds: [
                        [south, west],
                        [north, east],
                    ],
                    scaleFactor:
                        readNumberAttribute(
                            arrayNode.attrs,
                            "scale_factor",
                            1
                        ),
                    addOffset:
                        readNumberAttribute(
                            arrayNode.attrs,
                            "add_offset",
                            0
                        ),
                    fillValues:
                        collectFillValues(arrayNode),
                };

                datasetRef.current = loadedDataset;
                setBounds(loadedDataset.bounds);
                setFrameCount(frameCount);
                setTimeLabels(timeLabels);
            } catch (loadError) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    "Error cargando Zarr:",
                    loadError
                );

                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible abrir el Zarr"
                );

                datasetRef.current = null;
                setBounds(null);
                setFrameCount(0);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingMetadata(false);
                }
            }
        };

        void loadMetadata();

        return () => {
            controller.abort();
        };
    }, [
        clearFrameCache,
        enabled,
        latName,
        lonName,
        reloadVersion,
        timeName,
        url,
        variableName,
    ]);

    const setFrameIndex = useCallback(
        (index: number) => {
            const safeCount = Math.max(
                frameCount,
                1
            );

            const normalized =
                ((Math.trunc(index) % safeCount) +
                    safeCount) %
                safeCount;

            setFrameIndexState(normalized);
        },
        [frameCount]
    );

    useEffect(() => {
        const loaded = datasetRef.current;

        if (
            !enabled ||
            !loaded ||
            frameCount === 0
        ) {
            return;
        }

        const cached =
            frameCacheRef.current.get(
                frameIndexState
            );

        if (cached) {
            cached.lastUsed = Date.now();
            setFrameUrl(cached.url);
            setIsLoadingFrame(false);
            return;
        }

        frameAbortRef.current?.abort();

        const controller =
            new AbortController();

        frameAbortRef.current = controller;

        const loadFrame = async () => {
            try {
                setIsLoadingFrame(true);
                setError(null);

                const frameObjectUrl =
                    await renderFrame(
                        loaded,
                        frameIndexState,
                        {
                            variableName,
                            timeName,
                            latName,
                            lonName,
                            minimum: minValue,
                            maximum: maxValue,
                            palette,
                            signal:
                                controller.signal,
                        }
                    );

                if (controller.signal.aborted) {
                    URL.revokeObjectURL(
                        frameObjectUrl
                    );

                    return;
                }

                frameCacheRef.current.set(
                    frameIndexState,
                    {
                        url: frameObjectUrl,
                        lastUsed: Date.now(),
                    }
                );

                if (
                    frameCacheRef.current.size >
                    cacheSize
                ) {
                    const oldestEntry = Array.from(
                        frameCacheRef.current.entries()
                    ).sort(
                        (left, right) =>
                            left[1].lastUsed -
                            right[1].lastUsed
                    )[0];

                    if (oldestEntry) {
                        frameCacheRef.current.delete(
                            oldestEntry[0]
                        );

                        URL.revokeObjectURL(
                            oldestEntry[1].url
                        );
                    }
                }

                setFrameUrl(
                    frameObjectUrl
                );
            } catch (frameError) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    "Error renderizando frame Zarr:",
                    frameError
                );

                setError(
                    frameError instanceof Error
                        ? frameError.message
                        : "No fue posible renderizar el frame"
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingFrame(false);
                }
            }
        };

        void loadFrame();

        return () => {
            controller.abort();
        };
    }, [
        cacheSize,
        enabled,
        frameCount,
        frameIndexState,
        latName,
        lonName,
        maxValue,
        minValue,
        palette,
        timeName,
        variableName,
    ]);

    useEffect(() => {
        if (
            !isPlaying ||
            frameCount <= 1 ||
            isLoadingFrame
        ) {
            return;
        }

        const timeout = window.setTimeout(
            () => {
                setFrameIndexState(
                    (current) =>
                        (current + 4) %
                        frameCount
                );
            },
            frameDurationMs
        );

        return () => {
            window.clearTimeout(timeout);
        };
    }, [
        frameCount,
        frameDurationMs,
        frameIndexState,
        isLoadingFrame,
        isPlaying,
    ]);

    useEffect(() => {
        return () => {
            frameAbortRef.current?.abort();
            clearFrameCache();
        };
    }, [clearFrameCache]);

    const currentTimeLabel = useMemo(
        () =>
            timeLabels[frameIndexState] ??
            `Frame ${frameIndexState + 1}`,
        [frameIndexState, timeLabels]
    );

    return {
        frameUrl,
        bounds,
        frameIndex: frameIndexState,
        frameCount,
        currentTimeLabel,
        isPlaying,
        isLoadingMetadata,
        isLoadingFrame,
        error,
        opacity,
        frameDurationMs,
        palette,
        minValue,
        maxValue,
        setFrameIndex,
        setOpacity: (value: number) =>
            setOpacityState(
                Math.min(1, Math.max(0, value))
            ),
        setFrameDurationMs: (value: number) =>
            setFrameDurationState(
                Math.max(100, Math.trunc(value))
            ),
        togglePlaying: () =>
            setIsPlaying((current) => !current),
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        reload: () =>
            setReloadVersion(
                (current) => current + 1
            ),
    };
}
