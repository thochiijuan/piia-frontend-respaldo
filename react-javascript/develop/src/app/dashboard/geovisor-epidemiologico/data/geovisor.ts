/**
 * ============================================================================
 * OPCIÓN GENÉRICA PARA FILTROS
 * ----------------------------------------------------------------------------
 * Estructura reutilizable para las opciones de los diferentes selectores
 * del Geovisor Epidemiológico.
 * ============================================================================
 */
export interface GeovisorFilterOption {

    /**
     * Valor utilizado internamente por el sistema.
     */
    value: string;

    /**
     * Texto mostrado al usuario.
     */
    label: string;

}

/**
 * ============================================================================
 * OPCIONES DE FILTROS DEL GEOVISOR
 * ----------------------------------------------------------------------------
 * Define la información disponible en los filtros superiores.
 *
 * En producción estos valores podrán provenir del Backend.
 * ============================================================================
 */
export interface GeovisorFilterOptions {

    /**
     * Años disponibles.
     */
    years: GeovisorFilterOption[];

    /**
     * Semanas epidemiológicas disponibles.
     */
    epidemiologicalWeeks: GeovisorFilterOption[];

    /**
     * Enfermedades disponibles.
     */
    diseases: GeovisorFilterOption[];

    /**
     * Indicadores disponibles.
     */
    indicators: GeovisorFilterOption[];

    /**
     * Direcciones territoriales disponibles.
     */
    territorialDirections: GeovisorFilterOption[];

}

/**
 * ============================================================================
 * FILTROS SELECCIONADOS
 * ----------------------------------------------------------------------------
 * Representa el estado actual de los filtros del Geovisor.
 * ============================================================================
 */
export interface GeovisorSelectedFilters {

    year: string;

    epidemiologicalWeek: string;

    disease: string;

    indicator: string;

    territorialDirection: string;

}