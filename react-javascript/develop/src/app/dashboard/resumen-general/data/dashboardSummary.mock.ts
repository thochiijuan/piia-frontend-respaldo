/**
 * ============================================================================
 * Dashboard Summary Mock
 * ----------------------------------------------------------------------------
 * Contiene la información simulada utilizada por el módulo
 * "Resumen General" del Dashboard.
 *
 * Objetivo:
 * Permitir el desarrollo y las pruebas del frontend sin depender
 * de la disponibilidad del backend o de la API.
 *
 * Cuando el backend esté disponible, este archivo podrá conservarse
 * para pruebas locales o eliminarse si ya no es necesario.
 *
 * Flujo:
 *
 * dashboardSummary.mock.ts
 *          │
 *          ▼
 * dashboard.service.ts
 *          │
 *          ▼
 * Componentes del Dashboard
 * ============================================================================
 */

import { DashboardSummary } from "./dashboardSummary";

/**
 * Datos simulados del Dashboard.
 */

export const dashboardSummaryMock: DashboardSummary = {

    /**
     * Indicadores principales mostrados en las tarjetas superiores.
     */

    indicators:{

        totalCases:33000,

        dengueCases:17000,

        iraCases:13000,

        weeklyVariation:12.4,

        newCases:1123

    },

     /**
     * Casos por semana epidemiológica.
     *
     * Nota:
     * Estos valores son temporales y serán reemplazados por los
     * datos obtenidos desde la API.
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

};