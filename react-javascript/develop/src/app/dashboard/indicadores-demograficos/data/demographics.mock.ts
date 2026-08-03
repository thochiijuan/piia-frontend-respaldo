import { DemographicSummary } from "./demographicSummary";

/**
 * ============================================================================
 * MOCK - INDICADORES DEMOGRÁFICOS
 * ----------------------------------------------------------------------------
 * Datos simulados utilizados durante el desarrollo del módulo.
 *
 * En producción esta información será reemplazada por la respuesta
 * del Backend.
 * ============================================================================
 */

export const demographicSummaryMock: DemographicSummary = {

    cards: [

        {

            id: "population",

            title: "Población total (Área de estudio)",

            value: "5.843.367",

            description: "Habitantes",

            color: "#3B82F6",

            icon: "users",

        },

        {

            id: "under15",

            title: "Casos en población < 15 años",

            value: "3.452",

            description: "27.3% del total",

            color: "#F59E0B",

            icon: "baby",

        },

        {

            id: "over60",

            title: "Casos en población > 60 años",

            value: "2.184",

            description: "17.2% del total",

            color: "#6B7280",

            icon: "personStanding"

        },

        {

            id: "genderRatio",

            title: "Razón masculino : femenino",

            value: "17 - 10",

            description: "La incidencia en hombres supera en 34% a la población femenina",

            color: "#7C3AED",

            icon: "venusMars",

        },

        {

            id: "dependency",

            title: "Índice de dependencia",

            value: "48.7",

            description: "Alta proporción de población vulnerable",

            color: "#10B981",

            icon: "chart",

        }

    ]

};