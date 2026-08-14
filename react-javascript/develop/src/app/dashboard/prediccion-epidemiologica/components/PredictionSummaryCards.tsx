"use client";

import RiskMunicipalitiesSummaryCard
    from "./RiskMunicipalitiesSummaryCard";

import {
    useEffect,
    useState,
} from "react";

import {
    Activity,
    CalendarClock,
    Gauge,
    ShieldAlert,
    Target,
} from "lucide-react";

import type {
    AllMunicipalitiesForecast,
    MunicipalityForecast,
    PredictionHistoryResponse,
    PredictionHorizon,
    PredictionMetricsResponse,
    PredictionMunicipality,
} from "../data/predictionApi";

import {
    createMeanClimateInput,
    getForecastByHorizon,
    getElevatedRiskMunicipalities,
    getLastObservedPoint,
    getMetricByHorizon,
    getPredictionClimateRanges,
    getPredictionHistory,
    getPredictionMetrics,
    predictAllMunicipalities,
    predictMunicipality,
} from "../services/predictionApi.service";

import PredictionSummaryCard
    from "./PredictionSummaryCard";


interface PredictionSummaryCardsProps {

    municipalities: PredictionMunicipality[];

    selectedMunicipalityCode: string;

    selectedHorizon: PredictionHorizon;

}


interface PredictionSummaryState {

    municipalityForecast: MunicipalityForecast;

    history: PredictionHistoryResponse;

    allForecast: AllMunicipalitiesForecast;

    metrics: PredictionMetricsResponse;

}


/**
 * ============================================================================
 * FORMATO DE FECHAS
 * ============================================================================
 */

function formatApiDate(
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


/**
 * ============================================================================
 * FORMATO DE NÚMEROS
 * ============================================================================
 */

function formatNumber(
    value: number | undefined,
    maximumFractionDigits = 1
): string {

    if (
        value === undefined ||
        Number.isNaN(value)
    ) {
        return "Sin dato";
    }

    return new Intl.NumberFormat(
        "es-CO",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits,
        }
    ).format(value);

}


