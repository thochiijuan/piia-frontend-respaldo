/**
 * ============================================================================
 * weatherApi.service.ts
 * ----------------------------------------------------------------------------
 * Servicio meteorológico complementario utilizando Open-Meteo.
 *
 * IMPORTANTE:
 *
 * Este servicio NO modifica ni alimenta el modelo predictivo de Dengue.
 *
 * Se utiliza únicamente para proporcionar contexto meteorológico
 * adicional en los componentes finales del dashboard:
 *
 * - Alertas predictivas
 * - Recomendaciones
 * - Escenarios de riesgo
 *
 * ============================================================================
 */

import type {
    MunicipalityWeatherSummary,
    OpenMeteoForecastResponse,
    WeatherHourlyPoint,
} from "../data/weatherApi";


/* ============================================================================
   URLS BASE
============================================================================ */

const OPEN_METEO_GEOCODING_URL =
    "https://geocoding-api.open-meteo.com/v1/search";


const OPEN_METEO_FORECAST_URL =
    "https://api.open-meteo.com/v1/forecast";


/* ============================================================================
   TIPOS INTERNOS DE GEOCODIFICACIÓN
============================================================================ */

interface OpenMeteoGeocodingResult {

    id: number;

    name: string;

    latitude: number;

    longitude: number;

    country_code: string;

    country?: string;

    admin1?: string;

    admin2?: string;

    timezone?: string;

}


interface OpenMeteoGeocodingResponse {

    results?: OpenMeteoGeocodingResult[];

}


/* ============================================================================
   ERROR
============================================================================ */

export class WeatherApiError extends Error {

    status?: number;

    details?: unknown;


    constructor(
        message: string,
        status?: number,
        details?: unknown
    ) {

        super(message);

        this.name =
            "WeatherApiError";

        this.status =
            status;

        this.details =
            details;

    }

}


/* ============================================================================
   UTILIDADES
============================================================================ */

function normalizeText(
    value: string | undefined
): string {

    return (
        value
            ?.normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim()
            .toLowerCase() ??
        ""
    );

}


function average(
    values: number[]
): number {

    if (
        values.length === 0
    ) {
        return 0;
    }


    return (
        values.reduce(
            (
                total,
                value
            ) =>
                total + value,
            0
        ) /
        values.length
    );

}


function sum(
    values: number[]
): number {

    return values.reduce(
        (
            total,
            value
        ) =>
            total + value,
        0
    );

}


/* ============================================================================
   BUSCAR MUNICIPIO
============================================================================ */

async function getMunicipalityCoordinates(
    municipalityName: string
): Promise<OpenMeteoGeocodingResult> {

    const params =
        new URLSearchParams({

            name:
                municipalityName,

            count:
                "20",

            language:
                "es",

            format:
                "json",

            countryCode:
                "CO",

        });


    const response =
        await fetch(
            `${OPEN_METEO_GEOCODING_URL}?${params.toString()}`,
            {
                method:
                    "GET",

                headers: {
                    Accept:
                        "application/json",
                },

                cache:
                    "no-store",
            }
        );


    if (
        !response.ok
    ) {

        throw new WeatherApiError(
            `No fue posible localizar el municipio ${municipalityName}.`,
            response.status
        );

    }


    const data =
        (
            await response.json()
        ) as OpenMeteoGeocodingResponse;


    const results =
        data.results ??
        [];


    /*
     * Open-Meteo puede devolver lugares homónimos.
     *
     * Por eso buscamos preferiblemente:
     *
     * - país Colombia
     * - departamento Huila
     * - mismo nombre del municipio
     */

    const exactHuilaMatch =
        results.find(
            (
                result
            ) =>
                normalizeText(
                    result.name
                ) ===
                    normalizeText(
                        municipalityName
                    ) &&
                normalizeText(
                    result.admin1
                ) ===
                    "huila"
        );


    const huilaMatch =
        results.find(
            (
                result
            ) =>
                normalizeText(
                    result.admin1
                ) ===
                    "huila"
        );


    const exactNameMatch =
        results.find(
            (
                result
            ) =>
                normalizeText(
                    result.name
                ) ===
                    normalizeText(
                        municipalityName
                    )
        );


    const municipality =
        exactHuilaMatch ??
        huilaMatch ??
        exactNameMatch ??
        results[0];


    if (
        !municipality
    ) {

        throw new WeatherApiError(
            `Open-Meteo no encontró coordenadas para ${municipalityName}.`
        );

    }


    return municipality;

}


