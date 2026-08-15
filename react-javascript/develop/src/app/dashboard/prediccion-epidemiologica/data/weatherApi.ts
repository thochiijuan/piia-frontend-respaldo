/**
 * ============================================================================
 * weatherApi.ts
 * ----------------------------------------------------------------------------
 * Contratos utilizados para integrar Open-Meteo como fuente meteorológica
 * complementaria del módulo de Predicción Epidemiológica.
 *
 * IMPORTANTE:
 *
 * Open-Meteo NO modifica el modelo predictivo de Dengue.
 *
 * Sus datos se utilizarán únicamente como contexto meteorológico en:
 *
 * - Alertas predictivas
 * - Recomendaciones
 * - Escenarios de riesgo
 *
 * ============================================================================
 */


/* ============================================================================
   COORDENADAS MUNICIPALES
============================================================================ */

export interface MunicipalityCoordinates {

    code: string;

    name: string;

    latitude: number;

    longitude: number;

}


/* ============================================================================
   UNIDADES HORARIAS DEVUELTAS POR OPEN-METEO
============================================================================ */

export interface OpenMeteoHourlyUnits {

    time: string;

    temperature_2m: string;

    relative_humidity_2m: string;

    precipitation: string;

}


/* ============================================================================
   DATOS HORARIOS
============================================================================ */

export interface OpenMeteoHourly {

    time: string[];

    temperature_2m: number[];

    relative_humidity_2m: number[];

    precipitation: number[];

}


/* ============================================================================
   RESPUESTA DIRECTA DE OPEN-METEO
============================================================================ */

export interface OpenMeteoForecastResponse {

    latitude: number;

    longitude: number;

    generationtime_ms: number;

    utc_offset_seconds: number;

    timezone: string;

    timezone_abbreviation: string;

    elevation: number;

    hourly_units: OpenMeteoHourlyUnits;

    hourly: OpenMeteoHourly;

}


/* ============================================================================
   PUNTO METEOROLÓGICO HORARIO NORMALIZADO
============================================================================ */

export interface WeatherHourlyPoint {

    time: string;

    temperature: number;

    relativeHumidity: number;

    precipitation: number;

}


/* ============================================================================
   RESUMEN METEOROLÓGICO DEL MUNICIPIO
============================================================================ */

export interface MunicipalityWeatherSummary {

    municipalityCode: string;

    municipalityName: string;

    latitude: number;

    longitude: number;

    timezone: string;

    generatedAt: string;

    current: {

        temperature: number;

        relativeHumidity: number;

        precipitation: number;

    };

    next24Hours: {

        temperatureMean: number;

        temperatureMin: number;

        temperatureMax: number;

        relativeHumidityMean: number;

        precipitationTotal: number;

    };

    hourly: WeatherHourlyPoint[];

}