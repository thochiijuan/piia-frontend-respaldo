/**
 * ============================================================================
 * ageGroupComparison.service.ts
 * ----------------------------------------------------------------------------
 * Servicio encargado de construir las comparaciones epidemiológicas
 * correspondientes al indicador "Casos por grupo de edad".
 *
 * Responsabilidades:
 *
 * - Recibir una cantidad dinámica de períodos.
 * - Comparar semanas epidemiológicas de diferentes años.
 * - Comparar años completos.
 * - Aplicar filtros territoriales.
 * - Aplicar filtro por grupo de edad.
 * - Comparar Total, Dengue o IRA.
 * - Agrupar los resultados por grupo de edad.
 * - Calcular variación absoluta.
 * - Calcular variación porcentual.
 *
 * Fuente actual:
 *
 * ageGroupDetails.mock.ts
 *
 * Futuro:
 *
 * Backend / API
 *      ↓
 * ageGroupComparison.service.ts
 *      ↓
 * AgeGroupComparison
 *
 * ============================================================================
 */

import {
    ageGroupDetailsMockData,
} from "../ageGroupDetails.mock";

import type {
    AgeGroupDetail,
} from "../ageGroupDetails";

import type {
    AgeGroupComparisonRequest,
    AgeGroupComparisonResponse,
    AgeGroupComparisonRow,
    AgeGroupComparisonFilters,
    ComparisonMetric,
    ComparisonPeriod,
    ComparisonPeriodSummary,
    ComparisonPeriodValue,
} from "./ageGroupComparison";


/**
 * ============================================================================
 * ORDEN DE LOS GRUPOS DE EDAD
 * ============================================================================
 */
const AGE_GROUP_ORDER = [

    "<1 Año",

    "1-4",

    "5-9",

    "10-14",

    "15-19",

    "20-29",

    "30-39",

    "40-49",

    "50-59",

    "60+",

];


/**
 * ============================================================================
 * OBTENER VALOR SEGÚN MÉTRICA
 * ----------------------------------------------------------------------------
 * Permite utilizar la misma lógica para:
 *
 * total
 * dengue
 * ira
 * ============================================================================
 */
function getMetricValue(
    item: AgeGroupDetail,
    metric: ComparisonMetric
): number {

    switch (metric) {

        case "dengue":
            return item.dengue;

        case "ira":
            return item.ira;

        case "total":
        default:
            return item.total;

    }

}


/**
 * ============================================================================
 * VALIDAR PERÍODO
 * ----------------------------------------------------------------------------
 * Un período semanal necesita:
 *
 * - Año
 * - Semana
 *
 * Un período anual necesita:
 *
 * - Año
 *
 * ============================================================================
 */
function isValidPeriod(
    period: ComparisonPeriod
): boolean {

    if (
        period.year === null
    ) {

        return false;

    }


    if (
        period.type === "week" &&
        period.week === null
    ) {

        return false;

    }


    return true;

}


/**
 * ============================================================================
 * CREAR ETIQUETA DEL PERÍODO
 * ----------------------------------------------------------------------------
 * Ejemplos:
 *
 * 2026 · SE 17
 *
 * Año 2025
 * ============================================================================
 */
export function getComparisonPeriodLabel(
    period: ComparisonPeriod
): string {

    if (
        period.year === null
    ) {

        return "Período sin configurar";

    }


    if (
        period.type === "year"
    ) {

        return `Año ${period.year}`;

    }


    if (
        period.week === null
    ) {

        return `${period.year} · Semana pendiente`;

    }


    return `${period.year} · SE ${period.week}`;

}


/**
 * ============================================================================
 * FILTROS TERRITORIALES
 * ----------------------------------------------------------------------------
 * Estos filtros se aplican ANTES de comparar los períodos.
 * ============================================================================
 */
