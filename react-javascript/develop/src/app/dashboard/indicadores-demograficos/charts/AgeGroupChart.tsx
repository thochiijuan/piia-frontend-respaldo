"use client";


import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Label,
} from "recharts";

import { AgeGroupData } from "../data/demographicCharts";

import { getAgeGroupData } from "../services/demographicCharts.service";

export default function AgeGroupChart() {

    const [data, setData] = useState<AgeGroupData[]>([]);

    useEffect(() => {

        async function loadChart() {

            const response = await getAgeGroupData();

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

                Casos por grupo de edad

            </h2>

            {/* ============================================================
                SUBTÍTULO
            ============================================================ */}

            <p className="text-sm text-slate-400 mt-1">

                Distribución de casos por grupos de edad

            </p>

            {/* ============================================================
                CONTENEDOR DEL GRÁFICO
            ============================================================ */}

            <div className="flex-1 mt-4">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart
                        data={data}
                        barGap={4}
                        barCategoryGap="18%"
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 10,
                        }}
                    >

                        <CartesianGrid stroke="#ECEFF5" />

                        <XAxis
                            dataKey="ageGroup"
                            tick={{
                                fontSize: 11,
                            }}
                            interval={0}
                        >

                            <Label
                                value="Grupo de edad (años)"
                                position="insideBottom"
                                offset={-5}
                                style={{
                                    fontSize: 12,
                                    fill: "#475569",
                                }}
                            />
                            </XAxis>

                            <YAxis>

                                <Label
                                    value="Casos"
                                    angle={-90}
                                    position="insideLeft"
                                    style={{
                                        fontSize: 12,
                                        fill: "#475569",
                                    }}
                                />

                            </YAxis>

                            <Tooltip
                                cursor={{
                                    fill: "#F8FAFC",
                                }}
                                contentStyle={{
                                    borderRadius: 12,
                                    border: "1px solid #E5E7EB",
                                    boxShadow:
                                        "0 8px 20px rgba(0,0,0,0.08)",
                                }}
                            />

                            <Legend />

                            <Bar
                                dataKey="dengue"
                                name="Dengue"
                                fill="#6D4CFF"
                                radius={[4, 4, 0, 0]}
                            />

                            <Bar
                                dataKey="ira"
                                name="IRA"
                                fill="#5BC98C"
                                radius={[4, 4, 0, 0]}
                            />

                    </BarChart>

                </ResponsiveContainer>

            </div>

            {/* ============================================================
                BOTÓN
            ============================================================ */}

            <button
                className="
                    mt-4
                    w-full
                    rounded-xl
                    bg-[#F5F8FF]
                    py-3
                    text-[#2563EB]
                    font-semibold
                    transition
                    hover:bg-[#EDF4FF]
                "
            >

                Ver más detalles →

            </button>

        </div>

    );

}