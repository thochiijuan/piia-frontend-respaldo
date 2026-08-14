"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import {
    Activity,
    CloudRain,
    Droplets,
    Loader2,
    Minus,
    Thermometer,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import type {
    PredictionClimateInput,
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

interface PredictionVariableImpactProps {

    municipalities: PredictionMunicipality[];

    selectedMunicipalityCode: string;

    selectedHorizon: PredictionHorizon;

}


/* ============================================================================
   VARIABLES
============================================================================ */

type VariableKey =
    keyof PredictionClimateInput;


interface VariableDefinition {

    key: VariableKey;

    label: string;

    unit: string;

    decimals: number;

    icon: ReactNode;

    iconClassName: string;

}


interface VariableImpactRow {

    key: VariableKey;

    label: string;

    unit: string;

    decimals: number;

    icon: ReactNode;

    iconClassName: string;

    baseValue: number;

    evaluatedValue: number;

    baseCases: number;

    evaluatedCases: number;

    deltaCases: number;

    deltaPercent: number | null;

    baseRisk: string;

    baseRiskColor: string;

    evaluatedRisk: string;

    evaluatedRiskColor: string;

}


const VARIABLES: VariableDefinition[] = [

    {
        key: "precip_mean",
        label: "Precipitación",
        unit: "mm",
        decimals: 1,
        icon: (
            <CloudRain size={14} />
        ),
        iconClassName:
            "bg-blue-50 text-blue-600",
    },

    {
        key: "temp_mean",
        label: "Temperatura media",
        unit: "°C",
        decimals: 1,
        icon: (
            <Thermometer size={14} />
        ),
        iconClassName:
            "bg-orange-50 text-orange-500",
    },

    {
        key: "temp_max_mean",
        label: "Temperatura máxima",
        unit: "°C",
        decimals: 1,
        icon: (
            <Thermometer size={14} />
        ),
        iconClassName:
            "bg-red-50 text-red-500",
    },

    {
        key: "temp_min_mean",
        label: "Temperatura mínima",
        unit: "°C",
        decimals: 1,
        icon: (
            <Thermometer size={14} />
        ),
        iconClassName:
            "bg-cyan-50 text-cyan-600",
    },

    {
        key: "rh_mean",
        label: "Humedad relativa",
        unit: "%",
        decimals: 1,
        icon: (
            <Droplets size={14} />
        ),
        iconClassName:
            "bg-sky-50 text-sky-600",
    },

    {
        key: "dengue_lag1",
        label: "Casos previos",
        unit: "casos",
        decimals: 0,
        icon: (
            <Activity size={14} />
        ),
        iconClassName:
            "bg-violet-50 text-violet-600",
    },

];


/* ============================================================================
   FORMATO
============================================================================ */

function formatNumber(
    value: number,
    decimals = 2
): string {

    return new Intl.NumberFormat(
        "es-CO",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }
    ).format(value);

}


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionVariableImpact({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

}: PredictionVariableImpactProps) {

    const [
        rows,
        setRows,
    ] = useState<VariableImpactRow[]>([]);


    const [
        loading,
        setLoading,
    ] = useState<boolean>(true);


    const [
        error,
        setError,
    ] = useState<string | null>(null);


    /* ============================================================
       MUNICIPIO
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
       CÁLCULO DEL IMPACTO
    ============================================================ */

    useEffect(() => {

        if (!selectedMunicipality) {
            return;
        }


        let cancelled =
            false;


        async function loadImpact() {

            try {

                setLoading(
                    true
                );


                setError(
                    null
                );


                /* ====================================================
                   ESCENARIO BASE
                ==================================================== */

                const rangesResponse =
                    await getPredictionClimateRanges();


                const baseClimate =
                    createMeanClimateInput(
                        rangesResponse
                    );


                const basePrediction =
                    await predictMunicipality({

                        municipality:
                            selectedMunicipality!.name,

                        climate:
                            baseClimate,

                    });


                const baseForecast =
                    getForecastByHorizon(
                        basePrediction,
                        selectedHorizon
                    );


                if (!baseForecast) {

                    throw new Error(
                        "No se encontró el horizonte seleccionado."
                    );

                }


                /* ====================================================
                   PRUEBA CONTROLADA

                   Para cada variable:
                   media + 1 desviación estándar.

                   Solo se modifica una variable.
                   Las demás permanecen en escenario base.
                ==================================================== */

                const impactResponses =
                    await Promise.all(

                        VARIABLES.map(
                            async (
                                variable
                            ): Promise<VariableImpactRow> => {

                                const range =
                                    rangesResponse
                                        .ranges[
                                            variable.key
                                        ];


                                let evaluatedValue =
                                    Math.min(
                                        range.max,
                                        range.mean +
                                        range.std
                                    );


                                /* ========================================
                                   CASOS PREVIOS DEBEN SER ENTEROS
                                ======================================== */

                                if (
                                    variable.key ===
                                    "dengue_lag1"
                                ) {

                                    evaluatedValue =
                                        Math.max(
                                            1,
                                            Math.round(
                                                evaluatedValue
                                            )
                                        );

                                }


                                /* ========================================
                                   ESCENARIO MODIFICADO
                                ======================================== */

                                const modifiedClimate:
                                    PredictionClimateInput = {

                                    ...baseClimate,

                                    [variable.key]:
                                        evaluatedValue,

                                };


                                /* ========================================
                                   NUEVA PREDICCIÓN
                                ======================================== */

                                const modifiedPrediction =
                                    await predictMunicipality({

                                        municipality:
                                            selectedMunicipality!.name,

                                        climate:
                                            modifiedClimate,

                                    });


                                const modifiedForecast =
                                    getForecastByHorizon(
                                        modifiedPrediction,
                                        selectedHorizon
                                    );


                                if (!modifiedForecast) {

                                    throw new Error(
                                        `No se obtuvo resultado para ${variable.label}.`
                                    );

                                }


                                /* ========================================
                                   DIFERENCIAS
                                ======================================== */

                                const deltaCases =
                                    modifiedForecast
                                        .predicted_cases -
                                    baseForecast
                                        .predicted_cases;


                                const deltaPercent =
                                    baseForecast
                                        .predicted_cases !== 0

                                        ? (
                                            deltaCases /
                                            baseForecast
                                                .predicted_cases
                                        ) * 100

                                        : null;


                                return {

                                    key:
                                        variable.key,

                                    label:
                                        variable.label,

                                    unit:
                                        variable.unit,

                                    decimals:
                                        variable.decimals,

                                    icon:
                                        variable.icon,

                                    iconClassName:
                                        variable.iconClassName,

                                    baseValue:
                                        baseClimate[
                                            variable.key
                                        ],

                                    evaluatedValue,

                                    baseCases:
                                        baseForecast
                                            .predicted_cases,

                                    evaluatedCases:
                                        modifiedForecast
                                            .predicted_cases,

                                    deltaCases,

                                    deltaPercent,

                                    baseRisk:
                                        baseForecast
                                            .risk_level,

                                    baseRiskColor:
                                        baseForecast
                                            .risk_color,

                                    evaluatedRisk:
                                        modifiedForecast
                                            .risk_level,

                                    evaluatedRiskColor:
                                        modifiedForecast
                                            .risk_color,

                                };

                            }
                        )

                    );


                /* ====================================================
                   ORDENAR DE MAYOR A MENOR IMPACTO ABSOLUTO
                ==================================================== */

                impactResponses.sort(
                    (a, b) => {

                        const impactA =
                            a.deltaPercent !== null
                                ? Math.abs(
                                    a.deltaPercent
                                )
                                : Math.abs(
                                    a.deltaCases
                                );


                        const impactB =
                            b.deltaPercent !== null
                                ? Math.abs(
                                    b.deltaPercent
                                )
                                : Math.abs(
                                    b.deltaCases
                                );


                        return (
                            impactB -
                            impactA
                        );

                    }
                );


                if (cancelled) {
                    return;
                }


                setRows(
                    impactResponses
                );

            } catch (loadError) {

                console.error(
                    "Error calculando impacto de variables:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible calcular el impacto de las variables."
                );

            } finally {

                if (!cancelled) {

                    setLoading(
                        false
                    );

                }

            }

        }


        void loadImpact();


        return () => {

            cancelled =
                true;

        };

    }, [
        selectedMunicipality,
        selectedHorizon,
    ]);


    /* ============================================================
       VARIABLE CON MAYOR IMPACTO
    ============================================================ */

    const strongestImpact =
        rows.length > 0
            ? rows[0]
            : null;


    /* ============================================================
       PANEL
    ============================================================ */

    return (

        <article
            className="
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            {/* ========================================================
                HEADER
            ======================================================== */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                "
            >

                <div>

                    <h2
                        className="
                            text-[17px]
                            font-bold
                            text-slate-800
                        "
                    >
                        Impacto de variables en la predicción
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Sensibilidad individual sobre los casos esperados
                    </p>

                </div>


                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    <span
                        className="
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-50
                            px-2.5
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-slate-600
                        "
                    >
                        {selectedMunicipality?.name ??
                            "Municipio"}
                    </span>


                    <span
                        className="
                            rounded-lg
                            border
                            border-violet-100
                            bg-violet-50
                            px-2.5
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-violet-700
                        "
                    >
                        +{selectedHorizon}{" "}
                        {selectedHorizon === 1
                            ? "semana"
                            : "semanas"}
                    </span>

                </div>

            </div>


            {/* ========================================================
                EXPLICACIÓN METODOLÓGICA
            ======================================================== */}

            <div
                className="
                    mt-3
                    flex
                    flex-col
                    gap-2
                    rounded-xl
                    border
                    border-violet-100
                    bg-violet-50/50
                    px-3
                    py-2.5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >

                <p
                    className="
                        max-w-[850px]
                        text-[9px]
                        leading-[13px]
                        text-violet-700
                    "
                >
                    Cada variable se evalúa individualmente en
                    media + 1 desviación estándar, manteniendo las
                    demás entradas en el escenario base.
                </p>


                {strongestImpact && (

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                text-[8px]
                                text-violet-500
                            "
                        >
                            Mayor cambio:
                        </span>


                        <span
                            className="
                                rounded-md
                                border
                                border-violet-200
                                bg-white
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-violet-700
                            "
                        >
                            {strongestImpact.label}
                        </span>

                    </div>

                )}

            </div>


            {/* ========================================================
                LOADING
            ======================================================== */}

            {loading && (

                <div
                    className="
                        flex
                        h-[190px]
                        items-center
                        justify-center
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
                            className="
                                animate-spin
                            "
                        />


                        <span
                            className="
                                text-[9px]
                            "
                        >
                            Evaluando impacto de variables...
                        </span>

                    </div>

                </div>

            )}


            {/* ========================================================
                ERROR
            ======================================================== */}

            {!loading &&
                error && (

                <div
                    className="
                        mt-3
                        rounded-lg
                        border
                        border-red-100
                        bg-red-50
                        px-3
                        py-2
                    "
                >

                    <p
                        className="
                            text-[9px]
                            text-red-600
                        "
                    >
                        {error}
                    </p>

                </div>

            )}


            {/* ========================================================
                TABLA DE ANCHO COMPLETO
            ======================================================== */}

            {!loading &&
                !error &&
                rows.length > 0 && (

                <div
                    className="
                        mt-4
                        overflow-x-auto
                        rounded-xl
                        border
                        border-slate-200
                    "
                >

                    <div
                        className="
                            min-w-[1050px]
                        "
                    >

                        {/* ====================================================
                            CABECERA
                        ==================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-[1.5fr_0.8fr_0.9fr_0.8fr_0.95fr_0.75fr_0.75fr_1fr]
                                items-center
                                gap-3
                                border-b
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-2.5
                            "
                        >

                            <span
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Variable
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Valor base
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Valor evaluado
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Casos base
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Casos resultantes
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Δ casos
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Variación
                            </span>


                            <span
                                className="
                                    text-right
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Riesgo resultante
                            </span>

                        </div>


                        {/* ====================================================
                            FILAS
                        ==================================================== */}

                        <div>

                            {rows.map(
                                (
                                    row,
                                    index
                                ) => {

                                    const isIncrease =
                                        row.deltaCases >
                                        0.005;


                                    const isDecrease =
                                        row.deltaCases <
                                        -0.005;


                                    const riskChanged =
                                        row.baseRisk !==
                                        row.evaluatedRisk;


                                    return (

                                        <div
                                            key={
                                                row.key
                                            }
                                            className="
                                                grid
                                                grid-cols-[1.5fr_0.8fr_0.9fr_0.8fr_0.95fr_0.75fr_0.75fr_1fr]
                                                items-center
                                                gap-3
                                                border-b
                                                border-slate-100
                                                px-4
                                                py-2.5
                                                transition
                                                last:border-b-0
                                                hover:bg-slate-50/70
                                            "
                                        >

                                            {/* ====================================
                                                VARIABLE
                                            ==================================== */}

                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    gap-2.5
                                                "
                                            >

                                                <div
                                                    className={`
                                                        flex
                                                        h-8
                                                        w-8
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        ${row.iconClassName}
                                                    `}
                                                >
                                                    {row.icon}
                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                        "
                                                    >

                                                        <p
                                                            className="
                                                                truncate
                                                                text-[10px]
                                                                font-semibold
                                                                text-slate-700
                                                            "
                                                        >
                                                            {row.label}
                                                        </p>


                                                        {index === 0 && (

                                                            <span
                                                                className="
                                                                    rounded
                                                                    bg-violet-50
                                                                    px-1.5
                                                                    py-0.5
                                                                    text-[7px]
                                                                    font-bold
                                                                    text-violet-600
                                                                "
                                                            >
                                                                Mayor cambio
                                                            </span>

                                                        )}

                                                    </div>


                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-[8px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        Prueba controlada individual
                                                    </p>

                                                </div>

                                            </div>


                                            {/* ====================================
                                                VALOR BASE
                                            ==================================== */}

                                            <div
                                                className="
                                                    text-right
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        text-slate-600
                                                    "
                                                >
                                                    {formatNumber(
                                                        row.baseValue,
                                                        row.decimals
                                                    )}
                                                </p>


                                                <p
                                                    className="
                                                        text-[8px]
                                                        text-slate-400
                                                    "
                                                >
                                                    {row.unit}
                                                </p>

                                            </div>


                                            {/* ====================================
                                                VALOR EVALUADO
                                            ==================================== */}

                                            <div
                                                className="
                                                    text-right
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-bold
                                                        text-slate-700
                                                    "
                                                >
                                                    {formatNumber(
                                                        row.evaluatedValue,
                                                        row.decimals
                                                    )}
                                                </p>


                                                <p
                                                    className="
                                                        text-[8px]
                                                        text-slate-400
                                                    "
                                                >
                                                    {row.unit}
                                                </p>

                                            </div>


                                            {/* ====================================
                                                CASOS BASE
                                            ==================================== */}

                                            <p
                                                className="
                                                    text-right
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-600
                                                "
                                            >
                                                {formatNumber(
                                                    row.baseCases,
                                                    2
                                                )}
                                            </p>


                                            {/* ====================================
                                                CASOS RESULTANTES
                                            ==================================== */}

                                            <p
                                                className="
                                                    text-right
                                                    text-[10px]
                                                    font-bold
                                                    text-slate-800
                                                "
                                            >
                                                {formatNumber(
                                                    row.evaluatedCases,
                                                    2
                                                )}
                                            </p>


                                            {/* ====================================
                                                DELTA ABSOLUTO
                                            ==================================== */}

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-end
                                                    gap-1
                                                "
                                            >

                                                {isIncrease ? (

                                                    <TrendingUp
                                                        size={12}
                                                        className="
                                                            text-red-500
                                                        "
                                                    />

                                                ) : isDecrease ? (

                                                    <TrendingDown
                                                        size={12}
                                                        className="
                                                            text-emerald-500
                                                        "
                                                    />

                                                ) : (

                                                    <Minus
                                                        size={12}
                                                        className="
                                                            text-slate-400
                                                        "
                                                    />

                                                )}


                                                <span
                                                    className={`
                                                        text-[10px]
                                                        font-bold
                                                        ${
                                                            isIncrease
                                                                ? "text-red-500"
                                                                : isDecrease
                                                                    ? "text-emerald-600"
                                                                    : "text-slate-500"
                                                        }
                                                    `}
                                                >
                                                    {row.deltaCases > 0
                                                        ? "+"
                                                        : ""}

                                                    {formatNumber(
                                                        row.deltaCases,
                                                        2
                                                    )}
                                                </span>

                                            </div>


                                            {/* ====================================
                                                VARIACIÓN %
                                            ==================================== */}

                                            <div
                                                className="
                                                    text-right
                                                "
                                            >

                                                <span
                                                    className={`
                                                        inline-flex
                                                        rounded-md
                                                        px-2
                                                        py-1
                                                        text-[9px]
                                                        font-bold
                                                        ${
                                                            isIncrease
                                                                ? "bg-red-50 text-red-600"
                                                                : isDecrease
                                                                    ? "bg-emerald-50 text-emerald-600"
                                                                    : "bg-slate-100 text-slate-500"
                                                        }
                                                    `}
                                                >

                                                    {row.deltaPercent !==
                                                    null ? (

                                                        <>
                                                            {row.deltaPercent >
                                                            0
                                                                ? "+"
                                                                : ""}

                                                            {row.deltaPercent.toFixed(
                                                                1
                                                            )}
                                                            %
                                                        </>

                                                    ) : (

                                                        "—"

                                                    )}

                                                </span>

                                            </div>


                                            {/* ====================================
                                                RIESGO
                                            ==================================== */}

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    items-end
                                                "
                                            >

                                                <span
                                                    className="
                                                        inline-flex
                                                        rounded-full
                                                        px-2.5
                                                        py-1
                                                        text-[9px]
                                                        font-bold
                                                    "
                                                    style={{
                                                        color:
                                                            row.evaluatedRiskColor,

                                                        backgroundColor:
                                                            `${row.evaluatedRiskColor}15`,
                                                    }}
                                                >
                                                    {row.evaluatedRisk}
                                                </span>


                                                {riskChanged && (

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[7px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        {row.baseRisk}
                                                        {" → "}
                                                        {row.evaluatedRisk}
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* ========================================================
                ACLARACIÓN
            ======================================================== */}

            {!loading &&
                !error &&
                rows.length > 0 && (

                <div
                    className="
                        mt-3
                        flex
                        flex-col
                        gap-1
                        rounded-lg
                        border
                        border-amber-100
                        bg-amber-50/60
                        px-3
                        py-2
                    "
                >

                    <p
                        className="
                            text-[8px]
                            leading-[12px]
                            text-amber-700
                        "
                    >
                        El análisis representa sensibilidad del modelo
                        frente a modificaciones controladas de sus entradas.
                    </p>


                    <p
                        className="
                            text-[8px]
                            leading-[12px]
                            text-amber-600
                        "
                    >
                        Los resultados no deben interpretarse como causalidad,
                        correlación estadística ni importancia SHAP.
                    </p>

                </div>

            )}

        </article>

    );

}