export default function PredictionSummaryCards({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

}: PredictionSummaryCardsProps) {

    const [
        data,
        setData,
    ] = useState<PredictionSummaryState | null>(
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

    const selectedMunicipalityName =
        selectedMunicipality?.name ?? "";


    /* ============================================================
       CARGA DE INFORMACIÓN REAL
    ============================================================ */

    useEffect(() => {

        if (!selectedMunicipalityName) {
            return;
        }


        let cancelled = false;


        async function loadPredictionData() {

            try {

                setLoading(true);

                setError(null);

                setData(null);


                /* ====================================================
                   1. RANGOS DEL MODELO

                   Por ahora utilizamos la media de cada variable
                   como escenario base.
                ==================================================== */

                const climateRanges =
                    await getPredictionClimateRanges();


                const climate =
                    createMeanClimateInput(
                        climateRanges
                    );


                /* ====================================================
                   2. CONSULTAS REALES
                ==================================================== */

                const [
                    municipalityForecast,
                    history,
                    allForecast,
                    metrics,
                ] = await Promise.all([

                    predictMunicipality({
                        municipality:
                            selectedMunicipalityName,
                        climate,
                    }),

                    getPredictionHistory(
                        selectedMunicipalityName,
                        12
                    ),

                    predictAllMunicipalities(
                        {
                            climate,
                        },
                        selectedHorizon
                    ),

                    getPredictionMetrics(),

                ]);


                if (cancelled) {
                    return;
                }


                setData({

                    municipalityForecast,

                    history,

                    allForecast,

                    metrics,

                });

            } catch (loadError) {

                console.error(
                    "Error cargando resumen predictivo:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar la predicción."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }


        void loadPredictionData();


        return () => {

            cancelled = true;

        };

    }, [
        selectedMunicipalityName,
        selectedHorizon,
    ]);


    /* ============================================================
       CARGANDO
    ============================================================ */

    if (
        loading ||
        !selectedMunicipality
    ) {

        return (

            <section
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-3
                    2xl:grid-cols-6
                "
            >

                {Array.from({
                    length: 6,
                }).map((_, index) => (

                    <article
                        key={index}
                        className="
                            min-h-[150px]
                            animate-pulse
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
                                h-3
                                w-28
                                rounded
                                bg-slate-200
                            "
                        />

                        <div
                            className="
                                mt-6
                                h-7
                                w-20
                                rounded
                                bg-slate-200
                            "
                        />

                        <div
                            className="
                                mt-4
                                h-2.5
                                w-32
                                rounded
                                bg-slate-100
                            "
                        />

                    </article>

                ))}

            </section>

        );

    }


    /* ============================================================
       ERROR
    ============================================================ */

    if (
        error ||
        !data
    ) {

        return (

            <div
                className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-4
                "
            >

                <p
                    className="
                        text-[12px]
                        font-semibold
                        text-red-700
                    "
                >
                    No fue posible cargar el resumen predictivo
                </p>

                <p
                    className="
                        mt-1
                        text-[10px]
                        text-red-600
                    "
                >
                    {error ??
                        "No se recibieron datos del modelo."}
                </p>

            </div>

        );

    }


    /* ============================================================
       RESULTADOS DEL HORIZONTE SELECCIONADO
    ============================================================ */

    const selectedForecast =
        getForecastByHorizon(
            data.municipalityForecast,
            selectedHorizon
        );


    const selectedMetric =
        getMetricByHorizon(
            data.metrics,
            selectedHorizon
        );


    const lastObserved =
        getLastObservedPoint(
            data.history
        );


    const elevatedRiskMunicipalities =
        getElevatedRiskMunicipalities(
            data.allForecast,
            selectedHorizon
        );


    const totalMunicipalities =
        data.allForecast.items.length;


    const horizonLabel =
        `+${selectedHorizon} ${selectedHorizon === 1
            ? "semana"
            : "semanas"
        }`;


    /* ============================================================
       TARJETAS REALES
    ============================================================ */

    return (

        <section
            className="
                grid
                w-full
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-6
            "
        >

            {/* ====================================================
                RIESGO PROYECTADO
            ==================================================== */}

            <PredictionSummaryCard
                title="Riesgo proyectado"
                value={
                    selectedForecast?.risk_level ??
                    "Sin dato"
                }
                description={
                    `${selectedMunicipality.name} · ${horizonLabel}`
                }
                secondary="Escenario medio de entrada"
                badge="Dengue"
                icon={ShieldAlert}
                tone="slate"
                accentColor={
                    selectedForecast?.risk_color
                }
            />


            {/* ====================================================
                ÚLTIMO DATO OBSERVADO
            ==================================================== */}

            <PredictionSummaryCard
                title="Último dato observado"
                value={
                    lastObserved
                        ? `${formatNumber(
                            lastObserved.cases,
                            0
                        )} ${lastObserved.cases === 1
                            ? "caso"
                            : "casos"
                        }`
                        : "Sin dato"
                }
                description="Último registro disponible"
                secondary={
                    lastObserved
                        ? formatApiDate(
                            lastObserved.date
                        )
                        : "Sin fecha disponible"
                }
                icon={CalendarClock}
                tone="blue"
            />


            {/* ====================================================
                CASOS ESPERADOS
            ==================================================== */}

            <PredictionSummaryCard
                title="Casos esperados"
                value={
                    formatNumber(
                        selectedForecast?.predicted_cases,
                        1
                    )
                }
                description={
                    `Predicción a ${horizonLabel}`
                }
                secondary={
                    `Fecha de predicción: ${formatApiDate(
                        data.municipalityForecast
                            .prediction_date
                    )}`
                }
                icon={Target}
                tone="violet"
            />


            {/* ====================================================
                INCIDENCIA PROYECTADA
            ==================================================== */}

            <PredictionSummaryCard
                title="Incidencia proyectada"
                value={
                    formatNumber(
                        selectedForecast?.incidence,
                        2
                    )
                }
                description="Casos por 100.000 habitantes"
                secondary={
                    selectedMunicipality.name
                }
                icon={Activity}
                tone="orange"
            />


            {/* ====================================================
                MUNICIPIOS EN RIESGO ALTO
            ==================================================== */}

            <RiskMunicipalitiesSummaryCard
                municipalities={
                    elevatedRiskMunicipalities
                }
                totalMunicipalities={
                    totalMunicipalities
                }
                selectedHorizon={
                    selectedHorizon
                }
            />


            {/* ====================================================
                RENDIMIENTO DEL MODELO
            ==================================================== */}

            <PredictionSummaryCard
                title="Rendimiento del modelo"
                value={
                    selectedMetric
                        ? `R² ${selectedMetric.r2.toFixed(
                            3
                        )}`
                        : "Sin dato"
                }
                description={
                    selectedMetric
                        ? `MAE ${selectedMetric.mae.toFixed(
                            2
                        )} casos`
                        : "Métrica no disponible"
                }
                secondary={
                    `Modelo ${horizonLabel}`
                }
                icon={Gauge}
                tone="emerald"
            />

        </section>

    );

}