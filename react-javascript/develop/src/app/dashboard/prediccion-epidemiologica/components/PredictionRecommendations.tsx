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
    AlertTriangle,
    CheckCircle2,
    Info,
    Lightbulb,
    Loader2,
    ShieldAlert,
} from "lucide-react";

import type {
    PredictionClimateInput,
    PredictionHorizon,
    PredictionMunicipality,
    WeekForecast,
} from "../data/predictionApi";

import {
    getForecastByHorizon,
    getPredictionMunicipalityFactors,
    predictMunicipality,
} from "../services/predictionApi.service";


/* ============================================================================
   PROPS
============================================================================ */

interface PredictionRecommendationsProps {

    municipalities:
        PredictionMunicipality[];

    selectedMunicipalityCode:
        string;

    selectedHorizon:
        PredictionHorizon;

}


/* ============================================================================
   RECOMENDACIÓN
============================================================================ */

interface RecommendationItem {

    title: string;

    description: string;

    icon: ReactNode;

    iconClassName: string;

}


/* ============================================================================
   NORMALIZAR NIVEL DE RIESGO
============================================================================ */

function normalizeRiskLevel(
    value: string
): string {

    return value
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim()
        .toLowerCase();

}


/* ============================================================================
   RECOMENDACIONES SEGÚN RIESGO

   IMPORTANTE:
   Estas recomendaciones utilizan exclusivamente el nivel de riesgo
   entregado por el modelo predictivo.
============================================================================ */

