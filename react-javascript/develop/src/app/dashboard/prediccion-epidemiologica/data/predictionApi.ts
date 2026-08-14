/**
 * ============================================================================
 * predictionApi.ts
 * ----------------------------------------------------------------------------
 * Contratos de datos utilizados para integrar el módulo de
 * Predicción Epidemiológica con la API de predicción de Dengue.
 *
 * IMPORTANTE:
 *
 * La API actualmente disponible corresponde exclusivamente al:
 *
 * DEPARTAMENTO DEL HUILA
 *
 * y realiza predicciones para sus 36 municipios.
 *
 * El modelo predictivo corresponde únicamente a:
 *
 * DENGUE
 *
 * Actualmente NO existen datos predictivos de IRA en esta API.
 *
 * Horizonte predictivo:
 *
 * t+1
 * t+2
 * t+3
 * t+4 semanas
 *
 * ============================================================================
 */


/**
 * ============================================================================
 * HORIZONTE DE PREDICCIÓN
 * ----------------------------------------------------------------------------
 * La API trabaja con cuatro modelos XGBoost.
 *
 * Cada modelo predice un horizonte diferente:
 *
 * 1 = +1 semana
 * 2 = +2 semanas
 * 3 = +3 semanas
 * 4 = +4 semanas
 * ============================================================================
 */
export type PredictionHorizon =
    | 1
    | 2
    | 3
    | 4;


/**
 * ============================================================================
 * MUNICIPIO
 * ----------------------------------------------------------------------------
 * Respuesta de:
 *
 * GET /api/v1/municipalities
 *
 * La API devuelve los municipios disponibles del departamento del Huila.
 * ============================================================================
 */
export interface PredictionMunicipality {

    /**
     * Código territorial del municipio.
     *
     * Se mantiene como string porque representa un código,
     * no una cantidad matemática.
     *
     * Ejemplo:
     *
     * "41006"
     */
    code: string;


    /**
     * Nombre del municipio.
     *
     * Ejemplo:
     *
     * "Acevedo"
     */
    name: string;


    /**
     * Población utilizada por la API.
     */
    population: number;

}


/**
 * ============================================================================
 * RANGO DE VARIABLE
 * ----------------------------------------------------------------------------
 * Estructura devuelta por:
 *
 * GET /api/v1/climate-ranges
 *
 * Cada variable contiene estadísticas observadas en los datos
 * utilizados por el modelo.
 * ============================================================================
 */
export interface PredictionVariableRange {

    /**
     * Valor mínimo observado.
     */
    min: number;


    /**
     * Valor máximo observado.
     */
    max: number;


    /**
     * Valor promedio observado.
     */
    mean: number;


    /**
     * Desviación estándar.
     */
    std: number;

}


/**
 * ============================================================================
 * RANGOS DE VARIABLES DEL MODELO
 * ============================================================================
 */
export interface PredictionClimateRanges {

    /**
     * Precipitación media.
     */
    precip_mean: PredictionVariableRange;


    /**
     * Temperatura media.
     */
    temp_mean: PredictionVariableRange;


    /**
     * Temperatura máxima media.
     */
    temp_max_mean: PredictionVariableRange;


    /**
     * Temperatura mínima media.
     */
    temp_min_mean: PredictionVariableRange;


    /**
     * Humedad relativa media.
     */
    rh_mean: PredictionVariableRange;


    /**
     * Casos de Dengue de la semana anterior.
     *
     * IMPORTANTE:
     *
     * Esta variable NO es climática.
     * Es una variable epidemiológica rezagada.
     */
    dengue_lag1: PredictionVariableRange;

}


/**
 * ============================================================================
 * RESPUESTA DE RANGOS
 * ----------------------------------------------------------------------------
 * GET /api/v1/climate-ranges
 * ============================================================================
 */
export interface PredictionClimateRangesResponse {

    ranges: PredictionClimateRanges;

}


