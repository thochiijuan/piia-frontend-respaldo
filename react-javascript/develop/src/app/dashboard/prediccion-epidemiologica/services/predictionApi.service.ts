/**
 * ============================================================================
 * predictionApi.service.ts
 * ----------------------------------------------------------------------------
 * Servicio encargado de comunicar el módulo de Predicción Epidemiológica
 * con la API de predicción de Dengue.
 *
 * COBERTURA ACTUAL DE LA API
 * ----------------------------------------------------------------------------
 *
 * Departamento:
 * Huila
 *
 * Municipios:
 * 36 municipios del Huila
 *
 * Enfermedad:
 * Dengue
 *
 * Horizonte:
 * t+1
 * t+2
 * t+3
 * t+4 semanas
 *
 * ============================================================================
 *
 * ENDPOINTS UTILIZADOS
 *
 * GET
 * /api/v1/municipalities
 *
 * GET
 * /api/v1/municipality-factors/{municipality}
 *
 * GET
 * /api/v1/climate-ranges
 *
 * GET
 * /api/v1/metrics
 *
 * GET
 * /api/v1/history/{municipality}
 *
 * POST
 * /api/v1/predict
 *
 * POST
 * /api/v1/predict/all
 *
 * ============================================================================
 *
 * IMPORTANTE
 *
 * Los componentes visuales NO deben llamar directamente a fetch().
 *
 * Flujo:
 *
 * FastAPI
 *    ↓
 * predictionApi.service.ts
 *    ↓
 * componentes / dashboard
 *
 * Esto permitirá cambiar posteriormente la URL de la API o incluso
 * utilizar un proxy de Next.js sin modificar todos los componentes.
 *
 * ============================================================================
 */

import type {
    AllMunicipalitiesForecast,
    AllMunicipalitiesPredictionRequest,
    MunicipalityForecast,
    MunicipalityPredictionRequest,
    PredictionClimateInput,
    PredictionClimateRangesResponse,
    PredictionHistoryResponse,
    PredictionHorizon,
    PredictionHorizonMetric,
    PredictionMetricsResponse,
    PredictionMunicipality,
    PredictionMunicipalityFactorsResponse,
    WeekForecast,
} from "../data/predictionApi";


/**
 * ============================================================================
 * URL BASE DE LA API
 * ----------------------------------------------------------------------------
 * Para desarrollo local:
 *
 * http://localhost:8000
 *
 * Posteriormente podremos colocar esta URL en:
 *
 * .env.local
 *
 * NEXT_PUBLIC_PREDICTION_API_URL=http://localhost:8000
 *
 * ============================================================================
 */
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";


/**
 * ============================================================================
 * ERROR PERSONALIZADO DE LA API
 * ============================================================================
 */
export class PredictionApiError extends Error {

    status: number;

    details?: unknown;


    constructor(
        message: string,
        status: number,
        details?: unknown
    ) {

        super(message);

        this.name =
            "PredictionApiError";

        this.status =
            status;

        this.details =
            details;

    }

}


/**
 * ============================================================================
 * PROCESAR RESPUESTA HTTP
 * ----------------------------------------------------------------------------
 * Centralizamos aquí el manejo de errores.
 *
 * De esta manera evitamos repetir:
 *
 * if (!response.ok)
 *
 * dentro de cada función.
 * ============================================================================
 */
async function handleResponse<T>(
    response: Response
): Promise<T> {

    if (
        response.ok
    ) {

        return (
            await response.json()
        ) as T;

    }


    let details:
        unknown = null;


    try {

        details =
            await response.json();

    }
    catch {

        details =
            null;

    }


    let message =
        `Error al consultar la API predictiva (${response.status}).`;


    /**
     * FastAPI normalmente devuelve:
     *
     * {
     *     "detail": "mensaje"
     * }
     */
    if (
        typeof details === "object" &&
        details !== null &&
        "detail" in details
    ) {

        const detail =
            (
                details as {
                    detail?: unknown;
                }
            ).detail;


        if (
            typeof detail ===
            "string"
        ) {

            message =
                detail;

        }

    }


    throw new PredictionApiError(
        message,
        response.status,
        details
    );

}


/**
 * ============================================================================
 * GET MUNICIPALITIES
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * GET /api/v1/municipalities
 *
 * Devuelve exclusivamente los municipios disponibles en la API predictiva.
 *
 * Actualmente:
 *
 * 36 municipios del departamento del Huila.
 * ============================================================================
 */
