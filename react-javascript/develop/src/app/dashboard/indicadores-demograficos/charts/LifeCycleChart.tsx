"use client";

import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
} from "recharts";

import { LifeCycleData } from "../data/demographicCharts";

import { getLifeCycleData } from "../services/demographicCharts.service";

interface YAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
        value?: string;
    };
}

function LeftAlignedYAxisTick({
    x = 0,
    y = 0,
    payload,
}: YAxisTickProps) {
    return (
        <text
            x={x - 125}
            y={y}
            dy={4}
            textAnchor="start"
            fill="#475569"
            fontSize={12}
            fontWeight={600}
        >
            {payload?.value}
        </text>
    );
}

function CustomTooltip({ active, payload }: any) {

    if (!active || !payload || !payload.length) {

        return null;

    }

    const item = payload[0].payload as LifeCycleData;

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-lg
            "
        >

            <p className="font-semibold text-slate-800">

                {item.stage}

            </p>

            <p className="text-sm text-slate-500 mb-3">

                {item.ageRange}

            </p>

            <div className="space-y-2">

                <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-[#6D4CFF]" />

                    <span className="text-[#6D4CFF]">

                        Dengue:
                    </span>

                    <span className="font-semibold text-slate-700">

                        {item.dengue.toLocaleString("es-CO")}

                    </span>

                </div>

                <div className="flex items-center gap-2">

                    <div className="w-3 h-3 rounded-full bg-[#5BC98C]" />

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

export default function LifeCycleChart() {

    const [data, setData] = useState<LifeCycleData[]>([]);

    useEffect(() => {

        async function loadChart() {

            const response = await getLifeCycleData();

            setData(response);

        }

        loadChart();

    }, []);

    const maxCases = Math.max(
        0,
        ...data.map((item) =>
            Math.max(item.dengue, item.ira)
        )
    );

    const axisMaximum = Math.max(
        4000,
        Math.ceil(maxCases / 1000) * 1000
    );

    const axisTicks = Array.from(
        { length: axisMaximum / 1000 + 1 },
        (_, index) => index * 1000
    );

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[430px] flex flex-col">

            {/* ============================================================
                TÍTULO
            ============================================================ */}

            <h2 className="text-[20px] font-semibold text-slate-800">

                Casos por ciclo de vida

            </h2>

            {/* ============================================================
                SUBTÍTULO
            ============================================================ */}

            <p className="text-sm text-slate-400 mt-1 mb-4">

                Agrupación por etapas del curso de vida

            </p>

            {/* ============================================================
                GRÁFICO
            ============================================================ */}

            <div className="flex-1 flex flex-col min-h-0">

                <div
                    className="
        relative
        flex-1
        min-h-0
        border-t
        border-slate-200
        pt-4
    "
                >
                    {/* Línea inferior extendida */}
                    <div
                        className="
            pointer-events-none
            absolute
            bottom-[28px]
            left-0
            right-0
            z-10
            h-px
            bg-slate-300
        "
                    />

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{
                                top: 0,
                                right: 45,
                                left: 0,
                                bottom: 0,
                            }}
                            barGap={6}
                            barCategoryGap="32%"
                        >

                            <CartesianGrid
                                horizontal={false}
                                stroke="#E2E8F0"
                            />

                            <XAxis
                                type="number"
                                domain={[0, axisMaximum]}
                                ticks={axisTicks}
                                height={28}
                                tickFormatter={(value: number) =>
                                    value === 0 ? "0" : `${value / 1000}k`
                                }
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fill: "#475569",
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            />

                            <YAxis
                                type="category"
                                dataKey="stage"
                                width={135}
                                interval={0}
                                tick={<LeftAlignedYAxisTick />}
                                tickLine={false}
                                axisLine={false}
                            />

                            <Tooltip
                                cursor={{
                                    fill: "#F8FAFC",
                                }}
                                content={<CustomTooltip />}
                            />

                            <Bar
                                dataKey="dengue"
                                name="Dengue"
                                fill="#6D4CFF"
                                barSize={7}
                                radius={[0, 6, 6, 0]}
                            >
                                <LabelList
                                    dataKey="dengue"
                                    position="right"
                                    fontSize={10}
                                    fill="#64748B"
                                />
                            </Bar>

                            <Bar
                                dataKey="ira"
                                name="IRA"
                                fill="#5BC98C"
                                barSize={7}
                                radius={[0, 6, 6, 0]}
                            >
                                <LabelList
                                    dataKey="ira"
                                    position="right"
                                    fontSize={10}
                                    fill="#64748B"
                                />
                            </Bar>

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                <p className="-mt-1 text-center text-[11px] font-bold leading-none text-slate-600">
                    Casos
                </p>

                <div className="mt-2 flex justify-center gap-4 text-sm">

                    <div className="flex items-center gap-1.5 text-[#6D4CFF]">
                        <span className="h-3 w-3 rounded-[3px] bg-[#6D4CFF]" />
                        Dengue
                    </div>

                    <div className="flex items-center gap-1.5 text-[#5BC98C]">
                        <span className="h-3 w-3 rounded-[3px] bg-[#5BC98C]" />
                        IRA
                    </div>

                </div>

            </div>

            {/* ============================================================
                BOTÓN
            ============================================================ */}

            <div className="pt-3">

                <button
                    className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#DCE7FF]
                        bg-[#F5F8FF]
                        text-[#2563EB]
                        font-semibold
                        hover:bg-[#EDF4FF]
                        transition
                    "
                >

                    Ver más detalles →

                </button>

            </div>

        </div>

    );

}