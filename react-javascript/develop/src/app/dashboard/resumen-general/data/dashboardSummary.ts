/**
 * ============================================================================
 * dashboardSummary.ts
 * ----------------------------------------------------------------------------
 * Define los contratos de datos utilizados por el módulo
 * "Resumen General".
 *
 * Responsabilidades:
 *
 * - Definir la estructura esperada por el Dashboard.
 * - Garantizar el tipado de la información.
 * - Servir como contrato entre el Frontend y el Backend.
 *
 * Este archivo no contiene lógica de negocio ni datos.
 * Únicamente describe la forma que deben tener los objetos.
 *
 * Flujo:
 *
 * Backend / API
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
 * ============================================================================
 * CASOS POR SEMANA EPIDEMIOLÓGICA
 * ----------------------------------------------------------------------------
 * Representa los casos registrados de Dengue e IRA durante una
 * semana epidemiológica.
 *
 * Esta estructura es utilizada por:
 *
 * - La gráfica principal "Casos por semana epidemiológica".
 * - La minigráfica de barras de la tarjeta "Variación semanal".
 *
 * Eje X = Semana epidemiológica.
 * Eje Y = Número de casos.
 * ============================================================================
 */
export interface WeeklyCase {

    /**
     * Semana epidemiológica.
     *
     * Ejemplo:
     * "1", "2", "3", "4"
     */
    week: string;

    /**
     * Número de casos de Dengue registrados
     * durante la semana.
     */
    dengue: number;

    /**
     * Número de casos de IRA registrados
     * durante la semana.
     */
    ira: number;

}


/**
 * ============================================================================
 * MODELO PRINCIPAL DEL DASHBOARD
 * ----------------------------------------------------------------------------
 * Agrupa toda la información necesaria para construir el módulo
 * "Resumen General".
 * ============================================================================
 */
export interface DashboardSummary {

    /**
     * ========================================================================
     * INDICADORES PRINCIPALES
     * ----------------------------------------------------------------------------
     * Información utilizada por las cuatro tarjetas superiores.
     * ========================================================================
     */
    indicators: {

        /**
         * Total general de casos reportados.
         */
        totalCases: number;

        /**
         * Total acumulado de casos de Dengue.
         */
        dengueCases: number;

        /**
         * Total acumulado de casos de IRA.
         */
        iraCases: number;

        /**
         * Variación porcentual respecto al periodo anterior.
         */
        weeklyVariation: number;

        /**
         * Número de casos nuevos registrados.
         */
        newCases: number;

    };


    /**
     * ========================================================================
     * CASOS POR SEMANA EPIDEMIOLÓGICA
     * ----------------------------------------------------------------------------
     * Contiene la distribución semanal de Dengue e IRA.
     *
     * También alimenta la minigráfica de barras de
     * "Variación semanal".
     * ========================================================================
     */
    weeklyCases: WeeklyCase[];


    /**
     * ========================================================================
     * TENDENCIAS DE LAS TARJETAS SUPERIORES
     * ----------------------------------------------------------------------------
     * Series simplificadas utilizadas únicamente por las minigráficas
     * compactas de las tarjetas.
     *
     * El orden de los valores corresponde al orden temporal de las semanas.
     * ========================================================================
     */
    trends: {

        /**
         * Tendencia del total general de casos.
         *
         * Utilizada por:
         * Casos Totales.
         */
        totalCases: number[];

        /**
         * Tendencia de casos de Dengue.
         *
         * Utilizada por:
         * Dengue.
         */
        dengueCases: number[];

        /**
         * Tendencia de casos de IRA.
         *
         * Utilizada por:
         * IRA.
         */
        iraCases: number[];

    };

}