/**
 * ============================================================================
 * VARIABLES DE ENTRADA DEL MODELO
 * ----------------------------------------------------------------------------
 * Estas son las variables enviadas al endpoint de predicción.
 *
 * Se utilizarán posteriormente para:
 *
 * - Predicción base.
 * - Simulación de escenarios.
 * - Modificación de condiciones climáticas.
 * ============================================================================
 */
export interface PredictionClimateInput {

    /**
     * Precipitación media.
     */
    precip_mean: number;


    /**
     * Temperatura media.
     */
    temp_mean: number;


    /**
     * Temperatura máxima media.
     */
    temp_max_mean: number;


    /**
     * Temperatura mínima media.
     */
    temp_min_mean: number;


    /**
     * Humedad relativa media.
     */
    rh_mean: number;


    /**
     * Casos de Dengue en la semana anterior.
     */
    dengue_lag1: number;

}


/**
 * ============================================================================
 * REQUEST DE PREDICCIÓN MUNICIPAL
 * ----------------------------------------------------------------------------
 * POST /api/v1/predict
 * ============================================================================
 */
export interface MunicipalityPredictionRequest {

    /**
     * Nombre del municipio del Huila.
     *
     * Ejemplo:
     *
     * "Acevedo"
     */
    municipality: string;


    /**
     * Condiciones utilizadas por el modelo.
     */
    climate: PredictionClimateInput;

}


/**
 * ============================================================================
 * REQUEST PARA TODOS LOS MUNICIPIOS
 * ----------------------------------------------------------------------------
 * POST /api/v1/predict/all
 *
 * A diferencia del endpoint municipal, este no recibe un municipio.
 *
 * La API ejecuta la predicción para los 36 municipios del Huila.
 * ============================================================================
 */
export interface AllMunicipalitiesPredictionRequest {

    climate: PredictionClimateInput;

}


/**
 * ============================================================================
 * PREDICCIÓN DE UNA SEMANA
 * ----------------------------------------------------------------------------
 * Representa un horizonte individual dentro del forecast.
 *
 * Ejemplo:
 *
 * week = 1
 *
 * significa:
 *
 * t+1 semana
 * ============================================================================
 */
export interface WeekForecast {

    /**
     * Horizonte futuro.
     *
     * 1
     * 2
     * 3
     * 4
     */
    week: PredictionHorizon;


    /**
     * Número de casos predichos.
     *
     * La API puede devolver valores decimales.
     *
     * Ejemplo real observado:
     *
     * 4.8
     */
    predicted_cases: number;


    /**
     * Incidencia calculada por la API.
     */
    incidence: number;


    /**
     * Nivel de riesgo calculado por el backend.
     *
     * Ejemplos observados:
     *
     * "Bajo"
     * "Medio"
     *
     * El frontend NO debe recalcular este valor.
     */
    risk_level: string;


    /**
     * Color asociado al nivel de riesgo.
     *
     * Ejemplo observado:
     *
     * "#CA8A04"
     */
    risk_color: string;

}


/**
 * ============================================================================
 * PREDICCIÓN MUNICIPAL
 * ----------------------------------------------------------------------------
 * Respuesta de:
 *
 * POST /api/v1/predict
 *
 * También forma parte de:
 *
 * POST /api/v1/predict/all
 * ============================================================================
 */
export interface MunicipalityForecast {

    /**
     * Nombre del municipio.
     */
    municipality: string;


    /**
     * Código territorial.
     */
    municipality_code: string;


    /**
     * Población.
     */
    population: number;


    /**
     * Fecha generada por la API para la predicción.
     *
     * Formato observado:
     *
     * YYYY-MM-DD
     */
    prediction_date: string;


    /**
     * Predicciones para:
     *
     * t+1
     * t+2
     * t+3
     * t+4
     */
    forecast: WeekForecast[];

}


/**
 * ============================================================================
 * PREDICCIÓN PARA TODOS LOS MUNICIPIOS DEL HUILA
 * ----------------------------------------------------------------------------
 * POST /api/v1/predict/all
 * ============================================================================
 */