/* ============================================================================
   OBTENER PRONÓSTICO
============================================================================ */

async function getOpenMeteoForecast(
    latitude: number,
    longitude: number
): Promise<OpenMeteoForecastResponse> {

    const params =
        new URLSearchParams({

            latitude:
                latitude.toString(),

            longitude:
                longitude.toString(),

            hourly:
                [
                    "temperature_2m",
                    "relative_humidity_2m",
                    "precipitation",
                ].join(","),

            timezone:
                "America/Bogota",

            forecast_days:
                "7",

        });


    const response =
        await fetch(
            `${OPEN_METEO_FORECAST_URL}?${params.toString()}`,
            {
                method:
                    "GET",

                headers: {
                    Accept:
                        "application/json",
                },

                cache:
                    "no-store",
            }
        );


    if (
        !response.ok
    ) {

        throw new WeatherApiError(
            "No fue posible obtener el pronóstico meteorológico.",
            response.status
        );

    }


    return (
        await response.json()
    ) as OpenMeteoForecastResponse;

}


/* ============================================================================
   CONSTRUIR PUNTOS HORARIOS
============================================================================ */

function createHourlyPoints(
    response: OpenMeteoForecastResponse
): WeatherHourlyPoint[] {

    return response.hourly.time.map(
        (
            time,
            index
        ) => ({

            time,

            temperature:
                response
                    .hourly
                    .temperature_2m[
                        index
                    ] ??
                0,

            relativeHumidity:
                response
                    .hourly
                    .relative_humidity_2m[
                        index
                    ] ??
                0,

            precipitation:
                response
                    .hourly
                    .precipitation[
                        index
                    ] ??
                0,

        })
    );

}


/* ============================================================================
   OBTENER RESUMEN METEOROLÓGICO MUNICIPAL
============================================================================ */

export async function getMunicipalityWeather(
    municipalityCode: string,
    municipalityName: string
): Promise<MunicipalityWeatherSummary> {

    /*
     * Paso 1:
     * Resolver coordenadas a partir del municipio seleccionado.
     */

    const location =
        await getMunicipalityCoordinates(
            municipalityName
        );


    /*
     * Paso 2:
     * Consultar Open-Meteo.
     */

    const forecast =
        await getOpenMeteoForecast(
            location.latitude,
            location.longitude
        );


    /*
     * Paso 3:
     * Normalizar los datos horarios.
     */

    const hourly =
        createHourlyPoints(
            forecast
        );


    /*
     * Open-Meteo devuelve el pronóstico desde las
     * 00:00 del día actual.
     *
     * Para obtener realmente las próximas 24 horas,
     * buscamos el primer registro cuya hora sea >= ahora.
     */

    const now =
        new Date();


    let currentIndex =
        hourly.findIndex(
            (
                point
            ) =>
                new Date(
                    point.time
                ).getTime() >=
                now.getTime()
        );


    if (
        currentIndex === -1
    ) {

        currentIndex =
            0;

    }


    const next24 =
        hourly.slice(
            currentIndex,
            currentIndex + 24
        );


    const current =
        hourly[
            currentIndex
        ] ??
        hourly[0];


    if (
        !current
    ) {

        throw new WeatherApiError(
            "Open-Meteo no devolvió datos meteorológicos."
        );

    }


    const temperatures =
        next24.map(
            (
                point
            ) =>
                point.temperature
        );


    const humidities =
        next24.map(
            (
                point
            ) =>
                point.relativeHumidity
        );


    const precipitation =
        next24.map(
            (
                point
            ) =>
                point.precipitation
        );


    return {

        municipalityCode,

        municipalityName,

        latitude:
            location.latitude,

        longitude:
            location.longitude,

        timezone:
            forecast.timezone,

        generatedAt:
            new Date().toISOString(),

        current: {

            temperature:
                current.temperature,

            relativeHumidity:
                current.relativeHumidity,

            precipitation:
                current.precipitation,

        },

        next24Hours: {

            temperatureMean:
                average(
                    temperatures
                ),

            temperatureMin:
                temperatures.length > 0
                    ? Math.min(
                        ...temperatures
                    )
                    : 0,

            temperatureMax:
                temperatures.length > 0
                    ? Math.max(
                        ...temperatures
                    )
                    : 0,

            relativeHumidityMean:
                average(
                    humidities
                ),

            precipitationTotal:
                sum(
                    precipitation
                ),

        },

        hourly:

            /*
             * Para los componentes finales conservamos
             * los próximos 7 días horarios.
             */

            hourly,

    };

}