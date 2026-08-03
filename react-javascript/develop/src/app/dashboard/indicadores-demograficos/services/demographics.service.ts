import { demographicSummaryMock } from "../data/demographics.mock";

/**
 * ============================================================================
 * SERVICIO - INDICADORES DEMOGRÁFICOS
 * ----------------------------------------------------------------------------
 * Responsable de suministrar la información utilizada por el módulo
 * Indicadores Demográficos.
 *
 * Actualmente retorna datos Mock.
 *
 * En producción realizará la consulta al Backend mediante la API.
 * ============================================================================
 */

export async function getDemographicSummary() {

    return demographicSummaryMock;

}