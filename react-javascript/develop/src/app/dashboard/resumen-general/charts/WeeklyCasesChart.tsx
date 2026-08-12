/**
 * ============================================================================
 * WeeklyCasesChart
 * ----------------------------------------------------------------------------
 * Componente encargado de visualizar la evolución de los casos por semana
 * epidemiológica mediante un gráfico de líneas.
 *
 * Responsabilidades:
 *
 * - Mostrar la evolución semanal de los casos.
 * - Comparar Dengue e IRA.
 * - Adaptarse automáticamente al tamaño disponible.
 * - Permitir la navegación hacia el Geovisor Epidemiológico.
 *
 * Librería utilizada:
 * Recharts
 *
 * Fuente de datos:
 * Actualmente utiliza datos simulados.
 * En producción consumirá la información desde dashboard.service.ts.
 * ============================================================================
 */

"use client";

import Link from "next/link";

import {
    MapPinned,
} from "lucide-react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";


/**
 * ============================================================================
 * DATOS SIMULADOS
 * ----------------------------------------------------------------------------
 * TODO:
 * Reemplazar por la información obtenida desde dashboard.service.ts
 * cuando el backend esté disponible.
 * ============================================================================
 */
const data = [

    {
        week: "1",
        dengue: 40,
        ira: 27,
    },

    {
        week: "2",
        dengue: 25,
        ira: 35,
    },

    {
        week: "3",
        dengue: 30,
        ira: 56,
    },

    {
        week: "4",
        dengue: 17,
        ira: 30,
    },

];


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */
export default function WeeklyCasesChart() {

    return (

        <div
            className="
                flex
                h-[430px]
                flex-col
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div className="mb-3">

                <h2
                    className="
                        text-xl
                        font-semibold
                        text-slate-800
                    "
                >
                    Casos por semana epidemiológica
                </h2>


                <p
                    className="
                        mt-1
                        text-[13px]
                        text-slate-400
                    "
                >
                    Evolución semanal de casos de Dengue e IRA
                </p>

            </div>


            {/* ============================================================
                GRÁFICA
            ============================================================ */}

            <div
                className="
                    min-h-0
                    flex-1
                "
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 5,
                        }}
                    >

                        {/* ====================================================
                            CUADRÍCULA
                        ==================================================== */}

                        <CartesianGrid
                            stroke="#E5E7EB"
                        />


                        {/* ====================================================
                            EJE X
                            Semana epidemiológica
                        ==================================================== */}

                        <XAxis
                            dataKey="week"
                            tick={{
                                fill: "#64748B",
                                fontSize: 12,
                            }}
                            axisLine={{
                                stroke: "#94A3B8",
                            }}
                            tickLine={{
                                stroke: "#94A3B8",
                            }}
                        />


                        {/* ====================================================
                            EJE Y
                            Número de casos
                        ==================================================== */}

                        <YAxis
                            tick={{
                                fill: "#64748B",
                                fontSize: 12,
                            }}
                            axisLine={{
                                stroke: "#94A3B8",
                            }}
                            tickLine={{
                                stroke: "#94A3B8",
                            }}
                        />


                        {/* ====================================================
                            TOOLTIP
                        ==================================================== */}

                        <Tooltip />


                        {/* ====================================================
                            LEYENDA
                        ==================================================== */}

                        <Legend />


                        {/* ====================================================
                            DENGUE
                        ==================================================== */}

                        <Line
                            type="monotone"
                            dataKey="dengue"
                            name="Dengue"
                            stroke="#0F9D94"
                            strokeWidth={3}
                            dot={{
                                r: 3,
                                fill: "#0F9D94",
                                stroke: "#FFFFFF",
                                strokeWidth: 1.5,
                            }}
                            activeDot={{
                                r: 5,
                                fill: "#0F9D94",
                                stroke: "#FFFFFF",
                                strokeWidth: 2,
                            }}
                        />


                        {/* ====================================================
                            IRA
                        ==================================================== */}

                        <Line
                            type="monotone"
                            dataKey="ira"
                            name="IRA"
                            stroke="#7C3AED"
                            strokeWidth={3}
                            dot={{
                                r: 3,
                                fill: "#7C3AED",
                                stroke: "#FFFFFF",
                                strokeWidth: 1.5,
                            }}
                            activeDot={{
                                r: 5,
                                fill: "#7C3AED",
                                stroke: "#FFFFFF",
                                strokeWidth: 2,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>


            {/* ============================================================
                BOTÓN ABRIR GEOVISOR
            ============================================================ */}

            <div className="mt-3">

                <Link
                    href="/dashboard/geovisor-epidemiologico"
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

                    <MapPinned
                        size={16}
                    />

                    Abrir Geovisor

                </Link>

            </div>

        </div>

    );

}