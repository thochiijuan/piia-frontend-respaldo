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

            <div className="flex-1">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{
                            top: 10,
                            right: 30,
                            left: 80,
                            bottom: 10,
                        }}
                        barCategoryGap="25%"
                    >

                        <CartesianGrid
                            horizontal={false}
                            stroke="#E2E8F0"
                        />

                        <XAxis
                            type="number"
                        />

                        <YAxis
                            type="category"
                            dataKey="stage"
                            width={120}
                            tickLine={false}
                            axisLine={false}
                            tick={{
                                fill: "#475569",
                                fontSize: 13,
                            }}
                        />

                        <Tooltip
                            cursor={{
                                fill: "#F8FAFC",
                            }}
                            content={<CustomTooltip />}
                        />

                        <Legend />

                        <Bar
                            dataKey="dengue"
                            name="Dengue"
                            fill="#6D4CFF"
                            radius={[0, 6, 6, 0]}
                        >

                            <LabelList
                                dataKey="dengue"
                                position="right"
                            />

                        </Bar>

                        <Bar
                            dataKey="ira"
                            name="IRA"
                            fill="#5BC98C"
                            radius={[0, 6, 6, 0]}
                        >

                            <LabelList
                                dataKey="ira"
                                position="right"
                            />

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

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