function applyComparisonFilters(

    data: AgeGroupDetail[],

    filters: AgeGroupComparisonFilters

): AgeGroupDetail[] {

    return data.filter(
        (item) => {

            /**
             * REGIÓN
             */
            if (
                filters.region &&
                item.region !==
                    filters.region
            ) {

                return false;

            }


            /**
             * DEPARTAMENTO
             */
            if (
                filters.department &&
                item.department !==
                    filters.department
            ) {

                return false;

            }


            /**
             * MUNICIPIO
             */
            if (
                filters.municipality &&
                item.municipality !==
                    filters.municipality
            ) {

                return false;

            }


            /**
             * GRUPO DE EDAD
             */
            if (
                filters.ageGroup &&
                item.ageGroup !==
                    filters.ageGroup
            ) {

                return false;

            }


            return true;

        }
    );

}


/**
 * ============================================================================
 * OBTENER REGISTROS DE UN PERÍODO
 * ----------------------------------------------------------------------------
 * WEEK:
 *
 * Año 2026 + Semana 17
 *
 * YEAR:
 *
 * Todos los registros del año 2026.
 * ============================================================================
 */
function getPeriodData(

    data: AgeGroupDetail[],

    period: ComparisonPeriod

): AgeGroupDetail[] {

    if (
        period.year === null
    ) {

        return [];

    }


    /**
     * ========================================================================
     * AÑO COMPLETO
     * ========================================================================
     */
    if (
        period.type === "year"
    ) {

        return data.filter(
            (item) =>
                item.year ===
                period.year
        );

    }


    /**
     * ========================================================================
     * SEMANA EPIDEMIOLÓGICA
     * ========================================================================
     */
    if (
        period.week === null
    ) {

        return [];

    }


    return data.filter(
        (item) =>
            item.year ===
                period.year &&
            item.week ===
                period.week
    );

}


/**
 * ============================================================================
 * SUMAR MÉTRICA
 * ----------------------------------------------------------------------------
 * Suma Total, Dengue o IRA dependiendo de lo seleccionado.
 * ============================================================================
 */
function calculateMetricTotal(

    data: AgeGroupDetail[],

    metric: ComparisonMetric

): number {

    return data.reduce(
        (
            accumulator,
            item
        ) => {

            return (
                accumulator +
                getMetricValue(
                    item,
                    metric
                )
            );

        },
        0
    );

}


/**
 * ============================================================================
 * OBTENER VALOR DE UN GRUPO DE EDAD EN UN PERÍODO
 * ============================================================================
 */
function calculateAgeGroupPeriodValue(

    data: AgeGroupDetail[],

    ageGroup: string,

    metric: ComparisonMetric

): number {

    const ageGroupData =
        data.filter(
            (item) =>
                item.ageGroup ===
                ageGroup
        );


    return calculateMetricTotal(
        ageGroupData,
        metric
    );

}


/**
 * ============================================================================
 * ORDENAR GRUPOS DE EDAD
 * ============================================================================
 */
function sortAgeGroups(
    groups: string[]
): string[] {

    return [
        ...groups,
    ].sort(
        (
            a,
            b
        ) => {

            const indexA =
                AGE_GROUP_ORDER.indexOf(
                    a
                );


            const indexB =
                AGE_GROUP_ORDER.indexOf(
                    b
                );


            if (
                indexA !== -1 &&
                indexB !== -1
            ) {

                return (
                    indexA -
                    indexB
                );

            }


            if (
                indexA !== -1
            ) {

                return -1;

            }


            if (
                indexB !== -1
            ) {

                return 1;

            }


            return a.localeCompare(
                b
            );

        }
    );

}


/**
 * ============================================================================
 * CALCULAR VARIACIONES
 * ----------------------------------------------------------------------------
 * La comparación siempre toma:
 *
 * PRIMER PERÍODO
 *
 * vs
 *
 * ÚLTIMO PERÍODO
 *
 *
 * Ejemplo:
 *
 * SE 1  = 100 casos
 * SE 5  = 120 casos
 * SE 10 = 150 casos
 *
 * Variación calculada:
 *
 * SE 1 → SE 10
 *
 * Diferencia absoluta:
 *
 * 150 - 100 = +50
 *
 * Variación porcentual:
 *
 * ((150 - 100) / 100) * 100 = +50%
 * ============================================================================
 */