export async function getPredictionMunicipalities():
    Promise<PredictionMunicipality[]> {

    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/municipalities`,
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


    return handleResponse<
        PredictionMunicipality[]
    >(
        response
    );

}


/**
 * ============================================================================
 * GET MUNICIPALITY FACTORS
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * GET /api/v1/municipality-factors/{municipality}
 *
 * Devuelve los valores base específicos del municipio utilizados
 * como semilla predictiva por el modelo.
 *
 * IMPORTANTE:
 *
 * Estos valores NO son los promedios generales de /climate-ranges.
 *
 * Provienen del último estado disponible del municipio almacenado
 * por el backend en:
 *
 * last_state_per_municipality.parquet
 *
 * Ejemplos:
 *
 * Neiva
 * Garzón
 * Acevedo
 * Pitalito
 *
 * Cada municipio puede tener valores diferentes.
 * ============================================================================
 */
export async function getPredictionMunicipalityFactors(
    municipality: string
): Promise<PredictionMunicipalityFactorsResponse> {

    const encodedMunicipality =
        encodeURIComponent(
            municipality
        );


    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/municipality-factors/${encodedMunicipality}`,
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


    return handleResponse<
        PredictionMunicipalityFactorsResponse
    >(
        response
    );

}


/**
 * ============================================================================
 * GET CLIMATE RANGES
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * GET /api/v1/climate-ranges
 *
 * Devuelve:
 *
 * min
 * max
 * mean
 * std
 *
 * para las variables utilizadas por el modelo.
 * ============================================================================
 */
export async function getPredictionClimateRanges():
    Promise<PredictionClimateRangesResponse> {

    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/climate-ranges`,
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


    return handleResponse<
        PredictionClimateRangesResponse
    >(
        response
    );

}


/**
 * ============================================================================
 * GET METRICS
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * GET /api/v1/metrics
 *
 * Devuelve las métricas de evaluación para:
 *
 * t+1
 * t+2
 * t+3
 * t+4
 *
 * Métricas:
 *
 * MAE
 * RMSE
 * R²
 * MAPE
 * ============================================================================
 */
export async function getPredictionMetrics():
    Promise<PredictionMetricsResponse> {

    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/metrics`,
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


    return handleResponse<
        PredictionMetricsResponse
    >(
        response
    );

}


/**
 * ============================================================================
 * GET HISTORY
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * GET /api/v1/history/{municipality}
 *
 * Parámetros:
 *
 * municipality
 * weeks
 *
 * IMPORTANTE:
 *
 * La API interpreta "weeks" como cantidad de registros históricos
 * solicitados.
 *
 * Los registros NO necesariamente corresponden a semanas consecutivas.
 *
 * Por esa razón el frontend siempre debe utilizar:
 *
 * point.date
 *
 * y nunca inventar fechas intermedias.
 * ============================================================================
 */
export async function getPredictionHistory(
    municipality: string,
    weeks = 12
): Promise<PredictionHistoryResponse> {

    const encodedMunicipality =
        encodeURIComponent(
            municipality
        );


    const safeWeeks =
        Math.min(
            Math.max(
                weeks,
                4
            ),
            1000
        );


    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/history/${encodedMunicipality}?weeks=${safeWeeks}`,
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


    return handleResponse<
        PredictionHistoryResponse
    >(
        response
    );

}


/**
 * ============================================================================
 * PREDICT MUNICIPALITY
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * POST /api/v1/predict
 *
 * Realiza la predicción de Dengue para un municipio específico del Huila.
 *
 * Devuelve:
 *
 * t+1
 * t+2
 * t+3
 * t+4
 *
 * incluyendo:
 *
 * predicted_cases
 * incidence
 * risk_level
 * risk_color
 * ============================================================================
 */
export async function predictMunicipality(
    request:
        MunicipalityPredictionRequest
): Promise<MunicipalityForecast> {

    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/predict`,
            {
                method:
                    "POST",

                headers: {

                    Accept:
                        "application/json",

                    "Content-Type":
                        "application/json",

                },

                body:
                    JSON.stringify(
                        request
                    ),

                cache:
                    "no-store",
            }
        );


    return handleResponse<
        MunicipalityForecast
    >(
        response
    );

}


