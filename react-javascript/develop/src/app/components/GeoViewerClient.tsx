// src/app/components/GeoViewerClient.tsx

"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
const defaultDepartmentStyle: PathOptions = {
  color: "#ff0000",
  weight: 2.5,
  opacity: 1,
  fill: false,
  dashArray: "4 7",
  lineCap: "round",
};

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

/*
 * Municipios del departamento.
 */
const municipalityStyle: PathOptions = {
  color: "#f59e0b",
  weight: 1.8,
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
  color: "#ffd400",
  weight: 4.5,
  opacity: 1,
  fill: false,
  dashArray: "7 5",
  lineCap: "round",
};

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
        style={
          departmentId
            ? inactiveDepartmentStyle
            : defaultDepartmentStyle
        }
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
  municipalityIds,
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
    <div className="relative w-full h-full min-h-0">
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
        className="w-full h-full z-0"
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