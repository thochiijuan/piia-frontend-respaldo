import {
    geovisorFilterOptionsMock,
} from "../data/geovisor.mock";

import type {
    GeovisorFilterOptions,
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

    return Promise.resolve(geovisorFilterOptionsMock);

}