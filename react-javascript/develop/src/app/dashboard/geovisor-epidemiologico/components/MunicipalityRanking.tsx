"use client";

import { useEffect, useMemo, useState } from "react";

import {
    ArrowRight,
    Info,
} from "lucide-react";

import type {
    MunicipalityRankingData,
    MunicipalityRankingDisease,
} from "../data/geovisor";

import {
    getMunicipalityRankingData,
} from "../services/geovisor.service";

/**
 * ============================================================================
 * CONFIGURACIÓN VISUAL DE LOS NIVELES DE RIESGO
 * ============================================================================
 */
const RISK_STYLES = {

    "Muy alto": {
        bar: "#F43F5E",
        badge:
            "border-red-200 bg-red-50 text-red-500",
    },

    "Alto": {
        bar: "#FF7A3D",
        badge:
            "border-orange-200 bg-orange-50 text-orange-500",
    },

    "Medio": {
        bar: "#F5B934",
        badge:
            "border-amber-200 bg-amber-50 text-amber-600",
    },

    "Bajo": {
        bar: "#4DBB88",
        badge:
            "border-green-200 bg-green-50 text-green-600",
    },

} satisfies Record<
    MunicipalityRankingData["riskLevel"],
    {
        bar: string;
        badge: string;
    }
>;

/**
 * ============================================================================
 * RANKING DE MUNICIPIOS
 * ============================================================================
 */
