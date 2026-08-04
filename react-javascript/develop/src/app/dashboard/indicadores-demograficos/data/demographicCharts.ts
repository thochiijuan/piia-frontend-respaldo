/**
 * ============================================================================
 * Casos por grupo de edad
 * ----------------------------------------------------------------------------
 * Representa la cantidad de casos de Dengue e IRA
 * para cada grupo etario.
 * ============================================================================
 */
export interface AgeGroupData {

    /**
     * Grupo de edad.
     * Ejemplo:
     * <1 Año
     * 1 a 4
     * 5 a 9
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

}

/**
 * ============================================================================
 * Casos por sexo
 * ----------------------------------------------------------------------------
 * Representa la distribución de casos por sexo.
 * ============================================================================
 */
export interface GenderData {

    /**
     * Sexo.
     */
    gender: string;

    /**
     * Número de casos.
     */
    cases: number;

    /**
     * Porcentaje respecto al total de casos.
     */
    percentage: number;

}

/**
 * ============================================================================
 * Casos por ciclo de vida
 * ----------------------------------------------------------------------------
 * Representa la cantidad de casos de Dengue e IRA
 * para cada etapa del ciclo de vida.
 * ============================================================================
 */
export interface LifeCycleData {

    /**
     * Etapa del ciclo de vida.
     */
    stage: string;

    /**
     * Rango de edad correspondiente.
     * Ejemplo:
     * (0 - 5 años)
     */
    ageRange: string;

    /**
     * Casos de Dengue.
     */
    dengue: number;

    /**
     * Casos de IRA.
     */
    ira: number;

}