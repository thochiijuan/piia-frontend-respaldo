/**
 * ============================================================================
 * ColombiaRegionsMap
 * ----------------------------------------------------------------------------
 * Componente encargado de renderizar el mapa interactivo de Colombia
 * utilizado en el Dashboard de Resumen General.
 *
 * Responsabilidades:
 * - Dibujar el mapa utilizando Leaflet.
 * - Colorear los departamentos según su región.
 * - Mostrar información resumida mediante Tooltips.
 * - Resaltar una región cuando el usuario pasa el cursor.
 * - Ajustar automáticamente el mapa al tamaño del contenedor.
 *
 * Fuente de datos:
 * Actualmente utiliza información simulada definida en regions.ts.
 * En producción los indicadores serán obtenidos desde dashboard.service.ts.
 *
 * Dependencias principales:
 * - React Leaflet
 * - Leaflet
 * - GeoJSON
 * ============================================================================
 */

"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";

import L from "leaflet";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";

import colombia from "../../data/co.json";

import {

    getRegionByDepartment,

} from "./regions";

/**
 * Ajusta automáticamente el mapa para que todo el territorio nacional
 * sea visible dentro del contenedor.
 *
 * Este componente evita configurar manualmente el centro y el nivel
 * de zoom, permitiendo que el mapa se adapte a diferentes resoluciones.
 */
function FitMapBounds({ data }: { data: any }) {

    const map = useMap();

    useEffect(() => {

        const layer = L.geoJSON(data);

        map.fitBounds(layer.getBounds(), {
            padding: [5, 5],
        });

        map.setZoom(map.getZoom() + 0.15);

    }, [map, data]);

    return null;

}

export default function ColombiaRegionsMap() {

    /**
     * Región actualmente resaltada por interacción del usuario.
     *
     * Se utiliza para atenuar las demás regiones y mejorar
     * la percepción visual del mapa.
     */
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    return (

        <div className="w-full h-full">

            {/* Contenedor principal del mapa */}
            <MapContainer

                /**
                 * El mapa del Dashboard es únicamente informativo.
                 * Las interacciones avanzadas estarán disponibles
                 * en el Geovisor Epidemiológico.
                 */
                zoomControl={false}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                touchZoom={false}
                keyboard={false}
                attributionControl={false}

                zoomSnap={0.1}
                zoomDelta={0.1}

                style={{
                    width: "100%",
                    height: "100%",
                    background: "transparent",
                }}
                
                /**
                * Renderiza todos los departamentos contenidos
                * en el archivo GeoJSON de Colombia.
                */
            >

                {/* Ajusta automáticamente el mapa al tamaño disponible */}
                <FitMapBounds data={colombia} />

                <GeoJSON

                    data={colombia as GeoJSON.GeoJsonObject}

                    /**
                     * Determina el color que tendrá cada departamento.
                     *
                     * Si existe una región activa únicamente esa región
                     * conservará su color; las demás se mostrarán atenuadas.
                     */
                    style={(feature: any) => {


                        const department = feature.properties.name;

                        /**
                         * Obtiene la región a la que pertenece el departamento.
                         */
                        const region = getRegionByDepartment(department);

                        return {

                            color: "#F8FAFC",

                            weight: 1.5,

                            fillColor: region
                                ? activeRegion === null
                                    ? region.color
                                    : activeRegion === region.name
                                        ? region.color
                                        : "#E5E7EB"
                                : "#D1D5DB",

                            fillOpacity: 1,

                        };

                    }}

                    /**
                     * Configura el comportamiento interactivo
                     * de cada departamento del mapa.
                     */
                    onEachFeature={(feature: any, layer: any) => {

                        const department = feature.properties.name;

                        const region = getRegionByDepartment(department);

                        if (!region) return;

                        /**
                         * Tooltip informativo mostrado al pasar el cursor.
                         *
                         * Actualmente presenta información simulada.
                         * Cuando exista la API mostrará indicadores reales.
                         */
                        layer.bindTooltip(
                            `
                            <div style="min-width:170px">
                                <strong>${region.name}</strong>
                                <hr style="margin:6px 0"/>
                                <div>👥 Casos: <b>${region.cases.toLocaleString()}</b></div>
                                <div>📈 Participación: <b>${region.percentage}%</b></div>
                            </div>
                            `,
                            {
                                sticky: true,
                                direction: "top",
                                opacity: 1,
                            }
                        );

                        layer.on({


                            /**
                             * Resalta la región correspondiente.
                             */
                            mouseover: () => {

                                setActiveRegion(region.name);

                            },

                            /**
                             * Restablece el estado inicial del mapa.
                             */
                            mouseout: () => {

                                setActiveRegion(null);

                            }

                        });

                    }}

                />

            </MapContainer>

        </div>

    );

}