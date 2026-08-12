/**
 * ============================================================================
 * ageGroupComparison.ts
 * ----------------------------------------------------------------------------
 * Contratos utilizados por la funcionalidad de comparación epidemiológica
 * del indicador "Casos por grupo de edad".
 *
 * Este archivo NO contiene:
 *
 * - Datos simulados.
 * - Consultas.
 * - Componentes visuales.
 * - Lógica de comparación.
 *
 * Únicamente define las estructuras que utilizarán:
 *
 * ComparisonPeriodSelector
 *          ↓
 * AgeGroupComparison
 *          ↓
 * ageGroupComparison.service
 *          ↓
 * AgeGroupComparisonTable
 *
 * ============================================================================
 */


/**
 * ============================================================================
 * TIPO DE PERÍODO
 * ----------------------------------------------------------------------------
 * Define cómo será interpretado cada período agregado por el usuario.
 *
 * week
 * ----
 * Compara una semana epidemiológica específica de un año.
 *
 * Ejemplo:
 *
 * 2026 - SE 17
 *
 *
 * year
 * ----
 * Compara el acumulado de todo un año.
 *
 * Ejemplo:
 *
 * Año 2025
 * ============================================================================
 */
export type ComparisonPeriodType =
    | "week"
    | "year";


/**
 * ============================================================================
 * MÉTRICA DE COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Evitamos mostrar Dengue, IRA y Total simultáneamente en cada período,
 * ya que una comparación con muchos períodos produciría una tabla
 * excesivamente ancha.
 *
 * El usuario podrá seleccionar qué indicador desea analizar.
 * ============================================================================
 */
export type ComparisonMetric =
    | "total"
    | "dengue"
    | "ira";


/**
 * ============================================================================
 * PERÍODO DE COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Cada elemento representa uno de los períodos agregados dinámicamente
 * por el usuario.
 *
 * La aplicación manejará estos períodos como un arreglo:
 *
 * ComparisonPeriod[]
 *
 * Por lo tanto no existe una cantidad fija de períodos.
 * ============================================================================
 */
export interface ComparisonPeriod {

    /**
     * Identificador único del período.
     *
     * No representa información epidemiológica.
     * Únicamente permite identificar el período dentro de React.
     *
     * Ejemplo:
     *
     * "period-1"
     * "period-2"
     */
    id: string;


    /**
     * Tipo de período.
     *
     * week = año + semana epidemiológica
     * year = año completo
     */
    type: ComparisonPeriodType;


    /**
     * Año seleccionado.
     *
     * null significa que todavía no ha sido seleccionado.
     */
    year: number | null;


    /**
     * Semana epidemiológica.
     *
     * Cuando:
     *
     * type === "week"
     *
     * deberá contener una semana.
     *
     * Cuando:
     *
     * type === "year"
     *
     * deberá ser null.
     */
    week: number | null;

}


/**
 * ============================================================================
 * FILTROS TERRITORIALES DE LA COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Estos filtros permiten restringir la comparación.
 *
 * Ejemplo:
 *
 * Región: Región Andina
 * Departamento: Huila
 * Municipio: Neiva
 * Grupo de edad: Todos
 *
 * Después:
 *
 * 2025 - SE 10
 * vs
 * 2026 - SE 10
 * ============================================================================
 */
export interface AgeGroupComparisonFilters {

    /**
     * Región.
     *
     * "" = Todas.
     */
    region: string;


    /**
     * Departamento.
     *
     * "" = Todos.
     */
    department: string;


    /**
     * Municipio.
     *
     * "" = Todos.
     */
    municipality: string;


    /**
     * Grupo de edad.
     *
     * "" = Todos.
     */
    ageGroup: string;

}


/**
 * ============================================================================
 * SOLICITUD DE COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Representa toda la configuración elegida por el usuario antes de
 * ejecutar la comparación.
 * ============================================================================
 */
export interface AgeGroupComparisonRequest {

    /**
     * Métrica que será comparada.
     *
     * total
     * dengue
     * ira
     */
    metric: ComparisonMetric;


    /**
     * Filtros territoriales.
     */
    filters: AgeGroupComparisonFilters;


    /**
     * Períodos seleccionados.
     *
     * Puede contener tantos períodos como el usuario agregue.
     */
    periods: ComparisonPeriod[];

}


/**
 * ============================================================================
 * VALOR DE UN PERÍODO
 * ----------------------------------------------------------------------------
 * Representa el valor encontrado para un período específico dentro
 * de una fila de comparación.
 *
 * Ejemplo:
 *
 * Grupo de edad:
 * 5-9
 *
 * Período:
 * 2026 - SE 17
 *
 * Valor:
 * 86 casos
 * ============================================================================
 */
export interface ComparisonPeriodValue {

    /**
     * ID del período al que pertenece el valor.
     */
    periodId: string;


    /**
     * Valor de la métrica seleccionada.
     */
    value: number;

}


/**
 * ============================================================================
 * FILA DE COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Cada fila representa un grupo de edad.
 *
 * Ejemplo:
 *
 * Grupo        2025-SE1   2025-SE17   2026-SE1   2026-SE17
 * ---------------------------------------------------------
 * <1 Año           41          48          52          61
 *
 * ============================================================================
 */
export interface AgeGroupComparisonRow {

    /**
     * Identificador de la fila.
     */
    id: string;


    /**
     * Grupo de edad.
     */
    ageGroup: string;


    /**
     * Valores correspondientes a cada período.
     *
     * La cantidad de elementos dependerá de los períodos
     * que haya agregado el usuario.
     */
    values: ComparisonPeriodValue[];


    /**
     * Variación absoluta entre el primer y último período.
     *
     * Ejemplo:
     *
     * 41 → 61
     *
     * absoluteVariation = 20
     */
    absoluteVariation: number | null;


    /**
     * Variación porcentual entre el primer y último período.
     *
     * Ejemplo:
     *
     * 41 → 61
     *
     * percentageVariation = 48.78
     */
    percentageVariation: number | null;

}


/**
 * ============================================================================
 * RESUMEN DE UN PERÍODO
 * ----------------------------------------------------------------------------
 * Permite mostrar posteriormente tarjetas de resumen encima
 * de la tabla comparativa.
 *
 * Ejemplo:
 *
 * ┌────────────────────┐
 * │ 2026 · SE 17       │
 * │ 2.188 casos        │
 * └────────────────────┘
 * ============================================================================
 */
export interface ComparisonPeriodSummary {

    /**
     * ID del período.
     */
    periodId: string;


    /**
     * Texto visible.
     *
     * Ejemplos:
     *
     * "2026 · SE 17"
     * "Año 2025"
     */
    label: string;


    /**
     * Valor total correspondiente a la métrica seleccionada.
     */
    value: number;

}


/**
 * ============================================================================
 * RESPUESTA DE LA COMPARACIÓN
 * ----------------------------------------------------------------------------
 * Estructura que devolverá ageGroupComparison.service.ts.
 * ============================================================================
 */
export interface AgeGroupComparisonResponse {

    /**
     * Métrica utilizada.
     */
    metric: ComparisonMetric;


    /**
     * Períodos válidos utilizados para la comparación.
     */
    periods: ComparisonPeriod[];


    /**
     * Resumen total de cada período.
     */
    summaries: ComparisonPeriodSummary[];


    /**
     * Filas dinámicas de la tabla.
     */
    rows: AgeGroupComparisonRow[];

}