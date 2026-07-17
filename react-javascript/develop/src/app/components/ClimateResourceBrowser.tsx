"use client";

import {
    Fragment,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Archive,
    ArrowLeft,
    Boxes,
    CalendarRange,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Clock3,
    Database,
    Download,
    File,
    FileCode2,
    FileImage,
    FileText,
    Folder,
    FolderOpen,
    Home,
    HardDrive,
    Info,
    Layers3,
    Loader2,
    MapPinned,
    PackageOpen,
    Plus,
    RefreshCw,
    Ruler,
    Search,
    Tags,
    Trash2,
    TriangleAlert,
    X,
} from "lucide-react";

import {
    getAssetsByCatalogNode,
    getCatalogNodeChildren,
    getRootCatalogNodes,
} from "../../static/js/fetch_petition_repository";

import type {
    CatalogNode,
    RepositoryAsset,
} from "../../static/js/fetch_petition_repository";

type SelectedItem =
    | {
        type: "catalog-node";
        data: CatalogNode;
    }
    | {
        type: "asset";
        data: RepositoryAsset;
    }
    | null;

function getAssetKindLabel(
    kind: string
): string {
    const labels: Record<string, string> = {
        tabular_dataset: "Datos tabulares",
        spatial_dataset: "Datos espaciales",
        spatiotemporal_dataset:
            "Datos espaciotemporales",
        document: "Documento",
        image: "Imagen",
        model: "Modelo",
        script: "Script",
        archive: "Archivo comprimido",
        folder_asset: "Carpeta",
        other: "Otro",
    };

    return labels[kind] ?? kind ?? "Asset";
}


type UnknownRecord = Record<string, unknown>;

