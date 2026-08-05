"use client";

import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import type { IncidenceRateData } from "../data/demographicCharts";

import { getIncidenceRateData } from "../services/demographicCharts.service";

const INCIDENCE_LABELS: Record<string, string> = {
    "< 1 año": "<1",
    "1 a 4 años": "1–4",
    "5 a 14 años": "5–14",
    "15 años y más": "15+",
};

/**
 * ============================================================================
 * TOOLTIP PERSONALIZADO
 * ============================================================================
 */
function IncidenceRateTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{
        payload?: IncidenceRateData;
    }>;
}) {

    if (!active || !payload?.length) {

        return null;

    }

    const item = payload[0]?.payload;

    if (!item) {

        return null;

    }

    return (

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">

            <p className="font-semibold text-slate-800">

                {item.ageGroup}

            </p>

            <p className="mb-3 text-xs text-slate-400">

                Casos por cada 100.000 habitantes

            </p>

            <div className="space-y-2">

                <div className="flex items-center gap-2">

                    <span className="h-3 w-3 rounded-[3px] bg-[#6D4CFF]" />

                    <span className="text-[#6D4CFF]">

                        Dengue:

                    </span>

                    <span className="font-semibold text-slate-700">

                        {item.dengue.toLocaleString("es-CO")}

                    </span>

                </div>

                <div className="flex items-center gap-2">

                    <span className="h-3 w-3 rounded-[3px] bg-[#5BC98C]" />

                    <span className="text-[#5BC98C]">

                        IRA:

                    </span>

                    <span className="font-semibold text-slate-700">

                        {item.ira.toLocaleString("es-CO")}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default function IncidenceRateChart() {

    const [data, setData] = useState<IncidenceRateData[]>([]);

    useEffect(() => {

        async function loadChart() {

            const response = await getIncidenceRateData();

            setData(response);

        }

        loadChart();

    }, []);

    /**
     * Calcula automáticamente el valor máximo del eje Y.
     * Esto permite que el gráfico se adapte a los datos reales.
     */
    const maximumRate = Math.max(
        0,
        ...data.map((item) =>
            Math.max(item.dengue, item.ira)
        )
    );

    /**
     * Calcula una separación adecuada entre los valores del eje.
     */
    const axisStep = Math.max(
        10,
        Math.ceil(maximumRate / 6 / 10) * 10
    );

    /**
     * El gráfico tendrá como mínimo una escala de 0 a 60.
     */
    const axisMaximum = Math.max(
        60,
        Math.ceil(maximumRate / axisStep) * axisStep
    );

    const axisTicks = Array.from(
        {
            length: Math.floor(axisMaximum / axisStep) + 1,
        },
        (_, index) => index * axisStep
    );

    return (

        <div className="flex h-[430px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* ============================================================
                TÍTULO
            ============================================================ */}

            <h2 className="text-[20px] font-semibold text-slate-800">

                Tasa de incidencia por grupo de edad

            </h2>

            {/* ============================================================
                SUBTÍTULO
            ============================================================ */}

            <p className="mt-1 text-sm text-slate-400">

                Casos por cada 100.000 habitantes

            </p>

            {/* ============================================================
                GRÁFICO
            ============================================================ */}

            <div className="relative mt-4 min-h-0 flex-1 pl-10">

                {/* TÍTULO DEL EJE Y */}

                <span
                    className="
                        pointer-events-none
                        absolute
                        -left-[74px]
                        top-1/2
                        -translate-y-1/2
                       translate-y-1/2
                        -rotate-90
                        whitespace-nowrap
                        text-[12px]
                        font-semibold
                        text-slate-600
                    "
                >

                    Casos por 100.000 habitantes

                </span>

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 0,
                            bottom: 0,
                        }}
                    >

                        <CartesianGrid
                            stroke="#ECEFF5"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="ageGroup"
                            interval={0}
                            height={32}
                            tickLine={false}
                            tickMargin={8}
                            tickFormatter={(value: string) =>
                                INCIDENCE_LABELS[value] ?? value
                            }
                            axisLine={{
                                stroke: "#CBD5E1",
                            }}
                            tick={{
                                fontSize: 11,
                                fontWeight: 500,
                                fill: "#475569",
                            }}
                        />

                        <YAxis
                            domain={[0, axisMaximum]}
                            ticks={axisTicks}
                            width={38}
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
                            content={<IncidenceRateTooltip />}
                        />

                        <Line
                            type="monotone"
                            dataKey="dengue"
                            name="Dengue"
                            stroke="#6D4CFF"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#FFFFFF",
                                stroke: "#6D4CFF",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#6D4CFF",
                                stroke: "#FFFFFF",
                                strokeWidth: 2,
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="ira"
                            name="IRA"
                            stroke="#5BC98C"
                            strokeWidth={3}
                            dot={{
                                r: 4,
                                fill: "#FFFFFF",
                                stroke: "#5BC98C",
                                strokeWidth: 2,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "#5BC98C",
                                stroke: "#FFFFFF",
                                strokeWidth: 2,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

            {/* ============================================================
                TÍTULO DEL EJE X
            ============================================================ */}

            <p className="mt-1 shrink-0 text-center text-[12px] font-semibold leading-none text-slate-600">

                Grupo de edad

            </p>

            {/* ============================================================
                LEYENDA
            ============================================================ */}

            <div className="flex h-7 shrink-0 items-center justify-center gap-4 text-sm">

                <div className="flex items-center gap-1.5 text-[#6D4CFF]">

                    <span className="h-3 w-3 rounded-[3px] bg-[#6D4CFF]" />

                    <span>Dengue</span>

                </div>

                <div className="flex items-center gap-1.5 text-[#5BC98C]">

                    <span className="h-3 w-3 rounded-[3px] bg-[#5BC98C]" />

                    <span>IRA</span>

                </div>

            </div>

            {/* ============================================================
                BOTÓN
            ============================================================ */}

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