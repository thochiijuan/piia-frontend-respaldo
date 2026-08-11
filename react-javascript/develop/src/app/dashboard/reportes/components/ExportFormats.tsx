"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ArrowRight,
    FileImage,
    FileSpreadsheet,
    FileText,
    Info,
    Presentation,
} from "lucide-react";

import type {
    ExportFormatData,
} from "../data/reports";

import {
    getExportFormats,
} from "../services/reports.service";


const THEMES = {

    red: {
        color: "#EF4444",
        background: "#FEF2F2",
        border: "#FEE2E2",
    },

    green: {
        color: "#16A34A",
        background: "#F0FDF4",
        border: "#DCFCE7",
    },

    teal: {
        color: "#0D9488",
        background: "#F0FDFA",
        border: "#CCFBF1",
    },

    purple: {
        color: "#7C3AED",
        background: "#F5F3FF",
        border: "#EDE9FE",
    },

    orange: {
        color: "#F97316",
        background: "#FFF7ED",
        border: "#FFEDD5",
    },

    blue: {
        color: "#2563EB",
        background: "#EFF6FF",
        border: "#DBEAFE",
    },

};


function FormatIcon({
    type,
}: {
    type: ExportFormatData["icon"];
}) {

    switch (type) {

        case "excel":
        case "csv":

            return (
                <FileSpreadsheet
                    size={23}
                    strokeWidth={2}
                />
            );

        case "png":

            return (
                <FileImage
                    size={23}
                    strokeWidth={2}
                />
            );

        case "powerpoint":

            return (
                <Presentation
                    size={23}
                    strokeWidth={2}
                />
            );

        default:

            return (
                <FileText
                    size={23}
                    strokeWidth={2}
                />
            );

    }

}


export default function ExportFormats() {

    const [data, setData] =
        useState<ExportFormatData[]>([]);


    useEffect(() => {

        async function loadData() {

            const response =
                await getExportFormats();

            setData(response);

        }

        void loadData();

    }, []);


    return (

        <section
            className="
                flex
                h-full
                min-h-[340px]
                w-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-4
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Formatos de exportación disponibles
                </h2>

                <Info
                    size={15}
                    className="text-slate-400"
                />

            </div>


            {/* ============================================================
                FORMATOS
            ============================================================ */}

            <div
                className="
                    grid
                    flex-1
                    grid-cols-1
                    gap-3
                    px-5
                    pb-3
                    sm:grid-cols-2
                    xl:grid-cols-3
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
                                min-h-[82px]
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

                            {/* ICONO */}

                            <div
                                className="
                                    flex
                                    h-[44px]
                                    w-[44px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
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

                                <FormatIcon
                                    type={item.icon}
                                />

                            </div>


                            {/* INFORMACIÓN */}

                            <div className="min-w-0 flex-1">

                                <p
                                    className="
                                        text-[13px]
                                        font-semibold
                                        leading-[18px]
                                        text-slate-800
                                    "
                                >
                                    {item.name}
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[11px]
                                        leading-[15px]
                                        text-slate-500
                                    "
                                >
                                    {item.description}
                                </p>

                                <p
                                    className="
                                        text-[10px]
                                        leading-[14px]
                                        text-slate-400
                                    "
                                >
                                    {item.secondaryDescription}
                                </p>

                            </div>

                        </article>

                    );

                })}

            </div>


            {/* ============================================================
                BOTÓN
            ============================================================ */}

            <div className="p-3">

                <button
                    type="button"
                    className="
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

                    Ver todas las opciones

                    <ArrowRight size={16} />

                </button>

            </div>

        </section>

    );

}