/**
 * ============================================================================
 * PREDICT ALL MUNICIPALITIES
 * ----------------------------------------------------------------------------
 * Endpoint:
 *
 * POST /api/v1/predict/all?horizon={1..4}
 *
 * Ejecuta la predicción para los 36 municipios del departamento del Huila.
 *
 * Se utilizará principalmente para:
 *
 * - Mapa de riesgo.
 * - Municipios en riesgo alto.
 * - Ranking municipal.
 * - Casos esperados del Huila.
 * - Distribución de riesgo.
 *
 * ============================================================================
 */
export async function predictAllMunicipalities(

    request:
        AllMunicipalitiesPredictionRequest,

    horizon:
        PredictionHorizon

): Promise<AllMunicipalitiesForecast> {

    const response =
        await fetch(
            `${API_BASE_URL}/api/v1/predict/all?horizon=${horizon}`,
            {
                method:
                    "POST",

                headers: {

                    Accept:
                        "application/json",

                    "Content-Type":
                        "application/json",

                },

                body:
                    JSON.stringify(
                        request
                    ),

                cache:
                    "no-store",
            }
        );


    return handleResponse<
        AllMunicipalitiesForecast
    >(
        response
    );

}


/**
 * ============================================================================
 * CREATE MEAN CLIMATE INPUT
 * ----------------------------------------------------------------------------
 * Construye las condiciones iniciales para realizar una predicción utilizando
 * los valores promedio observados entregados por:
 *
 * GET /api/v1/climate-ranges
 *
 * Esto evita enviar:
 *
 * temperatura = 0
 * humedad = 0
 * etc.
 *
 * porque algunos de esos valores estarían fuera de los rangos observados.
 *
 * ============================================================================
 */
export function createMeanClimateInput(
    response:
        PredictionClimateRangesResponse
): PredictionClimateInput {

    const {
        ranges,
    } = response;


    return {

        precip_mean:
            ranges.precip_mean.mean,

        temp_mean:
            ranges.temp_mean.mean,

        temp_max_mean:
            ranges.temp_max_mean.mean,

        temp_min_mean:
            ranges.temp_min_mean.mean,

        rh_mean:
            ranges.rh_mean.mean,

        /**
         * dengue_lag1 representa número de casos.
         *
         * Por eso utilizamos un entero para la predicción inicial.
         */
        dengue_lag1:
            Math.max(
                1,
                Math.round(
                    ranges.dengue_lag1.mean
                )
            ),

    };

}


/**
 * ============================================================================
 * GET FORECAST BY HORIZON
 * ----------------------------------------------------------------------------
 * Busca dentro del forecast la predicción correspondiente al horizonte
 * seleccionado.
 *
 * Ejemplo:
 *
 * horizon = 3
 *
 * devuelve:
 *
 * forecast.week === 3
 * ============================================================================
 */
export function getForecastByHorizon(

    forecast:
        MunicipalityForecast | null,

    horizon:
        PredictionHorizon

): WeekForecast | null {

    if (
        !forecast
    ) {

        return null;

    }


    return (
        forecast.forecast.find(
            (item) =>
                item.week ===
                horizon
        ) ??
        null
    );

}


/**
 * ============================================================================
 * GET METRIC BY HORIZON
 * ----------------------------------------------------------------------------
 * Permite obtener las métricas correspondientes al modelo seleccionado.
 *
 * Ejemplo:
 *
 * horizon = 1
 *
 * →
 *
 * MAE
 * RMSE
 * R²
 * MAPE
 * ============================================================================
 */
export function getMetricByHorizon(

    metrics:
        PredictionMetricsResponse | null,

    horizon:
        PredictionHorizon

): PredictionHorizonMetric | null {

    if (
        !metrics
    ) {

        return null;

    }


    return (
        metrics.metrics.find(
            (metric) =>
                metric.horizon ===
                horizon
        ) ??
        null
    );

}


/**
 * ============================================================================
 * GET LAST OBSERVED POINT
 * ----------------------------------------------------------------------------
 * Obtiene el dato histórico más reciente según la fecha real.
 *
 * NO asumimos que el último elemento del arreglo siempre venga correctamente
 * ordenado.
 * ============================================================================
 */
export function getLastObservedPoint(
    history:
        PredictionHistoryResponse | null
) {

    if (
        !history ||
        history.points.length ===
        0
    ) {

        return null;

    }


    const sortedPoints =
        [
            ...history.points,
        ].sort(
            (
                a,
                b
            ) =>
                new Date(
                    a.date
                ).getTime() -
                new Date(
                    b.date
                ).getTime()
        );


    return (
        sortedPoints[
            sortedPoints.length -
            1
        ] ??
        null
    );

}


