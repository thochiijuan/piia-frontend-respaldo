"use client";

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

const data = [

    { age: "<1 Año", femenino: 45, masculino: 37 },

    { age: "1-4", femenino: 27, masculino: 30 },

    { age: "5-9", femenino: 30, masculino: 56 },

    { age: "10-14", femenino: 27, masculino: 35 },

    { age: "15-19", femenino: 34, masculino: 67 },

    { age: "20-29", femenino: 34, masculino: 23 },

    { age: "30-39", femenino: 34, masculino: 21 },

    { age: "40-49", femenino: 24, masculino: 45 },

    { age: "50-59", femenino: 34, masculino: 33 },

    { age: "60+", femenino: 32, masculino: 45 },

];

export default function AgeSexChart() {

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[300px]">

            <h2 className="text-[20px] font-semibold text-slate-800 mb-5">

                Casos por grupo de edad y sexo

            </h2>

            <ResponsiveContainer width="100%" height="82%">

                <BarChart
                    data={data}
                    barGap={3}
                    barCategoryGap="20%"
                >

                    <CartesianGrid stroke="#ECEFF5" />

                    <XAxis dataKey="age" />

                    <YAxis />

                    <Tooltip
                        cursor={{ fill: "#F8FAFC" }}
                        contentStyle={{
                            borderRadius: 12,
                            border: "1px solid #E5E7EB",
                            boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                        }}
                    />

                    <Legend />

                    <Bar
                        dataKey="femenino"
                        fill="#E78AC8"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="masculino"
                        fill="#4A86E8"
                        radius={[4, 4, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}