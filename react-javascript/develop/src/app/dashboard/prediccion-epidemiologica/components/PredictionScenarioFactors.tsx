"use client";

import {
    useEffect,
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
    Thermometer,
} from "lucide-react";

import type {
    PredictionMunicipality,
    PredictionMunicipalityFactors,
    PredictionMunicipalityFactorsResponse,
} from "../data/predictionApi";

import {
    getPredictionMunicipalityFactors,
} from "../services/predictionApi.service";


/* ============================================================================
   TIPOS
============================================================================ */

interface PredictionScenarioFactorsProps {

    municipalities:
        PredictionMunicipality[];

    selectedMunicipalityCode:
        string;

}


interface FactorItemProps {

    icon: ReactNode;

    label: string;

    value: string;

    detail: string;

    iconClassName: string;

}


/* ============================================================================
   ITEM DE VARIABLE
============================================================================ */

function FactorItem({

    icon,

    label,

    value,

    detail,

    iconClassName,

}: FactorItemProps) {

    return (

        <div
            className="
                flex
                items-center
                justify-between
                gap-3
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-3
                py-2.5
            "
        >

            {/* ICONO + INFORMACIÓN */}

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
                        ${iconClassName}
                    `}
                >
                    {icon}
                </div>


                <div className="min-w-0">

                    <p
                        className="
                            truncate
                            text-[11px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        {label}
                    </p>


                    <p
                        className="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-slate-400
                        "
                    >
                        {detail}
                    </p>

                </div>

            </div>


            {/* VALOR */}

            <span
                className="
                    shrink-0
                    text-[12px]
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </span>

        </div>

    );

}


/* ============================================================================
   FORMATO DE NÚMEROS
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
   COMPONENTE PRINCIPAL
============================================================================ */

export default function PredictionScenarioFactors({

    municipalities,

    selectedMunicipalityCode,

}: PredictionScenarioFactorsProps) {

    const [
        response,
        setResponse,
    ] = useState<PredictionMunicipalityFactorsResponse | null>(
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
        ) ?? null;


    /* ============================================================
       CARGA DE FACTORES DEL MUNICIPIO
    ============================================================ */

    useEffect(() => {

        let cancelled = false;


        async function loadScenario() {

            if (
                !selectedMunicipality
            ) {

                setResponse(null);

                setLoading(false);

                setError(
                    "No fue posible identificar el municipio seleccionado."
                );

                return;

            }


            try {

                setLoading(true);

                setError(null);


                const municipalityFactors =
                    await getPredictionMunicipalityFactors(
                        selectedMunicipality.name
                    );


                if (cancelled) {
                    return;
                }


                setResponse(
                    municipalityFactors
                );

            } catch (loadError) {

                console.error(
                    "Error cargando factores del municipio:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar los factores del municipio."
                );

                setResponse(null);

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }


        void loadScenario();


        return () => {

            cancelled = true;

        };

    }, [
        selectedMunicipality,
    ]);


    /* ============================================================
       FACTORES
    ============================================================ */

    const factors:
        PredictionMunicipalityFactors | null =
        response?.factors ?? null;


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


                    <span
                        className="
                            text-[10px]
                        "
                    >
                        Cargando factores del municipio...
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
        !factors ||
        !response
    ) {

        return (

            <article
                className="
                    h-full
                    min-h-[460px]
                    overflow-y-auto
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
                    Factores del escenario predictivo
                </h2>


                <p
                    className="
                        mt-4
                        text-[11px]
                        text-red-500
                    "
                >
                    {error ??
                        "No fue posible obtener las variables."}
                </p>

            </article>

        );

    }


    /* ============================================================
       PANEL PRINCIPAL
    ============================================================ */

    return (

        <article
            className="
                h-full
                min-h-[460px]
                overflow-y-auto
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div>

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Factores del escenario predictivo
                </h2>


                <p
                    className="
                        mt-1
                        text-[10px]
                        text-slate-500
                    "
                >
                    Valores utilizados como entrada del modelo
                </p>

            </div>


            {/* ============================================================
                ESCENARIO BASE
            ============================================================ */}

            <div
                className="
                    mt-4
                    rounded-lg
                    border
                    border-violet-100
                    bg-violet-50/70
                    px-3
                    py-2.5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                >

                    <div className="min-w-0">

                        <p
                            className="
                                text-[10px]
                                font-bold
                                text-violet-700
                            "
                        >
                            Escenario base
                        </p>


                        <p
                            className="
                                mt-0.5
                                truncate
                                text-[9px]
                                text-violet-500
                            "
                        >
                            Último estado disponible de {response.municipality}
                        </p>

                    </div>


                    <span
                        className="
                            shrink-0
                            rounded-md
                            border
                            border-violet-200
                            bg-white
                            px-2
                            py-1
                            text-[9px]
                            font-semibold
                            text-violet-600
                        "
                    >
                        {response.date}
                    </span>

                </div>

            </div>


            {/* ============================================================
                VARIABLES CLIMÁTICAS
            ============================================================ */}

            <div className="mt-4">

                <p
                    className="
                        mb-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-slate-400
                    "
                >
                    Variables climáticas
                </p>


                <div className="space-y-2">

                    {/* PRECIPITACIÓN */}

                    <FactorItem
                        icon={
                            <CloudRain
                                size={15}
                            />
                        }
                        label="Precipitación media"
                        value={`${formatNumber(
                            factors.precip_mean
                        )} mm`}
                        detail="precip_mean"
                        iconClassName="
                            bg-blue-50
                            text-blue-600
                        "
                    />


                    {/* TEMPERATURA MEDIA */}

                    <FactorItem
                        icon={
                            <Thermometer
                                size={15}
                            />
                        }
                        label="Temperatura media"
                        value={`${formatNumber(
                            factors.temp_mean
                        )} °C`}
                        detail="temp_mean"
                        iconClassName="
                            bg-orange-50
                            text-orange-500
                        "
                    />


                    {/* TEMPERATURA MÁXIMA */}

                    <FactorItem
                        icon={
                            <Thermometer
                                size={15}
                            />
                        }
                        label="Temperatura máxima"
                        value={`${formatNumber(
                            factors.temp_max_mean
                        )} °C`}
                        detail="temp_max_mean"
                        iconClassName="
                            bg-red-50
                            text-red-500
                        "
                    />


                    {/* TEMPERATURA MÍNIMA */}

                    <FactorItem
                        icon={
                            <Thermometer
                                size={15}
                            />
                        }
                        label="Temperatura mínima"
                        value={`${formatNumber(
                            factors.temp_min_mean
                        )} °C`}
                        detail="temp_min_mean"
                        iconClassName="
                            bg-cyan-50
                            text-cyan-600
                        "
                    />


                    {/* HUMEDAD */}

                    <FactorItem
                        icon={
                            <Droplets
                                size={15}
                            />
                        }
                        label="Humedad relativa"
                        value={`${formatNumber(
                            factors.rh_mean
                        )} %`}
                        detail="rh_mean"
                        iconClassName="
                            bg-sky-50
                            text-sky-600
                        "
                    />

                </div>

            </div>


            {/* ============================================================
                CONDICIÓN EPIDEMIOLÓGICA
            ============================================================ */}

            <div className="mt-4">

                <p
                    className="
                        mb-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-slate-400
                    "
                >
                    Condición epidemiológica
                </p>


                <FactorItem
                    icon={
                        <Activity
                            size={15}
                        />
                    }
                    label="Casos previos"
                    value={`${formatNumber(
                        factors.dengue_lag1,
                        0
                    )}`}
                    detail="dengue_lag1 · rezago de 1 periodo"
                    iconClassName="
                        bg-violet-50
                        text-violet-600
                    "
                />

            </div>


            {/* ============================================================
                ACLARACIÓN
            ============================================================ */}

            <div
                className="
                    mt-4
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
                        text-[9px]
                        leading-[14px]
                        text-amber-700
                    "
                >
                    Estos valores corresponden al último estado disponible
                    utilizado por el modelo como semilla predictiva para
                    {` ${response.municipality}`}. No corresponden a condiciones
                    climáticas en tiempo real.
                </p>

            </div>

        </article>

    );

}