"use client";

import IncidenceLegend from "./IncidenceLegend";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    GeoJSON,
    MapContainer,
    TileLayer,
    ZoomControl,
    useMap,
} from "react-leaflet";

import L from "leaflet";

import type {
    Feature,
    FeatureCollection,
    GeoJsonObject,
} from "geojson";

import type {
    Layer,
    PathOptions,
} from "leaflet";

import type {
    DepartmentEpidemiologicalMapData,
} from "../data/geovisor";

import {
    getDepartmentEpidemiologicalMapData,
} from "../services/geovisor.service";

/**
 * ============================================================================
 * URL OFICIAL - DEPARTAMENTOS DE COLOMBIA
 * ----------------------------------------------------------------------------
 * Fuente: DANE
 * ============================================================================
 */
const DEPARTMENTS_GEOJSON_URL =
    "/api/geovisor/departamentos";

/**
 * ============================================================================
 * COLOR SEGÚN TASA DE INCIDENCIA
 * ============================================================================
 */
function getIncidenceColor(
    incidenceRate: number
) {

    if (incidenceRate <= 50) {
        return "#35B779";
    }

    if (incidenceRate <= 100) {
        return "#8CCB6B";
    }

    if (incidenceRate <= 200) {
        return "#F9C23C";
    }

    if (incidenceRate <= 400) {
        return "#F98C2B";
    }

    if (incidenceRate <= 800) {
        return "#F65341";
    }

    return "#D92F3D";

}

/**
 * ============================================================================
 * NORMALIZACIÓN DE NOMBRES
 * ----------------------------------------------------------------------------
 * Permite comparar:
 *
 * "Atlántico"
 * "ATLANTICO"
 * "atlántico"
 *
 * sin generar problemas.
 * ============================================================================
 */
function normalizeDepartmentName(
    value: string
) {

    return value
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();

}

/**
 * ============================================================================
 * OBTENER NOMBRE DEL DEPARTAMENTO
 * ============================================================================
 */
function getDepartmentName(
    feature?: Feature
) {

    const properties =
        feature?.properties ?? {};

    return String(
        properties.DPTO_CNMBRE ??
        properties.NOM_DPTO ??
        properties.DEPARTAMENTO ??
        ""
    );

}

/**
 * ============================================================================
 * AJUSTAR MAPA A LOS LÍMITES DE COLOMBIA
 * ============================================================================
 */
function FitDepartmentsBounds({
    data,
}: {
    data: FeatureCollection;
}) {

    const map = useMap();

    useEffect(() => {

        const geoJsonLayer =
            L.geoJSON(data);

        const bounds =
            geoJsonLayer.getBounds();

        if (bounds.isValid()) {

            map.fitBounds(
                bounds,
                {
                    padding: [18, 18],
                }
            );

        }

    }, [data, map]);

    return null;

}

/**
 * ============================================================================
 * MAPA EPIDEMIOLÓGICO
 * ============================================================================
 */
