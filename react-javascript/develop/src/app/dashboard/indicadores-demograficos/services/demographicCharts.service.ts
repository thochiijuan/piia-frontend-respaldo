import {

    ageGroupMock,

    genderMock,

    lifeCycleMock,

} from "../data/demographicCharts.mock";

import {

    AgeGroupData,

    GenderData,

    LifeCycleData,

} from "../data/demographicCharts";

/**
 * ============================================================================
 * SERVICIO - GRÁFICOS DEMOGRÁFICOS
 * ----------------------------------------------------------------------------
 * Centraliza la obtención de datos para los gráficos del módulo
 * Indicadores Demográficos.
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