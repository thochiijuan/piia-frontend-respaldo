"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    CalendarClock,
    Loader2,
    TrendingUp,
} from "lucide-react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    MunicipalityForecast,
    PredictionHistoryResponse,
    PredictionHorizon,
    PredictionMunicipality,
} from "../data/predictionApi";

import {
    createMeanClimateInput,
    getPredictionClimateRanges,
    getPredictionHistory,
    predictMunicipality,
} from "../services/predictionApi.service";


/* ============================================================================
   PROPS
============================================================================ */

interface PredictionHistoryForecastChartProps {

    municipalities: PredictionMunicipality[];

    selectedMunicipalityCode: string;

    selectedHorizon: PredictionHorizon;

}


/* ============================================================================
   PUNTOS DEL GRÁFICO
============================================================================ */

interface ChartPoint {

    id: string;

    label: string;

    fullLabel: string;

    observed?: number;

    predicted?: number;

    type:
        | "history"
        | "separator"
        | "forecast";

    week?: PredictionHorizon;

    riskLevel?: string;

    riskColor?: string;

    incidence?: number;

}


/* ============================================================================
   FECHAS
============================================================================ */

function formatDate(
    date: string | undefined
): string {

    if (!date) {
        return "Sin fecha";
    }

    const parts =
        date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    const [
        year,
        month,
        day,
    ] = parts;

    return `${day}/${month}/${year}`;

}


