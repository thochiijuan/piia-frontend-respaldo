/**
 * ============================================================================
 * AgeSexChart
 * ----------------------------------------------------------------------------
 * Componente encargado de visualizar la distribución de casos según
 * grupo de edad y sexo.
 *
 * Responsabilidades:
 *
 * - Mostrar la distribución de casos por grupos de edad.
 * - Comparar los casos registrados en población femenina y masculina.
 * - Permitir la navegación al módulo de Indicadores Demográficos.
 *
 * Librería utilizada:
 * Recharts
 *
 * Fuente de datos:
 * Actualmente utiliza información simulada.
 * Posteriormente podrá obtener los datos desde el servicio correspondiente.
 * ============================================================================
 */

"use client";

import Link from "next/link";

import {
    UsersRound,
} from "lucide-react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";


/**
 * ============================================================================
 * DATOS SIMULADOS
 * ============================================================================
 */
const data = [

    {
        age: "<1 Año",
        femenino: 45,
        masculino: 37,
    },

    {
        age: "1-4",
        femenino: 27,
        masculino: 30,
    },

    {
        age: "5-9",
        femenino: 30,
        masculino: 56,
    },

    {
        age: "10-14",
        femenino: 27,
        masculino: 35,
    },

    {
        age: "15-19",
        femenino: 34,
        masculino: 67,
    },

    {
        age: "20-29",
        femenino: 34,
        masculino: 23,
    },

    {
        age: "30-39",
        femenino: 34,
        masculino: 21,
    },

    {
        age: "40-49",
        femenino: 24,
        masculino: 45,
    },

    {
        age: "50-59",
        femenino: 34,
        masculino: 33,
    },

    {
        age: "60+",
        femenino: 32,
        masculino: 45,
    },

];


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */
export default function AgeSexChart() {

    return (

        <div
            className="
                flex
                h-[340px]
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
                        text-[20px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Casos por grupo de edad y sexo
                </h2>


                <p
                    className="
                        mt-1
                        text-[13px]
                        text-slate-400
                    "
                >
                    Distribución de casos según grupo de edad y sexo
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

                    <BarChart
                        data={data}
                        barGap={3}
                        barCategoryGap="20%"
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 0,
                        }}
                    >

                        {/* CUADRÍCULA */}

                        <CartesianGrid
                            stroke="#ECEFF5"
                        />


                        {/* EJE X */}

                        <XAxis
                            dataKey="age"
                            tick={{
                                fill: "#64748B",
                                fontSize: 11,
                            }}
                            axisLine={{
                                stroke: "#94A3B8",
                            }}
                            tickLine={{
                                stroke: "#94A3B8",
                            }}
                        />


                        {/* EJE Y */}

                        <YAxis
                            tick={{
                                fill: "#64748B",
                                fontSize: 11,
                            }}
                            axisLine={{
                                stroke: "#94A3B8",
                            }}
                            tickLine={{
                                stroke: "#94A3B8",
                            }}
                        />


                        {/* TOOLTIP */}

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


                        {/* LEYENDA */}

                        <Legend />


                        {/* FEMENINO */}

                        <Bar
                            dataKey="femenino"
                            name="Femenino"
                            fill="#E78AC8"
                            radius={[
                                4,
                                4,
                                0,
                                0,
                            ]}
                        />


                        {/* MASCULINO */}

                        <Bar
                            dataKey="masculino"
                            name="Masculino"
                            fill="#4A86E8"
                            radius={[
                                4,
                                4,
                                0,
                                0,
                            ]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>


            {/* ============================================================
                BOTÓN INDICADORES DEMOGRÁFICOS
            ============================================================ */}

            <div className="mt-3">

                <Link
                    href="/dashboard/indicadores-demograficos"
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

                    <UsersRound
                        size={16}
                    />

                    Ver Indicadores Demográficos

                </Link>

            </div>

        </div>

    );

}