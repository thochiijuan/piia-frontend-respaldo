import {
    geovisorFilterOptionsMock,
    diseaseSummaryMock,
    municipalityRankingMock,
    geographicQuickFilterOptionsMock,
    healthUnitLegendMock,
    departmentCasesMock,
    spatialDistributionMock,
    epidemiologicalMapPointsMock,
    departmentEpidemiologicalMapMock,
} from "../data/geovisor.mock";

import type {
    GeovisorFilterOptions,
    DiseaseSummaryData,
    MunicipalityRankingData,
    MunicipalityRankingDisease,
    GeographicQuickFilterOptions,
    HealthUnitLegendData,
    DepartmentCasesData,
    SpatialDistributionData,
    EpidemiologicalMapPointData,
    DepartmentEpidemiologicalMapData,
} from "../data/geovisor";



/**
 * ============================================================================
 * SERVICIO - GEOVISOR EPIDEMIOLÓGICO
 * ----------------------------------------------------------------------------
 * Centraliza la obtención de información utilizada por el Geovisor.
 *
 * Actualmente consume datos Mock.
 * Posteriormente podrá consumir los servicios reales del Backend.
 * ============================================================================
 */

/**
 * ============================================================================
 * Obtiene las opciones disponibles para los filtros superiores
 * ============================================================================
 */
export async function getGeovisorFilterOptions(): Promise<
    GeovisorFilterOptions
> {

    return Promise.resolve(
        geovisorFilterOptionsMock
    );

}

/**
 * ============================================================================
 * Obtiene la información resumen de las enfermedades
 * Dengue e IRA.
 * ============================================================================
 */
export async function getDiseaseSummaryData(): Promise<
    DiseaseSummaryData[]
> {

    return Promise.resolve(
        diseaseSummaryMock
    );

}

/**
 * ============================================================================
 * Obtiene el ranking de municipios por tasa de incidencia
 * ----------------------------------------------------------------------------
 * El parámetro disease permite consultar el ranking correspondiente
 * a Dengue o IRA.
 * ============================================================================
 */
export async function getMunicipalityRankingData(
    disease: MunicipalityRankingDisease
): Promise<MunicipalityRankingData[]> {

    return Promise.resolve(
        municipalityRankingMock[disease]
    );

}

/**
 * ============================================================================
 * Obtiene filtros geográficos rápidos
 * ============================================================================
 */
export async function getGeographicQuickFilterOptions():
    Promise<GeographicQuickFilterOptions> {

    return Promise.resolve(
        geographicQuickFilterOptionsMock
    );

}


/**
 * ============================================================================
 * Obtiene leyenda de unidades de salud
 * ============================================================================
 */
export async function getHealthUnitLegendData():
    Promise<HealthUnitLegendData[]> {

    return Promise.resolve(
        healthUnitLegendMock
    );

}


/**
 * ============================================================================
 * Obtiene casos por departamento
 * ============================================================================
 */
export async function getDepartmentCasesData():
    Promise<DepartmentCasesData[]> {

    return Promise.resolve(
        departmentCasesMock
    );

}


/**
 * ============================================================================
 * Obtiene configuración de distribución espacial
 * ============================================================================
 */
export async function getSpatialDistributionData():
    Promise<SpatialDistributionData> {

    return Promise.resolve(
        spatialDistributionMock
    );

}

/**
 * ============================================================================
 * Obtiene los puntos epidemiológicos mostrados en el mapa
 * ============================================================================
 */
export async function getEpidemiologicalMapPoints():
    Promise<EpidemiologicalMapPointData[]> {

    return Promise.resolve(
        epidemiologicalMapPointsMock
    );

}

/**
 * ============================================================================
 * Obtiene la información epidemiológica por departamento
 * ============================================================================
 */
export async function getDepartmentEpidemiologicalMapData():
    Promise<DepartmentEpidemiologicalMapData[]> {

    return Promise.resolve(
        departmentEpidemiologicalMapMock
    );

}