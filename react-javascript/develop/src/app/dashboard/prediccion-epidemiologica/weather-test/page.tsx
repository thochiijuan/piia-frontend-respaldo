"use client";

import {
    useState,
} from "react";

import {
    CloudRain,
    Droplets,
    Loader2,
    MapPin,
    Thermometer,
} from "lucide-react";

import type {
    MunicipalityWeatherSummary,
} from "../data/weatherApi";

import {
    getMunicipalityWeather,
} from "../services/weatherApi.service";


/* ============================================================================
   MUNICIPIOS DE PRUEBA

   El código se utiliza únicamente para mantener
   consistencia con el catálogo predictivo.

   La búsqueda meteorológica se realiza por nombre.
============================================================================ */

const TEST_MUNICIPALITIES = [

    {
        code: "41001",
        name: "Neiva",
    },

    {
        code: "41298",
        name: "Garzón",
    },

    {
        code: "41006",
        name: "Acevedo",
    },

    {
        code: "41551",
        name: "Pitalito",
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
   PÁGINA DE PRUEBA
============================================================================ */

export default function WeatherTestPage() {

    const [
        selectedCode,
        setSelectedCode,
    ] = useState<string>(
        "41001"
    );


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
        false
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
        TEST_MUNICIPALITIES.find(
            (
                municipality
            ) =>
                municipality.code ===
                selectedCode
        ) ??
        TEST_MUNICIPALITIES[0];


    /* ============================================================
       CONSULTAR OPEN-METEO
    ============================================================ */

    async function handleLoadWeather() {

        if (
            !selectedMunicipality
        ) {
            return;
        }


        try {

            setLoading(
                true
            );

            setError(
                null
            );

            setWeather(
                null
            );


            const response =
                await getMunicipalityWeather(
                    selectedMunicipality.code,
                    selectedMunicipality.name
                );


            setWeather(
                response
            );

        }
        catch (
            loadError
        ) {

            console.error(
                "Error consultando Open-Meteo:",
                loadError
            );


            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "No fue posible consultar Open-Meteo."
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <main
            className="
                min-h-screen
                bg-slate-50
                p-6
            "
        >

            <div
                className="
                    mx-auto
                    max-w-5xl
                    space-y-4
                "
            >

                {/* ========================================================
                    HEADER
                ======================================================== */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <h1
                        className="
                            text-[22px]
                            font-bold
                            text-slate-800
                        "
                    >
                        Prueba Open-Meteo
                    </h1>


                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-500
                        "
                    >
                        Contexto meteorológico independiente del modelo
                        predictivo de Dengue.
                    </p>

                </div>


                {/* ========================================================
                    CONTROLES
                ======================================================== */}

                <div
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            md:flex-row
                            md:items-end
                        "
                    >

                        <div
                            className="
                                flex-1
                            "
                        >

                            <label
                                htmlFor="weather-test-municipality"
                                className="
                                    mb-1
                                    block
                                    text-[10px]
                                    font-semibold
                                    text-slate-500
                                "
                            >
                                Municipio
                            </label>


                            <select
                                id="weather-test-municipality"
                                value={
                                    selectedCode
                                }
                                onChange={(
                                    event
                                ) => {

                                    setSelectedCode(
                                        event.target.value
                                    );

                                    setWeather(
                                        null
                                    );

                                    setError(
                                        null
                                    );

                                }}
                                className="
                                    h-10
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    text-[11px]
                                    font-semibold
                                    text-slate-700
                                    outline-none
                                    focus:border-violet-300
                                    focus:ring-2
                                    focus:ring-violet-100
                                "
                            >

                                {TEST_MUNICIPALITIES.map(
                                    (
                                        municipality
                                    ) => (

                                        <option
                                            key={
                                                municipality.code
                                            }
                                            value={
                                                municipality.code
                                            }
                                        >
                                            {municipality.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <button
                            type="button"
                            onClick={
                                handleLoadWeather
                            }
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-violet-600
                                px-5
                                text-[11px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-violet-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {loading ? (

                                <Loader2
                                    size={15}
                                    className="
                                        animate-spin
                                    "
                                />

                            ) : (

                                <CloudRain
                                    size={15}
                                />

                            )}


                            {loading
                                ? "Consultando..."
                                : "Consultar clima"}

                        </button>

                    </div>

                </div>


                {/* ========================================================
                    ERROR
                ======================================================== */}

                {error && (

                    <div
                        className="
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            p-4
                        "
                    >

                        <p
                            className="
                                text-[11px]
                                font-semibold
                                text-red-700
                            "
                        >
                            Error consultando Open-Meteo
                        </p>


                        <p
                            className="
                                mt-1
                                text-[10px]
                                text-red-600
                            "
                        >
                            {error}
                        </p>

                    </div>

                )}


                {/* ========================================================
                    RESULTADO
                ======================================================== */}

                {weather && (

                    <>

                        {/* ====================================================
                            UBICACIÓN
                        ==================================================== */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
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
                                    size={17}
                                    className="
                                        text-violet-600
                                    "
                                />


                                <h2
                                    className="
                                        text-[17px]
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    {weather.municipalityName}
                                </h2>

                            </div>


                            <div
                                className="
                                    mt-3
                                    grid
                                    grid-cols-1
                                    gap-2
                                    text-[10px]
                                    text-slate-500
                                    md:grid-cols-3
                                "
                            >

                                <div>
                                    Código:{" "}
                                    <strong>
                                        {weather.municipalityCode}
                                    </strong>
                                </div>


                                <div>
                                    Latitud:{" "}
                                    <strong>
                                        {formatNumber(
                                            weather.latitude,
                                            5
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    Longitud:{" "}
                                    <strong>
                                        {formatNumber(
                                            weather.longitude,
                                            5
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* ====================================================
                            CONDICIONES ACTUALES
                        ==================================================== */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-3
                            "
                        >

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                    shadow-sm
                                "
                            >

                                <Thermometer
                                    size={18}
                                    className="
                                        text-orange-500
                                    "
                                />


                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        text-slate-400
                                    "
                                >
                                    Temperatura actual
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[20px]
                                        font-bold
                                        text-slate-800
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
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                    shadow-sm
                                "
                            >

                                <Droplets
                                    size={18}
                                    className="
                                        text-sky-600
                                    "
                                />


                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        text-slate-400
                                    "
                                >
                                    Humedad actual
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[20px]
                                        font-bold
                                        text-slate-800
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
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                    shadow-sm
                                "
                            >

                                <CloudRain
                                    size={18}
                                    className="
                                        text-blue-600
                                    "
                                />


                                <p
                                    className="
                                        mt-2
                                        text-[9px]
                                        text-slate-400
                                    "
                                >
                                    Precipitación actual
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[20px]
                                        font-bold
                                        text-slate-800
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


                        {/* ====================================================
                            PRÓXIMAS 24 HORAS
                        ==================================================== */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
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
                                Próximas 24 horas
                            </h2>


                            <div
                                className="
                                    mt-4
                                    grid
                                    grid-cols-2
                                    gap-3
                                    md:grid-cols-5
                                "
                            >

                                <WeatherValue
                                    label="Temp. media"
                                    value={`${formatNumber(
                                        weather
                                            .next24Hours
                                            .temperatureMean,
                                        1
                                    )} °C`}
                                />


                                <WeatherValue
                                    label="Temp. mínima"
                                    value={`${formatNumber(
                                        weather
                                            .next24Hours
                                            .temperatureMin,
                                        1
                                    )} °C`}
                                />


                                <WeatherValue
                                    label="Temp. máxima"
                                    value={`${formatNumber(
                                        weather
                                            .next24Hours
                                            .temperatureMax,
                                        1
                                    )} °C`}
                                />


                                <WeatherValue
                                    label="Humedad media"
                                    value={`${formatNumber(
                                        weather
                                            .next24Hours
                                            .relativeHumidityMean,
                                        0
                                    )} %`}
                                />


                                <WeatherValue
                                    label="Precipitación total"
                                    value={`${formatNumber(
                                        weather
                                            .next24Hours
                                            .precipitationTotal,
                                        2
                                    )} mm`}
                                />

                            </div>

                        </div>


                        {/* ====================================================
                            INFORMACIÓN TÉCNICA
                        ==================================================== */}

                        <div
                            className="
                                rounded-xl
                                border
                                border-amber-100
                                bg-amber-50
                                px-4
                                py-3
                            "
                        >

                            <p
                                className="
                                    text-[9px]
                                    leading-[14px]
                                    text-amber-700
                                "
                            >
                                Estos datos provienen de Open-Meteo y se
                                utilizan únicamente como contexto
                                meteorológico. No modifican ni alimentan el
                                modelo predictivo de Dengue.
                            </p>

                        </div>

                    </>

                )}

            </div>

        </main>

    );

}


/* ============================================================================
   TARJETA SIMPLE
============================================================================ */

interface WeatherValueProps {

    label: string;

    value: string;

}


function WeatherValue({

    label,

    value,

}: WeatherValueProps) {

    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50
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
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-[12px]
                    font-bold
                    text-slate-700
                "
            >
                {value}
            </p>

        </div>

    );

}