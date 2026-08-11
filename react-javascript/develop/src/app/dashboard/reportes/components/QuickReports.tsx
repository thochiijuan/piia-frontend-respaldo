"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Activity,
    ArrowRight,
    BarChart3,
    FileBarChart,
    Info,
    MapPinned,
    Wind,
} from "lucide-react";

import type {
    QuickReportData,
} from "../data/reports";

import {
    getQuickReports,
} from "../services/reports.service";


/**
 * ============================================================================
 * CONFIGURACIÓN VISUAL
 * ============================================================================
 */
const THEMES = {

    green: {
        color: "#16A36A",
        background: "#EAF9F1",
        border: "#D4F2E1",
    },

    blue: {
        color: "#3B82F6",
        background: "#EEF4FF",
        border: "#DBE8FF",
    },

    orange: {
        color: "#F97316",
        background: "#FFF4EA",
        border: "#FFE0C5",
    },

    purple: {
        color: "#7447F5",
        background: "#F4F0FF",
        border: "#E7DEFF",
    },

    pink: {
        color: "#EC4899",
        background: "#FDF0F7",
        border: "#F9D7E8",
    },

};


/**
 * ============================================================================
 * ICONO DEL REPORTE
 * ============================================================================
 */
function QuickReportIcon({
    type,
}: {
    type: QuickReportData["icon"];
}) {

    switch (type) {

        case "ira":

            return (
                <Wind
                    size={23}
                    strokeWidth={2}
                />
            );

        case "comparison":

            return (
                <BarChart3
                    size={23}
                    strokeWidth={2}
                />
            );

        case "territory":

            return (
                <MapPinned
                    size={23}
                    strokeWidth={2}
                />
            );

        case "bulletin":

            return (
                <FileBarChart
                    size={23}
                    strokeWidth={2}
                />
            );

        default:

            return (
                <Activity
                    size={23}
                    strokeWidth={2}
                />
            );

    }

}


/**
 * ============================================================================
 * REPORTES RÁPIDOS
 * ============================================================================
 */
export default function QuickReports() {

    const [data, setData] =
        useState<QuickReportData[]>([]);


    useEffect(() => {

        async function loadData() {

            const response =
                await getQuickReports();

            setData(response);

        }

        void loadData();

    }, []);


    return (

        <section
            className="
                flex
                h-full
                min-h-[480px]
                w-full
                flex-col
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div className="flex items-center gap-2">

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Reportes rápidos
                </h2>

                <Info
                    size={15}
                    className="text-slate-400"
                />

            </div>


            {/* ============================================================
                LISTADO DE REPORTES
            ============================================================ */}

            <div
                className="
                    mt-4
                    flex-1
                    space-y-3
                "
            >

                {data.map((item) => {

                    const theme =
                        THEMES[item.theme];

                    return (

                        <article
                            key={item.id}
                            className="
                                flex
                                min-h-[66px]
                                items-center
                                gap-3
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-2.5
                                transition
                                hover:border-slate-300
                                hover:shadow-sm
                            "
                        >

                            {/* =================================================
                                ICONO
                            ================================================= */}

                            <div
                                className="
                                    flex
                                    h-[44px]
                                    w-[44px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                "
                                style={{
                                    color:
                                        theme.color,

                                    backgroundColor:
                                        theme.background,

                                    borderColor:
                                        theme.border,
                                }}
                            >

                                <QuickReportIcon
                                    type={item.icon}
                                />

                            </div>


                            {/* =================================================
                                INFORMACIÓN
                            ================================================= */}

                            <div
                                className="
                                    min-w-0
                                    flex-1
                                "
                            >

                                <p
                                    className="
                                        text-[13px]
                                        font-semibold
                                        leading-[18px]
                                        text-slate-800
                                    "
                                >
                                    {item.title}
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[11px]
                                        leading-[16px]
                                        text-slate-500
                                    "
                                >
                                    {item.description}
                                </p>

                            </div>


                            {/* =================================================
                                BOTÓN GENERAR
                            ================================================= */}

                            <button
                                type="button"
                                className="
                                    shrink-0
                                    rounded-lg
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    px-3
                                    py-2
                                    text-[11px]
                                    font-semibold
                                    text-blue-600
                                    transition
                                    hover:bg-blue-100
                                "
                            >
                                Generar
                            </button>

                        </article>

                    );

                })}

            </div>


            {/* ============================================================
                BOTÓN INFERIOR
            ============================================================ */}

            <button
                type="button"
                className="
                    mt-3
                    flex
                    h-10
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

                Ver más plantillas

                <ArrowRight size={16} />

            </button>

        </section>

    );

}