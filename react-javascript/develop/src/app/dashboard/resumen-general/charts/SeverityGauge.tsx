"use client";

interface Props {
    value?: number;
    threshold?: number;
}

export default function SeverityGauge({

    value = 2.3,

    threshold = 5,

}: Props) {

    const radius = 90;

    const circumference = Math.PI * radius;

    const progress = Math.min(value / threshold, 1);

    const dashOffset = circumference * (1 - progress);

    return (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-[300px]">

            <h2 className="text-[20px] font-semibold text-slate-800 mb-5">

                Indicador de gravedad

            </h2>

            <div className="flex justify-center">

                <svg width="250" height="170">

                    {/* Fondo */}

                    <path
                        d="
                        M30 130
                        A90 90 0 0 1 210 130
                        "
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="16"
                        strokeLinecap="round"
                    />

                    {/* Progreso */}

                    <path
                        d="
                        M30 130
                        A90 90 0 0 1 210 130
                        "
                        fill="none"
                        stroke="#F4B740"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        style={{
                            transition: "all .8s ease"
                        }}
                    />

                    <text

                        x="120"

                        y="95"

                        textAnchor="middle"

                        fontSize="34"

                        fontWeight="700"

                        fill="#1F2937"

                    >

                        {value.toFixed(1)}%

                    </text>

                    <text

                        x="120"

                        y="118"

                        textAnchor="middle"

                        fontSize="13"

                        fill="#64748B"

                    >

                        Casos graves

                    </text>

                </svg>

            </div>

            <p className="text-center text-sm text-slate-500 mt-2">

                Umbral recomendado: {threshold}%

            </p>

        </div>

    );

}