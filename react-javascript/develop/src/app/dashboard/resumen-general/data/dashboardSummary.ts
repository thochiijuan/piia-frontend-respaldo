/**
 * ============================================================================
 * dashboardSummary.ts
 * ----------------------------------------------------------------------------
 * Define los contratos de datos utilizados por el módulo
 * "Resumen General".
 *
 * Responsabilidades:
 * - Definir la estructura esperada por el Dashboard.
 * - Garantizar el tipado de la información.
 * - Servir como contrato entre el Frontend y el Backend.
 *
 * Este archivo no contiene lógica de negocio ni datos.
 * Únicamente describe la forma que deben tener los objetos.
 *
 * Flujo:
 *
 * Backend/API
 *      │
 *      ▼
 * DashboardSummary
 *      │
 *      ▼
 * dashboard.service.ts
 *      │
 *      ▼
 * Componentes React
 * ============================================================================
 */


/**
 * Representa el número de casos registrados
 * durante una semana epidemiológica.
 */
export interface WeeklyCase {

    /** Semana epidemiológica */
    week: string;

    /** Casos de Dengue */
    dengue: number;

    /** Casos de IRA */
    ira: number;

}

/**
 * Modelo principal del Dashboard de Resumen General.
 *
 * Agrupa toda la información necesaria para construir
 * la interfaz principal del Dashboard.
 */
export interface DashboardSummary {

    /**
     * Indicadores principales mostrados
     * en las tarjetas superiores.
     */
    indicators: {

        totalCases: number;

        dengueCases: number;

        iraCases: number;

        weeklyVariation: number;

        newCases: number;

    };

    /**
     * Casos agrupados por semana epidemiológica.
     */
    weeklyCases: WeeklyCase[];

}