/**
 * ============================================================================
 * GET HIGH RISK MUNICIPALITIES
 * ----------------------------------------------------------------------------
 * Obtiene los municipios clasificados por la API como:
 *
 * Alto
 *
 * para el horizonte seleccionado.
 *
 * IMPORTANTE:
 *
 * El frontend NO determina qué significa riesgo alto.
 * Se respeta risk_level calculado por el backend.
 * ============================================================================
 */
export interface ElevatedRiskMunicipality {

    municipality: string;

    municipalityCode: string;

    riskLevel: string;

    riskColor: string;

    predictedCases: number;

    incidence: number;

}


function normalizeRiskLevel(
    value: string | undefined
): string {

    return (
        value
            ?.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase() ?? ""
    );

}


export function getElevatedRiskMunicipalities(
    allForecast: AllMunicipalitiesForecast,
    horizon: PredictionHorizon
): ElevatedRiskMunicipality[] {

    return allForecast.items

        .map((municipalityForecast) => {

            const forecast =
                getForecastByHorizon(
                    municipalityForecast,
                    horizon
                );


            if (!forecast) {
                return null;
            }


            const normalizedRisk =
                normalizeRiskLevel(
                    forecast.risk_level
                );


            const isElevatedRisk =
                normalizedRisk === "alto" ||
                normalizedRisk === "critico";


            if (!isElevatedRisk) {
                return null;
            }


            return {

                municipality:
                    municipalityForecast.municipality,

                municipalityCode:
                    municipalityForecast.municipality_code,

                riskLevel:
                    forecast.risk_level,

                riskColor:
                    forecast.risk_color,

                predictedCases:
                    forecast.predicted_cases,

                incidence:
                    forecast.incidence,

            };

        })

        .filter(
            (
                item
            ): item is ElevatedRiskMunicipality =>
                item !== null
        )

        .sort((a, b) => {

            const riskPriority = (
                level: string
            ) => {

                const normalized =
                    normalizeRiskLevel(level);

                if (normalized === "critico") {
                    return 2;
                }

                if (normalized === "alto") {
                    return 1;
                }

                return 0;

            };


            const priorityDifference =
                riskPriority(b.riskLevel) -
                riskPriority(a.riskLevel);


            if (priorityDifference !== 0) {
                return priorityDifference;
            }


            return b.incidence - a.incidence;

        });

}


/**
 * ============================================================================
 * GET EXPECTED CASES FOR HUILA
 * ----------------------------------------------------------------------------
 * Suma los casos predichos de los 36 municipios del Huila para un horizonte.
 *
 * Ejemplo:
 *
 * +1 semana
 *
 * Acevedo       4.8
 * Agrado        ...
 * Aipe          ...
 * ...
 *
 * TOTAL HUILA   xxx
 *
 * ============================================================================
 */
export function getExpectedCasesForHuila(

    forecast:
        AllMunicipalitiesForecast | null,

    horizon:
        PredictionHorizon

): number {

    if (
        !forecast
    ) {

        return 0;

    }


    return forecast.items.reduce(
        (
            total,
            municipality
        ) => {

            const selectedForecast =
                municipality.forecast.find(
                    (item) =>
                        item.week ===
                        horizon
                );


            return (
                total +
                (
                    selectedForecast
                        ?.predicted_cases ??
                    0
                )
            );

        },
        0
    );

}


/**
 * ============================================================================
 * GET MUNICIPAL FORECAST FROM ALL
 * ----------------------------------------------------------------------------
 * Busca un municipio dentro de la respuesta de /predict/all utilizando
 * preferiblemente su código territorial.
 *
 * Esto será útil para sincronizar:
 *
 * MAPA
 * ↓
 * selección del municipio
 * ↓
 * panel lateral
 * ============================================================================
 */
export function getMunicipalityFromAllForecast(

    forecast:
        AllMunicipalitiesForecast | null,

    municipalityCode:
        string

): MunicipalityForecast | null {

    if (
        !forecast
    ) {

        return null;

    }


    return (
        forecast.items.find(
            (item) =>
                item.municipality_code ===
                municipalityCode
        ) ??
        null
    );

}