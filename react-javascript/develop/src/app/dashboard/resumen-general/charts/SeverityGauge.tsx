/**
 * ============================================================================
 * SeverityGauge
 * ----------------------------------------------------------------------------
 * Componente encargado de visualizar el porcentaje de casos clasificados
 * como graves mediante un indicador semicircular.
 *
 * Responsabilidades:
 *
 * - Mostrar el porcentaje actual de casos graves.
 * - Comparar visualmente el valor con un umbral recomendado.
 * - Facilitar la interpretación rápida del nivel de gravedad.
 *
 * Actualmente utiliza valores simulados mediante propiedades.
 * ============================================================================
 */

"use client";


interface Props {

    /**
     * Porcentaje actual de casos graves.
     */
    value?: number;

    /**
     * Umbral de referencia recomendado.
     */
    threshold?: number;

}


export default function SeverityGauge({

    value = 2.3,

    threshold = 5,

}: Props) {

    /**
     * =========================================================================
     * CONFIGURACIÓN DEL MEDIDOR
     * =========================================================================
     */

    const radius = 90;

    const circumference =
        Math.PI * radius;

    const progress =
        Math.min(
            value / threshold,
            1
        );

    const dashOffset =
        circumference *
        (1 - progress);


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

            <div>

                <h2
                    className="
                        text-[20px]
                        font-semibold
                        text-slate-800
                    "
                >
                    Indicador de gravedad
                </h2>


                <p
                    className="
                        mt-1
                        text-[13px]
                        text-slate-400
                    "
                >
                    Proporción de casos clasificados como graves
                </p>

            </div>


            {/* ============================================================
                MEDIDOR
            ============================================================ */}

            <div
                className="
                    flex
                    min-h-0
                    flex-1
                    items-center
                    justify-center
                "
            >

                <svg
                    width="270"
                    height="180"
                    viewBox="0 0 240 170"
                >

                    {/* ====================================================
                        FONDO DEL MEDIDOR
                    ==================================================== */}

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


                    {/* ====================================================
                        PROGRESO
                    ==================================================== */}

                    <path
                        d="
                            M30 130
                            A90 90 0 0 1 210 130
                        "
                        fill="none"
                        stroke="#F4B740"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={
                            circumference
                        }
                        strokeDashoffset={
                            dashOffset
                        }
                        style={{
                            transition:
                                "stroke-dashoffset .8s ease",
                        }}
                    />


                    {/* ====================================================
                        VALOR PRINCIPAL
                    ==================================================== */}

                    <text
                        x="120"
                        y="94"
                        textAnchor="middle"
                        fontSize="34"
                        fontWeight="700"
                        fill="#1F2937"
                    >
                        {value.toFixed(1)}%
                    </text>


                    {/* ====================================================
                        DESCRIPCIÓN DEL VALOR
                    ==================================================== */}

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


            {/* ============================================================
                UMBRAL
            ============================================================ */}

            <p
                className="
                    text-center
                    text-[13px]
                    text-slate-500
                "
            >
                Umbral recomendado:{" "}
                <span
                    className="
                        font-semibold
                        text-slate-700
                    "
                >
                    {threshold}%
                </span>
            </p>

        </div>

    );

}