interface RepositoryObjectVersion {
    _key: string;
    asset_key?: string;
    metric_set_key?: string | null;
    status?: string;
    stage?: string;
    storage_layout?: string;
    object_key?: string | null;
    object_prefix?: string | null;
    original_filename?: string | null;
    safe_filename?: string | null;
    extension?: string | null;
    size_bytes?: number | null;
    total_size_bytes?: number | null;
    files_count?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface VariableDescription {
    long_name?: string | null;
    standard_name?: string | null;
    description?: string | null;
    units?: string | null;
    dtype?: string | null;
    dims?: string[];
    shape?: number[];
    total_values?: number;
    non_null_values?: number;
    null_values?: number;
    null_ratio?: number;
}

interface SpatiotemporalMetrics {
    is_spatiotemporal?: boolean;
    engine?: string;
    dims?: Record<string, number>;
    coords?: string[];
    variables?: string[];
    variables_count?: number;
    variable_descriptions?: Record<
        string,
        VariableDescription
    >;
    spatial?: {
        lat_name?: string | null;
        lon_name?: string | null;
        lat_min?: number | null;
        lat_max?: number | null;
        lon_min?: number | null;
        lon_max?: number | null;
        cell_size_lat?: number | null;
        cell_size_lon?: number | null;
    };
    temporal?: {
        time_name?: string | null;
        time_min?: string | null;
        time_max?: string | null;
    };
    values?: {
        total_values?: number;
        non_null_values?: number;
        null_values?: number;
        null_ratio?: number;
    };
    attrs?: UnknownRecord;
}

interface RepositoryMetricSet {
    _key: string;
    asset_key?: string;
    object_version_key?: string;
    profile?: string;
    status?: string;
    metrics?: {
        storage_layout?: string;
        bucket?: string;
        object_key?: string | null;
        object_prefix?: string | null;
        files_count?: number;
        directories_count?: number;
        total_size_bytes?: number;
        first_modified?: string | null;
        last_modified?: string | null;
        detected_profile?: string;
        extensions?: Record<string, number>;
        spatiotemporal?: SpatiotemporalMetrics;
        spatiotemporal_status?: string;
    };
    file_metadata?: {
        storage_layout?: string;
        bucket?: string;
        object_key?: string | null;
        object_prefix?: string | null;
        object_url_path?: string | null;
        storage_uri?: string | null;
    };
    error?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    processed_at?: string | null;
}

interface ObjectVersionWithMetrics {
    version: RepositoryObjectVersion;
    metricSet: RepositoryMetricSet | null;
}

interface SpatiotemporalQueryResolved {
    time_start?: string | null;
    time_end?: string | null;
    variables?: string[];
    periodicity?: string | null;
    aggregation?: Record<string, string>;
    default_aggregation?: string | null;
    output_mode?: string | null;
    cube_format?: string | null;
    bounds?: {
        lon_min?: number | null;
        lon_max?: number | null;
        lat_min?: number | null;
        lat_max?: number | null;
    };
}

interface RepositorySpatiotemporalQuery {
    _key: string;
    asset_key?: string;
    status?: string;
    resolved?: SpatiotemporalQueryResolved;
    selected_object_versions?: UnknownRecord[];
    process_task_id?: string | null;
    delete_task_id?: string | null;
    dispatch_attempts?: number | null;
    result_bucket?: string | null;
    result_object_key?: string | null;
    result_object_prefix?: string | null;
    result_storage_uri?: string | null;
    result_object_url_path?: string | null;
    error?: string | null;
    deletion_error?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    started_at?: string | null;
    processed_at?: string | null;
    failed_at?: string | null;
}

interface TimelineObjectVersion
    extends ObjectVersionWithMetrics {
    temporal: NonNullable<
        SpatiotemporalMetrics["temporal"]
    >;
    startMs: number;
    endMs: number;
    updatedAtMs: number;
}

const REPOSITORY_API_BASE_URL = (
    process.env.NEXT_PUBLIC_REPOSITORY_API_URL ??
    "https://api.dorito-develop.com/repository"
).replace(/\/$/, "");

function isRecord(
    value: unknown
): value is UnknownRecord {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

function extractCollectionList<T>(
    payload: unknown,
    candidateKeys: string[]
): T[] {
    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (!isRecord(payload)) {
        return [];
    }

    for (const key of candidateKeys) {
        const value = payload[key];

        if (Array.isArray(value)) {
            return value as T[];
        }
    }

    return [];
}

function extractTotal(
    payload: unknown
): number | null {
    if (!isRecord(payload)) {
        return null;
    }

    return typeof payload.total === "number"
        ? payload.total
        : null;
}

async function getRepositoryJson<T>(
    path: string,
    signal?: AbortSignal
): Promise<T> {
    const response = await fetch(
        `${REPOSITORY_API_BASE_URL}${path}`,
        {
            method: "GET",
            cache: "no-store",
            signal,
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorBody = await response
            .text()
            .catch(() => "");

        throw new Error(
            `Repository API ${response.status}: ${errorBody || response.statusText
            }`
        );
    }

    return (await response.json()) as T;
}

async function getAllAssetObjectVersions(
    assetKey: string,
    signal?: AbortSignal
): Promise<RepositoryObjectVersion[]> {
    const limit = 200;
    let offset = 0;
    const versions: RepositoryObjectVersion[] = [];

    while (true) {
        const payload = await getRepositoryJson<unknown>(
            `/assets/${encodeURIComponent(
                assetKey
            )}/versions?limit=${limit}&offset=${offset}&include_deleted=false`,
            signal
        );

        const batch = extractCollectionList<RepositoryObjectVersion>(
            payload,
            ["versions", "items", "results", "data"]
        );

        versions.push(...batch);

        const total = extractTotal(payload);
        offset += batch.length;

        if (
            batch.length === 0 ||
            batch.length < limit ||
            (total !== null && offset >= total)
        ) {
            break;
        }
    }

    return versions;
}

async function getAllAssetMetricSets(
    assetKey: string,
    signal?: AbortSignal
): Promise<RepositoryMetricSet[]> {
    const limit = 200;
    let offset = 0;
    const metricSets: RepositoryMetricSet[] = [];

    while (true) {
        const payload = await getRepositoryJson<unknown>(
            `/metric-sets?asset_key=${encodeURIComponent(
                assetKey
            )}&limit=${limit}&offset=${offset}`,
            signal
        );

        const batch = extractCollectionList<RepositoryMetricSet>(
            payload,
            ["metric_sets", "items", "results", "data"]
        );

        metricSets.push(...batch);

        const total = extractTotal(payload);
        offset += batch.length;

        if (
            batch.length === 0 ||
            batch.length < limit ||
            (total !== null && offset >= total)
        ) {
            break;
        }
    }

    return metricSets;
}

async function getMetricSetByKey(
    metricSetKey: string,
    signal?: AbortSignal
): Promise<RepositoryMetricSet> {
    return getRepositoryJson<RepositoryMetricSet>(
        `/metric-sets/${encodeURIComponent(
            metricSetKey
        )}`,
        signal
    );
}

async function getAssetObjectVersionsWithMetrics(
    assetKey: string,
    signal?: AbortSignal
): Promise<ObjectVersionWithMetrics[]> {
    const [versions, metricSets] = await Promise.all([
        getAllAssetObjectVersions(
            assetKey,
            signal
        ),
        getAllAssetMetricSets(
            assetKey,
            signal
        ),
    ]);

    const metricSetByKey = new Map(
        metricSets.map((metricSet) => [
            metricSet._key,
            metricSet,
        ])
    );

    const metricSetByObjectVersion = new Map(
        metricSets
            .filter(
                (metricSet) =>
                    metricSet.object_version_key
            )
            .map((metricSet) => [
                metricSet.object_version_key as string,
                metricSet,
            ])
    );

    const missingMetricKeys = Array.from(
        new Set(
            versions
                .map(
                    (version) =>
                        version.metric_set_key
                )
                .filter(
                    (metricSetKey): metricSetKey is string =>
                        Boolean(metricSetKey) &&
                        !metricSetByKey.has(metricSetKey)
                )
        )
    );

    if (missingMetricKeys.length > 0) {
        const fallbackResults =
            await Promise.allSettled(
                missingMetricKeys.map(
                    (metricSetKey) =>
                        getMetricSetByKey(
                            metricSetKey,
                            signal
                        )
                )
            );

        fallbackResults.forEach((result) => {
            if (result.status === "fulfilled") {
                metricSetByKey.set(
                    result.value._key,
                    result.value
                );

                if (
                    result.value
                        .object_version_key
                ) {
                    metricSetByObjectVersion.set(
                        result.value
                            .object_version_key,
                        result.value
                    );
                }
            }
        });
    }

    return versions.map((version) => ({
        version,
        metricSet:
            (version.metric_set_key
                ? metricSetByKey.get(
                    version.metric_set_key
                )
                : undefined) ??
            metricSetByObjectVersion.get(
                version._key
            ) ??
            null,
    }));
}

async function getAllAssetSpatiotemporalQueries(
    assetKey: string,
    signal?: AbortSignal
): Promise<RepositorySpatiotemporalQuery[]> {
    const limit = 200;
    let offset = 0;
    const requests: RepositorySpatiotemporalQuery[] = [];

    while (true) {
        const payload = await getRepositoryJson<unknown>(
            `/assets/querry/spatiotemporal/${encodeURIComponent(
                assetKey
            )}/requests?limit=${limit}&offset=${offset}`,
            signal
        );

        const batch =
            extractCollectionList<RepositorySpatiotemporalQuery>(
                payload,
                [
                    "requests",
                    "items",
                    "results",
                    "data",
                ]
            );

        requests.push(...batch);

        const total = extractTotal(payload);
        offset += batch.length;

        if (
            batch.length === 0 ||
            batch.length < limit ||
            (total !== null && offset >= total)
        ) {
            break;
        }
    }

    return requests;
}

async function deleteAssetSpatiotemporalQuery(
    queryKey: string
): Promise<unknown> {
    const response = await fetch(
        `${REPOSITORY_API_BASE_URL}/assets/querry/spatiotemporal/requests/${encodeURIComponent(
            queryKey
        )}?force=true`,
        {
            method: "DELETE",
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorBody = await response
            .text()
            .catch(() => "");

        throw new Error(
            `Repository API ${response.status}: ${errorBody || response.statusText
            }`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json().catch(() => null);
}

function parseDateMs(
    value?: string | null
): number | null {
    if (!value) {
        return null;
    }

    const parsed = Date.parse(value);

    return Number.isFinite(parsed)
        ? parsed
        : null;
}

function formatDate(
    value?: string | null,
    includeTime = false
): string {
    const dateMs = parseDateMs(value);

    if (dateMs === null) {
        return "Sin fecha";
    }

    return new Intl.DateTimeFormat(
        "es-CO",
        includeTime
            ? {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC",
            }
            : {
                year: "numeric",
                month: "short",
                day: "2-digit",
                timeZone: "UTC",
            }
    ).format(new Date(dateMs));
}

function formatBytes(
    value?: number | null
): string {
    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(value)
    ) {
        return "Sin tamaño";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB",
    ];

    let size = value;
    let unitIndex = 0;

    while (
        size >= 1024 &&
        unitIndex < units.length - 1
    ) {
        size /= 1024;
        unitIndex += 1;
    }

    return `${size.toLocaleString("es-CO", {
        maximumFractionDigits: 2,
    })} ${units[unitIndex]}`;
}

function formatNumber(
    value?: number | null
): string {
    if (
        value === null ||
        value === undefined ||
        !Number.isFinite(value)
    ) {
        return "—";
    }

    return value.toLocaleString("es-CO");
}

function getObjectVersionName(
    version: RepositoryObjectVersion
): string {
    if (version.original_filename) {
        return version.original_filename;
    }

    if (version.safe_filename) {
        return version.safe_filename;
    }

    const storagePath =
        version.object_key ??
        version.object_prefix ??
        "";

    const pathParts = storagePath
        .replace(/\/$/, "")
        .split("/");

    return (
        pathParts[pathParts.length - 1] ||
        version._key
    );
}

function getTimelineVersions(
    entries: ObjectVersionWithMetrics[]
): TimelineObjectVersion[] {
    return entries
        .map((entry) => {
            const temporal =
                entry.metricSet?.metrics
                    ?.spatiotemporal?.temporal;

            const startMs = parseDateMs(
                temporal?.time_min
            );

            const endMs = parseDateMs(
                temporal?.time_max
            );

            if (
                !temporal ||
                startMs === null ||
                endMs === null
            ) {
                return null;
            }

            const updatedAtMs =
                parseDateMs(
                    entry.metricSet
                        ?.updated_at
                ) ??
                parseDateMs(
                    entry.version.updated_at
                ) ??
                0;

            return {
                ...entry,
                temporal,
                startMs: Math.min(
                    startMs,
                    endMs
                ),
                endMs: Math.max(
                    startMs,
                    endMs
                ),
                updatedAtMs,
            };
        })
        .filter(
            (
                entry
            ): entry is TimelineObjectVersion =>
                entry !== null
        )
        .sort(
            (left, right) =>
                right.updatedAtMs -
                left.updatedAtMs
        );
}

function getTimelinePosition(
    entry: TimelineObjectVersion,
    globalStartMs: number,
    globalEndMs: number
): {
    left: number;
    width: number;
} {
    const totalDuration = Math.max(
        globalEndMs - globalStartMs,
        1
    );

    const left =
        ((entry.startMs - globalStartMs) /
            totalDuration) *
        100;

    const rawWidth =
        ((entry.endMs - entry.startMs) /
            totalDuration) *
        100;

    const width = Math.max(
        rawWidth,
        1.5
    );

    return {
        left: Math.min(
            Math.max(left, 0),
            100
        ),
        width: Math.min(
            width,
            100 - Math.min(
                Math.max(left, 0),
                100
            )
        ),
    };
}

interface AssetSidebarProps {
    asset: RepositoryAsset;
    onClose: () => void;
}

function AssetIcon({
    kind,
}: {
    kind: string;
}) {
    const iconClass =
        "h-5 w-5 shrink-0";

    switch (kind) {
        case "tabular_dataset":
            return (
                <Database
                    className={`${iconClass} text-emerald-600`}
                />
            );

        case "spatial_dataset":
        case "spatiotemporal_dataset":
            return (
                <Database
                    className={`${iconClass} text-blue-600`}
                />
            );

        case "document":
            return (
                <FileText
                    className={`${iconClass} text-slate-600`}
                />
            );

        case "image":
            return (
                <FileImage
                    className={`${iconClass} text-violet-600`}
                />
            );

        case "model":
            return (
                <Boxes
                    className={`${iconClass} text-indigo-600`}
                />
            );

        case "script":
            return (
                <FileCode2
                    className={`${iconClass} text-orange-600`}
                />
            );

        case "archive":
            return (
                <Archive
                    className={`${iconClass} text-amber-600`}
                />
            );

        case "folder_asset":
            return (
                <FolderOpen
                    className={`${iconClass} text-yellow-600`}
                />
            );

        default:
            return (
                <File
                    className={`${iconClass} text-slate-500`}
                />
            );
    }
}

function getStatusClasses(
    status?: string
): string {
    switch (status) {
        case "processed":
            return (
                "bg-emerald-50 text-emerald-700 " +
                "border-emerald-200"
            );

        case "processing":
        case "queued":
            return (
                "bg-blue-50 text-blue-700 " +
                "border-blue-200"
            );

        case "deleting":
            return (
                "bg-violet-50 text-violet-700 " +
                "border-violet-200"
            );

        case "failed":
        case "delete_failed":
        case "cleanup_failed":
            return (
                "bg-red-50 text-red-700 " +
                "border-red-200"
            );

        case "archived":
        case "deprecated":
            return (
                "bg-slate-100 text-slate-600 " +
                "border-slate-200"
            );

        default:
            return (
                "bg-amber-50 text-amber-700 " +
                "border-amber-200"
            );
    }
}

function getQueryStatusLabel(
    status?: string
): string {
    const labels: Record<string, string> = {
        pending: "Pendiente",
        queued: "En cola",
        processing: "Procesando",
        processed: "Procesada",
        failed: "Fallida",
        deleting: "Eliminando",
        delete_failed: "Error al eliminar",
        cleanup_failed: "Error de limpieza",
    };

    return labels[status ?? ""] ??
        status ??
        "Sin estado";
}

function formatMetadataValue(
    value: unknown
): string {
    if (
        value === null ||
        value === undefined
    ) {
        return "Sin información";
    }

    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    try {
        return JSON.stringify(
            value,
            null,
            2
        );
    } catch {
        return String(value);
    }
}

function SpatiotemporalVersionReport({
    asset,
}: {
    asset: RepositoryAsset;
}) {
    const [entries, setEntries] = useState<
        ObjectVersionWithMetrics[]
    >([]);

    const [isLoadingVersions, setIsLoadingVersions] =
        useState(true);

    const [versionsError, setVersionsError] =
        useState<string | null>(null);

    const [reloadVersion, setReloadVersion] =
        useState(0);

    const [expandedVersionKey, setExpandedVersionKey] =
        useState<string | null>(null);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadVersions = async () => {
            try {
                setIsLoadingVersions(true);
                setVersionsError(null);
                setEntries([]);
                setExpandedVersionKey(null);

                const loadedEntries =
                    await getAssetObjectVersionsWithMetrics(
                        asset._key,
                        controller.signal
                    );

                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                setEntries(loadedEntries);
            } catch (loadError) {
                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                console.error(
                    "Error cargando ObjectVersions y MetricSets:",
                    loadError
                );

                setVersionsError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar las versiones"
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoadingVersions(false);
                }
            }
        };

        loadVersions();

        return () => {
            controller.abort();
        };
    }, [asset._key, reloadVersion]);

    const timelineVersions = useMemo(
        () => getTimelineVersions(entries),
        [entries]
    );

    const globalStartMs = useMemo(
        () =>
            timelineVersions.length > 0
                ? Math.min(
                    ...timelineVersions.map(
                        (entry) =>
                            entry.startMs
                    )
                )
                : 0,
        [timelineVersions]
    );

    const globalEndMs = useMemo(
        () =>
            timelineVersions.length > 0
                ? Math.max(
                    ...timelineVersions.map(
                        (entry) =>
                            entry.endMs
                    )
                )
                : 0,
        [timelineVersions]
    );

    const versionsWithoutTemporalMetrics = useMemo(
        () =>
            entries.filter((entry) => {
                const temporal =
                    entry.metricSet?.metrics
                        ?.spatiotemporal
                        ?.temporal;

                return !(
                    parseDateMs(
                        temporal?.time_min
                    ) !== null &&
                    parseDateMs(
                        temporal?.time_max
                    ) !== null
                );
            }),
        [entries]
    );

    const currentVersionKey = (
        asset as RepositoryAsset & {
            current_version_key?:
            | string
            | null;
        }
    ).current_version_key;

    return (
        <section className="border-b border-slate-200 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <CalendarRange className="h-4 w-4 text-blue-600" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Versiones y cobertura temporal
                        </p>
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Los solapamientos se muestran de arriba hacia abajo, priorizando la versión con actualización más reciente.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setReloadVersion(
                            (value) =>
                                value + 1
                        )
                    }
                    disabled={isLoadingVersions}
                    title="Recargar versiones"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-3.5 w-3.5 ${isLoadingVersions
                            ? "animate-spin"
                            : ""
                            }`}
                    />
                </button>
            </div>

            {isLoadingVersions && (
                <div className="flex min-h-[180px] items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando versiones y métricas…
                </div>
            )}

            {!isLoadingVersions &&
                versionsError && (
                    <div className="rounded-[8px] border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-700">
                            No fue posible cargar las versiones
                        </p>

                        <p className="mt-1 break-words text-xs leading-5 text-red-600">
                            {versionsError}
                        </p>
                    </div>
                )}

            {!isLoadingVersions &&
                !versionsError &&
                entries.length === 0 && (
                    <div className="rounded-[8px] border border-dashed border-slate-300 p-5 text-center">
                        <PackageOpen className="mx-auto h-8 w-8 text-slate-300" />

                        <p className="mt-3 text-sm font-semibold text-slate-700">
                            El asset no tiene ObjectVersions
                        </p>
                    </div>
                )}

            {!isLoadingVersions &&
                !versionsError &&
                timelineVersions.length > 0 && (
                    <div className="space-y-4">
                        <div className="rounded-[9px] border border-slate-200 bg-slate-50 p-3">
                            <div className="flex items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
                                <span>
                                    {formatDate(
                                        new Date(
                                            globalStartMs
                                        ).toISOString()
                                    )}
                                </span>

                                <span className="text-center text-slate-400">
                                    Cobertura total del asset
                                </span>

                                <span>
                                    {formatDate(
                                        new Date(
                                            globalEndMs
                                        ).toISOString()
                                    )}
                                </span>
                            </div>

                            <div className="mt-3 space-y-2">
                                {timelineVersions.map(
                                    (entry) => {
                                        const position =
                                            getTimelinePosition(
                                                entry,
                                                globalStartMs,
                                                globalEndMs
                                            );

                                        const isCurrent =
                                            currentVersionKey ===
                                            entry.version
                                                ._key;

                                        return (
                                            <button
                                                key={
                                                    entry
                                                        .version
                                                        ._key
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setExpandedVersionKey(
                                                        (
                                                            current
                                                        ) =>
                                                            current ===
                                                                entry
                                                                    .version
                                                                    ._key
                                                                ? null
                                                                : entry
                                                                    .version
                                                                    ._key
                                                    )
                                                }
                                                className="group grid w-full grid-cols-[128px_minmax(0,1fr)] items-center gap-3 rounded-[7px] px-2 py-1.5 text-left transition hover:bg-white"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="truncate text-xs font-semibold text-slate-700">
                                                            {getObjectVersionName(
                                                                entry.version
                                                            )}
                                                        </p>

                                                        {isCurrent && (
                                                            <span className="shrink-0 rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-blue-700">
                                                                actual
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">
                                                        {
                                                            entry
                                                                .version
                                                                ._key
                                                        }
                                                    </p>
                                                </div>

                                                <div className="relative h-7 overflow-hidden rounded-[6px] border border-slate-200 bg-white">
                                                    <div className="absolute inset-y-0 left-1/4 border-l border-dashed border-slate-200" />
                                                    <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-200" />
                                                    <div className="absolute inset-y-0 left-3/4 border-l border-dashed border-slate-200" />

                                                    <div
                                                        className={`absolute top-1/2 h-3.5 -translate-y-1/2 rounded-full border shadow-sm transition group-hover:h-4 ${isCurrent
                                                            ? "border-blue-500 bg-blue-500"
                                                            : "border-sky-400 bg-sky-300"
                                                            }`}
                                                        style={{
                                                            left: `${position.left}%`,
                                                            width: `${position.width}%`,
                                                        }}
                                                        title={`${formatDate(
                                                            entry
                                                                .temporal
                                                                .time_min
                                                        )} → ${formatDate(
                                                            entry
                                                                .temporal
                                                                .time_max
                                                        )}`}
                                                    />
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {timelineVersions.map(
                                (entry) => {
                                    const metricSet =
                                        entry.metricSet;

                                    const spatiotemporal =
                                        metricSet
                                            ?.metrics
                                            ?.spatiotemporal;

                                    const spatial =
                                        spatiotemporal
                                            ?.spatial;

                                    const dimensions =
                                        Object.entries(
                                            spatiotemporal
                                                ?.dims ??
                                            {}
                                        ) as Array<
                                            [
                                                string,
                                                number,
                                            ]
                                        >;

                                    const variables =
                                        spatiotemporal
                                            ?.variables ??
                                        [];

                                    const variableDescriptions =
                                        spatiotemporal
                                            ?.variable_descriptions ??
                                        {};

                                    const isExpanded =
                                        expandedVersionKey ===
                                        entry.version
                                            ._key;

                                    const isCurrent =
                                        currentVersionKey ===
                                        entry.version
                                            ._key;

                                    const sizeBytes =
                                        metricSet
                                            ?.metrics
                                            ?.total_size_bytes ??
                                        entry.version
                                            .total_size_bytes ??
                                        entry.version
                                            .size_bytes;

                                    return (
                                        <article
                                            key={
                                                entry
                                                    .version
                                                    ._key
                                            }
                                            className={`overflow-hidden rounded-[9px] border ${isCurrent
                                                ? "border-blue-300 bg-blue-50/30"
                                                : "border-slate-200 bg-white"
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedVersionKey(
                                                        (
                                                            current
                                                        ) =>
                                                            current ===
                                                                entry
                                                                    .version
                                                                    ._key
                                                                ? null
                                                                : entry
                                                                    .version
                                                                    ._key
                                                    )
                                                }
                                                className="flex w-full items-start justify-between gap-3 p-4 text-left"
                                            >
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="truncate text-sm font-semibold text-slate-800">
                                                            {getObjectVersionName(
                                                                entry.version
                                                            )}
                                                        </p>

                                                        {isCurrent && (
                                                            <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700">
                                                                versión actual
                                                            </span>
                                                        )}

                                                        <span
                                                            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusClasses(
                                                                metricSet
                                                                    ?.status ??
                                                                entry
                                                                    .version
                                                                    .status
                                                            )}`}
                                                        >
                                                            {metricSet
                                                                ?.status ??
                                                                entry
                                                                    .version
                                                                    .status ??
                                                                "Sin estado"}
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Clock3 className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                                                        <span>
                                                            {formatDate(
                                                                entry
                                                                    .temporal
                                                                    .time_min
                                                            )}
                                                            {" → "}
                                                            {formatDate(
                                                                entry
                                                                    .temporal
                                                                    .time_max
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        Métricas actualizadas: {formatDate(
                                                            metricSet
                                                                ?.updated_at ??
                                                            entry
                                                                .version
                                                                .updated_at,
                                                            true
                                                        )}
                                                    </p>
                                                </div>

                                                {isExpanded ? (
                                                    <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                                ) : (
                                                    <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                                )}
                                            </button>

                                            {isExpanded && (
                                                <div className="border-t border-slate-200 px-4 pb-4 pt-3">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="rounded-[7px] bg-slate-50 p-3">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400">
                                                                <Layers3 className="h-3.5 w-3.5" />
                                                                Dimensiones
                                                            </div>

                                                            <p className="mt-1.5 text-xs leading-5 text-slate-700">
                                                                {dimensions.length >
                                                                    0
                                                                    ? dimensions
                                                                        .map(
                                                                            ([
                                                                                name,
                                                                                size,
                                                                            ]) =>
                                                                                `${name}: ${formatNumber(
                                                                                    size
                                                                                )}`
                                                                        )
                                                                        .join(
                                                                            " · "
                                                                        )
                                                                    : "Sin dimensiones"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-[7px] bg-slate-50 p-3">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400">
                                                                <HardDrive className="h-3.5 w-3.5" />
                                                                Almacenamiento
                                                            </div>

                                                            <p className="mt-1.5 text-xs leading-5 text-slate-700">
                                                                {formatBytes(
                                                                    sizeBytes
                                                                )}
                                                                {" · "}
                                                                {metricSet
                                                                    ?.metrics
                                                                    ?.files_count ??
                                                                    entry
                                                                        .version
                                                                        .files_count ??
                                                                    1}{" "}
                                                                archivos
                                                            </p>
                                                        </div>

                                                        <div className="rounded-[7px] bg-slate-50 p-3">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400">
                                                                <MapPinned className="h-3.5 w-3.5" />
                                                                Extensión
                                                            </div>

                                                            <p className="mt-1.5 text-xs leading-5 text-slate-700">
                                                                {spatial &&
                                                                    spatial.lat_min !==
                                                                    null &&
                                                                    spatial.lat_min !==
                                                                    undefined &&
                                                                    spatial.lat_max !==
                                                                    null &&
                                                                    spatial.lat_max !==
                                                                    undefined &&
                                                                    spatial.lon_min !==
                                                                    null &&
                                                                    spatial.lon_min !==
                                                                    undefined &&
                                                                    spatial.lon_max !==
                                                                    null &&
                                                                    spatial.lon_max !==
                                                                    undefined
                                                                    ? `Lat ${spatial.lat_min} a ${spatial.lat_max} · Lon ${spatial.lon_min} a ${spatial.lon_max}`
                                                                    : "Sin extensión espacial"}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-[7px] bg-slate-50 p-3">
                                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400">
                                                                <Ruler className="h-3.5 w-3.5" />
                                                                Resolución
                                                            </div>

                                                            <p className="mt-1.5 text-xs leading-5 text-slate-700">
                                                                {spatial
                                                                    ?.cell_size_lat !==
                                                                    null &&
                                                                    spatial
                                                                        ?.cell_size_lat !==
                                                                    undefined &&
                                                                    spatial
                                                                        ?.cell_size_lon !==
                                                                    null &&
                                                                    spatial
                                                                        ?.cell_size_lon !==
                                                                    undefined
                                                                    ? `${spatial.cell_size_lat.toFixed(
                                                                        4
                                                                    )}° × ${spatial.cell_size_lon.toFixed(
                                                                        4
                                                                    )}°`
                                                                    : "Sin resolución"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3">
                                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                            Variables
                                                        </p>

                                                        {variables.length >
                                                            0 ? (
                                                            <div className="mt-2 space-y-2">
                                                                {variables.map(
                                                                    (
                                                                        variable
                                                                    ) => {
                                                                        const description =
                                                                            variableDescriptions[
                                                                            variable
                                                                            ];

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    variable
                                                                                }
                                                                                className="rounded-[7px] border border-slate-200 bg-slate-50 p-3"
                                                                            >
                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                    <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-blue-700">
                                                                                        {
                                                                                            variable
                                                                                        }
                                                                                    </span>

                                                                                    {description
                                                                                        ?.units && (
                                                                                            <span className="text-[11px] text-slate-500">
                                                                                                {
                                                                                                    description.units
                                                                                                }
                                                                                            </span>
                                                                                        )}

                                                                                    {description
                                                                                        ?.dtype && (
                                                                                            <span className="text-[11px] text-slate-400">
                                                                                                {
                                                                                                    description.dtype
                                                                                                }
                                                                                            </span>
                                                                                        )}
                                                                                </div>

                                                                                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                                                                                    {description
                                                                                        ?.description ??
                                                                                        description
                                                                                            ?.long_name ??
                                                                                        description
                                                                                            ?.standard_name ??
                                                                                        "Sin descripción"}
                                                                                </p>

                                                                                {description
                                                                                    ?.dims &&
                                                                                    description
                                                                                        .dims
                                                                                        .length >
                                                                                    0 && (
                                                                                        <p className="mt-1 text-[11px] text-slate-400">
                                                                                            Dimensiones: {description.dims.join(
                                                                                                " × "
                                                                                            )}
                                                                                        </p>
                                                                                    )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                Sin variables registradas
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                                Perfil
                                                            </p>
                                                            <p className="mt-1 text-slate-700">
                                                                {metricSet
                                                                    ?.profile ??
                                                                    metricSet
                                                                        ?.metrics
                                                                        ?.detected_profile ??
                                                                    "Sin detectar"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                                Layout
                                                            </p>
                                                            <p className="mt-1 text-slate-700">
                                                                {metricSet
                                                                    ?.metrics
                                                                    ?.storage_layout ??
                                                                    entry
                                                                        .version
                                                                        .storage_layout ??
                                                                    "Sin definir"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                                Extensiones
                                                            </p>
                                                            <p className="mt-1 text-slate-700">
                                                                {Object.keys(
                                                                    metricSet
                                                                        ?.metrics
                                                                        ?.extensions ??
                                                                    {}
                                                                ).length > 0
                                                                    ? Object.entries(
                                                                        metricSet
                                                                            ?.metrics
                                                                            ?.extensions ??
                                                                        {}
                                                                    )
                                                                        .map(
                                                                            ([
                                                                                extension,
                                                                                count,
                                                                            ]) =>
                                                                                `${extension}: ${count}`
                                                                        )
                                                                        .join(
                                                                            " · "
                                                                        )
                                                                    : entry
                                                                        .version
                                                                        .extension ??
                                                                    "Sin extensiones"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                                MetricSet
                                                            </p>
                                                            <p className="mt-1 break-all font-mono text-[11px] text-slate-700">
                                                                {entry
                                                                    .version
                                                                    .metric_set_key ??
                                                                    metricSet
                                                                        ?._key ??
                                                                    "Sin MetricSet"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}

            {!isLoadingVersions &&
                !versionsError &&
                versionsWithoutTemporalMetrics.length >
                0 && (
                    <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-semibold text-amber-800">
                            Versiones sin cobertura temporal
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-700">
                            {versionsWithoutTemporalMetrics.length}{" "}
                            ObjectVersion no tiene todavía métricas temporales procesadas.
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {versionsWithoutTemporalMetrics.map(
                                (entry) => (
                                    <span
                                        key={
                                            entry
                                                .version
                                                ._key
                                        }
                                        className="rounded border border-amber-200 bg-white px-2 py-1 font-mono text-[10px] text-amber-700"
                                    >
                                        {
                                            entry
                                                .version
                                                ._key
                                        }
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                )}
        </section>
    );
}

function SpatiotemporalQueriesReport({
    asset,
}: {
    asset: RepositoryAsset;
}) {
    const [queries, setQueries] = useState<
        RepositorySpatiotemporalQuery[]
    >([]);

    const [isLoadingQueries, setIsLoadingQueries] =
        useState(true);

    const [queriesError, setQueriesError] =
        useState<string | null>(null);

    const [reloadQueries, setReloadQueries] =
        useState(0);

    const [deleteTarget, setDeleteTarget] =
        useState<RepositorySpatiotemporalQuery | null>(
            null
        );

    const [deletingQueryKey, setDeletingQueryKey] =
        useState<string | null>(null);

    const [deleteError, setDeleteError] =
        useState<string | null>(null);

    useEffect(() => {
        const controller =
            new AbortController();

        const loadQueries = async () => {
            try {
                setIsLoadingQueries(true);
                setQueriesError(null);
                setDeleteError(null);

                const loadedQueries =
                    await getAllAssetSpatiotemporalQueries(
                        asset._key,
                        controller.signal
                    );

                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                setQueries(
                    [...loadedQueries].sort(
                        (left, right) =>
                            (parseDateMs(
                                right.created_at
                            ) ?? 0) -
                            (parseDateMs(
                                left.created_at
                            ) ?? 0)
                    )
                );
            } catch (loadError) {
                if (
                    controller.signal.aborted
                ) {
                    return;
                }

                console.error(
                    "Error cargando consultas espaciotemporales:",
                    loadError
                );

                setQueriesError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar las consultas"
                );
            } finally {
                if (
                    !controller.signal.aborted
                ) {
                    setIsLoadingQueries(false);
                }
            }
        };

        loadQueries();

        return () => {
            controller.abort();
        };
    }, [asset._key, reloadQueries]);

    const confirmDelete = async () => {
        if (!deleteTarget) {
            return;
        }

        const queryKey = deleteTarget._key;

        try {
            setDeletingQueryKey(queryKey);
            setDeleteError(null);

            const payload =
                await deleteAssetSpatiotemporalQuery(
                    queryKey
                );

            const responseStatus =
                isRecord(payload) &&
                    typeof payload.status === "string"
                    ? payload.status
                    : "deleting";

            const deleteTaskId =
                isRecord(payload) &&
                    typeof payload.delete_task_id ===
                    "string"
                    ? payload.delete_task_id
                    : null;

            setQueries((currentQueries) =>
                currentQueries.map((query) =>
                    query._key === queryKey
                        ? {
                            ...query,
                            status: responseStatus,
                            delete_task_id:
                                deleteTaskId ??
                                query.delete_task_id,
                            updated_at:
                                new Date().toISOString(),
                        }
                        : query
                )
            );

            setDeleteTarget(null);
        } catch (deleteRequestError) {
            console.error(
                "Error eliminando consulta espaciotemporal:",
                deleteRequestError
            );

            setDeleteError(
                deleteRequestError instanceof Error
                    ? deleteRequestError.message
                    : "No fue posible solicitar la eliminación"
            );
        } finally {
            setDeletingQueryKey(null);
        }
    };

    return (
        <>
            <section className="p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-600" />

                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Consultas espaciotemporales
                            </p>
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Solicitudes creadas sobre este asset y su estado de procesamiento.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setReloadQueries(
                                (value) =>
                                    value + 1
                            )
                        }
                        disabled={isLoadingQueries}
                        title="Recargar consultas"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${isLoadingQueries
                                    ? "animate-spin"
                                    : ""
                                }`}
                        />
                    </button>
                </div>

