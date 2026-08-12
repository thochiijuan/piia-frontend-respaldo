/**
 * ============================================================================
 * ageGroupDetails.service.ts
 * ----------------------------------------------------------------------------
 * Servicio encargado de proporcionar la información detallada del indicador
 * "Casos por grupo de edad".
 *
 * Responsabilidades:
 *
 * - Obtener los registros.
 * - Aplicar filtros.
 * - Aplicar búsqueda general.
 * - Calcular los totales después de filtrar.
 * - Mantener desacoplados los componentes de la fuente de datos.
 *
 * Actualmente:
 *
 * ageGroupDetails.mock.ts
 *          ↓
 * ageGroupDetails.service.ts
 *          ↓
 * Modal / Tabla
 *
 * Futuro:
 *
 * Backend / API
 *          ↓
 * ageGroupDetails.service.ts
 *          ↓
 * Modal / Tabla
 *
 * ============================================================================
 */


import type {
    AgeGroupDetail,
    AgeGroupDetailsFilters,
    AgeGroupDetailsResponse,
    AgeGroupDetailsSummary,
} from "./ageGroupDetails";


import {
    ageGroupDetailsMockData,
} from "./ageGroupDetails.mock";


/**
 * ============================================================================
 * NORMALIZAR TEXTO
 * ----------------------------------------------------------------------------
 * Convierte texto a minúsculas y elimina tildes.
 *
 * Esto permite búsquedas como:
 *
 * "Region Pacifica"
 *
 * aunque el registro contenga:
 *
 * "Región Pacífica"
 * ============================================================================
 */
function normalizeText(
    value: string
): string {

    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();
}


/**
 * ============================================================================
 * CALCULAR RESUMEN
 * ----------------------------------------------------------------------------
 * Calcula Dengue, IRA y total tomando únicamente los registros filtrados.
 * ============================================================================
 */
function calculateSummary(
    data: AgeGroupDetail[]
): AgeGroupDetailsSummary {

    const dengue =
        data.reduce(
            (
                accumulator,
                item
            ) =>
                accumulator +
                item.dengue,
            0
        );


    const ira =
        data.reduce(
            (
                accumulator,
                item
            ) =>
                accumulator +
                item.ira,
            0
        );


    return {

        dengue,

        ira,

        total:
            dengue + ira,

    };
}


/**
 * ============================================================================
 * FILTRAR REGISTROS
 * ============================================================================
 */
function filterAgeGroupDetails(

    data: AgeGroupDetail[],

    filters?: Partial<AgeGroupDetailsFilters>

): AgeGroupDetail[] {

    if (!filters) {

        return data;

    }


    return data.filter(
        (item) => {

            /**
             * =================================================================
             * AÑO
             * =================================================================
             */
            if (
                filters.year !== undefined &&
                filters.year !== null &&
                item.year !== filters.year
            ) {

                return false;

            }


            /**
             * =================================================================
             * SEMANA
             * =================================================================
             */
            if (
                filters.week !== undefined &&
                filters.week !== null &&
                item.week !== filters.week
            ) {

                return false;

            }


            /**
             * =================================================================
             * REGIÓN
             * =================================================================
             */
            if (
                filters.region &&
                item.region !== filters.region
            ) {

                return false;

            }


            /**
             * =================================================================
             * DEPARTAMENTO
             * =================================================================
             */
            if (
                filters.department &&
                item.department !==
                    filters.department
            ) {

                return false;

            }


            /**
             * =================================================================
             * MUNICIPIO
             * =================================================================
             */
            if (
                filters.municipality &&
                item.municipality !==
                    filters.municipality
            ) {

                return false;

            }


            /**
             * =================================================================
             * GRUPO DE EDAD
             * =================================================================
             */
            if (
                filters.ageGroup &&
                item.ageGroup !==
                    filters.ageGroup
            ) {

                return false;

            }


            /**
             * =================================================================
             * BÚSQUEDA GENERAL
             * ----------------------------------------------------------------------------
             * Permite buscar por:
             *
             * - Año
             * - Semana
             * - Región
             * - Departamento
             * - Municipio
             * - Grupo de edad
             * =================================================================
             */
            if (
                filters.search &&
                filters.search.trim() !== ""
            ) {

                const search =
                    normalizeText(
                        filters.search
                    );


                const searchableContent =
                    normalizeText(
                        [
                            item.year,
                            item.week,
                            item.region,
                            item.department,
                            item.municipality,
                            item.ageGroup,
                        ].join(" ")
                    );


                if (
                    !searchableContent.includes(
                        search
                    )
                ) {

                    return false;

                }

            }


            return true;

        }
    );
}


/**
 * ============================================================================
 * GET AGE GROUP DETAILS
 * ----------------------------------------------------------------------------
 * Función pública utilizada por la modal.
 * ============================================================================
 */
export async function getAgeGroupDetails(

    filters?: Partial<AgeGroupDetailsFilters>

): Promise<AgeGroupDetailsResponse> {

    /**
     * =========================================================================
     * FUENTE ACTUAL
     * ----------------------------------------------------------------------------
     * Actualmente obtenemos los registros desde el mock.
     *
     * Más adelante esta sección puede cambiar por:
     *
     * const response = await fetch("/api/...");
     * const sourceData = await response.json();
     * =========================================================================
     */
    const sourceData =
        ageGroupDetailsMockData;


    /**
     * =========================================================================
     * FILTRAR
     * =========================================================================
     */
    const filteredData =
        filterAgeGroupDetails(
            sourceData,
            filters
        );


    /**
     * =========================================================================
     * CALCULAR RESUMEN
     * =========================================================================
     */
    const summary =
        calculateSummary(
            filteredData
        );


    /**
     * =========================================================================
     * RESPUESTA
     * =========================================================================
     */
    return {

        data:
            filteredData,

        summary,

    };
}