"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
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

interface PredictionAlertsProps {

    municipalities:
        PredictionMunicipality[];

    selectedMunicipalityCode:
        string;

    selectedHorizon:
        PredictionHorizon;

}


/* ============================================================================
   CONFIGURACIÓN VISUAL DEL RIESGO
============================================================================ */

interface RiskVisualConfig {

    title: string;

    description: string;

    recommendation: string;

    icon:
        React.ReactNode;

    containerClassName: string;

    iconClassName: string;

    badgeClassName: string;

}


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


function getRiskVisualConfig(
    riskLevel: string
): RiskVisualConfig {

    const normalized =
        normalizeRiskLevel(
            riskLevel
        );


    if (
        normalized ===
        "critico"
    ) {

        return {

            title:
                "Alerta crítica",

            description:
                "La predicción indica un nivel crítico de riesgo epidemiológico para el horizonte seleccionado.",

            recommendation:
                "Se recomienda priorizar la revisión epidemiológica y el seguimiento territorial del municipio.",

            icon:
                <ShieldAlert
                    size={20}
                />,

            containerClassName:
                "border-red-200 bg-red-50/70",

            iconClassName:
                "bg-red-100 text-red-700",

            badgeClassName:
                "border-red-200 bg-red-100 text-red-700",

        };

    }


    if (
        normalized ===
        "alto"
    ) {

        return {

            title:
                "Riesgo elevado",

            description:
                "La proyección presenta un nivel alto de riesgo epidemiológico para el periodo seleccionado.",

            recommendation:
                "Conviene reforzar el monitoreo y revisar oportunamente la evolución de casos esperados.",

            icon:
                <AlertTriangle
                    size={20}
                />,

            containerClassName:
                "border-orange-200 bg-orange-50/70",

            iconClassName:
                "bg-orange-100 text-orange-600",

            badgeClassName:
                "border-orange-200 bg-orange-100 text-orange-700",

        };

    }


    if (
        normalized ===
        "medio"
    ) {

        return {

            title:
                "Vigilancia preventiva",

            description:
                "La predicción ubica al municipio en un nivel medio de riesgo epidemiológico.",

            recommendation:
                "Se recomienda mantener vigilancia sobre la evolución de los casos y las condiciones asociadas.",

            icon:
                <AlertCircle
                    size={20}
                />,

            containerClassName:
                "border-amber-200 bg-amber-50/70",

            iconClassName:
                "bg-amber-100 text-amber-600",

            badgeClassName:
                "border-amber-200 bg-amber-100 text-amber-700",

        };

    }


    return {

        title:
            "Situación estable",

        description:
            "La predicción presenta un nivel bajo de riesgo epidemiológico para el horizonte seleccionado.",

        recommendation:
            "Mantener el seguimiento periódico y continuar con las acciones habituales de vigilancia.",

        icon:
            <CheckCircle2
                size={20}
            />,

        containerClassName:
            "border-emerald-200 bg-emerald-50/70",

        iconClassName:
            "bg-emerald-100 text-emerald-600",

        badgeClassName:
            "border-emerald-200 bg-emerald-100 text-emerald-700",

    };

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

export default function PredictionAlerts({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

}: PredictionAlertsProps) {

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
       CARGA DE PREDICCIÓN BASE
    ============================================================ */

    useEffect(() => {

        let cancelled =
            false;


        async function loadAlert() {

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


                const factorsResponse =
                    await getPredictionMunicipalityFactors(
                        selectedMunicipality.name
                    );


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
                    "Error cargando alerta predictiva:",
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
                        : "No fue posible cargar la alerta predictiva."
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


        void loadAlert();


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
                        Evaluando riesgo...
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
                    Alertas predictivas
                </h2>


                <p
                    className="
                        mt-4
                        text-[10px]
                        text-red-500
                    "
                >
                    {error ??
                        "No fue posible obtener la información de riesgo."}
                </p>

            </article>

        );

    }


    /* ============================================================
       CONFIGURACIÓN VISUAL
    ============================================================ */

    const visual =
        getRiskVisualConfig(
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
                            Alertas predictivas
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
                        Basadas en el nivel de riesgo proyectado
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
                ALERTA PRINCIPAL
            ======================================================== */}

            <div
                className={`
                    mt-4
                    rounded-xl
                    border
                    p-3
                    ${visual.containerClassName}
                `}
            >

                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >

                    <div
                        className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            ${visual.iconClassName}
                        `}
                    >
                        {visual.icon}
                    </div>


                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-2
                            "
                        >

                            <p
                                className="
                                    text-[12px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {visual.title}
                            </p>


                            <span
                                className={`
                                    rounded-full
                                    border
                                    px-2.5
                                    py-1
                                    text-[9px]
                                    font-bold
                                    ${visual.badgeClassName}
                                `}
                            >
                                {forecast.risk_level}
                            </span>

                        </div>


                        <p
                            className="
                                mt-2
                                text-[9px]
                                leading-[14px]
                                text-slate-600
                            "
                        >
                            {visual.description}
                        </p>

                    </div>

                </div>

            </div>


            {/* ========================================================
                MÉTRICAS
            ======================================================== */}

            <div
                className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-2
                "
            >

                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50/60
                        px-3
                        py-2.5
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
                            mt-1
                            text-[16px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {formatNumber(
                            forecast.predicted_cases,
                            2
                        )}
                    </p>

                </div>


                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-slate-50/60
                        px-3
                        py-2.5
                    "
                >

                    <p
                        className="
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Incidencia
                    </p>


                    <p
                        className="
                            mt-1
                            text-[16px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {formatNumber(
                            forecast.incidence,
                            2
                        )}
                    </p>

                </div>

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
                    px-3
                    py-2
                "
            >

                <span
                    className="
                        text-[9px]
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
                ORIENTACIÓN
            ======================================================== */}

            <div
                className="
                    mt-3
                    rounded-lg
                    border
                    border-slate-200
                    bg-slate-50/50
                    px-3
                    py-2.5
                "
            >

                <p
                    className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    Orientación
                </p>


                <p
                    className="
                        mt-1
                        text-[9px]
                        leading-[14px]
                        text-slate-600
                    "
                >
                    {visual.recommendation}
                </p>

            </div>


            {/* ========================================================
                ACLARACIÓN
            ======================================================== */}

            <p
                className="
                    mt-auto
                    pt-3
                    text-[8px]
                    leading-[12px]
                    text-slate-400
                "
            >
                El nivel mostrado corresponde directamente a la
                clasificación entregada por el modelo predictivo.
            </p>

        </article>

    );

}