import type {
    GeovisorFilterOptions,
} from "./geovisor";

/**
 * ============================================================================
 * MOCK - FILTROS DEL GEOVISOR EPIDEMIOLÓGICO
 * ----------------------------------------------------------------------------
 * Datos simulados utilizados para poblar los filtros superiores
 * del Geovisor Epidemiológico.
 *
 * Posteriormente estos valores podrán ser reemplazados por información
 * proveniente de los servicios del Backend.
 * ============================================================================
 */
export const geovisorFilterOptionsMock: GeovisorFilterOptions = {

    /**
     * ========================================================================
     * AÑOS
     * ========================================================================
     */
    years: [

        {
            value: "2025",
            label: "2025",
        },

        {
            value: "2026",
            label: "2026",
        },

    ],

    /**
     * ========================================================================
     * SEMANAS EPIDEMIOLÓGICAS
     * ========================================================================
     */
    epidemiologicalWeeks: Array.from(
        { length: 52 },
        (_, index) => {

            const week = index + 1;

            return {
                value: String(week),
                label: `Semana ${week}`,
            };

        }
    ),

    /**
     * ========================================================================
     * ENFERMEDADES
     * ========================================================================
     */
    diseases: [

        {
            value: "all",
            label: "Todas",
        },

        {
            value: "dengue",
            label: "Dengue",
        },

        {
            value: "ira",
            label: "IRA",
        },

    ],

    /**
     * ========================================================================
     * INDICADORES
     * ========================================================================
     */
    indicators: [

        {
            value: "incidence-rate",
            label: "Tasa de incidencia",
        },

        {
            value: "confirmed-cases",
            label: "Casos confirmados",
        },

        {
            value: "accumulated-cases",
            label: "Casos acumulados",
        },

    ],

    /**
     * ========================================================================
     * DIRECCIONES TERRITORIALES
     * ========================================================================
     */
    territorialDirections: [

        {
            value: "all",
            label: "Todas",
        },

        {
            value: "atlantico",
            label: "Atlántico",
        },

        {
            value: "norte-santander",
            label: "Norte de Santander",
        },

        {
            value: "huila",
            label: "Huila",
        },

        {
            value: "cauca",
            label: "Cauca",
        },

        {
            value: "guaviare",
            label: "Guaviare",
        },

    ],

};