export default function MunicipalityRanking() {

    const [activeDisease, setActiveDisease] =
        useState<MunicipalityRankingDisease>(
            "dengue"
        );

    const [ranking, setRanking] =
        useState<MunicipalityRankingData[]>([]);

    /**
     * ============================================================================
     * CARGA DE DATOS
     * ============================================================================
     */
    useEffect(() => {

        async function loadRanking() {

            const response =
                await getMunicipalityRankingData(
                    activeDisease
                );

            setRanking(response);

        }

        void loadRanking();

    }, [activeDisease]);

    /**
     * ============================================================================
     * VALOR MÁXIMO
     * ----------------------------------------------------------------------------
     * Se utiliza para calcular automáticamente el tamaño de las barras.
     * ============================================================================
     */
    const maximumIncidence = useMemo(() => {

        return Math.max(
            ...ranking.map(
                (item) => item.incidenceRate
            ),
            1
        );

    }, [ranking]);

    return (

        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div className="px-4 pt-3">

                <div className="flex items-center gap-2">

                    <h2
                        className="
                            text-[16px]
                            font-bold
                            text-slate-800
                        "
                    >
                        Ranking de municipios por tasa de incidencia
                    </h2>

                    <Info
                        size={16}
                        className="shrink-0 text-slate-400"
                    />

                </div>

                {/* ========================================================
                    SELECTOR DENGUE / IRA
                ======================================================== */}

                <div className="mt-2 flex items-center gap-5 border-b border-slate-200">

                    <button
                        type="button"
                        onClick={() =>
                            setActiveDisease("dengue")
                        }
                        className={`
                            relative
                            pb-2
                            text-[12px]
                            font-semibold
                            transition
                            ${
                                activeDisease ===
                                "dengue"
                                    ? "text-[#7447F5]"
                                    : "text-slate-400"
                            }
                        `}
                    >

                        Dengue

                        {activeDisease ===
                            "dengue" && (

                            <span
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    h-[2px]
                                    w-full
                                    rounded-full
                                    bg-[#7447F5]
                                "
                            />

                        )}

                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setActiveDisease("ira")
                        }
                        className={`
                            relative
                            pb-2
                            text-[12px]
                            font-semibold
                            transition
                            ${
                                activeDisease === "ira"
                                    ? "text-[#4DBB88]"
                                    : "text-slate-400"
                            }
                        `}
                    >

                        IRA

                        {activeDisease === "ira" && (

                            <span
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    h-[2px]
                                    w-full
                                    rounded-full
                                    bg-[#4DBB88]
                                "
                            />

                        )}

                    </button>

                </div>

            </div>

            {/* ============================================================
                TABLA
            ============================================================ */}

            <div className="overflow-x-auto">

                <table className="w-full border-collapse">

                    {/* ====================================================
                        CABECERA
                    ==================================================== */}

                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-100
                                text-left
                                text-[9px]
                                font-semibold
                                text-slate-400
                            "
                        >

                            <th className="w-[28px] px-3 py-2 text-center">
                                #
                            </th>

                            <th className="px-1 py-2">
                                Municipio
                            </th>

                            <th className="px-1 py-2">
                                Departamento
                            </th>

                            <th className="w-[145px] px-1 py-2">

                                <span className="block">
                                    Tasa de incidencia
                                </span>

                                <span className="font-normal">
                                    por 100.000 hab.
                                </span>

                            </th>

                            <th className="w-[80px] px-2 py-2 text-center">
                                Nivel de riesgo
                            </th>

                        </tr>

                    </thead>

                    {/* ====================================================
                        FILAS
                    ==================================================== */}

                    <tbody>

                        {ranking.map((item) => {

                            const risk =
                                RISK_STYLES[
                                    item.riskLevel
                                ];

                            const barWidth =
                                Math.max(
                                    12,
                                    (
                                        item.incidenceRate /
                                        maximumIncidence
                                    ) * 100
                                );

                            return (

                                <tr
                                    key={`${activeDisease}-${item.position}-${item.municipality}`}
                                    className="
                                        border-b
                                        border-slate-100
                                        last:border-b-0
                                    "
                                >

                                    {/* POSICIÓN */}

                                    <td
                                        className="
                                            px-3
                                            py-1.5
                                            text-center
                                            text-[10px]
                                            font-medium
                                            text-slate-600
                                        "
                                    >

                                        {item.position}

                                    </td>

                                    {/* MUNICIPIO */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-1
                                            py-1.5
                                            text-[10px]
                                            font-semibold
                                            text-slate-700
                                        "
                                    >

                                        {item.municipality}

                                    </td>

                                    {/* DEPARTAMENTO */}

                                    <td
                                        className="
                                            whitespace-nowrap
                                            px-1
                                            py-1.5
                                            text-[10px]
                                            text-slate-400
                                        "
                                    >

                                        {item.department}

                                    </td>

                                    {/* INCIDENCIA */}

                                    <td className="px-1 py-1.5">

                                        <div className="flex items-center gap-2">

                                            <span
                                                className="
                                                    w-[30px]
                                                    shrink-0
                                                    text-right
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >

                                                {item.incidenceRate}

                                            </span>

                                            <div
                                                className="
                                                    h-[8px]
                                                    min-w-0
                                                    flex-1
                                                    overflow-hidden
                                                    rounded-full
                                                    bg-slate-100
                                                "
                                            >

                                                <div
                                                    className="
                                                        h-full
                                                        rounded-full
                                                        transition-all
                                                    "
                                                    style={{
                                                        width:
                                                            `${barWidth}%`,
                                                        backgroundColor:
                                                            risk.bar,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    </td>

                                    {/* NIVEL DE RIESGO */}

                                    <td className="px-2 py-1.5 text-center">

                                        <span
                                            className={`
                                                inline-flex
                                                min-w-[58px]
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                px-2
                                                py-[2px]
                                                text-[9px]
                                                font-medium
                                                ${risk.badge}
                                            `}
                                        >

                                            {item.riskLevel}

                                        </span>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

            {/* ============================================================
                BOTÓN
            ============================================================ */}

            <div className="border-t border-slate-100 p-2">

                <button
                    type="button"
                    className="
                        flex
                        h-9
                        w-full
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

                    Ver ranking completo

                    <ArrowRight size={16} />

                </button>

            </div>

        </section>

    );

}