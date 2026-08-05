"use client";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { useEffect, useState } from "react";

import { GenderData } from "../data/demographicCharts";

import { getGenderData } from "../services/demographicCharts.service";

export default function GenderChart() {

    const [data, setData] = useState<GenderData[]>([]);

    useEffect(() => {

        async function loadChart() {

            const response = await getGenderData();

            setData(response);

        }

        loadChart();

    }, []);

    const male = data.find(item => item.gender === "Masculino");

    const female = data.find(item => item.gender === "Femenino");

    const totalCases = data.reduce(
        (total, item) => total + item.cases,
        0
    );

    const chartData = [
        {
            name: female?.gender,
            value: female?.cases ?? 0,
        },
        {
            name: male?.gender,
            value: male?.cases ?? 0,
        },
    ];

    const COLORS = [
        "#EC4899", // Femenino
        "#3B82F6", // Masculino
    ];

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[430px] flex flex-col">

            {/* ============================================================
                TÍTULO
            ============================================================ */}

            <h2 className="text-[20px] font-semibold text-slate-800">

                Casos por sexo

            </h2>

            {/* ============================================================
                SUBTÍTULO
            ============================================================ */}

            <p className="text-sm text-slate-400 mt-1">

                Distribución porcentual de casos

            </p>

            {/* ============================================================
                CONTENIDO
            ============================================================ */}

            <div className="flex-1 flex items-center justify-center">

                <div className="w-full max-w-[620px]">

                    <div className="grid grid-cols-[1fr_230px_1fr] items-center gap-2">

                        {/* ================= Masculino ================= */}

                        <div className="flex flex-col items-center">

                            <p className="text-sm font-semibold text-slate-700">

                                {male?.gender}

                            </p>

                            <p className="text-[32px] font-bold text-[#3B82F6] leading-none mt-1">

                                {male?.percentage}%

                            </p>

                            <p className="text-sm text-slate-500 mt-1">

                                {male?.cases.toLocaleString("es-CO")} casos

                            </p>

                        </div>

                        {/* ================= Dona (Temporal) ================= */}

                        <div className="relative h-[230px] w-[230px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">

                                <PieChart>

                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={66}
                                        outerRadius={90}
                                        startAngle={90}
                                        endAngle={-270}
                                        paddingAngle={2}
                                        cornerRadius={8}
                                        stroke="none"
                                    >

                                        {chartData.map((_, index) => (

                                            <Cell
                                                key={index}
                                                fill={COLORS[index]}
                                            />

                                        ))}

                                    </Pie>

                                </PieChart>

                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">

                                <p className="text-xs text-slate-500">

                                    Total

                                </p>

                                <p className="text-[34px] font-bold leading-none mt-1">

                                    {totalCases.toLocaleString("es-CO")}

                                </p>

                                <p className="text-sm text-slate-500 mt-0.5">

                                    casos

                                </p>

                            </div>

                        </div>

                        {/* ================= Femenino ================= */}

                        <div className="flex flex-col items-center">

                            <p className="text-sm font-semibold text-slate-700">

                                {female?.gender}

                            </p>

                            <p className="text-[32px] font-bold text-[#EC4899] leading-none mt-1">

                                {female?.percentage}%

                            </p>

                            <p className="text-sm text-slate-500 mt-1">

                                {female?.cases.toLocaleString("es-CO")} casos

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ============================================================
                BOTÓN
            ============================================================ */}

            <div className="mt-auto pt-2">

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