export interface AllMunicipalitiesForecast {

    /**
     * Fecha de ejecución de la predicción.
     */
    prediction_date: string;


    /**
     * Horizonte seleccionado para visualización.
     *
     * Principalmente utilizado por el mapa.
     */
    horizon: PredictionHorizon;


    /**
     * Predicciones municipales.
     *
     * Actualmente corresponde a los 36 municipios del Huila.
     */
    items: MunicipalityForecast[];

}


/**
 * ============================================================================
 * PUNTO HISTÓRICO
 * ----------------------------------------------------------------------------
 * GET /api/v1/history/{municipality}
 * ============================================================================
 */
export interface PredictionHistoryPoint {

    /**
     * Fecha real del dato observado.
     *
     * Formato:
     *
     * YYYY-MM-DD
     */
    date: string;


    /**
     * Casos observados.
     */
    cases: number;

}


/**
 * ============================================================================
 * RESPUESTA HISTÓRICA
 * ----------------------------------------------------------------------------
 * GET /api/v1/history/{municipality}
 *
 * IMPORTANTE:
 *
 * Los puntos devueltos por la API NO necesariamente corresponden
 * a semanas consecutivas.
 *
 * El frontend debe respetar las fechas reales entregadas por la API.
 * ============================================================================
 */
export interface PredictionHistoryResponse {

    /**
     * Municipio consultado.
     */
    municipality: string;


    /**
     * Código territorial.
     */
    municipality_code: string;


    /**
     * Serie histórica observada.
     */
    points: PredictionHistoryPoint[];

}


/**
 * ============================================================================
 * MÉTRICA POR HORIZONTE
 * ----------------------------------------------------------------------------
 * GET /api/v1/metrics
 *
 * Las métricas corresponden a la evaluación de cada modelo
 * por horizonte predictivo.
 * ============================================================================
 */
export interface PredictionHorizonMetric {

    /**
     * Horizonte:
     *
     * 1 = t+1
     * 2 = t+2
     * 3 = t+3
     * 4 = t+4
     */
    horizon: PredictionHorizon;


    /**
     * Mean Absolute Error.
     *
     * Error absoluto medio.
     */
    mae: number;


    /**
     * Root Mean Squared Error.
     */
    rmse: number;


    /**
     * Coeficiente de determinación.
     *
     * IMPORTANTE:
     *
     * R² NO debe mostrarse como porcentaje de "confianza".
     */
    r2: number;


    /**
     * Mean Absolute Percentage Error.
     */
    mape: number;

}


/**
 * ============================================================================
 * RESPUESTA DE MÉTRICAS
 * ----------------------------------------------------------------------------
 * GET /api/v1/metrics
 * ============================================================================
 */
export interface PredictionMetricsResponse {

    metrics: PredictionHorizonMetric[];

}


/**
 * ============================================================================
 * ESTADO GENERAL DEL MÓDULO PREDICTIVO
 * ----------------------------------------------------------------------------
 * Esta interfaz NO viene directamente de la API.
 *
 * Es una estructura del frontend que posteriormente utilizaremos para
 * consolidar la información necesaria por el dashboard.
 *
 * Nos permitirá evitar que cada componente consulte la API por separado.
 * ============================================================================
 */
export interface PredictionDashboardState {

    /**
     * Municipio seleccionado.
     */
    municipality:
        PredictionMunicipality | null;


    /**
     * Horizonte seleccionado.
     */
    horizon:
        PredictionHorizon;


    /**
     * Predicción municipal.
     */
    municipalityForecast:
        MunicipalityForecast | null;


    /**
     * Histórico observado.
     */
    history:
        PredictionHistoryResponse | null;


    /**
     * Métricas del modelo.
     */
    metrics:
        PredictionMetricsResponse | null;


    /**
     * Rangos de variables.
     */
    climateRanges:
        PredictionClimateRangesResponse | null;

}