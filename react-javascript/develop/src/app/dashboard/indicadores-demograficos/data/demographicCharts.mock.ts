import type {
    AgeGroupData,
    GenderData,
    LifeCycleData,
    IncidenceRateData,
    SocioeconomicStratumData,
    DemographicKeyIndicatorData,
    DemographicInsightData,
} from "./demographicCharts";

/**
 * ============================================================================
 * MOCK - GRÁFICOS DEMOGRÁFICOS
 * ============================================================================
 */

/**
 * ============================================================================
 * Casos por grupo de edad
 * ============================================================================
 */
export const ageGroupMock: AgeGroupData[] = [

    {
        ageGroup: "<1 Año",
        dengue: 45,
        ira: 37,
    },

    {
        ageGroup: "1 a 4",
        dengue: 27,
        ira: 30,
    },

    {
        ageGroup: "5 a 9",
        dengue: 30,
        ira: 56,
    },

    {
        ageGroup: "10 a 14",
        dengue: 27,
        ira: 35,
    },

    {
        ageGroup: "15 a 19",
        dengue: 34,
        ira: 67,
    },

    {
        ageGroup: "20 a 29",
        dengue: 34,
        ira: 23,
    },

    {
        ageGroup: "30 a 39",
        dengue: 34,
        ira: 21,
    },

    {
        ageGroup: "40 a 49",
        dengue: 24,
        ira: 45,
    },

    {
        ageGroup: "50 a 59",
        dengue: 34,
        ira: 33,
    },

    {
        ageGroup: "60 años y más",
        dengue: 32,
        ira: 45,
    },

];

/**
 * ============================================================================
 * Casos por sexo
 * ============================================================================
 */
export const genderMock: GenderData[] = [

    {
        gender: "Masculino",
        cases: 6652,
        percentage: 52.6,
    },

    {
        gender: "Femenino",
        cases: 5994,
        percentage: 47.4,
    },

];

/**
 * ============================================================================
 * Casos por ciclo de vida
 * ============================================================================
 */
export const lifeCycleMock: LifeCycleData[] = [

    {
        stage: "Primera infancia",
        ageRange: "(0 - 5 años)",
        dengue: 1245,
        ira: 1976,
    },

    {
        stage: "Infancia",
        ageRange: "(6 - 11 años)",
        dengue: 1102,
        ira: 3167,
    },

    {
        stage: "Adolescencia",
        ageRange: "(12 - 17 años)",
        dengue: 1239,
        ira: 1788,
    },

    {
        stage: "Juventud",
        ageRange: "(18 - 28 años)",
        dengue: 2145,
        ira: 2356,
    },

    {
        stage: "Adulto",
        ageRange: "(29 - 59 años)",
        dengue: 3200,
        ira: 3987,
    },

    {
        stage: "Adulto Mayor",
        ageRange: "(60 años y más)",
        dengue: 1899,
        ira: 2489,
    },

];

/**
 * ============================================================================
 * Tasa de incidencia por grupo de edad
 * ----------------------------------------------------------------------------
 * Datos simulados de la tasa de incidencia de Dengue e IRA
 * por cada 100.000 habitantes.
 * ============================================================================
 */
export const incidenceRateMock: IncidenceRateData[] = [

    {
        ageGroup: "< 1 año",
        dengue: 40,
        ira: 27,
    },

    {
        ageGroup: "1 a 4 años",
        dengue: 25,
        ira: 35,
    },

    {
        ageGroup: "5 a 14 años",
        dengue: 30,
        ira: 55,
    },

    {
        ageGroup: "15 años y más",
        dengue: 17,
        ira: 30,
    },

];

/**
 * ============================================================================
 * Casos por estrato socioeconómico
 * ----------------------------------------------------------------------------
 * Datos simulados para representar múltiples áreas y líneas
 * superpuestas según la distribución por estrato socioeconómico.
 *
 * Ya no se utiliza la separación por Dengue e IRA en este gráfico.
 * ============================================================================
 */
export const socioeconomicStratumMock: SocioeconomicStratumData[] = [

    {
        category: "Estrato 1",
        estrato1: 45,
        estrato2: 40,
        estrato3: 33,
        estrato4: 27,
        estrato5a6: 35,
    },

    {
        category: "Estrato 2",
        estrato1: 12,
        estrato2: 26,
        estrato3: 40,
        estrato4: 35,
        estrato5a6: 42,
    },

    {
        category: "Estrato 3",
        estrato1: 13,
        estrato2: 31,
        estrato3: 56,
        estrato4: 40,
        estrato5a6: 40,
    },

    {
        category: "Estrato 4",
        estrato1: 5,
        estrato2: 17,
        estrato3: 42,
        estrato4: 48,
        estrato5a6: 34,
    },

    {
        category: "Estrato 5 a 6",
        estrato1: 0,
        estrato2: 0,
        estrato3: 0,
        estrato4: 0,
        estrato5a6: 0,
    },

];

/**
 * ============================================================================
 * Indicadores demográficos claves
 * ----------------------------------------------------------------------------
 * Datos simulados de los principales indicadores demográficos.
 *
 * Cada indicador contiene una serie de valores históricos utilizados
 * para construir su minigráfico de tendencia.
 * ============================================================================
 */
export const demographicKeyIndicatorsMock:
    DemographicKeyIndicatorData[] = [

    {
        id: "youth-dependency",
        title: "Tasa de dependencia juvenil",
        description: "Población < 15 años / 15 - 64 años",
        value: 48.7,
        status: "Alta dependencia",
        theme: "blue",
        trend: [28, 35, 42, 52, 63, 56],
    },

    {
        id: "elderly-dependency",
        title: "Tasa de dependencia de mayores",
        description: "Población > 60 años / 15 - 64 años",
        value: 48.7,
        status: "Dependencia moderada",
        theme: "purple",
        trend: [20, 24, 30, 50, 62, 28],
    },

    {
        id: "population-aging",
        title: "Envejecimiento poblacional",
        description: "Índice de envejecimiento",
        value: 48.7,
        status: "Alta dependencia",
        theme: "orange",
        trend: [18, 28, 38, 55, 68, 58],
    },

    {
        id: "masculinity-ratio",
        title: "Relación de masculinidad",
        description: "Población masculina / femenina x 100",
        value: 48.7,
        status: "Dependencia moderada",
        theme: "green",
        trend: [28, 35, 42, 52, 63, 20],
    },

];

/**
 * ============================================================================
 * Hallazgos y recomendaciones demográficas
 * ----------------------------------------------------------------------------
 * Datos simulados para las tarjetas informativas inferiores
 * del módulo de indicadores demográficos.
 * ============================================================================
 */
export const demographicInsightsMock: DemographicInsightData[] = [

    {
        id: "demographic-finding",
        type: "finding",
        title: "Hallazgos demográficos",
        description:
            "Los grupos de edad entre 20 y 59 años concentran el 55.1% de los casos totales. La mayor tasa de incidencia se presenta en menores de 5 años para IRA y en población de 20 a 29 años para Dengue.",
    },

    {
        id: "demographic-recommendation",
        type: "recommendation",
        title: "Recomendación",
        description:
            "Fortalecer intervenciones en primera infancia y adultos jóvenes. Implementar estrategias diferenciadas por curso de vida.",
    },

];