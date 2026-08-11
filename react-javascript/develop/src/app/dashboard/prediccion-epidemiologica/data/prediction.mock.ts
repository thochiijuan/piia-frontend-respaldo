import type {
    PredictionSummaryData,
} from "./prediction";


/**
 * ============================================================================
 * MOCK - TARJETAS SUPERIORES
 * ============================================================================
 */
export const predictionSummaryMock:
    PredictionSummaryData[] = [

    {
        id: "epidemic-risk",
        title: "Riesgo epidémico (Próx. 4 semanas)",
        value: "ALTO",
        description: "Probabilidad de brote: 78%",
        theme: "red",
        type: "risk",
        trend: [
            48,
            58,
            53,
            64,
            72,
            62,
            69,
            65,
            78,
        ],
    },

    {
        id: "observed-cases",
        title: "Casos observados (SE 1-17)",
        value: "28.745",
        description: "↑ 18.7% vs mismo periodo 2025",
        theme: "blue",
        type: "observed",
        trend: [
            19,
            25,
            23,
            29,
            25,
            32,
            28,
            36,
        ],
    },

    {
        id: "expected-cases",
        title: "Casos esperados (Modelo)",
        value: "32.650",
        description: "Intervalo: 28.100 - 37.200",
        theme: "purple",
        type: "expected",
        trend: [
            24,
            31,
            31,
            29,
            31,
            30,
            28,
            35,
        ],
    },

    {
        id: "high-risk-municipalities",
        title: "Municipios en riesgo alto",
        value: 48,
        description: "De 1.123 municipios",
        theme: "orange",
        type: "municipalities",
        trend: [
            31,
            34,
            34,
            34,
            36,
            38,
            36,
            41,
        ],
    },

    {
        id: "critical-climate-variables",
        title: "Variables climáticas críticas",
        value: "T°, Lluvia, Humedad",
        description: "Impacto: Alto",
        theme: "cyan",
        type: "climate",
        climateVariables: [
            "temperature",
            "rain",
            "humidity",
        ],
    },

    {
        id: "model-confidence",
        title: "Confianza del modelo",
        value: "82%",
        description: "Alta",
        theme: "green",
        type: "confidence",
        confidence: 82,
    },

];