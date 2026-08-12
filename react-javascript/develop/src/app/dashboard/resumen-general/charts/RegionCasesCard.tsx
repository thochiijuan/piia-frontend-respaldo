/**
 * ============================================================================
 * RegionCasesCard
 * ----------------------------------------------------------------------------
 * Componente contenedor encargado de mostrar la distribución de casos por
 * región dentro del Dashboard de Resumen General.
 *
 * Responsabilidades:
 *
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
 * │ Distribución territorial de los casos       │
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
import {
    MapPinned,
} from "lucide-react";

// Componentes
import ColombiaRegionsMap
    from "./map/ColombiaRegionsMap";

import RegionLegend
    from "./RegionLegend";


export default function RegionCasesCard() {

    /**
     * Permite navegar hacia el módulo del Geovisor
     * sin recargar la aplicación.
     */
    const router = useRouter();


    return (

        <div
            className="
                flex
                h-[430px]
                flex-col
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div className="mb-4">

                <h2
                    className="
                        text-[20px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Casos por región
                </h2>


                <p
                    className="
                        mt-1
                        text-[13px]
                        text-slate-400
                    "
                >
                    Distribución territorial de los casos reportados
                </p>

            </div>


            {/* ============================================================
                CONTENIDO PRINCIPAL
            ============================================================ */}

            <div
                className="
                    flex
                    min-h-0
                    flex-1
                    flex-col
                "
            >

                {/* ========================================================
                    MAPA + LEYENDA
                ======================================================== */}

                <div
                    className="
                        flex
                        min-h-0
                        flex-1
                        gap-5
                    "
                >

                    {/* MAPA DE COLOMBIA */}

                    <div
                        className="
                            min-w-0
                            flex-[2]
                        "
                    >

                        <ColombiaRegionsMap />

                    </div>


                    {/* LEYENDA */}

                    <div
                        className="
                            flex
                            w-[220px]
                            shrink-0
                            items-center
                        "
                    >

                        <RegionLegend />

                    </div>

                </div>


                {/* ========================================================
                    BOTÓN GEOVISOR
                ======================================================== */}

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/dashboard/geovisor-epidemiologico"
                        )
                    }
                    className="
                        mt-3
                        flex
                        h-10
                        w-full
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-[#DCE7FF]
                        bg-[#F5F8FF]
                        text-[12px]
                        font-semibold
                        text-[#2563EB]
                        transition
                        hover:bg-[#EDF4FF]
                    "
                >

                    <MapPinned
                        size={16}
                    />

                    Abrir Geovisor

                </button>

            </div>

        </div>

    );

}