import {
    CalendarDays,
    Clock3,
    Download,
    FileBarChart,
    Users,
} from "lucide-react";

import type {
    ReportSummaryData,
} from "../data/reports";


/**
 * ============================================================================
 * CONFIGURACIÓN VISUAL
 * ============================================================================
 */
const THEMES = {

    purple: {
        color: "#7447F5",
        background: "#F5F2FF",
        border: "#E6DFFF",
    },

    green: {
        color: "#10B981",
        background: "#EFFAF5",
        border: "#D7F3E6",
    },

    blue: {
        color: "#3B82F6",
        background: "#F1F6FF",
        border: "#DCE9FF",
    },

    orange: {
        color: "#FF9800",
        background: "#FFF8EC",
        border: "#FFE7BD",
    },

    pink: {
        color: "#B832E6",
        background: "#FCF2FF",
        border: "#F0D8F9",
    },

};


interface ReportSummaryCardProps {

    data: ReportSummaryData;

}


/**
 * ============================================================================
 * ICONO
 * ============================================================================
 */
function SummaryIcon({
    type,
}: {
    type: ReportSummaryData["icon"];
}) {

    const iconProps = {
        size: 25,
        strokeWidth: 2,
    };

    switch (type) {

        case "download":

            return (
                <Download {...iconProps} />
            );

        case "users":

            return (
                <Users {...iconProps} />
            );

        case "calendar":

            return (
                <CalendarDays {...iconProps} />
            );

        case "clock":

            return (
                <Clock3 {...iconProps} />
            );

        default:

            return (
                <FileBarChart {...iconProps} />
            );

    }

}


/**
 * ============================================================================
 * TARJETA RESUMEN
 * ============================================================================
 */
export default function ReportSummaryCard({
    data,
}: ReportSummaryCardProps) {

    const theme =
        THEMES[data.theme];

    const isTrend =
        data.description.startsWith("↑");

    return (

        <article
            className="
        h-full
        min-h-[135px]
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

            <div className="flex items-start gap-4">

                {/* ICONO */}

                <div
                    className="
                        flex
                        h-[48px]
                        w-[48px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        border
                    "
                    style={{
                        color: theme.color,
                        backgroundColor:
                            theme.background,
                        borderColor:
                            theme.border,
                    }}
                >

                    <SummaryIcon
                        type={data.icon}
                    />

                </div>


                {/* INFORMACIÓN */}

                <div className="min-w-0 flex-1">

                    <p
                        className="
                            min-h-[34px]
                            text-[13px]
                            font-semibold
                            leading-[17px]
                            text-slate-700
                        "
                    >

                        {data.title}

                    </p>


                    <p
                        className={`
        mt-1
        font-bold
        leading-none
        tracking-tight
        ${data.id === "last-report"
                                ? "text-[24px]"
                                : "text-[34px]"
                            }
    `}
                        style={{
                            color: theme.color,
                        }}
                    >
                        {data.value}
                    </p>


                    <p
                        className={`
                            mt-2
                            text-[12px]
                            leading-[17px]
                            ${isTrend
                                ? "font-medium text-emerald-600"
                                : "text-slate-500"
                            }
                        `}
                    >

                        {data.description}

                    </p>

                </div>

            </div>

        </article>

    );

}