function formatShortDate(
    date: string
): string {

    const parts =
        date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    const [
        year,
        month,
        day,
    ] = parts;

    return `${day}/${month}/${year.slice(-2)}`;

}


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionHistoryForecastChart({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

}: PredictionHistoryForecastChartProps) {

    const [
        history,
        setHistory,
    ] = useState<PredictionHistoryResponse | null>(
        null
    );

    const [
        prediction,
        setPrediction,
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
        municipalities.find(
            (municipality) =>
                municipality.code ===
                selectedMunicipalityCode
        );


    const municipalityName =
        selectedMunicipality?.name ?? "";


    /* ============================================================
       CARGA DE INFORMACIÓN
    ============================================================ */

    useEffect(() => {

        if (!municipalityName) {
            return;
        }


        let cancelled = false;


        async function loadData() {

            try {

                setLoading(true);

                setError(null);


                /* ====================================================
                   ESCENARIO BASE
                ==================================================== */

                const ranges =
                    await getPredictionClimateRanges();


                const climate =
                    createMeanClimateInput(
                        ranges
                    );


                /* ====================================================
                   HISTÓRICO + PREDICCIÓN
                ==================================================== */

                const [
                    historyResponse,
                    predictionResponse,
                ] = await Promise.all([

                    getPredictionHistory(
                        municipalityName,
                        12
                    ),

                    predictMunicipality({
                        municipality:
                            municipalityName,
                        climate,
                    }),

                ]);


                if (cancelled) {
                    return;
                }


                setHistory(
                    historyResponse
                );


                setPrediction(
                    predictionResponse
                );

            } catch (loadError) {

                console.error(
                    "Error cargando serie predictiva:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar la serie predictiva."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }


        void loadData();


        return () => {

            cancelled = true;

        };

    }, [
        municipalityName,
    ]);


    /* ============================================================
       DATOS DEL GRÁFICO
    ============================================================ */

    const chartData =
        useMemo<ChartPoint[]>(() => {

            if (
                !history ||
                !prediction
            ) {
                return [];
            }


            /* ====================================================
               HISTÓRICO
            ==================================================== */

            const historyPoints =
                [...history.points]
                    .sort(
                        (a, b) =>
                            a.date.localeCompare(
                                b.date
                            )
                    )
                    .map(
                        (
                            point,
                            index
                        ): ChartPoint => ({

                            id:
                                `history-${index}-${point.date}`,

                            label:
                                formatShortDate(
                                    point.date
                                ),

                            fullLabel:
                                formatDate(
                                    point.date
                                ),

                            observed:
                                point.cases,

                            type:
                                "history",

                        })
                    );


            /* ====================================================
               SEPARADOR TEMPORAL
            ==================================================== */

            const separator: ChartPoint = {

                id:
                    "temporal-gap",

                label:
                    "Brecha",

                fullLabel:
                    "Brecha temporal",

                type:
                    "separator",

            };


            /* ====================================================
               PREDICCIÓN
            ==================================================== */

            const forecastPoints =
                prediction.forecast.map(
                    (
                        forecast
                    ): ChartPoint => ({

                        id:
                            `forecast-${forecast.week}`,

                        label:
                            `+${forecast.week} sem`,

                        fullLabel:
                            `Predicción +${forecast.week} ${
                                forecast.week === 1
                                    ? "semana"
                                    : "semanas"
                            }`,

                        predicted:
                            forecast.predicted_cases,

                        type:
                            "forecast",

                        week:
                            forecast.week,

                        riskLevel:
                            forecast.risk_level,

                        riskColor:
                            forecast.risk_color,

                        incidence:
                            forecast.incidence,

                    })
                );


            return [

                ...historyPoints,

                separator,

                ...forecastPoints,

            ];

        }, [
            history,
            prediction,
        ]);


    /* ============================================================
       ÚLTIMO DATO OBSERVADO
    ============================================================ */

    const lastObserved =
        useMemo(() => {

            if (
                !history ||
                history.points.length === 0
            ) {
                return null;
            }


            return [...history.points].sort(
                (a, b) =>
                    b.date.localeCompare(
                        a.date
                    )
            )[0];

        }, [
            history,
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
                    min-h-[460px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
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
                        size={21}
                        className="animate-spin"
                    />

                    <p
                        className="
                            text-[10px]
                        "
                    >
                        Cargando serie predictiva...
                    </p>

                </div>

            </article>

        );

    }


    /* ============================================================
       ERROR
    ============================================================ */

    if (
        error ||
        !history ||
        !prediction
    ) {

        return (

            <article
                className="
                    flex
                    h-full
                    min-h-[460px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        max-w-[280px]
                        flex-col
                        items-center
                        text-center
                    "
                >

                    <div
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            bg-red-50
                            text-red-500
                        "
                    >

                        <AlertCircle
                            size={17}
                        />

                    </div>


                    <p
                        className="
                            mt-2
                            text-[11px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        No fue posible cargar la serie
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-[13px]
                            text-slate-400
                        "
                    >
                        {error}
                    </p>

                </div>

            </article>

        );

    }


    /* ============================================================
       PANEL PRINCIPAL
    ============================================================ */

    return (

        <article
            className="
                flex
                h-full
                min-h-[460px]
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-3
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div
                className="
                    flex
                    shrink-0
                    items-start
                    justify-between
                    gap-2
                "
            >

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

                        <TrendingUp
                            size={15}
                            className="
                                shrink-0
                                text-violet-600
                            "
                        />


                        <h2
                            className="
                                truncate
                                text-[16px]
                                font-bold
                                leading-[19px]
                                text-slate-800
                            "
                        >
                            Predicción de casos vs Observados
                        </h2>

                    </div>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-[12px]
                            text-slate-500
                        "
                    >
                        Serie histórica disponible y proyección de Dengue
                    </p>

                </div>


                <span
                    className="
                        inline-flex
                        shrink-0
                        rounded-lg
                        border
                        border-violet-100
                        bg-violet-50
                        px-2
                        py-1
                        text-[9px]
                        font-semibold
                        text-violet-700
                    "
                >
                    {municipalityName}
                    {" · "}
                    +{selectedHorizon}
                    {" "}
                    {selectedHorizon === 1
                        ? "semana"
                        : "semanas"}
                </span>

            </div>


            {/* ============================================================
                FECHAS
            ============================================================ */}

            <div
                className="
                    mt-2.5
                    grid
                    shrink-0
                    grid-cols-2
                    gap-2
                "
            >

                {/* ÚLTIMO OBSERVADO */}

                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50/60
                        px-2.5
                        py-1.5
                    "
                >

                    <p
                        className="
                            text-[8px]
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Último observado
                    </p>


                    <div
                        className="
                            mt-0.5
                            flex
                            items-center
                            gap-1.5
                        "
                    >

                        <CalendarClock
                            size={11}
                            className="
                                text-blue-500
                            "
                        />


                        <span
                            className="
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            {lastObserved
                                ? formatDate(
                                    lastObserved.date
                                )
                                : "Sin dato"}
                        </span>

                    </div>

                </div>


                {/* FECHA PREDICCIÓN */}

                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        bg-slate-50/60
                        px-2.5
                        py-1.5
                    "
                >

                    <p
                        className="
                            text-[8px]
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Fecha de predicción
                    </p>


                    <div
                        className="
                            mt-0.5
                            flex
                            items-center
                            gap-1.5
                        "
                    >

                        <CalendarClock
                            size={11}
                            className="
                                text-violet-500
                            "
                        />


                        <span
                            className="
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            {formatDate(
                                prediction.prediction_date
                            )}
                        </span>

                    </div>

                </div>

            </div>


            {/* ============================================================
                LEYENDA
            ============================================================ */}

            <div
                className="
                    mt-2.5
                    flex
                    shrink-0
                    flex-wrap
                    items-center
                    gap-3
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
                            w-5
                            rounded-full
                            bg-blue-500
                        "
                    />

                    <span
                        className="
                            text-[9px]
                            text-slate-500
                        "
                    >
                        Casos observados
                    </span>

                </div>


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
                            w-5
                            rounded-full
                            bg-violet-500
                        "
                    />

                    <span
                        className="
                            text-[9px]
                            text-slate-500
                        "
                    >
                        Casos predichos
                    </span>

                </div>

            </div>


            {/* ============================================================
                GRÁFICO
            ============================================================ */}

            <div
                className="
                    mt-1
                    h-[245px]
                    w-full
                    shrink-0
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
                            top: 14,
                            right: 12,
                            bottom: 2,
                            left: -18,
                        }}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E2E8F0"
                        />


                        <XAxis
                            dataKey="label"
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
                            interval="preserveStartEnd"
                        />


                        <YAxis
                            allowDecimals={false}
                            tick={{
                                fontSize: 8,
                                fill:
                                    "#64748B",
                            }}
                            axisLine={false}
                            tickLine={false}
                        />


                        <Tooltip
                            cursor={{
                                stroke:
                                    "#CBD5E1",
                                strokeDasharray:
                                    "3 3",
                            }}
                            content={({
                                active,
                                payload,
                            }) => {

                                if (
                                    !active ||
                                    !payload ||
                                    payload.length === 0
                                ) {
                                    return null;
                                }


                                const point =
                                    payload[0]
                                        .payload as ChartPoint;


                                if (
                                    point.type ===
                                    "separator"
                                ) {

                                    return (

                                        <div
                                            className="
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                px-2.5
                                                py-1.5
                                                shadow-lg
                                            "
                                        >

                                            <p
                                                className="
                                                    text-[9px]
                                                    font-semibold
                                                    text-slate-600
                                                "
                                            >
                                                Brecha temporal
                                            </p>

                                        </div>

                                    );

                                }


                                return (

                                    <div
                                        className="
                                            min-w-[135px]
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-white
                                            px-2.5
                                            py-2
                                            shadow-lg
                                        "
                                    >

                                        <p
                                            className="
                                                text-[9px]
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            {point.fullLabel}
                                        </p>


                                        {point.type ===
                                            "history" && (

                                            <p
                                                className="
                                                    mt-1
                                                    text-[10px]
                                                    font-bold
                                                    text-blue-600
                                                "
                                            >
                                                {point.observed} casos
                                            </p>

                                        )}


                                        {point.type ===
                                            "forecast" && (

                                            <>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-[10px]
                                                        font-bold
                                                        text-violet-600
                                                    "
                                                >
                                                    {point.predicted} casos
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-[8px]
                                                        text-slate-400
                                                    "
                                                >
                                                    Incidencia:{" "}
                                                    {point.incidence}
                                                </p>


                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[8px]
                                                        font-semibold
                                                    "
                                                    style={{
                                                        color:
                                                            point.riskColor,
                                                    }}
                                                >
                                                    Riesgo:{" "}
                                                    {point.riskLevel}
                                                </p>

                                            </>

                                        )}

                                    </div>

                                );

                            }}
                        />


                        {/* ====================================================
                            BRECHA TEMPORAL
                        ==================================================== */}

                        <ReferenceLine
                            x="Brecha"
                            stroke="#94A3B8"
                            strokeDasharray="4 4"
                            label={{
                                value:
                                    "Brecha temporal",
                                position:
                                    "insideTop",
                                fontSize: 8,
                                fill:
                                    "#64748B",
                            }}
                        />


                        {/* ====================================================
                            HORIZONTE SELECCIONADO
                        ==================================================== */}

                        <ReferenceLine
                            x={`+${selectedHorizon} sem`}
                            stroke="#8B5CF6"
                            strokeDasharray="3 3"
                        />


                        {/* ====================================================
                            OBSERVADOS
                        ==================================================== */}

                        <Line
                            type="monotone"
                            dataKey="observed"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{
                                r: 2.5,
                                fill:
                                    "#3B82F6",
                                strokeWidth: 0,
                            }}
                            activeDot={{
                                r: 4.5,
                            }}
                            connectNulls={false}
                            isAnimationActive={false}
                        />


                        {/* ====================================================
                            PREDICCIÓN
                        ==================================================== */}

                        <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#8B5CF6"
                            strokeWidth={2.5}
                            dot={{
                                r: 3.5,
                                fill:
                                    "#8B5CF6",
                                stroke:
                                    "#FFFFFF",
                                strokeWidth: 1.5,
                            }}
                            activeDot={{
                                r: 5,
                            }}
                            connectNulls={false}
                            isAnimationActive={false}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>


            {/* ============================================================
                NOTA SOBRE BRECHA TEMPORAL
            ============================================================ */}

            <div
                className="
                    mt-1.5
                    shrink-0
                    rounded-lg
                    border
                    border-amber-100
                    bg-amber-50/70
                    px-2.5
                    py-1.5
                "
            >

                <p
                    className="
                        text-[8px]
                        leading-[11px]
                        text-amber-700
                    "
                >
                    La serie histórica y la predicción se muestran separadas
                    porque existe una brecha temporal entre el último registro
                    observado disponible y la fecha de generación de la
                    predicción.
                </p>

            </div>

        </article>

    );

}