function calculateVariation(
    values: ComparisonPeriodValue[]
): {

    absoluteVariation:
        number | null;

    percentageVariation:
        number | null;

} {

    /**
     * Necesitamos al menos dos períodos.
     */
    if (
        values.length < 2
    ) {

        return {

            absoluteVariation:
                null,

            percentageVariation:
                null,

        };

    }


    const firstValue =
        values[0].value;


    const lastValue =
        values[
            values.length -
            1
        ].value;


    const absoluteVariation =
        lastValue -
        firstValue;


    /**
     * Evitamos división entre cero.
     *
     * Si el primer período tiene 0 casos,
     * la variación porcentual no se puede
     * calcular de forma convencional.
     */
    if (
        firstValue === 0
    ) {

        return {

            absoluteVariation,

            percentageVariation:
                null,

        };

    }


    const percentageVariation =
        (
            absoluteVariation /
            firstValue
        ) *
        100;


    return {

        absoluteVariation,

        percentageVariation,

    };

}


/**
 * ============================================================================
 * CONSTRUIR RESUMEN DE PERÍODOS
 * ----------------------------------------------------------------------------
 * Genera las pequeñas tarjetas que posteriormente mostraremos encima
 * de la tabla.
 *
 * Ejemplo:
 *
 * 2025 · SE 17       2026 · SE 17
 *     850                1.120
 * ============================================================================
 */
function buildPeriodSummaries(

    data: AgeGroupDetail[],

    periods: ComparisonPeriod[],

    metric: ComparisonMetric

): ComparisonPeriodSummary[] {

    return periods.map(
        (period) => {

            const periodData =
                getPeriodData(
                    data,
                    period
                );


            const value =
                calculateMetricTotal(
                    periodData,
                    metric
                );


            return {

                periodId:
                    period.id,

                label:
                    getComparisonPeriodLabel(
                        period
                    ),

                value,

            };

        }
    );

}


/**
 * ============================================================================
 * CONSTRUIR FILAS DE LA TABLA
 * ============================================================================
 */
function buildComparisonRows(

    data: AgeGroupDetail[],

    periods: ComparisonPeriod[],

    metric: ComparisonMetric

): AgeGroupComparisonRow[] {

    /**
     * Obtenemos los grupos de edad existentes
     * después de aplicar filtros territoriales.
     */
    const groups =
        sortAgeGroups(
            Array.from(
                new Set(
                    data.map(
                        (item) =>
                            item.ageGroup
                    )
                )
            )
        );


    return groups.map(
        (
            ageGroup,
            index
        ) => {

            /**
             * ================================================================
             * VALORES DE TODOS LOS PERÍODOS
             * ================================================================
             */
            const values:
                ComparisonPeriodValue[] =
                periods.map(
                    (period) => {

                        const periodData =
                            getPeriodData(
                                data,
                                period
                            );


                        const value =
                            calculateAgeGroupPeriodValue(
                                periodData,
                                ageGroup,
                                metric
                            );


                        return {

                            periodId:
                                period.id,

                            value,

                        };

                    }
                );


            /**
             * ================================================================
             * VARIACIÓN
             * ================================================================
             */
            const variation =
                calculateVariation(
                    values
                );


            return {

                id:
                    `comparison-row-${index}-${ageGroup}`,

                ageGroup,

                values,

                absoluteVariation:
                    variation.absoluteVariation,

                percentageVariation:
                    variation.percentageVariation,

            };

        }
    );

}


/**
 * ============================================================================
 * EJECUTAR COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Función principal utilizada posteriormente por AgeGroupComparison.tsx.
 *
 * Ejemplo:
 *
 * getAgeGroupComparison({
 *
 *     metric: "total",
 *
 *     filters: {
 *         region: "",
 *         department: "Huila",
 *         municipality: "Neiva",
 *         ageGroup: "",
 *     },
 *
 *     periods: [
 *
 *         {
 *             id: "1",
 *             type: "week",
 *             year: 2025,
 *             week: 17,
 *         },
 *
 *         {
 *             id: "2",
 *             type: "week",
 *             year: 2026,
 *             week: 17,
 *         },
 *
 *     ],
 *
 * });
 *
 * ============================================================================
 */
