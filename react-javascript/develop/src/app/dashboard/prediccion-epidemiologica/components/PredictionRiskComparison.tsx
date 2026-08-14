"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ArrowRight,
    Loader2,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    MunicipalityForecast,
    PredictionHorizon,
    PredictionMunicipality,
} from "../data/predictionApi";

import {
    createMeanClimateInput,
    getForecastByHorizon,
    getPredictionClimateRanges,
    predictMunicipality,
} from "../services/predictionApi.service";


/* ============================================================================
   PROPS
============================================================================ */

interface PredictionRiskComparisonProps {

    municipalities: PredictionMunicipality[];

    selectedMunicipalityCode: string;

    selectedHorizon: PredictionHorizon;

    simulatedForecast: MunicipalityForecast | null;

}


/* ============================================================================
   GRÁFICO
============================================================================ */

interface ComparisonChartPoint {

    horizon: string;

    base: number;

    simulated?: number;

}


/* ============================================================================
   FORMATO
============================================================================ */

function formatNumber(
    value: number
): string {

    return new Intl.NumberFormat(
        "es-CO",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(value);

}


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionRiskComparison({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

    simulatedForecast,

}: PredictionRiskComparisonProps) {

    const [
        baseForecast,
        setBaseForecast,
    ] = useState<MunicipalityForecast | null>(
        null
    );


    const [
        loading,
        setLoading,
    ] = useState<boolean>(true);


    const [
        error,
        setError,
    ] = useState<string | null>(null);


    /* ============================================================
       MUNICIPIO SELECCIONADO
    ============================================================ */

    const selectedMunicipality =
        useMemo(
            () =>
                municipalities.find(
                    (municipality) =>
                        municipality.code ===
                        selectedMunicipalityCode
                ),
            [
                municipalities,
                selectedMunicipalityCode,
            ]
        );


    /* ============================================================
       ESCENARIO BASE
    ============================================================ */

    useEffect(() => {

        if (!selectedMunicipality) {
            return;
        }


        let cancelled = false;


        async function loadBaseForecast() {

            try {

                setLoading(true);

                setError(null);


                const ranges =
                    await getPredictionClimateRanges();


                const climate =
                    createMeanClimateInput(
                        ranges
                    );


                const response =
                    await predictMunicipality({

                        municipality:
                            selectedMunicipality!.name,

                        climate,

                    });


                if (cancelled) {
                    return;
                }


                setBaseForecast(
                    response
                );

            } catch (loadError) {

                console.error(
                    "Error cargando escenario base:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar el escenario base."
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }


        void loadBaseForecast();


        return () => {

            cancelled = true;

        };

    }, [
        selectedMunicipality,
    ]);


    /* ============================================================
       HORIZONTE SELECCIONADO
    ============================================================ */

    const baseSelected =
        baseForecast
            ? getForecastByHorizon(
                baseForecast,
                selectedHorizon
            )
            : null;


    const simulatedSelected =
        simulatedForecast
            ? getForecastByHorizon(
                simulatedForecast,
                selectedHorizon
            )
            : null;


    /* ============================================================
       VARIACIÓN ENTRE BASE Y SIMULADO
    ============================================================ */

    const caseVariation =
        baseSelected &&
        simulatedSelected &&
        baseSelected.predicted_cases !== 0

            ? (
                (
                    simulatedSelected.predicted_cases -
                    baseSelected.predicted_cases
                ) /
                baseSelected.predicted_cases
            ) * 100

            : null;


    /* ============================================================
       DATOS DEL GRÁFICO +1 ... +4
    ============================================================ */

    const chartData =
        useMemo<ComparisonChartPoint[]>(() => {

            if (!baseForecast) {
                return [];
            }


            return baseForecast.forecast.map(
                (basePoint) => {

                    const simulatedPoint =
                        simulatedForecast?.forecast.find(
                            (item) =>
                                item.week ===
                                basePoint.week
                        );


                    return {

                        horizon:
                            `+${basePoint.week}`,

                        base:
                            basePoint.predicted_cases,

                        simulated:
                            simulatedPoint
                                ?.predicted_cases,

                    };

                }
            );

        }, [
            baseForecast,
            simulatedForecast,
        ]);


    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {

        return (

            <article
                className="
                    flex
                    h-full
                    min-h-[320px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    xl:min-h-0
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-2
                        text-slate-400
                    "
                >

                    <Loader2
                        size={20}
                        className="animate-spin"
                    />


                    <span
                        className="
                            text-[9px]
                        "
                    >
                        Cargando comportamiento del riesgo...
                    </span>

                </div>

            </article>

        );

    }


    /* ============================================================
       ERROR
    ============================================================ */

    if (
        error ||
        !baseSelected
    ) {

        return (

            <article
                className="
                    h-full
                    min-h-[320px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    xl:min-h-0
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Comportamiento del riesgo proyectado
                </h2>


                <p
                    className="
                        mt-4
                        text-[10px]
                        text-red-500
                    "
                >
                    {error ??
                        "No fue posible obtener la predicción."}
                </p>

            </article>

        );

    }


    /* ============================================================
       PANEL PRINCIPAL

       h-full:
       respeta los 420 px definidos en PredictionDashboard.

       overflow-hidden:
       evita que el contenido fuerce el crecimiento de la fila.

       flex-col:
       permite que el gráfico utilice todo el espacio sobrante.
    ============================================================ */

    return (

        <article
            className="
                flex
                h-full
                min-h-[320px]
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                xl:min-h-0
            "
        >

            {/* ========================================================
                HEADER
            ======================================================== */}

            <div
                className="
                    flex
                    shrink-0
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div className="min-w-0">

                    <h2
                        className="
                            text-[17px]
                            font-bold
                            text-slate-800
                        "
                    >
                        Comportamiento del riesgo proyectado
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Comparación entre escenario base y simulado
                    </p>

                </div>


                <span
                    className="
                        shrink-0
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        text-slate-500
                    "
                >
                    +{selectedHorizon}{" "}
                    {selectedHorizon === 1
                        ? "semana"
                        : "semanas"}
                </span>

            </div>


            {/* ========================================================
                SIN SIMULACIÓN
            ======================================================== */}

            {!simulatedSelected && (

                <div
                    className="
                        mt-3
                        shrink-0
                        rounded-xl
                        border
                        border-dashed
                        border-violet-200
                        bg-violet-50/40
                        px-3
                        py-2.5
                    "
                >

                    <p
                        className="
                            text-[10px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Ejecuta una simulación
                    </p>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            leading-[12px]
                            text-slate-500
                        "
                    >
                        Modifica las variables del escenario y pulsa
                        “Simular escenario” para comparar el resultado
                        con la predicción base.
                    </p>

                </div>

            )}


            {/* ========================================================
                BASE VS SIMULADO
            ======================================================== */}

            {simulatedSelected && (

                <>

                    <div
                        className="
                            mt-3
                            grid
                            shrink-0
                            grid-cols-[1fr_auto_1fr]
                            items-stretch
                            gap-2
                        "
                    >

                        {/* ====================================================
                            BASE
                        ==================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50/60
                                p-3
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Base
                            </p>


                            <p
                                className="
                                    mt-1.5
                                    text-[19px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {formatNumber(
                                    baseSelected
                                        .predicted_cases
                                )}
                            </p>


                            <p
                                className="
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                casos esperados
                            </p>


                            <div
                                className="
                                    mt-2
                                    flex
                                    items-end
                                    justify-between
                                    gap-2
                                "
                            >

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                    "
                                    style={{
                                        color:
                                            baseSelected
                                                .risk_color,
                                    }}
                                >
                                    {
                                        baseSelected
                                            .risk_level
                                    }
                                </p>


                                <p
                                    className="
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    Inc.{" "}
                                    {formatNumber(
                                        baseSelected
                                            .incidence
                                    )}
                                </p>

                            </div>

                        </div>


                        {/* ====================================================
                            FLECHA
                        ==================================================== */}

                        <div
                            className="
                                flex
                                items-center
                                justify-center
                            "
                        >

                            <ArrowRight
                                size={17}
                                className="
                                    text-slate-300
                                "
                            />

                        </div>


                        {/* ====================================================
                            SIMULADO
                        ==================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-violet-200
                                bg-violet-50/60
                                p-3
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-violet-500
                                "
                            >
                                Simulado
                            </p>


                            <p
                                className="
                                    mt-1.5
                                    text-[19px]
                                    font-bold
                                    text-violet-600
                                "
                            >
                                {formatNumber(
                                    simulatedSelected
                                        .predicted_cases
                                )}
                            </p>


                            <p
                                className="
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                casos esperados
                            </p>


                            <div
                                className="
                                    mt-2
                                    flex
                                    items-end
                                    justify-between
                                    gap-2
                                "
                            >

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                    "
                                    style={{
                                        color:
                                            simulatedSelected
                                                .risk_color,
                                    }}
                                >
                                    {
                                        simulatedSelected
                                            .risk_level
                                    }
                                </p>


                                <p
                                    className="
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    Inc.{" "}
                                    {formatNumber(
                                        simulatedSelected
                                            .incidence
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ====================================================
                        VARIACIÓN DE CASOS
                    ==================================================== */}

                    {caseVariation !== null && (

                        <div
                            className="
                                mt-2
                                flex
                                shrink-0
                                items-center
                                justify-between
                                rounded-lg
                                border
                                border-slate-200
                                px-3
                                py-1.5
                            "
                        >

                            <span
                                className="
                                    text-[8px]
                                    text-slate-500
                                "
                            >
                                Variación de casos
                            </span>


                            <div
                                className="
                                    flex
                                    items-center
                                    gap-1
                                "
                            >

                                {caseVariation > 0 ? (

                                    <TrendingUp
                                        size={12}
                                        className="
                                            text-red-500
                                        "
                                    />

                                ) : caseVariation < 0 ? (

                                    <TrendingDown
                                        size={12}
                                        className="
                                            text-emerald-500
                                        "
                                    />

                                ) : null}


                                <span
                                    className={`
                                        text-[10px]
                                        font-bold
                                        ${
                                            caseVariation > 0
                                                ? "text-red-500"
                                                : caseVariation < 0
                                                    ? "text-emerald-600"
                                                    : "text-slate-600"
                                        }
                                    `}
                                >
                                    {caseVariation > 0
                                        ? "+"
                                        : ""}

                                    {caseVariation.toFixed(
                                        1
                                    )}
                                    %
                                </span>

                            </div>

                        </div>

                    )}

                </>

            )}


            {/* ========================================================
                GRÁFICO

                flex-1:
                ocupa todo el espacio restante de los 420 px.
            ======================================================== */}

            <div
                className="
                    mt-2
                    min-h-[150px]
                    w-full
                    flex-1
                "
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <LineChart
                        data={
                            chartData
                        }
                        margin={{
                            top: 10,
                            right: 10,
                            bottom: 2,
                            left: -24,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E2E8F0"
                        />


                        <XAxis
                            dataKey="horizon"
                            tick={{
                                fontSize: 8,
                                fill:
                                    "#64748B",
                            }}
                            axisLine={{
                                stroke:
                                    "#CBD5E1",
                            }}
                            tickLine={false}
                        />


                        <YAxis
                            tick={{
                                fontSize: 8,
                                fill:
                                    "#94A3B8",
                            }}
                            axisLine={false}
                            tickLine={false}
                        />


                        <Tooltip
                            contentStyle={{
                                borderRadius:
                                    "10px",
                                border:
                                    "1px solid #E2E8F0",
                                fontSize:
                                    "10px",
                            }}
                            formatter={(
                                value,
                                name
                            ) => {

                                const numericValue =
                                    typeof value === "number"
                                        ? value
                                        : Number(value);


                                return [

                                    Number.isFinite(
                                        numericValue
                                    )
                                        ? formatNumber(
                                            numericValue
                                        )
                                        : value,

                                    name ===
                                    "Escenario base"
                                        ? "Base"
                                        : "Simulado",

                                ];

                            }}
                        />


                        {/* ====================================================
                            ESCENARIO BASE
                        ==================================================== */}

                        <Line
                            type="monotone"
                            dataKey="base"
                            name="Escenario base"
                            stroke="#64748B"
                            strokeWidth={2}
                            dot={{
                                r: 3,
                                fill:
                                    "#FFFFFF",
                                stroke:
                                    "#64748B",
                                strokeWidth: 1.5,
                            }}
                            activeDot={{
                                r: 5,
                            }}
                            isAnimationActive={false}
                        />


                        {/* ====================================================
                            ESCENARIO SIMULADO
                        ==================================================== */}

                        {simulatedForecast && (

                            <Line
                                type="monotone"
                                dataKey="simulated"
                                name="Escenario simulado"
                                stroke="#7C3AED"
                                strokeWidth={2.5}
                                dot={{
                                    r: 3.5,
                                    fill:
                                        "#7C3AED",
                                    stroke:
                                        "#FFFFFF",
                                    strokeWidth: 1.5,
                                }}
                                activeDot={{
                                    r: 5,
                                }}
                                isAnimationActive={false}
                            />

                        )}

                    </LineChart>

                </ResponsiveContainer>

            </div>


            {/* ========================================================
                LEYENDA
            ======================================================== */}

            <div
                className="
                    mt-1
                    flex
                    shrink-0
                    items-center
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-1.5
                    "
                >

                    <span
                        className="
                            h-[2px]
                            w-4
                            bg-slate-500
                        "
                    />


                    <span
                        className="
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Base
                    </span>

                </div>


                {simulatedForecast && (

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                        "
                    >

                        <span
                            className="
                                h-[2px]
                                w-4
                                bg-violet-600
                            "
                        />


                        <span
                            className="
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Simulado
                        </span>

                    </div>

                )}

            </div>

        </article>

    );

}