function getRiskRecommendations(
    riskLevel: string
): RecommendationItem[] {

    const normalized =
        normalizeRiskLevel(
            riskLevel
        );


    if (
        normalized ===
        "critico"
    ) {

        return [

            {
                title:
                    "Priorizar seguimiento epidemiológico",

                description:
                    "Revisar de manera prioritaria la evolución de los casos proyectados y el comportamiento territorial del municipio.",

                icon:
                    <ShieldAlert
                        size={15}
                    />,

                iconClassName:
                    "bg-red-50 text-red-600",
            },

            {
                title:
                    "Reforzar vigilancia territorial",

                description:
                    "Incrementar la atención sobre las zonas con mayor riesgo y revisar oportunamente los indicadores epidemiológicos disponibles.",

                icon:
                    <AlertTriangle
                        size={15}
                    />,

                iconClassName:
                    "bg-orange-50 text-orange-600",
            },

            {
                title:
                    "Mantener seguimiento continuo",

                description:
                    "Evaluar nuevamente la proyección ante cambios relevantes en los datos epidemiológicos disponibles.",

                icon:
                    <Lightbulb
                        size={15}
                    />,

                iconClassName:
                    "bg-violet-50 text-violet-600",
            },

        ];

    }


    if (
        normalized ===
        "alto"
    ) {

        return [

            {
                title:
                    "Reforzar monitoreo",

                description:
                    "Mantener seguimiento cercano a la evolución de los casos proyectados durante el horizonte seleccionado.",

                icon:
                    <AlertTriangle
                        size={15}
                    />,

                iconClassName:
                    "bg-orange-50 text-orange-600",
            },

            {
                title:
                    "Revisar comportamiento territorial",

                description:
                    "Analizar la evolución epidemiológica del municipio y contrastarla con los registros observados disponibles.",

                icon:
                    <Lightbulb
                        size={15}
                    />,

                iconClassName:
                    "bg-violet-50 text-violet-600",
            },

            {
                title:
                    "Actualizar seguimiento",

                description:
                    "Repetir la revisión predictiva cuando existan nuevos datos epidemiológicos o cambios relevantes en el periodo analizado.",

                icon:
                    <CheckCircle2
                        size={15}
                    />,

                iconClassName:
                    "bg-emerald-50 text-emerald-600",
            },

        ];

    }


    if (
        normalized ===
        "medio"
    ) {

        return [

            {
                title:
                    "Mantener vigilancia preventiva",

                description:
                    "Realizar seguimiento periódico de los casos proyectados y revisar posibles cambios en el nivel de riesgo.",

                icon:
                    <Lightbulb
                        size={15}
                    />,

                iconClassName:
                    "bg-amber-50 text-amber-600",
            },

            {
                title:
                    "Revisar tendencia epidemiológica",

                description:
                    "Comparar la proyección con los últimos datos observados disponibles para el municipio.",

                icon:
                    <CheckCircle2
                        size={15}
                    />,

                iconClassName:
                    "bg-emerald-50 text-emerald-600",
            },

        ];

    }


    return [

        {
            title:
                "Mantener seguimiento rutinario",

            description:
                "Continuar con la vigilancia epidemiológica habitual y revisar periódicamente la evolución del municipio.",

            icon:
                <CheckCircle2
                    size={15}
                />,

            iconClassName:
                "bg-emerald-50 text-emerald-600",
        },

        {
            title:
                "Observar cambios en la proyección",

            description:
                "Consultar nuevamente el modelo cuando existan nuevos datos o cuando cambie el horizonte de análisis.",

            icon:
                <Lightbulb
                    size={15}
                />,

            iconClassName:
                "bg-violet-50 text-violet-600",
        },

    ];

}


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
            minimumFractionDigits:
                decimals,

            maximumFractionDigits:
                decimals,
        }
    ).format(
        value
    );

}


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionRecommendations({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

}: PredictionRecommendationsProps) {

    const [
        forecast,
        setForecast,
    ] = useState<WeekForecast | null>(
        null
    );


    const [
        loading,
        setLoading,
    ] = useState<boolean>(
        true
    );


    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );


    /* ============================================================
       MUNICIPIO SELECCIONADO
    ============================================================ */

    const selectedMunicipality =
        useMemo(
            () =>
                municipalities.find(
                    (
                        municipality
                    ) =>
                        municipality.code ===
                        selectedMunicipalityCode
                ) ?? null,
            [
                municipalities,
                selectedMunicipalityCode,
            ]
        );


    /* ============================================================
       CARGA DE DATOS EPIDEMIOLÓGICOS
    ============================================================ */

    useEffect(() => {

        let cancelled =
            false;


        async function loadRecommendations() {

            if (
                !selectedMunicipality
            ) {

                setForecast(
                    null
                );

                setLoading(
                    false
                );

                return;

            }


            try {

                setLoading(
                    true
                );

                setError(
                    null
                );


                /*
                 * Obtenemos los factores base
                 * propios del municipio.
                 */

                const factorsResponse =
                    await getPredictionMunicipalityFactors(
                        selectedMunicipality.name
                    );


                /* ====================================================
                   ESCENARIO BASE DEL MODELO
                ==================================================== */

                const baseClimate:
                    PredictionClimateInput = {

                    precip_mean:
                        factorsResponse
                            .factors
                            .precip_mean,

                    temp_mean:
                        factorsResponse
                            .factors
                            .temp_mean,

                    temp_max_mean:
                        factorsResponse
                            .factors
                            .temp_max_mean,

                    temp_min_mean:
                        factorsResponse
                            .factors
                            .temp_min_mean,

                    rh_mean:
                        factorsResponse
                            .factors
                            .rh_mean,

                    dengue_lag1:
                        Math.round(
                            factorsResponse
                                .factors
                                .dengue_lag1
                        ),

                };


                /*
                 * La recomendación se deriva únicamente
                 * de la predicción epidemiológica.
                 */

                const prediction =
                    await predictMunicipality({

                        municipality:
                            selectedMunicipality.name,

                        climate:
                            baseClimate,

                    });


                const selectedForecast =
                    getForecastByHorizon(
                        prediction,
                        selectedHorizon
                    );


                if (
                    cancelled
                ) {
                    return;
                }


                setForecast(
                    selectedForecast
                );

            }
            catch (
                loadError
            ) {

                console.error(
                    "Error cargando recomendaciones:",
                    loadError
                );


                if (
                    cancelled
                ) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar las recomendaciones."
                );


                setForecast(
                    null
                );

            }
            finally {

                if (
                    !cancelled
                ) {

                    setLoading(
                        false
                    );

                }

            }

        }


        void loadRecommendations();


        return () => {

            cancelled =
                true;

        };

    }, [
        selectedMunicipality,
        selectedHorizon,
    ]);


    /* ============================================================
       LOADING
    ============================================================ */

    if (
        loading
    ) {

        return (

            <article
                className="
                    flex
                    h-full
                    min-h-[360px]
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
                        Generando recomendaciones...
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
        !forecast
    ) {

        return (

            <article
                className="
                    h-full
                    min-h-[360px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Recomendaciones ante el riesgo
                </h2>


                <p
                    className="
                        mt-4
                        text-[10px]
                        text-red-500
                    "
                >
                    {error ??
                        "No fue posible obtener las recomendaciones."}
                </p>

            </article>

        );

    }


    /* ============================================================
       RECOMENDACIONES SEGÚN RIESGO
    ============================================================ */

    const recommendations =
        getRiskRecommendations(
            forecast.risk_level
        );


    /* ============================================================
       PANEL
    ============================================================ */

    return (

        <article
            className="
                flex
                h-full
                min-h-[360px]
                flex-col
                overflow-hidden
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
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <h2
                            className="
                                text-[17px]
                                font-bold
                                text-slate-800
                            "
                        >
                            Recomendaciones ante el riesgo
                        </h2>


                        <Info
                            size={15}
                            className="
                                text-slate-400
                            "
                        />

                    </div>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Apoyo para la toma de decisiones
                    </p>

                </div>


                <span
                    className="
                        shrink-0
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
                    {selectedMunicipality?.name}
                </span>

            </div>


            {/* ========================================================
                RESUMEN
            ======================================================== */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-violet-100
                    bg-violet-50/50
                    px-3
                    py-2.5
                "
            >

                <div>

                    <p
                        className="
                            text-[8px]
                            text-violet-500
                        "
                    >
                        Riesgo proyectado
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[12px]
                            font-bold
                            text-violet-700
                        "
                    >
                        {forecast.risk_level}
                    </p>

                </div>


                <div
                    className="
                        text-right
                    "
                >

                    <p
                        className="
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Casos esperados
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[12px]
                            font-bold
                            text-slate-700
                        "
                    >
                        {formatNumber(
                            forecast.predicted_cases,
                            2
                        )}
                    </p>

                </div>

            </div>


            {/* ========================================================
                LISTA DE RECOMENDACIONES
            ======================================================== */}

            <div
                className="
                    mt-3
                    space-y-2
                "
            >

                {recommendations.map(
                    (
                        recommendation
                    ) => (

                        <div
                            key={
                                recommendation.title
                            }
                            className="
                                flex
                                items-start
                                gap-2.5
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50/40
                                px-3
                                py-2.5
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
                                    ${recommendation.iconClassName}
                                `}
                            >
                                {
                                    recommendation.icon
                                }
                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    {
                                        recommendation.title
                                    }
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        leading-[12px]
                                        text-slate-500
                                    "
                                >
                                    {
                                        recommendation.description
                                    }
                                </p>

                            </div>

                        </div>

                    )
                )}

            </div>


            {/* ========================================================
                HORIZONTE
            ======================================================== */}

            <div
                className="
                    mt-3
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50/30
                    px-3
                    py-2.5
                "
            >

                <span
                    className="
                        text-[8px]
                        text-slate-500
                    "
                >
                    Horizonte analizado
                </span>


                <span
                    className="
                        text-[9px]
                        font-bold
                        text-violet-600
                    "
                >
                    +{selectedHorizon}{" "}
                    {selectedHorizon === 1
                        ? "semana"
                        : "semanas"}
                </span>

            </div>


            {/* ========================================================
                ACLARACIÓN
            ======================================================== */}

            <p
                className="
                    mt-auto
                    pt-3
                    text-[7px]
                    leading-[11px]
                    text-slate-400
                "
            >
                Las recomendaciones se generan a partir del nivel de
                riesgo epidemiológico proyectado por el modelo para el
                municipio y horizonte seleccionados.
            </p>

        </article>

    );

}