                {isLoadingQueries && (
                    <div className="flex min-h-[150px] items-center justify-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando consultas…
                    </div>
                )}

                {!isLoadingQueries &&
                    queriesError && (
                        <div className="rounded-[8px] border border-red-200 bg-red-50 p-4">
                            <p className="text-sm font-semibold text-red-700">
                                No fue posible cargar las consultas
                            </p>

                            <p className="mt-1 break-words text-xs leading-5 text-red-600">
                                {queriesError}
                            </p>
                        </div>
                    )}

                {!isLoadingQueries &&
                    !queriesError &&
                    queries.length === 0 && (
                        <div className="rounded-[8px] border border-dashed border-slate-300 p-5 text-center">
                            <Database className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm font-semibold text-slate-700">
                                No hay consultas registradas
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Las nuevas solicitudes espaciotemporales aparecerán aquí.
                            </p>
                        </div>
                    )}

                {!isLoadingQueries &&
                    !queriesError &&
                    queries.length > 0 && (
                        <div className="space-y-3">
                            {queries.map(
                                (
                                    query,
                                    index
                                ) => {
                                    const resolved =
                                        query.resolved ??
                                        {};

                                    const variables =
                                        resolved.variables ??
                                        [];

                                    const isDeleting =
                                        deletingQueryKey ===
                                        query._key ||
                                        query.status ===
                                        "deleting";

                                    return (
                                        <article
                                            key={
                                                query._key
                                            }
                                            className="rounded-[9px] border border-slate-200 bg-white p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            Consulta{" "}
                                                            {queries.length -
                                                                index}
                                                        </p>

                                                        <span
                                                            className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusClasses(
                                                                query.status
                                                            )}`}
                                                        >
                                                            {getQueryStatusLabel(
                                                                query.status
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
                                                        {
                                                            query._key
                                                        }
                                                    </p>
                                                </div>

                                                <p className="shrink-0 text-right text-[10px] leading-4 text-slate-400">
                                                    Creada
                                                    <br />
                                                    {formatDate(
                                                        query.created_at,
                                                        true
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                <div className="rounded-[7px] bg-slate-50 p-3">
                                                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                        Rango temporal
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-700">
                                                        {formatDate(
                                                            resolved.time_start
                                                        )}
                                                        {" → "}
                                                        {formatDate(
                                                            resolved.time_end
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-[7px] bg-slate-50 p-3">
                                                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                        Salida
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-700">
                                                        {resolved.output_mode ??
                                                            "Sin definir"}
                                                        {resolved.cube_format
                                                            ? ` · ${resolved.cube_format}`
                                                            : ""}
                                                    </p>
                                                </div>

                                                <div className="rounded-[7px] bg-slate-50 p-3">
                                                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                        Periodicidad
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-700">
                                                        {resolved.periodicity ??
                                                            "Sin definir"}
                                                    </p>
                                                </div>

                                                <div className="rounded-[7px] bg-slate-50 p-3">
                                                    <p className="text-[10px] font-semibold uppercase text-slate-400">
                                                        Intentos
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-700">
                                                        {query.dispatch_attempts ??
                                                            1}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                                    Variables
                                                </p>

                                                {variables.length >
                                                    0 ? (
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {variables.map(
                                                            (
                                                                variable
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        variable
                                                                    }
                                                                    className="rounded bg-blue-50 px-2 py-1 font-mono text-[10px] font-semibold text-blue-700"
                                                                >
                                                                    {
                                                                        variable
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Sin variables registradas
                                                    </p>
                                                )}
                                            </div>

                                            {(query.error ||
                                                query.deletion_error) && (
                                                    <div className="mt-3 rounded-[7px] border border-red-200 bg-red-50 p-3">
                                                        <p className="text-[10px] font-semibold uppercase text-red-500">
                                                            Error
                                                        </p>

                                                        <p className="mt-1 break-words text-xs leading-5 text-red-700">
                                                            {query.deletion_error ??
                                                                query.error}
                                                        </p>
                                                    </div>
                                                )}

                                            <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                                                <button
                                                    type="button"
                                                    disabled
                                                    title="La acción del botón + se implementará después"
                                                    className="flex h-9 w-9 items-center justify-center rounded-[7px] border border-slate-200 bg-white text-slate-400 opacity-60"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled
                                                    title="La descarga se implementará después"
                                                    className="flex h-9 w-9 items-center justify-center rounded-[7px] border border-blue-200 bg-blue-50 text-blue-400 opacity-60"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDeleteError(
                                                            null
                                                        );
                                                        setDeleteTarget(
                                                            query
                                                        );
                                                    }}
                                                    disabled={
                                                        isDeleting
                                                    }
                                                    title="Eliminar consulta"
                                                    className="flex h-9 w-9 items-center justify-center rounded-[7px] border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
            </section>

            {deleteTarget && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[1px]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-query-title"
                >
                    <div className="w-full max-w-md rounded-[12px] border border-slate-200 bg-white p-5 shadow-2xl">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                                <TriangleAlert className="h-5 w-5 text-red-600" />
                            </div>

                            <div className="min-w-0">
                                <h2
                                    id="delete-query-title"
                                    className="text-base font-semibold text-slate-900"
                                >
                                    Eliminar consulta
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    ¿Seguro que quieres eliminar esta consulta espaciotemporal?
                                </p>

                                <p className="mt-2 break-all rounded-[7px] bg-slate-100 px-3 py-2 font-mono text-xs text-slate-700">
                                    {
                                        deleteTarget._key
                                    }
                                </p>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    Se solicitará una eliminación forzada. El backend eliminará el resultado físico asociado y después el registro de la consulta.
                                </p>
                            </div>
                        </div>

                        {deleteError && (
                            <div className="mt-4 rounded-[7px] border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
                                {deleteError}
                            </div>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setDeleteTarget(
                                        null
                                    );
                                    setDeleteError(
                                        null
                                    );
                                }}
                                disabled={
                                    deletingQueryKey ===
                                    deleteTarget._key
                                }
                                className="rounded-[7px] border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDelete
                                }
                                disabled={
                                    deletingQueryKey ===
                                    deleteTarget._key
                                }
                                className="flex items-center gap-2 rounded-[7px] border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deletingQueryKey ===
                                    deleteTarget._key ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Eliminando…
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Sí, eliminar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function AssetSidebar({
    asset,
    onClose,
}: AssetSidebarProps) {
    const metadataEntries =
        Object.entries(
            asset.logical_metadata ?? {}
        );

    const isSpatiotemporalAsset =
        asset.kind ===
        "spatiotemporal_dataset";

    return (
        <aside className="flex h-full w-[min(560px,48vw)] min-w-[420px] shrink-0 flex-col border-l border-slate-200 bg-white">
            {/* CABECERA */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-slate-100">
                        <AssetIcon
                            kind={asset.kind}
                        />
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {asset.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            {getAssetKindLabel(
                                asset.kind
                            )}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    title="Cerrar panel"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* CONTENIDO */}
            <div className="min-h-0 flex-1 overflow-y-auto">
                {/* ACCIONES */}
                <section className="border-b border-slate-200 p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Acciones
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-[7px] border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <Info className="h-4 w-4" />
                            Detalles
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-[7px] border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Download className="h-4 w-4" />
                            Descargar
                        </button>
                    </div>
                </section>

                {/* INFORMACIÓN GENERAL */}
                <section className="border-b border-slate-200 p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Información general
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                        <div className="col-span-2">
                            <p className="text-xs font-medium text-slate-500">
                                Descripción
                            </p>

                            <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-slate-700">
                                {asset.description ||
                                    "Este recurso no tiene descripción."}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Identificador
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-slate-700">
                                {asset._key}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Tipo de recurso
                            </p>

                            <p className="mt-1 text-sm text-slate-700">
                                {getAssetKindLabel(
                                    asset.kind
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Estado
                            </p>

                            <span
                                className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(
                                    asset.status
                                )}`}
                            >
                                {asset.status ??
                                    "registered"}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-slate-500">
                                Visibilidad
                            </p>

                            <p className="mt-1 text-sm capitalize text-slate-700">
                                {asset.visibility ??
                                    "Sin definir"}
                            </p>
                        </div>

                        {asset.asset_path && (
                            <div className="col-span-2">
                                <p className="text-xs font-medium text-slate-500">
                                    Ruta lógica
                                </p>

                                <p className="mt-1 break-all font-mono text-xs text-slate-700">
                                    {
                                        asset.asset_path
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {isSpatiotemporalAsset && (
                    <SpatiotemporalVersionReport
                        asset={asset}
                    />
                )}

                {/* ETIQUETAS */}
                <section className="border-b border-slate-200 p-5">
                    <div className="mb-3 flex items-center gap-2">
                        <Tags className="h-4 w-4 text-slate-500" />

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Etiquetas
                        </p>
                    </div>

                    {asset.tags &&
                        asset.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {asset.tags.map(
                                (tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                                    >
                                        {tag}
                                    </span>
                                )
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Sin etiquetas
                        </p>
                    )}
                </section>

                {/* METADATOS */}
                <section className="border-b border-slate-200 p-5">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Metadatos
                    </p>

                    {metadataEntries.length > 0 ? (
                        <div className="space-y-3">
                            {metadataEntries.map(
                                ([key, value]) => (
                                    <div
                                        key={key}
                                        className="rounded-[7px] border border-slate-200 bg-slate-50 p-3"
                                    >
                                        <p className="break-all text-xs font-semibold text-slate-600">
                                            {key}
                                        </p>

                                        <pre className="mt-1 whitespace-pre-wrap break-words font-sans text-xs leading-5 text-slate-700">
                                            {formatMetadataValue(
                                                value
                                            )}
                                        </pre>
                                    </div>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="rounded-[7px] border border-dashed border-slate-300 p-4 text-center">
                            <p className="text-sm text-slate-500">
                                Este asset todavía no tiene metadatos lógicos.
                            </p>

                            <button
                                type="button"
                                className="mt-3 rounded-[6px] border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                Añadir metadatos
                            </button>
                        </div>
                    )}
                </section>

                {isSpatiotemporalAsset && (
                    <SpatiotemporalQueriesReport
                        asset={asset}
                    />
                )}
            </div>
        </aside>
    );
}

export default function ClimateResourceBrowser() {
    const [
        selectedItem,
        setSelectedItem,
    ] = useState<SelectedItem>(null);
    const [
        navigationPath,
        setNavigationPath,
    ] = useState<CatalogNode[]>([]);

    const [catalogNodes, setCatalogNodes] =
        useState<CatalogNode[]>([]);

    const [assets, setAssets] =
        useState<RepositoryAsset[]>([]);

    const [search, setSearch] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [reloadVersion, setReloadVersion] =
        useState(0);

    const selectCatalogNode = (
        node: CatalogNode
    ) => {
        setSelectedItem({
            type: "catalog-node",
            data: node,
        });
    };

    const selectAsset = (
        asset: RepositoryAsset
    ) => {
        setSelectedItem({
            type: "asset",
            data: asset,
        });
    };

    const isCatalogNodeSelected = (
        nodeKey: string
    ) =>
        selectedItem?.type ===
        "catalog-node" &&
        selectedItem.data._key ===
        nodeKey;

    const isAssetSelected = (
        assetKey: string
    ) =>
        selectedItem?.type === "asset" &&
        selectedItem.data._key ===
        assetKey;

    const currentNode =
        navigationPath.length > 0
            ? navigationPath[
            navigationPath.length - 1
            ]
            : null;


    const selectedAsset =
        selectedItem?.type === "asset"
            ? selectedItem.data
            : null;

    /*
     * Cada vez que cambia la carpeta actual,
     * se consulta únicamente ese nivel.
     */
    useEffect(() => {
        const controller =
            new AbortController();

        const loadCurrentLevel =
            async () => {
                try {
                    setIsLoading(true);
                    setError(null);

                    if (!currentNode) {
                        const rootNodes =
                            await getRootCatalogNodes(
                                controller.signal
                            );

                        if (
                            controller.signal.aborted
                        ) {
                            return;
                        }

                        setCatalogNodes(rootNodes);
                        setAssets([]);
                        return;
                    }

                    const [
                        childNodes,
                        currentAssets,
                    ] = await Promise.all([
                        getCatalogNodeChildren(
                            currentNode._key,
                            controller.signal
                        ),

                        getAssetsByCatalogNode(
                            currentNode._key,
                            controller.signal
                        ),
                    ]);

                    if (
                        controller.signal.aborted
                    ) {
                        return;
                    }

                    setCatalogNodes(childNodes);
                    setAssets(currentAssets);
                } catch (loadError) {
                    if (
                        controller.signal.aborted
                    ) {
                        return;
                    }

                    console.error(
                        "Error cargando el catálogo:",
                        loadError
                    );

                    setCatalogNodes([]);
                    setAssets([]);

                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : "No fue posible cargar el catálogo"
                    );
                } finally {
                    if (
                        !controller.signal.aborted
                    ) {
                        setIsLoading(false);
                    }
                }
            };

        loadCurrentLevel();

        return () => {
            controller.abort();
        };
    }, [
        currentNode,
        reloadVersion,
    ]);

    const normalizedSearch =
        search.trim().toLowerCase();

    const visibleCatalogNodes =
        useMemo(() => {
            if (!normalizedSearch) {
                return catalogNodes;
            }

            return catalogNodes.filter(
                (node) =>
                    node.name
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    node.description
                        ?.toLowerCase()
                        .includes(normalizedSearch) ||
                    node.type
                        ?.toLowerCase()
                        .includes(normalizedSearch)
            );
        }, [
            catalogNodes,
            normalizedSearch,
        ]);

    const visibleAssets =
        useMemo(() => {
            if (!normalizedSearch) {
                return assets;
            }

            return assets.filter(
                (asset) =>
                    asset.name
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    asset.description
                        ?.toLowerCase()
                        .includes(normalizedSearch) ||
                    asset.kind
                        ?.toLowerCase()
                        .includes(normalizedSearch) ||
                    asset.tags?.some((tag) =>
                        tag
                            .toLowerCase()
                            .includes(
                                normalizedSearch
                            )
                    )
            );
        }, [
            assets,
            normalizedSearch,
        ]);

    const openCatalogNode = (
        node: CatalogNode
    ) => {
        setSearch("");
        setSelectedItem(null);

        setNavigationPath(
            (previousPath) => [
                ...previousPath,
                node,
            ]
        );
    };

    const navigateToRoot = () => {
        setSearch("");
        setSelectedItem(null);
        setNavigationPath([]);
    };

    const navigateToBreadcrumb = (
        index: number
    ) => {
        setSearch("");
        setSelectedItem(null);

        setNavigationPath(
            (previousPath) =>
                previousPath.slice(
                    0,
                    index + 1
                )
        );
    };

    const navigateBack = () => {
        setSearch("");
        setSelectedItem(null);

        setNavigationPath(
            (previousPath) =>
                previousPath.slice(
                    0,
                    -1
                )
        );
    };

    const hasResults =
        visibleCatalogNodes.length > 0 ||
        visibleAssets.length > 0;

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[8px] border border-slate-200 bg-white">
            {/* CABECERA */}
            <div className="border-b border-slate-200 px-5 py-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Navegador climático
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Explora las carpetas del catálogo y sus recursos asociados.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative w-full min-w-0 sm:w-[320px]">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Buscar en esta carpeta"
                                className="h-10 w-full rounded-[7px] border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setReloadVersion(
                                    (value) => value + 1
                                )
                            }
                            disabled={isLoading}
                            title="Recargar"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[7px] border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isLoading
                                    ? "animate-spin"
                                    : ""
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* ÁREA PRINCIPAL + SIDEBAR */}
            <div className="flex min-h-0 flex-1">
                {/* NAVEGADOR IZQUIERDO */}
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* NAVEGACIÓN */}
                    <div className="flex min-h-[58px] items-center gap-2 border-b border-slate-200 px-5">
                        <button
                            type="button"
                            onClick={navigateBack}
                            disabled={
                                navigationPath.length === 0 ||
                                isLoading
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                            title="Volver"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>

                        <div className="h-6 w-px bg-slate-200" />

                        <nav className="flex min-w-0 items-center overflow-x-auto whitespace-nowrap">
                            <button
                                type="button"
                                onClick={navigateToRoot}
                                className="flex items-center gap-2 rounded-[5px] px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            >
                                <Home className="h-4 w-4" />
                                Inicio
                            </button>

                            {navigationPath.map(
                                (node, index) => {
                                    const isCurrent =
                                        index ===
                                        navigationPath.length - 1;

                                    return (
                                        <Fragment
                                            key={node._key}
                                        >
                                            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigateToBreadcrumb(
                                                        index
                                                    )
                                                }
                                                className={`max-w-[220px] truncate rounded-[5px] px-2 py-1.5 text-sm ${isCurrent
                                                    ? "font-semibold text-slate-900"
                                                    : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                    }`}
                                            >
                                                {node.name}
                                            </button>
                                        </Fragment>
                                    );
                                }
                            )}
                        </nav>
                    </div>

                    {/* RESUMEN */}
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 px-5 py-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {currentNode
                                    ? currentNode.name
                                    : "Carpetas raíz"}
                            </p>

                            {currentNode?.description && (
                                <p className="mt-0.5 max-w-[700px] truncate text-xs text-slate-500">
                                    {currentNode.description}
                                </p>
                            )}
                        </div>

                        {!isLoading && (
                            <p className="shrink-0 text-xs text-slate-500">
                                {visibleCatalogNodes.length} carpetas ·{" "}
                                {visibleAssets.length} recursos
                            </p>
                        )}
                    </div>

                    {/* CONTENIDO */}
                    <div className="min-h-0 flex-1 overflow-auto">
                        <div className="min-w-[680px]">
                            <div className="sticky top-0 z-10 grid grid-cols-[minmax(300px,1fr)_180px_130px] border-b border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                <span>Nombre</span>
                                <span>Tipo</span>
                                <span>Estado</span>
                            </div>

                            {isLoading && (
                                <div className="flex min-h-[260px] items-center justify-center gap-3 text-sm text-slate-500">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Cargando contenido…
                                </div>
                            )}

                            {!isLoading && error && (
                                <div className="m-5 rounded-[8px] border border-red-200 bg-red-50 p-4">
                                    <p className="text-sm font-semibold text-red-700">
                                        No fue posible cargar esta carpeta
                                    </p>

                                    <p className="mt-1 text-sm text-red-600">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setReloadVersion(
                                                (value) =>
                                                    value + 1
                                            )
                                        }
                                        className="mt-3 rounded-[6px] border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            {!isLoading &&
                                !error &&
                                visibleCatalogNodes.map(
                                    (node) => (
                                        <button
                                            key={node._key}
                                            type="button"
                                            onClick={() =>
                                                selectCatalogNode(
                                                    node
                                                )
                                            }
                                            onDoubleClick={() =>
                                                openCatalogNode(
                                                    node
                                                )
                                            }
                                            className={`grid w-full grid-cols-[minmax(300px,1fr)_180px_130px] items-center border-b px-5 py-3 text-left transition ${isCatalogNodeSelected(
                                                node._key
                                            )
                                                ? "border-blue-200 bg-blue-100/80 ring-1 ring-inset ring-blue-300"
                                                : "border-slate-100 hover:bg-blue-50/60"
                                                }`}
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-amber-50">
                                                    <Folder className="h-5 w-5 fill-amber-400 text-amber-500" />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-800">
                                                        {node.name}
                                                    </p>

                                                    {node.description && (
                                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                                            {
                                                                node.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <span className="text-sm capitalize text-slate-500">
                                                {node.type ||
                                                    "folder"}
                                            </span>

                                            <span className="text-sm text-slate-400">
                                                —
                                            </span>
                                        </button>
                                    )
                                )}

                            {!isLoading &&
                                !error &&
                                visibleAssets.map(
                                    (asset) => (
                                        <button
                                            key={asset._key}
                                            type="button"
                                            onClick={() =>
                                                selectAsset(asset)
                                            }
                                            className={`grid w-full grid-cols-[minmax(300px,1fr)_180px_130px] items-center border-b px-5 py-3 text-left transition ${isAssetSelected(
                                                asset._key
                                            )
                                                ? "border-blue-200 bg-blue-100/80 ring-1 ring-inset ring-blue-300"
                                                : "border-slate-100 hover:bg-slate-50"
                                                }`}
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-slate-100">
                                                    <AssetIcon
                                                        kind={
                                                            asset.kind
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-800">
                                                        {asset.name}
                                                    </p>

                                                    {asset.description && (
                                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                                            {
                                                                asset.description
                                                            }
                                                        </p>
                                                    )}

                                                    {asset.tags &&
                                                        asset.tags
                                                            .length >
                                                        0 && (
                                                            <div className="mt-1 flex gap-1 overflow-hidden">
                                                                {asset.tags
                                                                    .slice(
                                                                        0,
                                                                        3
                                                                    )
                                                                    .map(
                                                                        (
                                                                            tag
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    tag
                                                                                }
                                                                                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500"
                                                                            >
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>

                                            <span className="truncate pr-3 text-sm text-slate-500">
                                                {getAssetKindLabel(
                                                    asset.kind
                                                )}
                                            </span>

                                            <div>
                                                <span
                                                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(
                                                        asset.status
                                                    )}`}
                                                >
                                                    {asset.status ??
                                                        "registered"}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                )}

                            {!isLoading &&
                                !error &&
                                !hasResults && (
                                    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                                        <FolderOpen className="h-12 w-12 text-slate-300" />

                                        <p className="mt-4 text-sm font-semibold text-slate-700">
                                            {normalizedSearch
                                                ? "No se encontraron resultados"
                                                : "Esta carpeta está vacía"}
                                        </p>

                                        <p className="mt-1 max-w-[400px] text-sm text-slate-500">
                                            {normalizedSearch
                                                ? "Prueba con otro nombre, tipo o etiqueta."
                                                : "No existen carpetas hijas ni assets registrados en este nivel."}
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR DERECHO */}
                {selectedAsset && (
                    <AssetSidebar
                        asset={selectedAsset}
                        onClose={() =>
                            setSelectedItem(null)
                        }
                    />
                )}
            </div>
        </div>
    );
}