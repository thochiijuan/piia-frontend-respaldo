"use client";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import type {
    DiseaseSummaryData,
} from "../data/geovisor";

/**
 * ============================================================================
 * CONFIGURACIÓN VISUAL
 * ============================================================================
 */
const THEMES = {

    purple: {
        color: "#7447F5",
        lightColor: "#EEE8FF",
        iconBackground: "#F7F3FF",
        borderColor: "#E8DEFF",
    },

    green: {
        color: "#4DBB88",
        lightColor: "#E4F6ED",
        iconBackground: "#F2FBF7",
        borderColor: "#D7F1E5",
    },

};

/**
 * ============================================================================
 * PROPIEDADES
 * ============================================================================
 */
interface DiseaseSummaryCardProps {

    data: DiseaseSummaryData;

}

/**
 * ============================================================================
 * ICONO DENGUE
 * ============================================================================
 */
function DengueIcon() {

    return (

        <svg
            viewBox="0 0 48 48"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >

            <ellipse
                cx="24"
                cy="24"
                rx="4"
                ry="10"
            />

            <circle
                cx="24"
                cy="11"
                r="3"
            />

            <path d="M20 19L11 12" />
            <path d="M28 19L37 12" />

            <path d="M20 23L8 21" />
            <path d="M28 23L40 21" />

            <path d="M20 27L10 35" />
            <path d="M28 27L38 35" />

            <path d="M20 17C14 14 13 8 16 6" />
            <path d="M28 17C34 14 35 8 32 6" />

            <path d="M24 34V42" />

        </svg>

    );

}

/**
 * ============================================================================
 * ICONO IRA
 * ============================================================================
 */
function IraIcon() {

    return (

        <svg
            viewBox="0 0 48 48"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >

            <path d="M23 8V23" />
            <path d="M25 8V23" />

            <path
                d="
                    M22 17
                    C18 17 17 13 15 12
                    C13 11 11 13 10 16
                    L6 31
                    C5 36 9 39 13 38
                    C18 37 21 32 22 25
                "
            />

            <path
                d="
                    M26 17
                    C30 17 31 13 33 12
                    C35 11 37 13 38 16
                    L42 31
                    C43 36 39 39 35 38
                    C30 37 27 32 26 25
                "
            />

        </svg>

    );

}

/**
 * ============================================================================
 * TARJETA RESUMEN DE ENFERMEDAD
 * ============================================================================
 */
export default function DiseaseSummaryCard({
    data,
}: DiseaseSummaryCardProps) {

    const theme = THEMES[data.theme];

    const chartData = data.trend.map(
        (value, index) => ({
            index,
            value,
        })
    );

    const minimumValue =
        Math.min(...data.trend);

    const maximumValue =
        Math.max(...data.trend);

    const difference =
        maximumValue - minimumValue;

    const chartPadding = Math.max(
        difference * 0.3,
        5
    );

    const gradientId =
        `disease-summary-${data.id}`;

    return (

        <article
            className="
                flex
                h-[168px]
                min-w-0
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                px-3
                pb-2
                pt-3
            "
        >

            {/* ============================================================
                TÍTULO
            ============================================================ */}

            <h3 className="shrink-0 text-[16px] font-bold leading-none text-slate-800">

                {data.disease}

            </h3>

            {/* ============================================================
                INFORMACIÓN PRINCIPAL
            ============================================================ */}

            <div className="mt-2 flex shrink-0 items-start gap-3">

                {/* ICONO */}

                <div
                    className="
                        flex
                        h-[48px]
                        w-[48px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        border
                    "
                    style={{
                        color: theme.color,
                        backgroundColor:
                            theme.iconBackground,
                        borderColor:
                            theme.borderColor,
                    }}
                >

                    {data.id === "dengue"
                        ? <DengueIcon />
                        : <IraIcon />
                    }

                </div>

                {/* DATOS */}

                <div className="min-w-0">

                    <p
                        className="
                            text-[23px]
                            font-bold
                            leading-none
                        "
                        style={{
                            color: theme.color,
                        }}
                    >

                        {data.confirmedCases.toLocaleString(
                            "es-CO"
                        )}

                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-slate-400">

                        Casos confirmados

                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-slate-400">

                        Incidencia:{" "}

                        <span className="font-medium">

                            {data.incidenceRate.toFixed(1)}

                        </span>

                    </p>

                    <p className="text-[10px] leading-tight text-slate-400">

                        por 100.000 hab.

                    </p>

                </div>

            </div>

            {/* ============================================================
                MINIGRÁFICO
            ============================================================ */}

            <div className="mt-1 min-h-0 flex-1">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 4,
                            right: 0,
                            bottom: 0,
                            left: 0,
                        }}
                    >

                        <defs>

                            <linearGradient
                                id={gradientId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop
                                    offset="5%"
                                    stopColor={theme.color}
                                    stopOpacity={0.28}
                                />

                                <stop
                                    offset="95%"
                                    stopColor={theme.lightColor}
                                    stopOpacity={0.25}
                                />

                            </linearGradient>

                        </defs>

                        <XAxis
                            dataKey="index"
                            hide
                        />

                        <YAxis
                            hide
                            domain={[
                                minimumValue - chartPadding,
                                maximumValue + chartPadding,
                            ]}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={theme.color}
                            strokeWidth={2}
                            fill={`url(#${gradientId})`}
                            isAnimationActive={false}
                            dot={false}
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </article>

    );

}