"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CloudRain,
    Droplets,
    Info,
    Loader2,
    MapPin,
    Thermometer,
} from "lucide-react";

import type {
    PredictionMunicipality,
} from "../data/predictionApi";

import type {
    MunicipalityWeatherSummary,
} from "../data/weatherApi";

import {
    getMunicipalityWeather,
} from "../services/weatherApi.service";


/* ============================================================================
   PROPS
============================================================================ */

interface PredictionScenariosProps {

    municipalities:
        PredictionMunicipality[];

    selectedMunicipalityCode:
        string;

}


/* ============================================================================
   FORMATO
============================================================================ */

function formatNumber(
    value: number,
    decimals = 1
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
   TARJETA DE VARIABLE
============================================================================ */

interface WeatherMetricProps {

    label: string;

    value: string;

    icon: React.ReactNode;

    iconClassName: string;

}


function WeatherMetric({

    label,

    value,

    icon,

    iconClassName,

}: WeatherMetricProps) {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50/50
                px-3
                py-3
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

                <div
                    className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        ${iconClassName}
                    `}
                >
                    {icon}
                </div>


                <span
                    className="
                        text-[14px]
                        font-bold
                        text-slate-800
                    "
                >
                    {value}
                </span>

            </div>


            <p
                className="
                    mt-2
                    text-[8px]
                    font-semibold
                    text-slate-500
                "
            >
                {label}
            </p>

        </div>

    );

}


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionScenarios({

    municipalities,

    selectedMunicipalityCode,

}: PredictionScenariosProps) {

    const [
        weather,
        setWeather,
    ] = useState<MunicipalityWeatherSummary | null>(
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
       CARGA DE OPEN-METEO
    ============================================================ */

    useEffect(() => {

        let cancelled =
            false;


        async function loadWeather() {

            if (
                !selectedMunicipality
            ) {

                setWeather(
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


                const response =
                    await getMunicipalityWeather(
                        selectedMunicipality.code,
                        selectedMunicipality.name
                    );


                if (
                    cancelled
                ) {
                    return;
                }


                setWeather(
                    response
                );

            }
            catch (
                loadError
            ) {

                console.error(
                    "Error cargando escenario meteorológico:",
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
                        : "No fue posible cargar el contexto meteorológico."
                );


                setWeather(
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


        void loadWeather();


        return () => {

            cancelled =
                true;

        };

    }, [
        selectedMunicipality,
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
                        Consultando contexto meteorológico...
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
        !weather
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
                    Escenario meteorológico
                </h2>


                <p
                    className="
                        mt-4
                        text-[10px]
                        text-red-500
                    "
                >
                    {error ??
                        "No fue posible obtener los datos meteorológicos."}
                </p>

            </article>

        );

    }


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
                            Escenario meteorológico
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
                        Contexto climático complementario · próximas 24 horas
                    </p>

                </div>


                <span
                    className="
                        shrink-0
                        rounded-lg
                        border
                        border-blue-100
                        bg-blue-50
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-blue-700
                    "
                >
                    Open-Meteo
                </span>

            </div>


            {/* ========================================================
                MUNICIPIO
            ======================================================== */}

            <div
                className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50/40
                    px-3
                    py-2.5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <MapPin
                        size={14}
                        className="
                            text-violet-600
                        "
                    />


                    <div>

                        <p
                            className="
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Municipio seleccionado
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-[11px]
                                font-bold
                                text-slate-700
                            "
                        >
                            {weather.municipalityName}
                        </p>

                    </div>

                </div>


                <div
                    className="
                        text-right
                    "
                >

                    <p
                        className="
                            text-[7px]
                            text-slate-400
                        "
                    >
                        Coordenadas
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[8px]
                            font-semibold
                            text-slate-500
                        "
                    >
                        {formatNumber(
                            weather.latitude,
                            3
                        )}
                        {", "}
                        {formatNumber(
                            weather.longitude,
                            3
                        )}
                    </p>

                </div>

            </div>


            {/* ========================================================
                MÉTRICAS PRINCIPALES
            ======================================================== */}

            <div
                className="
                    mt-3
                    grid
                    grid-cols-2
                    gap-2
                    xl:grid-cols-5
                "
            >

                <WeatherMetric
                    label="Temp. media"
                    value={`${formatNumber(
                        weather
                            .next24Hours
                            .temperatureMean,
                        1
                    )} °C`}
                    icon={
                        <Thermometer
                            size={15}
                        />
                    }
                    iconClassName="
                        bg-orange-50
                        text-orange-500
                    "
                />


                <WeatherMetric
                    label="Temp. mínima"
                    value={`${formatNumber(
                        weather
                            .next24Hours
                            .temperatureMin,
                        1
                    )} °C`}
                    icon={
                        <Thermometer
                            size={15}
                        />
                    }
                    iconClassName="
                        bg-cyan-50
                        text-cyan-600
                    "
                />


                <WeatherMetric
                    label="Temp. máxima"
                    value={`${formatNumber(
                        weather
                            .next24Hours
                            .temperatureMax,
                        1
                    )} °C`}
                    icon={
                        <Thermometer
                            size={15}
                        />
                    }
                    iconClassName="
                        bg-red-50
                        text-red-500
                    "
                />


                <WeatherMetric
                    label="Humedad media"
                    value={`${formatNumber(
                        weather
                            .next24Hours
                            .relativeHumidityMean,
                        0
                    )} %`}
                    icon={
                        <Droplets
                            size={15}
                        />
                    }
                    iconClassName="
                        bg-sky-50
                        text-sky-600
                    "
                />


                <WeatherMetric
                    label="Precipitación total"
                    value={`${formatNumber(
                        weather
                            .next24Hours
                            .precipitationTotal,
                        2
                    )} mm`}
                    icon={
                        <CloudRain
                            size={15}
                        />
                    }
                    iconClassName="
                        bg-blue-50
                        text-blue-600
                    "
                />

            </div>


            {/* ========================================================
                CONDICIONES ACTUALES
            ======================================================== */}

            <div
                className="
                    mt-3
                    grid
                    grid-cols-3
                    gap-2
                "
            >

                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-2
                    "
                >

                    <p
                        className="
                            text-[7px]
                            text-slate-400
                        "
                    >
                        Temperatura actual
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            font-bold
                            text-slate-700
                        "
                    >
                        {formatNumber(
                            weather.current.temperature,
                            1
                        )}
                        {" °C"}
                    </p>

                </div>


                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-2
                    "
                >

                    <p
                        className="
                            text-[7px]
                            text-slate-400
                        "
                    >
                        Humedad actual
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            font-bold
                            text-slate-700
                        "
                    >
                        {formatNumber(
                            weather.current.relativeHumidity,
                            0
                        )}
                        {" %"}
                    </p>

                </div>


                <div
                    className="
                        rounded-lg
                        border
                        border-slate-200
                        px-3
                        py-2
                    "
                >

                    <p
                        className="
                            text-[7px]
                            text-slate-400
                        "
                    >
                        Precipitación actual
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            font-bold
                            text-slate-700
                        "
                    >
                        {formatNumber(
                            weather.current.precipitation,
                            2
                        )}
                        {" mm"}
                    </p>

                </div>

            </div>


            {/* ========================================================
                EXPLICACIÓN
            ======================================================== */}

            <div
                className="
                    mt-3
                    rounded-lg
                    border
                    border-blue-100
                    bg-blue-50/40
                    px-3
                    py-2.5
                "
            >

                <p
                    className="
                        text-[8px]
                        leading-[13px]
                        text-blue-700
                    "
                >
                    Este panel presenta el contexto meteorológico del
                    municipio seleccionado para las próximas 24 horas.
                    Los valores se obtienen de Open-Meteo y se muestran
                    como información complementaria al análisis
                    epidemiológico.
                </p>

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
                Open-Meteo no modifica ni alimenta el modelo predictivo
                de Dengue.
            </p>

        </article>

    );

}