export default function EpidemiologicalMapClient() {

    const [
        geoJsonData,
        setGeoJsonData,
    ] = useState<FeatureCollection | null>(
        null
    );

    const [
        epidemiologicalData,
        setEpidemiologicalData,
    ] = useState<
        DepartmentEpidemiologicalMapData[]
    >([]);

    /**
     * =========================================================================
     * CARGA DE DATOS
     * =========================================================================
     */
    useEffect(() => {

        async function loadMap() {

            try {

                /**
                 * Datos epidemiológicos
                 */
                const epidemiologicalResponse =
                    await getDepartmentEpidemiologicalMapData();

                setEpidemiologicalData(
                    epidemiologicalResponse
                );

                /**
                 * Límites oficiales de Colombia
                 */
                const response =
                    await fetch(
                        DEPARTMENTS_GEOJSON_URL
                    );

                if (!response.ok) {

                    throw new Error(
                        "No fue posible cargar los departamentos."
                    );

                }

                const geoJson =
                    await response.json();

                setGeoJsonData(
                    geoJson as FeatureCollection
                );

            } catch (error) {

                console.error(
                    "Error cargando mapa epidemiológico:",
                    error
                );

            }

        }

        void loadMap();

    }, []);

    /**
     * =========================================================================
     * CREACIÓN DEL ÍNDICE POR DEPARTAMENTO
     * =========================================================================
     */
    const departmentDataMap =
        useMemo(() => {

            const map = new Map<
                string,
                DepartmentEpidemiologicalMapData
            >();

            epidemiologicalData.forEach(
                (item) => {

                    map.set(
                        normalizeDepartmentName(
                            item.department
                        ),
                        item
                    );

                }
            );

            return map;

        }, [epidemiologicalData]);

    /**
     * =========================================================================
     * OBTENER INFORMACIÓN DE UNA FEATURE
     * =========================================================================
     */
    function getFeatureData(
        feature?: Feature
    ) {

        const departmentName =
            getDepartmentName(feature);

        return departmentDataMap.get(
            normalizeDepartmentName(
                departmentName
            )
        );

    }

    /**
     * =========================================================================
     * ESTILO DE CADA DEPARTAMENTO
     * =========================================================================
     */
    function departmentStyle(
        feature?: Feature
    ): PathOptions {

        const data =
            getFeatureData(feature);

        /**
         * Departamento sin información
         */
        if (!data) {

            return {

                fillColor:
                    "#E2E8F0",

                fillOpacity:
                    0.35,

                color:
                    "#94A3B8",

                weight:
                    1,

            };

        }

        return {

            fillColor:
                getIncidenceColor(
                    data.incidenceRate
                ),

            fillOpacity:
                0.68,

            color:
                "#FFFFFF",

            weight:
                1.2,

        };

    }

    /**
     * =========================================================================
     * INTERACCIÓN DE CADA DEPARTAMENTO
     * =========================================================================
     */
    function onEachDepartment(
        feature: Feature,
        layer: Layer
    ) {

        const departmentName =
            getDepartmentName(feature) ||
            "Departamento";

        const data =
            getFeatureData(feature);

        /**
         * TOOLTIP SIN DATOS
         */
        if (!data) {

            layer.bindTooltip(
                `
                    <div style="
                        min-width: 130px;
                        font-family: sans-serif;
                    ">

                        <strong>
                            ${departmentName}
                        </strong>

                        <br />

                        <span style="
                            font-size: 11px;
                            color: #64748b;
                        ">
                            Sin información epidemiológica
                        </span>

                    </div>
                `
            );

            return;

        }

        /**
         * TOOLTIP CON INFORMACIÓN
         */
        layer.bindTooltip(
            `
        <div style="
            min-width: 150px;
            font-family: sans-serif;
        ">

            <strong style="
                font-size: 13px;
            ">
                ${departmentName}
            </strong>

            <div style="
                margin-top: 6px;
                font-size: 11px;
            ">

                <div style="
                    margin-top: 6px;
                    padding-bottom: 4px;
                ">

                    <span style="
                        color: #7447F5;
                        font-weight: 600;
                    ">
                        Dengue:
                    </span>

                    <strong style="
                        margin-left: 4px;
                    ">
                        ${data.dengueCases.toLocaleString(
                "es-CO"
            )}
                    </strong>

                </div>

                <div style="
                    padding-bottom: 4px;
                ">

                    <span style="
                        color: #4DBB88;
                        font-weight: 600;
                    ">
                        IRA:
                    </span>

                    <strong style="
                        margin-left: 4px;
                    ">
                        ${data.iraCases.toLocaleString(
                "es-CO"
            )}
                    </strong>

                </div>

                <div>
                    Incidencia:
                    <strong>
                        ${data.incidenceRate}
                    </strong>
                </div>

                <div>
                    Riesgo:
                    <strong>
                        ${data.riskLevel}
                    </strong>
                </div>

            </div>

        </div>
    `,
            {
                sticky: true,
            }
        );

    }

    return (

        <div
            className="
                relative
                h-full
                min-h-[480px]
                w-full
                overflow-hidden
                rounded-2xl
            "
        >


            <MapContainer
                center={[
                    4.3,
                    -74.2,
                ]}
                zoom={5.5}
                minZoom={5}
                maxZoom={12}
                scrollWheelZoom={true}
                zoomControl={false}
                className="
                    h-full
                    min-h-[480px]
                    w-full
                "
            >

                {/* ========================================================
                    MAPA BASE
                ======================================================== */}

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {geoJsonData && (

                    <FitDepartmentsBounds
                        data={geoJsonData}
                    />

                )}

                {/* ========================================================
                    DEPARTAMENTOS
                ======================================================== */}

                {geoJsonData && (

                    <GeoJSON
                        data={
                            geoJsonData as GeoJsonObject
                        }
                        style={
                            departmentStyle
                        }
                        onEachFeature={
                            onEachDepartment
                        }
                    />

                )}

                {/* ========================================================
                    ZOOM
                ======================================================== */}

                <ZoomControl
                    position="topright"
                />

            </MapContainer>

            <IncidenceLegend />

        </div>

    );

}