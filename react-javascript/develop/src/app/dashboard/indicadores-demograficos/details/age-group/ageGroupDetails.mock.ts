/**
 * ============================================================================
 * ageGroupDetails.mock.ts
 * ----------------------------------------------------------------------------
 * Datos simulados utilizados por el detalle del indicador
 * "Casos por grupo de edad".
 *
 * Este archivo permite desarrollar y probar:
 *
 * - La tabla de detalle.
 * - Los filtros.
 * - Los totales.
 * - La modal.
 *
 * sin depender todavía del backend.
 *
 * Posteriormente:
 *
 * Mock
 *   ↓
 * ageGroupDetails.service.ts
 *   ↓
 * Backend / API
 *
 * ============================================================================
 */

import type {
    AgeGroupDetail,
    AgeGroupDetailsResponse,
} from "./ageGroupDetails";


/**
 * ============================================================================
 * REGISTROS SIMULADOS
 * ----------------------------------------------------------------------------
 * Cada registro representa:
 *
 * Año
 * Semana epidemiológica
 * Región
 * Departamento
 * Municipio
 * Grupo de edad
 * Dengue
 * IRA
 * Total
 *
 * ============================================================================
 */
export const ageGroupDetailsMockData: AgeGroupDetail[] = [

    // ========================================================================
    // HUILA - NEIVA
    // ========================================================================

    {
        id: 1,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "<1 Año",
        dengue: 45,
        ira: 37,
        total: 82,
    },

    {
        id: 2,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "1-4",
        dengue: 27,
        ira: 30,
        total: 57,
    },

    {
        id: 3,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "5-9",
        dengue: 30,
        ira: 56,
        total: 86,
    },

    {
        id: 4,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "10-14",
        dengue: 27,
        ira: 35,
        total: 62,
    },

    {
        id: 5,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "15-19",
        dengue: 34,
        ira: 67,
        total: 101,
    },

    {
        id: 6,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "20-29",
        dengue: 34,
        ira: 23,
        total: 57,
    },

    {
        id: 7,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "30-39",
        dengue: 34,
        ira: 21,
        total: 55,
    },

    {
        id: 8,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "40-49",
        dengue: 24,
        ira: 45,
        total: 69,
    },

    {
        id: 9,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "50-59",
        dengue: 34,
        ira: 33,
        total: 67,
    },

    {
        id: 10,
        year: 2026,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "60+",
        dengue: 32,
        ira: 45,
        total: 77,
    },


    // ========================================================================
    // HUILA - PITALITO
    // ========================================================================

    {
        id: 11,
        year: 2026,
        week: 16,
        region: "Región Andina",
        department: "Huila",
        municipality: "Pitalito",
        ageGroup: "<1 Año",
        dengue: 18,
        ira: 25,
        total: 43,
    },

    {
        id: 12,
        year: 2026,
        week: 16,
        region: "Región Andina",
        department: "Huila",
        municipality: "Pitalito",
        ageGroup: "5-9",
        dengue: 24,
        ira: 39,
        total: 63,
    },

    {
        id: 13,
        year: 2026,
        week: 16,
        region: "Región Andina",
        department: "Huila",
        municipality: "Pitalito",
        ageGroup: "15-19",
        dengue: 29,
        ira: 44,
        total: 73,
    },

    {
        id: 14,
        year: 2026,
        week: 16,
        region: "Región Andina",
        department: "Huila",
        municipality: "Pitalito",
        ageGroup: "60+",
        dengue: 21,
        ira: 31,
        total: 52,
    },


    // ========================================================================
    // ATLÁNTICO - BARRANQUILLA
    // ========================================================================

    {
        id: 15,
        year: 2026,
        week: 17,
        region: "Región Caribe",
        department: "Atlántico",
        municipality: "Barranquilla",
        ageGroup: "<1 Año",
        dengue: 38,
        ira: 48,
        total: 86,
    },

    {
        id: 16,
        year: 2026,
        week: 17,
        region: "Región Caribe",
        department: "Atlántico",
        municipality: "Barranquilla",
        ageGroup: "1-4",
        dengue: 42,
        ira: 58,
        total: 100,
    },

    {
        id: 17,
        year: 2026,
        week: 17,
        region: "Región Caribe",
        department: "Atlántico",
        municipality: "Barranquilla",
        ageGroup: "20-29",
        dengue: 51,
        ira: 36,
        total: 87,
    },

    {
        id: 18,
        year: 2026,
        week: 17,
        region: "Región Caribe",
        department: "Atlántico",
        municipality: "Barranquilla",
        ageGroup: "60+",
        dengue: 30,
        ira: 52,
        total: 82,
    },


    // ========================================================================
    // CAUCA - POPAYÁN
    // ========================================================================

    {
        id: 19,
        year: 2026,
        week: 17,
        region: "Región Pacífica",
        department: "Cauca",
        municipality: "Popayán",
        ageGroup: "<1 Año",
        dengue: 20,
        ira: 31,
        total: 51,
    },

    {
        id: 20,
        year: 2026,
        week: 17,
        region: "Región Pacífica",
        department: "Cauca",
        municipality: "Popayán",
        ageGroup: "5-9",
        dengue: 35,
        ira: 42,
        total: 77,
    },

    {
        id: 21,
        year: 2026,
        week: 17,
        region: "Región Pacífica",
        department: "Cauca",
        municipality: "Popayán",
        ageGroup: "30-39",
        dengue: 28,
        ira: 24,
        total: 52,
    },

    {
        id: 22,
        year: 2026,
        week: 17,
        region: "Región Pacífica",
        department: "Cauca",
        municipality: "Popayán",
        ageGroup: "60+",
        dengue: 17,
        ira: 37,
        total: 54,
    },


    // ========================================================================
    // GUAVIARE - SAN JOSÉ DEL GUAVIARE
    // ========================================================================

    {
        id: 23,
        year: 2026,
        week: 15,
        region: "Región Amazónica",
        department: "Guaviare",
        municipality: "San José del Guaviare",
        ageGroup: "<1 Año",
        dengue: 12,
        ira: 19,
        total: 31,
    },

    {
        id: 24,
        year: 2026,
        week: 15,
        region: "Región Amazónica",
        department: "Guaviare",
        municipality: "San José del Guaviare",
        ageGroup: "10-14",
        dengue: 19,
        ira: 21,
        total: 40,
    },

    {
        id: 25,
        year: 2026,
        week: 15,
        region: "Región Amazónica",
        department: "Guaviare",
        municipality: "San José del Guaviare",
        ageGroup: "20-29",
        dengue: 25,
        ira: 18,
        total: 43,
    },

    {
        id: 26,
        year: 2026,
        week: 15,
        region: "Región Amazónica",
        department: "Guaviare",
        municipality: "San José del Guaviare",
        ageGroup: "60+",
        dengue: 10,
        ira: 24,
        total: 34,
    },


    // ========================================================================
    // META - VILLAVICENCIO
    // ========================================================================

    {
        id: 27,
        year: 2026,
        week: 16,
        region: "Región Orinoquía",
        department: "Meta",
        municipality: "Villavicencio",
        ageGroup: "<1 Año",
        dengue: 22,
        ira: 34,
        total: 56,
    },

    {
        id: 28,
        year: 2026,
        week: 16,
        region: "Región Orinoquía",
        department: "Meta",
        municipality: "Villavicencio",
        ageGroup: "5-9",
        dengue: 31,
        ira: 45,
        total: 76,
    },

    {
        id: 29,
        year: 2026,
        week: 16,
        region: "Región Orinoquía",
        department: "Meta",
        municipality: "Villavicencio",
        ageGroup: "20-29",
        dengue: 36,
        ira: 26,
        total: 62,
    },

    {
        id: 30,
        year: 2026,
        week: 16,
        region: "Región Orinoquía",
        department: "Meta",
        municipality: "Villavicencio",
        ageGroup: "60+",
        dengue: 18,
        ira: 29,
        total: 47,
    },


    // ========================================================================
    // DATOS DE 2025
    // Permiten comprobar que el filtro por año funciona correctamente.
    // ========================================================================

    {
        id: 31,
        year: 2025,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "<1 Año",
        dengue: 32,
        ira: 29,
        total: 61,
    },

    {
        id: 32,
        year: 2025,
        week: 17,
        region: "Región Andina",
        department: "Huila",
        municipality: "Neiva",
        ageGroup: "5-9",
        dengue: 27,
        ira: 46,
        total: 73,
    },

    {
        id: 33,
        year: 2025,
        week: 17,
        region: "Región Caribe",
        department: "Atlántico",
        municipality: "Barranquilla",
        ageGroup: "15-19",
        dengue: 41,
        ira: 39,
        total: 80,
    },

    {
        id: 34,
        year: 2025,
        week: 17,
        region: "Región Pacífica",
        department: "Cauca",
        municipality: "Popayán",
        ageGroup: "20-29",
        dengue: 24,
        ira: 28,
        total: 52,
    },

];


/**
 * ============================================================================
 * CÁLCULO DE TOTALES
 * ----------------------------------------------------------------------------
 * Los valores del resumen se calculan automáticamente a partir de los
 * registros simulados.
 *
 * De esta forma evitamos escribir manualmente los totales y reducimos
 * inconsistencias entre la tabla y las tarjetas resumen.
 * ============================================================================
 */

const dengueTotal =
    ageGroupDetailsMockData.reduce(
        (accumulator, item) =>
            accumulator + item.dengue,
        0
    );


const iraTotal =
    ageGroupDetailsMockData.reduce(
        (accumulator, item) =>
            accumulator + item.ira,
        0
    );


const generalTotal =
    dengueTotal + iraTotal;


/**
 * ============================================================================
 * RESPUESTA SIMULADA
 * ----------------------------------------------------------------------------
 * Esta estructura imita la respuesta que posteriormente podría entregar
 * el backend.
 * ============================================================================
 */
export const ageGroupDetailsMock:
    AgeGroupDetailsResponse = {

    data:
        ageGroupDetailsMockData,

    summary: {

        dengue:
            dengueTotal,

        ira:
            iraTotal,

        total:
            generalTotal,

    },

};