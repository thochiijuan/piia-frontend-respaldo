/**
 * ============================================================================
 * Dashboard Summary Mock
 * ----------------------------------------------------------------------------
 * Contiene la información simulada utilizada por el módulo
 * "Resumen General" del Dashboard.
 *
 * Objetivo:
 *
 * Permitir el desarrollo y las pruebas del frontend sin depender
 * de la disponibilidad del backend o de la API.
 *
 * Cuando el backend esté disponible, este archivo podrá conservarse
 * para pruebas locales o ser reemplazado por información real.
 *
 * Flujo:
 *
 * dashboardSummary.mock.ts
 *        │
 *        ▼
 * dashboard.service.ts
 *        │
 *        ▼
 * Componentes del Dashboard
 * ============================================================================
 */

import type {
    DashboardSummary,
} from "./dashboardSummary";


/**
 * ============================================================================
 * DATOS SIMULADOS DEL DASHBOARD
 * ============================================================================
 */
export const dashboardSummaryMock:
    DashboardSummary = {

    /**
     * ========================================================================
     * INDICADORES PRINCIPALES
     * ----------------------------------------------------------------------------
     * Información utilizada por las cuatro tarjetas superiores.
     * ========================================================================
     */
    indicators: {

        totalCases: 33000,

        dengueCases: 17000,

        iraCases: 13000,

        weeklyVariation: 12.4,

        newCases: 1123,

    },


    /**
     * ========================================================================
     * CASOS POR SEMANA EPIDEMIOLÓGICA
     * ----------------------------------------------------------------------------
     * Estos datos alimentan:
     *
     * - La gráfica principal de casos por semana.
     * - La minigráfica de barras de Variación semanal.
     *
     * En la minigráfica:
     *
     * Dengue = primera barra.
     * IRA    = segunda barra.
     * ========================================================================
     */
    weeklyCases: [

        {
            week: "1",

            dengue: 40,

            ira: 27,
        },

        {
            week: "2",

            dengue: 25,

            ira: 35,
        },

        {
            week: "3",

            dengue: 30,

            ira: 56,
        },

        {
            week: "4",

            dengue: 17,

            ira: 30,
        },

    ],


    /**
     * ========================================================================
     * TENDENCIAS PARA LAS MINIGRÁFICAS
     * ----------------------------------------------------------------------------
     * Estas series se utilizan únicamente en las tres primeras tarjetas.
     *
     * Cada posición representa una semana epidemiológica consecutiva.
     * ========================================================================
     */
    trends: {

        /**
         * --------------------------------------------------------------------
         * CASOS TOTALES
         * --------------------------------------------------------------------
         * Minigráfica azul.
         */
        totalCases: [

            67,

            60,

            86,

            47,

        ],


        /**
         * --------------------------------------------------------------------
         * DENGUE
         * --------------------------------------------------------------------
         * Minigráfica morada.
         */
        dengueCases: [

            40,

            25,

            30,

            17,

        ],


        /**
         * --------------------------------------------------------------------
         * IRA
         * --------------------------------------------------------------------
         * Minigráfica verde.
         */
        iraCases: [

            27,

            35,

            56,

            30,

        ],

    },

};