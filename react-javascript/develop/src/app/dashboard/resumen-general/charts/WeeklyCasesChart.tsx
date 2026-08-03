/**
 * ============================================================================
 * WeeklyCasesChart
 * ----------------------------------------------------------------------------
 * Componente encargado de visualizar la evolución de los casos por semana
 * epidemiológica mediante un gráfico de líneas.
 *
 * Responsabilidades:
 * - Mostrar la evolución semanal de los casos.
 * - Comparar Dengue e IRA.
 * - Adaptarse automáticamente al tamaño disponible.
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
 * Datos simulados.
 *
 * TODO:
 * Reemplazar por la información obtenida desde dashboard.service.ts
 * cuando el backend esté disponible.
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
 * Renderiza el gráfico de casos por semana epidemiológica.
 */
export default function WeeklyCasesChart() {

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[430px]">

            <h2 className="text-xl font-semibold text-slate-800 mb-6">

                Casos por semana epidemiológica

            </h2>

            {/* Permite que el gráfico ocupe automáticamente el espacio disponible */}
            <ResponsiveContainer
                width="100%"
                height="90%"
            >

                {/* Gráfico principal */}
                <LineChart data={data}>

                    <CartesianGrid stroke="#E5E7EB" />

                    {/* Eje horizontal (Semanas epidemiológicas) */}
                    <XAxis dataKey="week" />

                    {/* Eje vertical (Número de casos) */}
                    <YAxis />

                    {/* Información al pasar el cursor */}
                    <Tooltip />

                    {/* Leyenda de las enfermedades */}
                    <Legend />

                    {/* Serie correspondiente a Dengue */}
                    <Line
                        type="monotone"
                        dataKey="dengue"
                        stroke="#0F9D94"
                        strokeWidth={3}
                    />

                    {/* Serie correspondiente a IRA */}
                    <Line
                        type="monotone"
                        dataKey="ira"
                        stroke="#7C3AED"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}