export async function getAgeGroupComparison(

    request: AgeGroupComparisonRequest

): Promise<AgeGroupComparisonResponse> {

    /**
     * =========================================================================
     * VALIDAR PERÍODOS
     * =========================================================================
     */
    const validPeriods =
        request.periods.filter(
            isValidPeriod
        );


    /**
     * =========================================================================
     * APLICAR FILTROS GENERALES
     * =========================================================================
     */
    const filteredData =
        applyComparisonFilters(
            ageGroupDetailsMockData,
            request.filters
        );


    /**
     * =========================================================================
     * CONSTRUIR RESÚMENES
     * =========================================================================
     */
    const summaries =
        buildPeriodSummaries(
            filteredData,
            validPeriods,
            request.metric
        );


    /**
     * =========================================================================
     * CONSTRUIR TABLA
     * =========================================================================
     */
    const rows =
        buildComparisonRows(
            filteredData,
            validPeriods,
            request.metric
        );


    /**
     * =========================================================================
     * RESPUESTA
     * =========================================================================
     */
    return {

        metric:
            request.metric,

        periods:
            validPeriods,

        summaries,

        rows,

    };

}


/**
 * ============================================================================
 * OPCIONES DISPONIBLES PARA EL SELECTOR
 * ----------------------------------------------------------------------------
 * Estas funciones serán utilizadas por ComparisonPeriodSelector.tsx.
 * ============================================================================
 */


/**
 * Obtiene los años disponibles.
 */
export async function getAvailableComparisonYears():
    Promise<number[]> {

    return Array
        .from(
            new Set(
                ageGroupDetailsMockData.map(
                    (item) =>
                        item.year
                )
            )
        )
        .sort(
            (a, b) =>
                b - a
        );

}


/**
 * Obtiene las semanas epidemiológicas disponibles.
 *
 * Si se proporciona un año:
 *
 * getAvailableComparisonWeeks(2026)
 *
 * devuelve únicamente las semanas existentes
 * para 2026.
 */
export async function getAvailableComparisonWeeks(
    year?: number | null
): Promise<number[]> {

    const source =
        year
            ? ageGroupDetailsMockData.filter(
                (item) =>
                    item.year ===
                    year
            )
            : ageGroupDetailsMockData;


    return Array
        .from(
            new Set(
                source.map(
                    (item) =>
                        item.week
                )
            )
        )
        .sort(
            (a, b) =>
                a - b
        );

}


/**
 * Obtiene las regiones disponibles.
 */
export async function getAvailableComparisonRegions():
    Promise<string[]> {

    return Array
        .from(
            new Set(
                ageGroupDetailsMockData.map(
                    (item) =>
                        item.region
                )
            )
        )
        .sort();

}


/**
 * Obtiene los departamentos disponibles.
 *
 * Puede limitarse por región.
 */
export async function getAvailableComparisonDepartments(
    region?: string
): Promise<string[]> {

    const source =
        region
            ? ageGroupDetailsMockData.filter(
                (item) =>
                    item.region ===
                    region
            )
            : ageGroupDetailsMockData;


    return Array
        .from(
            new Set(
                source.map(
                    (item) =>
                        item.department
                )
            )
        )
        .sort();

}


/**
 * Obtiene los municipios disponibles.
 *
 * Puede limitarse por:
 *
 * Región
 * Departamento
 */
export async function getAvailableComparisonMunicipalities(

    region?: string,

    department?: string

): Promise<string[]> {

    let source =
        ageGroupDetailsMockData;


    if (
        region
    ) {

        source =
            source.filter(
                (item) =>
                    item.region ===
                    region
            );

    }


    if (
        department
    ) {

        source =
            source.filter(
                (item) =>
                    item.department ===
                    department
            );

    }


    return Array
        .from(
            new Set(
                source.map(
                    (item) =>
                        item.municipality
                )
            )
        )
        .sort();

}


/**
 * Obtiene los grupos de edad disponibles.
 */
export async function getAvailableComparisonAgeGroups():
    Promise<string[]> {

    const groups =
        Array.from(
            new Set(
                ageGroupDetailsMockData.map(
                    (item) =>
                        item.ageGroup
                )
            )
        );


    return sortAgeGroups(
        groups
    );

}