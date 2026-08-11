"use client";

import {
    CloudRain,
    Droplets,
    Thermometer,
} from "lucide-react";

import {
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import type {
    ClimateVariable,
    PredictionSummaryData,
} from "../data/prediction";


/**
 * ============================================================================
 * CONFIGURACIÓN VISUAL
 * ============================================================================
 */
const THEMES = {

    red: {
        color: "#EF4444",
        background: "#FEF2F2",
    },

    blue: {
        color: "#3B82F6",
        background: "#EFF6FF",
    },

    purple: {
        color: "#7447F5",
        background: "#F5F2FF",
    },

    orange: {
        color: "#F97316",
        background: "#FFF7ED",
    },

    cyan: {
        color: "#2563EB",
        background: "#EFF6FF",
    },

    green: {
        color: "#16A34A",
        background: "#F0FDF4",
    },

};


interface PredictionSummaryCardProps {

    data: PredictionSummaryData;

}


/**
 * ============================================================================
 * ICONOS CLIMÁTICOS
 * ============================================================================
 */
function ClimateIcon({
    type,
}: {
    type: ClimateVariable;
}) {

    switch (type) {

        case "temperature":
            return (
                <Thermometer size={21} />
            );

        case "rain":
            return (
                <Droplets size={21} />
            );

        default:
            return (
                <CloudRain size={21} />
            );

    }

}


/**
 * ============================================================================
 * MINIGRÁFICA
 * ============================================================================
 */
function MiniTrend({
    values,
    color,
}: {
    values: number[];
    color: string;
}) {

    const chartData =
        values.map((value, index) => ({
            index,
            value,
        }));

    const min =
        Math.min(...values);

    const max =
        Math.max(...values);

    const difference =
        Math.max(max - min, 1);

    return (

        <div className="h-[48px] w-[90px] shrink-0">

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 2,
                        bottom: 2,
                        left: 2,
                    }}
                >

                    <XAxis
                        hide
                        dataKey="index"
                    />

                    <YAxis
                        hide
                        domain={[
                            min - difference * 0.25,
                            max + difference * 0.25,
                        ]}
                    />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}


/**
 * ============================================================================
 * TARJETA RESUMEN
 * ============================================================================
 */
export default function PredictionSummaryCard({
    data,
}: PredictionSummaryCardProps) {

    const theme =
        THEMES[data.theme];

    const isRisk =
        data.type === "risk";

    const isClimate =
        data.type === "climate";

    const isConfidence =
        data.type === "confidence";

    const isObservedTrend =
        data.type === "observed" &&
        data.description.startsWith("↑");


    /**
     * =========================================================================
     * CONFIANZA DEL MODELO
     * =========================================================================
     */
    if (isConfidence) {

        const confidence =
            data.confidence ?? 0;

        return (

            <article
                className="
                    min-h-[150px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <p
                    className="
                        text-[13px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {data.title}
                </p>


                <div
                    className="
                        mt-4
                        flex
                        items-center
                        gap-4
                    "
                >

                    {/* CÍRCULO */}

                    <div
                        className="
                            relative
                            flex
                            h-[76px]
                            w-[76px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                        "
                        style={{
                            background:
                                `conic-gradient(
                                    #2563EB ${confidence}%,
                                    #DBEAFE ${confidence}% 100%
                                )`,
                        }}
                    >

                        <div
                            className="
                                flex
                                h-[58px]
                                w-[58px]
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                            "
                        >

                            <span
                                className="
                                    text-[21px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {confidence}%
                            </span>

                        </div>

                    </div>


                    <div>

                        <p
                            className="
                                text-[13px]
                                font-semibold
                                text-emerald-600
                            "
                        >
                            {data.description}
                        </p>

                        <p
                            className="
                                mt-1
                                text-[10px]
                                leading-[14px]
                                text-slate-400
                            "
                        >
                            Nivel de confianza
                        </p>

                    </div>

                </div>

            </article>

        );

    }


    /**
     * =========================================================================
     * VARIABLES CLIMÁTICAS
     * =========================================================================
     */
    if (isClimate) {

        return (

            <article
                className="
                    min-h-[150px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <p
                    className="
                        text-[13px]
                        font-semibold
                        text-slate-800
                    "
                >
                    {data.title}
                </p>


                <div
                    className="
                        mt-4
                        flex
                        items-center
                        gap-3
                    "
                >

                    {data.climateVariables?.map(
                        (variable) => (

                            <div
                                key={variable}
                                className="
                                    flex
                                    h-[42px]
                                    w-[42px]
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    text-blue-600
                                "
                            >

                                <ClimateIcon
                                    type={variable}
                                />

                            </div>

                        )
                    )}

                </div>


                <p
                    className="
                        mt-3
                        text-[11px]
                        text-slate-500
                    "
                >
                    T°, Lluvia, Humedad
                </p>


                <p
                    className="
                        mt-1
                        text-[11px]
                        font-medium
                        text-orange-500
                    "
                >
                    {data.description}
                </p>

            </article>

        );

    }


    /**
     * =========================================================================
     * TARJETAS CON VALOR + TENDENCIA
     * =========================================================================
     */
    return (

        <article
            className="
                min-h-[150px]
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
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
                {data.title}
            </p>


            <div
                className="
                    mt-4
                    flex
                    items-end
                    justify-between
                    gap-3
                "
            >

                <div className="min-w-0">

                    <p
                        className={`
                            text-[30px]
                            font-bold
                            leading-none
                            tracking-tight
                            ${
                                isRisk
                                    ? "text-red-500"
                                    : ""
                            }
                        `}
                        style={
                            !isRisk
                                ? {
                                    color:
                                        theme.color,
                                }
                                : undefined
                        }
                    >
                        {data.value}
                    </p>


                    <p
                        className={`
                            mt-3
                            text-[11px]
                            leading-[15px]
                            ${
                                isObservedTrend
                                    ? "font-medium text-emerald-600"
                                    : "text-slate-500"
                            }
                        `}
                    >
                        {data.description}
                    </p>

                </div>


                {data.trend && (

                    <MiniTrend
                        values={data.trend}
                        color={theme.color}
                    />

                )}

            </div>

        </article>

    );

}