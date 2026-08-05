import {

    ageGroupMock,

    genderMock,

    lifeCycleMock,

    incidenceRateMock,

    socioeconomicStratumMock,

    demographicKeyIndicatorsMock,

    demographicInsightsMock,

} from "../data/demographicCharts.mock";

import type {

    AgeGroupData,

    GenderData,

    LifeCycleData,

    IncidenceRateData,

    SocioeconomicStratumData,

    DemographicKeyIndicatorData,

    DemographicInsightData,

} from "../data/demographicCharts";

/**
 * ============================================================================
 * SERVICIO - GRÁFICOS DEMOGRÁFICOS
 * ----------------------------------------------------------------------------
 * Centraliza la obtención de datos para los gráficos y tarjetas
 * del módulo Indicadores Demográficos.
 *
 * Actualmente utiliza datos Mock.
 * En producción consumirá la API del Backend.
 * ============================================================================
 */

/**
 * Obtiene la información del gráfico
 * Casos por grupo de edad.
 */
export async function getAgeGroupData(): Promise<AgeGroupData[]> {

    return Promise.resolve(ageGroupMock);

}

/**
 * Obtiene la información del gráfico
 * Casos por sexo.
 */
export async function getGenderData(): Promise<GenderData[]> {

    return Promise.resolve(genderMock);

}

/**
 * Obtiene la información del gráfico
 * Casos por ciclo de vida.
 */
export async function getLifeCycleData(): Promise<LifeCycleData[]> {

    return Promise.resolve(lifeCycleMock);

}

/**
 * Obtiene la información del gráfico
 * Tasa de incidencia por grupo de edad.
 */
export async function getIncidenceRateData(): Promise<IncidenceRateData[]> {

    return Promise.resolve(incidenceRateMock);

}

/**
 * Obtiene la información del gráfico
 * Casos por estrato socioeconómico.
 */
export async function getSocioeconomicStratumData(): Promise<
    SocioeconomicStratumData[]
> {

    return Promise.resolve(socioeconomicStratumMock);

}

/**
 * Obtiene la información de la tarjeta
 * Indicadores demográficos claves.
 */
export async function getDemographicKeyIndicatorsData(): Promise<
    DemographicKeyIndicatorData[]
> {

    return Promise.resolve(demographicKeyIndicatorsMock);

}

/**
 * Obtiene la información de las tarjetas
 * Hallazgos demográficos y recomendación.
 */
export async function getDemographicInsightsData(): Promise<
    DemographicInsightData[]
> {

    return Promise.resolve(demographicInsightsMock);

}