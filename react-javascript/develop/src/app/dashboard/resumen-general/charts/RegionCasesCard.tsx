/**
 * ============================================================================
 * RegionCasesCard
 * ----------------------------------------------------------------------------
 * Componente contenedor encargado de mostrar la distribución de casos por
 * región dentro del Dashboard de Resumen General.
 *
 * Responsabilidades:
 * - Integrar el mapa de Colombia.
 * - Mostrar la leyenda de colores por región.
 * - Proporcionar acceso al Geovisor Epidemiológico.
 *
 * Este componente NO realiza consultas de datos ni contiene lógica
 * geoespacial; únicamente organiza los componentes visuales.
 *
 * Estructura:
 *
 * ┌─────────────────────────────────────────────┐
 * │ Casos por región                            │
 * ├──────────────────────┬──────────────────────┤
 * │ ColombiaRegionsMap   │ RegionLegend         │
 * ├──────────────────────┴──────────────────────┤
 * │ Botón "Abrir Geovisor"                      │
 * └─────────────────────────────────────────────┘
 * ============================================================================
 */

"use client";

import { useRouter } from "next/navigation";

// Iconos
import { MapPinned } from "lucide-react";

// Componentes
import ColombiaRegionsMap from "./map/ColombiaRegionsMap";
import RegionLegend from "./RegionLegend";


export default function RegionCasesCard() {

    /**
     * Permite navegar hacia el módulo del Geovisor
     * sin recargar la aplicación.
     */
    const router = useRouter();

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[430px] flex flex-col">

            <h2 className="text-[20px] font-semibold text-slate-800 mb-6">
                Casos por región
            </h2>

            {/* Contenedor principal del contenido de la tarjeta */}
            <div className="flex-1 flex flex-col">

                {/* Contenido */}
                <div className="flex flex-1 gap-5">

                    {/* Mapa interactivo de Colombia dividido por regiones */}
                    <div className="flex-[2]">

                        <ColombiaRegionsMap />

                    </div>

                    {/* Leyenda de colores correspondiente a cada región */}
                    <div className="w-[220px] flex items-center">

                        <RegionLegend />

                    </div>

                </div>

                {/* BOTÓN */}
                <button
                    onClick={() => router.push("/dashboard/geovisor-epidemiologico")}
                    className="
            mt-5
            h-11
            w-full
            rounded-xl
            border
            border-[#DCE7FF]
            bg-[#F5F8FF]
            text-[#2563EB]
            font-semibold
            flex
            items-center
            justify-center
            gap-2
            hover:bg-[#EDF4FF]
            transition
        "
                >
                    <MapPinned size={18} />

                    Abrir Geovisor

                </button>

            </div>

        </div>

    );

}