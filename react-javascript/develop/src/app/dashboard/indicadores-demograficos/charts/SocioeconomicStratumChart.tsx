"use client";

import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import type {
    SocioeconomicStratumData,
} from "../data/demographicCharts";

import {
    getSocioeconomicStratumData,
} from "../services/demographicCharts.service";

type SeriesKey =
    | "estrato1"
    | "estrato2"
    | "estrato3"
    | "estrato4"
    | "estrato5a6";

interface SeriesConfig {
    key: SeriesKey;
    label: string;
    color: string;
    gradientId: string;
}

const SERIES: SeriesConfig[] = [
    {
        key: "estrato1",
        label: "Estrato 1",
        color: "#4F9CF9",
        gradientId: "estrato1Gradient",
    },
    {
        key: "estrato2",
        label: "Estrato 2",
        color: "#38BDF8",
        gradientId: "estrato2Gradient",
    },
    {
        key: "estrato3",
        label: "Estrato 3",
        color: "#0EA5E9",
        gradientId: "estrato3Gradient",
    },
    {
        key: "estrato4",
        label: "Estrato 4",
        color: "#2CB6C4",
        gradientId: "estrato4Gradient",
    },
    {
        key: "estrato5a6",
        label: "Estrato 5 a 6",
        color: "#2563A6",
        gradientId: "estrato5a6Gradient",
    },
];

const STRATUM_LABELS: Record<string, string> = {
    "Estrato 1": "Estrato 1",
    "Estrato 2": "Estrato 2",
    "Estrato 3": "Estrato 3",
    "Estrato 4": "Estrato 4",
    "Estrato 5 a 6": "5–6",
};

interface TooltipPayloadItem {
    name?: string;
    value?: number;
    color?: string;
    stroke?: string;
}

interface TooltipProps {
    active?: boolean;
    label?: string;
    payload?: TooltipPayloadItem[];
}

function SocioeconomicTooltip({
    active,
    label,
    payload,
}: TooltipProps) {

    if (!active || !payload?.length) {
        return null;
    }

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">

            <p className="mb-2 font-semibold text-slate-800">
                {label}
            </p>

            <div className="space-y-1.5">

                {payload.map((item) => (

                    <div
                        key={item.name}
                        className="flex items-center gap-2 text-sm"
                    >

                        <span
                            className="h-2.5 w-2.5 rounded-[3px]"
                            style={{
                                backgroundColor:
                                    item.color ??
                                    item.stroke ??
                                    "#64748B",
                            }}
                        />

                        <span className="text-slate-500">
                            {item.name}:
                        </span>

                        <span className="font-semibold text-slate-700">
                            {Number(item.value ?? 0).toLocaleString("es-CO")}
                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default function SocioeconomicStratumChart() {

    const [data, setData] =
        useState<SocioeconomicStratumData[]>([]);

    useEffect(() => {

        async function loadChart() {

            const response =
                await getSocioeconomicStratumData();

            setData(response);

        }

        void loadChart();

    }, []);

    const maximumCases = Math.max(
        0,
        ...data.flatMap((item) =>
            SERIES.map((series) => item[series.key])
        )
    );

    const axisStep = Math.max(
        10,
        Math.ceil(maximumCases / 6 / 10) * 10
    );

    const axisMaximum = Math.max(
        60,
        Math.ceil(maximumCases / axisStep) * axisStep
    );

    const axisTicks = Array.from(
        {
            length:
                Math.floor(axisMaximum / axisStep) + 1,
        },
        (_, index) => index * axisStep
    );

    return (

        <div className="flex h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-[20px] font-semibold text-slate-800">

                Casos por estrato socioeconómico

            </h2>

            <p className="mt-1 text-sm text-slate-400">

                Distribución porcentual de casos

            </p>

            <div className="relative mt-4 min-h-0 flex-1 pl-4">

                <span
                    className="
                        pointer-events-none
                        absolute
                        -left-2
                        top-1/2
                        -translate-y-1/2
                        -rotate-90
                        whitespace-nowrap
                        text-[12px]
                        font-semibold
                        text-slate-600
                    "
                >
                    Casos
                </span>

                <ResponsiveContainer width="100%" height="100%">

                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 8,
                            left: -5,
                            bottom: 0,
                        }}
                    >

                        <defs>

                            {SERIES.map((series) => (

                                <linearGradient
                                    key={series.gradientId}
                                    id={series.gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="5%"
                                        stopColor={series.color}
                                        stopOpacity={0.35}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor={series.color}
                                        stopOpacity={0.05}
                                    />

                                </linearGradient>

                            ))}

                        </defs>

                        <CartesianGrid
                            stroke="#E2E8F0"
                        />

                        <XAxis
                            dataKey="category"
                            interval={0}
                            height={30}
                            tickLine={false}
                            tickMargin={8}
                            tickFormatter={(value: string) =>
                                STRATUM_LABELS[value] ?? value
                            }
                            tick={{
                                fontSize: 10,
                                fontWeight: 500,
                                fill: "#475569",
                            }}
                        />

                        <YAxis
                            domain={[0, axisMaximum]}
                            ticks={axisTicks}
                            width={32}
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            tick={{
                                fontSize: 11,
                                fontWeight: 500,
                                fill: "#64748B",
                            }}
                        />

                        <Tooltip
                            cursor={{
                                stroke: "#CBD5E1",
                                strokeDasharray: "4 4",
                            }}
                            content={<SocioeconomicTooltip />}
                        />

                        {SERIES.map((series) => (

                            <Area
                                key={series.key}
                                type="monotone"
                                dataKey={series.key}
                                name={series.label}
                                stroke={series.color}
                                strokeWidth={2.5}
                                fill={`url(#${series.gradientId})`}
                                dot={{
                                    r: 3,
                                    fill: "#FFFFFF",
                                    stroke: series.color,
                                    strokeWidth: 2,
                                }}
                                activeDot={{
                                    r: 5,
                                    fill: series.color,
                                    stroke: "#FFFFFF",
                                    strokeWidth: 2,
                                }}
                            />

                        ))}

                    </AreaChart>

                </ResponsiveContainer>

            </div>

            <p className="mt-1 shrink-0 text-center text-[12px] font-semibold leading-none text-slate-600">

                Estrato socioeconómico

            </p>

            {/* Reserva el espacio de la leyenda para alinear los botones */}
            <div className="h-7 shrink-0" />

            <div className="shrink-0 pt-3">

                <button
                    className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#DCE7FF]
                        bg-[#F5F8FF]
                        font-semibold
                        text-[#2563EB]
                        transition
                        hover:bg-[#EDF4FF]
                    "
                >

                    Ver más detalles →

                </button>

            </div>

        </div>

    );

}