"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
} from "recharts";

import {
    ArrowRight,
    Info,
} from "lucide-react";

import type {
    ReportDistributionData,
} from "../data/reports";

import {
    getReportDistribution,
} from "../services/reports.service";


export default function ReportsDistribution() {

    const [data, setData] =
        useState<ReportDistributionData[]>([]);


    useEffect(() => {

        async function loadData() {

            const response =
                await getReportDistribution();

            setData(response);

        }

        void loadData();

    }, []);


    const total = useMemo(() => {

        return data.reduce(
            (accumulator, item) =>
                accumulator + item.value,
            0
        );

    }, [data]);


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
                    Distribución de reportes
                </h2>

                <Info
                    size={15}
                    className="text-slate-400"
                />

            </div>


            {/* ============================================================
                CONTENIDO
            ============================================================ */}

            <div
                className="
                    grid
                    flex-1
                    grid-cols-[200px_minmax(0,1fr)]
                    items-center
                    gap-5
                    px-5
                    pb-3
                "
            >

                {/* GRÁFICO */}

                <div
                    className="
                        relative
                        h-[190px]
                        w-[190px]
                    "
                >

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <PieChart>

                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={58}
                                outerRadius={82}
                                paddingAngle={1}
                                stroke="none"
                                isAnimationActive={false}
                            >

                                {data.map((item) => (

                                    <Cell
                                        key={item.id}
                                        fill={item.color}
                                    />

                                ))}

                            </Pie>

                        </PieChart>

                    </ResponsiveContainer>


                    {/* TOTAL CENTRAL */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            flex
                            flex-col
                            items-center
                            justify-center
                        "
                    >

                        <span
                            className="
                                text-[28px]
                                font-bold
                                leading-none
                                text-slate-800
                            "
                        >
                            {total}
                        </span>

                        <span
                            className="
                                mt-2
                                text-[11px]
                                text-slate-500
                            "
                        >
                            Descargas
                        </span>

                    </div>

                </div>


                {/* LEYENDA */}

                <div className="space-y-3">

                    {data.map((item) => {

                        const percentage =
                            total > 0
                                ? Math.round(
                                    (
                                        item.value /
                                        total
                                    ) * 100
                                )
                                : 0;

                        return (

                            <div
                                key={item.id}
                                className="
                                    grid
                                    grid-cols-[12px_1fr_auto]
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        h-2.5
                                        w-2.5
                                        rounded-full
                                    "
                                    style={{
                                        backgroundColor:
                                            item.color,
                                    }}
                                />

                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-slate-700
                                    "
                                >
                                    {item.label}
                                </span>

                                <span
                                    className="
                                        whitespace-nowrap
                                        text-[12px]
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {item.value} ({percentage}%)
                                </span>

                            </div>

                        );

                    })}

                </div>

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

                    Ver detalle de descargas

                    <ArrowRight size={16} />

                </button>

            </div>

        </section>

    );

}