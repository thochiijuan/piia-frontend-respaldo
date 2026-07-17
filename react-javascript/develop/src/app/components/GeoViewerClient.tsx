// src/app/components/GeoViewerClient.tsx

"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";

import {
  geoJSON as createLeafletGeoJSON,
} from "leaflet";

import type {
  LatLngBoundsExpression,
  PathOptions,
} from "leaflet";

import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";

import {
  GeoJSON,
  ImageOverlay,
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import {
  ensureDepartmentVariableStored,
} from "../../static/js/department_variable_storage";

import {
  ensureMUNICIPALITYVariableStored,
} from "../../static/js/municipality_variable_storage";

import { departmentsIDs, departmentsColors } from "../../static/js/endpoint_var";

import {
  useZarrAnimation,
} from "./useZarrAnimation";

const DEFAULT_MIN_ZOOM = 4;
const DEFAULT_MAX_ZOOM = 18;

const DEPARTMENT_MAX_INITIAL_ZOOM = 10;
const MUNICIPALITY_MAX_INITIAL_ZOOM = 14;

const DEPARTMENT_BOUNDS_PADDING = 0.10;
const MUNICIPALITY_BOUNDS_PADDING = 0.12;

const WORLD_BOUNDS: LatLngBoundsExpression = [
  [-85, -180],
  [85, 180],
];

/*
 * El directorio debe existir como:
 * public/result.zarr/
 *
 * Next lo expone en:
 * /result.zarr/
 */
const TEST_ZARR_URL = "/result.zarr";
const TEST_ZARR_VARIABLE = "t2m";

/*
 * Rango fijo de la paleta.
 * Para temperatura ERA5 en Kelvin puedes empezar
 * con 260 K a 315 K y después ajustarlo.
 */
const TEST_ZARR_MIN_VALUE = 260;
const TEST_ZARR_MAX_VALUE = 315;

const TEST_ZARR_PALETTE = [
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

type ParsedShapefile = FeatureCollection<
  Geometry,
  GeoJsonProperties
> & {
  fileName?: string;
};

interface StoredFile {
  blob: Blob;
}

type ShapefileParser = (
  buffer: ArrayBuffer
) => Promise<
  | ParsedShapefile
  | ParsedShapefile[]
>;

interface GeoViewerClientProps {
  selectedDepartmentId: string;
  selectedMunicipalityId: string;

  /*
   * IDs provenientes de las opciones del selector.
   */
  municipalityIds?: string[];

  applyVersion: number;
}

interface DepartmentLayerProps {
  data: ParsedShapefile;
  selectedDepartmentId: string;
}

interface MunicipalityLayerProps {
  data: ParsedShapefile;
  selectedMunicipalityId: string;
}

interface MapViewportControllerProps {
  departmentData: ParsedShapefile;
  municipalityData: ParsedShapefile | null;

  selectedDepartmentId: string;
  selectedMunicipalityId: string;

  applyVersion: number;
}

/*
 * Departamentos sin selección.
 */
const createDepartmentStyle = (
  color: string
): PathOptions => ({
  color,
  weight: 2.5,
  opacity: 1,
  dashArray: "4 7",
  lineCap: "round",

  fill: true,
  fillColor: color,
  fillOpacity: 0.25,
});
const defaultDepartmentStyle: PathOptions = {
  color: "#ff0000",
  weight: 2.5,
  opacity: 1,
  fill: false,
  dashArray: "4 7",
  lineCap: "round",
};



const departmentColorById = new Map<string, string>(
  departmentsIDs.map((id, index) => [
    String(id),
    departmentsColors[index] ?? "#ff0000",
  ])
);

/*
 * Otros departamentos.
 */
const inactiveDepartmentStyle: PathOptions = {
  color: "#64748b",
  weight: 1.5,
  opacity: 0.18,
  fill: false,
  dashArray: "4 7",
  lineCap: "round",
};

/*
 * Departamento seleccionado.
 */
const selectedDepartmentStyle: PathOptions = {
  color: "#ff0000",
  weight: 4,
  opacity: 1,
  fill: false,
  dashArray: "6 6",
  lineCap: "round",
};

const createSelectedDepartmentStyle = (
  color: string
): PathOptions => ({
  color,
  weight: 4,
  opacity: 1,
  dashArray: "6 6",
  lineCap: "round",

  fill: true,
  fillColor: color,
  fillOpacity: 0.25,
});

const normalDepartmentStyle: PathOptions = {
  // Borde
  color: "#475569",
  weight: 0.8,
  opacity: 1,
  // dashArray: "4 7",
  lineCap: "round",

  // Relleno
  fill: true,
  fillColor: "#64748b",
  fillOpacity: 0.28,
};
/*
 * Municipios del departamento.
 */
const municipalityStyle: PathOptions = {
  color: "#b8a755",
  weight: 3,
  opacity: 0.9,
  fill: false,
  dashArray: "3 5",
  lineCap: "round",
};

/*
 * Otros municipios cuando uno está seleccionado.
 */
const inactiveMunicipalityStyle: PathOptions = {
  color: "#64748b",
  weight: 1.2,
  opacity: 0.20,
  fill: false,
  dashArray: "3 5",
  lineCap: "round",
};

/*
 * Municipio seleccionado.
 */
const selectedMunicipalityStyle: PathOptions = {
  color: "#8b7400",
  weight: 4.5,
  opacity: 1,
  fill: false,
  dashArray: "7 5",
  lineCap: "round",
};

const highlightedDepartmentIds = new Set(
  departmentsIDs.map((id) => String(id))
);

function getFeatureId(
  feature: Feature<
    Geometry,
    GeoJsonProperties
  >
): string {
  const properties =
    feature.properties ?? {};

  return String(
    properties.id ??
    properties.ID ??
    properties.pk ??
    properties.PK ??
    properties.codigo ??
    properties.CODIGO ??
    feature.id ??
    ""
  );
}

function findFeatureById(
  data: ParsedShapefile | null,
  id: string
): Feature<
  Geometry,
  GeoJsonProperties
> | null {
  if (!data || !id) {
    return null;
  }

  return (
    data.features.find(
      (feature) =>
        getFeatureId(feature) === id
    ) ?? null
  );
}

function isStoredFile(
  value: unknown
): value is StoredFile {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  return (
    "blob" in value &&
    value.blob instanceof Blob
  );
}

async function parseStoredShapefile(
  storedFile: unknown,
  parser: ShapefileParser,
  variableName: string
): Promise<ParsedShapefile> {
  if (!isStoredFile(storedFile)) {
    throw new Error(
      `${variableName} no contiene un Blob válido`
    );
  }

  const zipBuffer =
    await storedFile.blob.arrayBuffer();

  const parsed =
    await parser(zipBuffer);

  const shapefiles =
    Array.isArray(parsed)
      ? parsed
      : [parsed];

  const shape =
    shapefiles.find(
      (item) =>
        item.fileName
          ?.toLowerCase() === "data"
    ) ?? shapefiles[0];

  if (!shape) {
    throw new Error(
      `No se encontró data.shp dentro de ${variableName}`
    );
  }

  if (
    shape.type !==
    "FeatureCollection"
  ) {
    throw new Error(
      `${variableName} no produjo un FeatureCollection válido`
    );
  }

  return shape;
}

function DepartmentLayer({
  data,
  selectedDepartmentId,
}: DepartmentLayerProps) {
  const departmentId = String(
    selectedDepartmentId ?? ""
  );
  const selectedDepartmentColor =
    departmentColorById.get(departmentId) ??
    "#ff0000";

  const selectedFeature = useMemo(
    () =>
      findFeatureById(
        data,
        departmentId
      ),
    [data, departmentId]
  );

  return (
    <>
      <GeoJSON
        key={`departments-${departmentId || "all"}`}
        data={data}
        style={(feature) => {
          if (!feature) {
            return normalDepartmentStyle;
          }

          const featureId = getFeatureId(
            feature as Feature<
              Geometry,
              GeoJsonProperties
            >
          );

          const departmentColor =
            departmentColorById.get(featureId);

          if (departmentColor) {
            return createDepartmentStyle(
              departmentColor
            );
          }

          return normalDepartmentStyle;
        }}
        interactive={false}
      />

      {selectedFeature && (
        <GeoJSON
          key={`selected-department-${departmentId}`}
          data={selectedFeature}
          style={selectedDepartmentStyle}
          interactive={false}
        />
      )}
    </>
  );
}

function MunicipalityLayer({
  data,
  selectedMunicipalityId,
}: MunicipalityLayerProps) {
  const municipalityId = String(
    selectedMunicipalityId ?? ""
  );

  const selectedFeature = useMemo(
    () =>
      findFeatureById(
        data,
        municipalityId
      ),
    [data, municipalityId]
  );

  if (data.features.length === 0) {
    return null;
  }

  return (
    <>
      <GeoJSON
        key={`municipalities-${municipalityId || "all"}`}
        data={data}
        style={
          municipalityId
            ? inactiveMunicipalityStyle
            : municipalityStyle
        }
        interactive={false}
      />

      {selectedFeature && (
        <GeoJSON
          key={`selected-municipality-${municipalityId}`}
          data={selectedFeature}
          style={selectedMunicipalityStyle}
          interactive={false}
        />
      )}
    </>
  );
}

/*
 * Único componente autorizado para controlar
 * zoom, centro y límites de navegación.
 */
function MapViewportController({
  departmentData,
  municipalityData,
  selectedDepartmentId,
  selectedMunicipalityId,
  applyVersion,
}: MapViewportControllerProps) {
  const map = useMap();

  const departmentId = String(
    selectedDepartmentId ?? ""
  );

  const municipalityId = String(
    selectedMunicipalityId ?? ""
  );

  const selectedDepartmentFeature =
    useMemo(
      () =>
        findFeatureById(
          departmentData,
          departmentId
        ),
      [departmentData, departmentId]
    );

  const selectedMunicipalityFeature =
    useMemo(
      () =>
        findFeatureById(
          municipalityData,
          municipalityId
        ),
      [
        municipalityData,
        municipalityId,
      ]
    );

  useEffect(() => {
    /*
     * Primero eliminamos restricciones anteriores.
     * Esto permite cambiar de municipio o departamento.
     */
    map.setMaxBounds(WORLD_BOUNDS);
    map.setMinZoom(DEFAULT_MIN_ZOOM);

    let targetFeature:
      | Feature<
        Geometry,
        GeoJsonProperties
      >
      | null = null;

    let movementPadding =
      DEPARTMENT_BOUNDS_PADDING;

    let maximumInitialZoom =
      DEPARTMENT_MAX_INITIAL_ZOOM;

    /*
     * El municipio tiene prioridad.
     */
    if (selectedMunicipalityFeature) {
      targetFeature =
        selectedMunicipalityFeature;

      movementPadding =
        MUNICIPALITY_BOUNDS_PADDING;

      maximumInitialZoom =
        MUNICIPALITY_MAX_INITIAL_ZOOM;
    } else if (
      selectedDepartmentFeature
    ) {
      targetFeature =
        selectedDepartmentFeature;
    }

    if (targetFeature) {
      const targetBounds =
        createLeafletGeoJSON(
          targetFeature
        ).getBounds();

      if (!targetBounds.isValid()) {
        return;
      }

      const movementBounds =
        targetBounds.pad(
          movementPadding
        );

      const calculatedMinZoom =
        map.getBoundsZoom(
          movementBounds,
          false,
          [30, 30]
        );

      const restrictedMinZoom =
        Math.min(
          calculatedMinZoom,
          maximumInitialZoom
        );

      map.setMinZoom(
        restrictedMinZoom
      );

      map.setMaxBounds(
        movementBounds
      );

      map.fitBounds(targetBounds, {
        padding: [30, 30],
        maxZoom:
          maximumInitialZoom,
        animate: true,
        duration: 0.6,
      });

      map.panInsideBounds(
        movementBounds,
        {
          animate: false,
        }
      );

      return;
    }

    if (
      municipalityId &&
      !selectedMunicipalityFeature
    ) {
      console.warn(
        `No se encontró el municipio ${municipalityId} en MunicipalityVariable.zip`
      );
    }

    if (
      departmentId &&
      !selectedDepartmentFeature
    ) {
      console.warn(
        `No se encontró el departamento ${departmentId} en DepartmentVariable.zip`
      );
    }

    const colombiaBounds =
      createLeafletGeoJSON(
        departmentData
      ).getBounds();

    if (!colombiaBounds.isValid()) {
      return;
    }

    map.fitBounds(colombiaBounds, {
      padding: [20, 20],
      maxZoom: 6,
      animate: true,
      duration: 0.6,
    });
  }, [
    map,
    departmentData,
    departmentId,
    municipalityId,
    selectedDepartmentFeature,
    selectedMunicipalityFeature,
    applyVersion,
  ]);

  return null;
}

export default function GeoViewerClient({
  selectedDepartmentId,
  selectedMunicipalityId,
  municipalityIds = [],
  applyVersion,
}: GeoViewerClientProps) {
  const [
    departmentGeoJSON,
    setDepartmentGeoJSON,
  ] = useState<
    ParsedShapefile | null
  >(null);

  const [
    municipalityGeoJSON,
    setMunicipalityGeoJSON,
  ] = useState<
    ParsedShapefile | null
  >(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const zarrAnimation = useZarrAnimation({
    url: TEST_ZARR_URL,
    variableName: TEST_ZARR_VARIABLE,
    latName: "lat",
    lonName: "lon",
    timeName: "time",
    minValue: TEST_ZARR_MIN_VALUE,
    maxValue: TEST_ZARR_MAX_VALUE,
    palette: TEST_ZARR_PALETTE,
    frameDurationMs: 900,
    opacity: 0.72,
    cacheSize: 8,
  });

  /*
   * De los 1.122 municipios del shapefile,
   * deja únicamente los que llegaron como choices.
   */
  const filteredMunicipalityGeoJSON =
    useMemo<
      ParsedShapefile | null
    >(() => {
      if (
        !municipalityGeoJSON ||
        !selectedDepartmentId ||
        municipalityIds.length === 0
      ) {
        return null;
      }

      const allowedIds = new Set(
        municipalityIds.map(String)
      );

      return {
        ...municipalityGeoJSON,

        features:
          municipalityGeoJSON.features.filter(
            (feature) =>
              allowedIds.has(
                getFeatureId(
                  feature
                )
              )
          ),
      };
    }, [
      municipalityGeoJSON,
      selectedDepartmentId,
      municipalityIds,
    ]);

  useEffect(() => {
    let cancelled = false;

    const loadGeographicVariables =
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const [
            storedDepartmentFile,
            storedMunicipalityFile,
          ] = await Promise.all([
            ensureDepartmentVariableStored(),
            ensureMUNICIPALITYVariableStored(),
          ]);

          const { default: shp } =
            await import("shpjs");

          const parser =
            shp as ShapefileParser;

          const [
            departmentShape,
            municipalityShape,
          ] = await Promise.all([
            parseStoredShapefile(
              storedDepartmentFile,
              parser,
              "DepartmentVariable.zip"
            ),

            parseStoredShapefile(
              storedMunicipalityFile,
              parser,
              "MunicipalityVariable.zip"
            ),
          ]);

          if (cancelled) {
            return;
          }

          setDepartmentGeoJSON(
            departmentShape
          );

          setMunicipalityGeoJSON(
            municipalityShape
          );
        } catch (loadError) {
          console.error(
            "Error cargando las capas geográficas:",
            loadError
          );

          if (!cancelled) {
            setDepartmentGeoJSON(
              null
            );

            setMunicipalityGeoJSON(
              null
            );

            setError(
              loadError instanceof Error
                ? loadError.message
                : "Error desconocido cargando las capas"
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    loadGeographicVariables();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasSelectedMunicipality =
    Boolean(
      selectedMunicipalityId
    );

  const hasSelectedDepartment =
    Boolean(
      selectedDepartmentId
    );

  return (
    <div className="relative isolate h-full w-full min-h-0 overflow-hidden">
      <MapContainer
        center={[4.5709, -74.2973]}
        zoom={6}
        minZoom={DEFAULT_MIN_ZOOM}
        maxZoom={DEFAULT_MAX_ZOOM}
        maxBounds={WORLD_BOUNDS}
        maxBoundsViscosity={1}
        inertia={false}
        bounceAtZoomLimits={false}
        scrollWheelZoom
        className="absolute inset-0 z-0 h-full w-full"
      >
        {departmentGeoJSON && (
          <MapViewportController
            departmentData={departmentGeoJSON}
            municipalityData={
              filteredMunicipalityGeoJSON
            }
            selectedDepartmentId={
              selectedDepartmentId
            }
            selectedMunicipalityId={
              selectedMunicipalityId
            }
            applyVersion={applyVersion}
          />
        )}

        <LayersControl position="topright">
          <LayersControl.BaseLayer
            checked
            name="OpenStreetMap"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url={
                "https://server.arcgisonline.com/" +
                "ArcGIS/rest/services/" +
                "World_Imagery/MapServer/" +
                "tile/{z}/{y}/{x}"
              }
            />
          </LayersControl.BaseLayer>

          {zarrAnimation.frameUrl &&
            zarrAnimation.bounds && (
              <LayersControl.Overlay
                checked
                name={`Zarr animado · ${TEST_ZARR_VARIABLE}`}
              >
                <ImageOverlay
                  key={`zarr-frame-${zarrAnimation.frameIndex}`}
                  url={zarrAnimation.frameUrl}
                  bounds={zarrAnimation.bounds}
                  opacity={zarrAnimation.opacity}
                  zIndex={350}
                  interactive={false}
                />
              </LayersControl.Overlay>
            )}
        </LayersControl>

        {departmentGeoJSON && (
          <DepartmentLayer
            data={departmentGeoJSON}
            selectedDepartmentId={
              selectedDepartmentId
            }
          />
        )}

        {filteredMunicipalityGeoJSON && (
          <MunicipalityLayer
            data={filteredMunicipalityGeoJSON}
            selectedMunicipalityId={
              selectedMunicipalityId
            }
          />
        )}
      </MapContainer>

      <div
        className="
    pointer-events-auto
    absolute
    left-1/2
    top-3
    z-[5000]
    w-[min(760px,calc(100%_-_32px))]
    -translate-x-1/2
    rounded-[10px]
    border border-slate-200
    bg-white/95
    p-3
    shadow-xl
    backdrop-blur
  "
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              zarrAnimation.setFrameIndex(
                zarrAnimation.frameIndex - 1
              )
            }
            disabled={
              zarrAnimation.frameCount <= 1 ||
              zarrAnimation.isLoadingFrame
            }
            title="Frame anterior"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={
              zarrAnimation.togglePlaying
            }
            disabled={
              zarrAnimation.frameCount <= 1 ||
              zarrAnimation.isLoadingMetadata
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              zarrAnimation.isPlaying
                ? "Pausar animación"
                : "Reproducir animación"
            }
          >
            {zarrAnimation.isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              zarrAnimation.setFrameIndex(
                zarrAnimation.frameIndex + 1
              )
            }
            disabled={
              zarrAnimation.frameCount <= 1 ||
              zarrAnimation.isLoadingFrame
            }
            title="Frame siguiente"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={zarrAnimation.reload}
            disabled={
              zarrAnimation.isLoadingMetadata
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            title="Recargar Zarr"
          >
            <RefreshCw
              className={`h-4 w-4 ${zarrAnimation.isLoadingMetadata
                ? "animate-spin"
                : ""
                }`}
            />
          </button>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-3 text-[11px] text-slate-500">
              <span className="truncate font-medium text-slate-700">
                {zarrAnimation.currentTimeLabel}
              </span>

              <span className="shrink-0">
                {zarrAnimation.frameCount > 0
                  ? `${zarrAnimation.frameIndex + 1
                  } / ${zarrAnimation.frameCount
                  }`
                  : "Sin frames"}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(
                zarrAnimation.frameCount - 1,
                0
              )}
              step={1}
              value={zarrAnimation.frameIndex}
              onChange={(event) =>
                zarrAnimation.setFrameIndex(
                  Number(event.target.value)
                )
              }
              disabled={
                zarrAnimation.frameCount === 0
              }
              className="w-full accent-blue-600"
            />
          </div>

          <label className="hidden shrink-0 text-[11px] text-slate-500 sm:block">
            Velocidad
            <select
              value={
                zarrAnimation.frameDurationMs
              }
              onChange={(event) =>
                zarrAnimation.setFrameDurationMs(
                  Number(event.target.value)
                )
              }
              className="ml-2 rounded-[6px] border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700"
            >
              <option value={1500}>Lenta</option>
              <option value={900}>Normal</option>
              <option value={450}>Rápida</option>
            </select>
          </label>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <span className="text-[10px] text-slate-500">
            {TEST_ZARR_MIN_VALUE}
          </span>

          <div
            className="h-2 flex-1 rounded-full"
            style={{
              background: `linear-gradient(to right, ${TEST_ZARR_PALETTE.join(
                ", "
              )})`,
            }}
          />

          <span className="text-[10px] text-slate-500">
            {TEST_ZARR_MAX_VALUE}
          </span>

          <label className="ml-2 flex items-center gap-2 text-[10px] text-slate-500">
            Opacidad
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={zarrAnimation.opacity}
              onChange={(event) =>
                zarrAnimation.setOpacity(
                  Number(event.target.value)
                )
              }
              className="w-20 accent-blue-600"
            />
          </label>
        </div>

        {zarrAnimation.isLoadingFrame && (
          <p className="mt-2 text-[11px] text-blue-600">
            Cargando frame Zarr…
          </p>
        )}

        {zarrAnimation.error && (
          <p className="mt-2 break-words text-[11px] text-red-600">
            {zarrAnimation.error}
          </p>
        )}
      </div>

      {hasSelectedMunicipality && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
          <div className="bg-white/90 border border-slate-200 shadow-sm rounded-[8px] px-3 py-2 text-xs text-slate-600">
            Navegación limitada al municipio seleccionado
          </div>
        </div>
      )}

      {!hasSelectedMunicipality &&
        hasSelectedDepartment && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
            <div className="bg-white/90 border border-slate-200 shadow-sm rounded-[8px] px-3 py-2 text-xs text-slate-600">
              Navegación limitada al departamento seleccionado
            </div>
          </div>
        )}

      {isLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[2000] bg-white border border-slate-200 shadow-md rounded-lg px-4 py-2 text-sm text-slate-600">
          Cargando departamentos y municipios…
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2000] max-w-[500px] bg-red-50 border border-red-200 shadow-md rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}