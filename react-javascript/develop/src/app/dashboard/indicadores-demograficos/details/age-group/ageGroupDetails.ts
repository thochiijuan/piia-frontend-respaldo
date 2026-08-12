/**
 * ============================================================================
 * ageGroupDetails.ts
 * ----------------------------------------------------------------------------
 * Contratos de datos utilizados por el detalle del indicador
 * "Casos por grupo de edad".
 *
 * Este archivo define únicamente la estructura de la información.
 * No contiene datos simulados ni lógica de negocio.
 *
 * Flujo:
 *
 * Backend / Mock
 *      ↓
 * ageGroupDetails.service.ts
 *      ↓
 * AgeGroupDetailsModal.tsx
 *      ↓
 * AgeGroupDetailsTable.tsx
 *
 * ============================================================================
 */


/**
 * ============================================================================
 * AgeGroupDetail
 * ----------------------------------------------------------------------------
 * Representa una fila de la tabla de detalle epidemiológico.
 * ============================================================================
 */
export interface AgeGroupDetail {

    /**
     * Identificador único.
     */
    id: number;


    /**
     * Año epidemiológico.
     *
     * Ejemplo:
     * 2026
     */
    year: number;


    /**
     * Semana epidemiológica.
     *
     * Ejemplo:
     * 17
     */
    week: number;


    /**
     * Región territorial.
     *
     * Ejemplo:
     * "Región Andina"
     */
    region: string;


    /**
     * Departamento.
     *
     * Ejemplo:
     * "Huila"
     */
    department: string;


    /**
     * Municipio.
     *
     * Ejemplo:
     * "Neiva"
     */
    municipality: string;


    /**
     * Grupo de edad.
     *
     * Ejemplos:
     *
     * "<1 Año"
     * "1-4"
     * "5-9"
     * "10-14"
     * "15-19"
     * "20-29"
     * "30-39"
     * "40-49"
     * "50-59"
     * "60+"
     */
    ageGroup: string;


    /**
     * Casos de Dengue.
     */
    dengue: number;


    /**
     * Casos de IRA.
     */
    ira: number;


    /**
     * Total de casos.
     *
     * Dengue + IRA
     */
    total: number;
}


/**
 * ============================================================================
 * AgeGroupDetailsFilters
 * ----------------------------------------------------------------------------
 * Filtros disponibles dentro de la modal.
 * ============================================================================
 */
export interface AgeGroupDetailsFilters {

    /**
     * Año seleccionado.
     *
     * null = Todos.
     */
    year: number | null;


    /**
     * Semana epidemiológica.
     *
     * null = Todas.
     */
    week: number | null;


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


    /**
     * Texto de búsqueda general.
     */
    search: string;
}


/**
 * ============================================================================
 * AgeGroupDetailsSummary
 * ----------------------------------------------------------------------------
 * Valores consolidados según los registros actualmente filtrados.
 * ============================================================================
 */
export interface AgeGroupDetailsSummary {

    /**
     * Total de casos de Dengue.
     */
    dengue: number;


    /**
     * Total de casos de IRA.
     */
    ira: number;


    /**
     * Total general.
     */
    total: number;
}


/**
 * ============================================================================
 * AgeGroupDetailsResponse
 * ----------------------------------------------------------------------------
 * Respuesta entregada por ageGroupDetails.service.ts.
 * ============================================================================
 */
export interface AgeGroupDetailsResponse {

    /**
     * Registros encontrados.
     */
    data: AgeGroupDetail[];


    /**
     * Resumen de los registros encontrados.
     */
    summary: AgeGroupDetailsSummary;
}