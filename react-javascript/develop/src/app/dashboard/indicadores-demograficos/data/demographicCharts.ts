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

/**
 * ============================================================================
 * Tasa de incidencia por grupo de edad
 * ----------------------------------------------------------------------------
 * Representa la tasa de incidencia de Dengue e IRA
 * por cada 100.000 habitantes para cada grupo etario.
 * ============================================================================
 */
export interface IncidenceRateData {

    /**
     * Grupo de edad.
     * Ejemplo:
     * < 1 año
     * 1 a 4 años
     * 5 a 14 años
     */
    ageGroup: string;

    /**
     * Tasa de incidencia de Dengue
     * por cada 100.000 habitantes.
     */
    dengue: number;

    /**
     * Tasa de incidencia de IRA
     * por cada 100.000 habitantes.
     */
    ira: number;

}

/**
 * ============================================================================
 * Casos por estrato socioeconómico
 * ----------------------------------------------------------------------------
 * Representa la distribución multiserie de casos por estrato
 * socioeconómico.
 *
 * Cada propiedad numérica corresponde a una de las áreas o líneas
 * que serán mostradas en el gráfico.
 * ============================================================================
 */
export interface SocioeconomicStratumData {

    /**
     * Categoría mostrada en el eje X.
     *
     * Ejemplo:
     * Estrato 1
     * Estrato 2
     * Estrato 3
     * Estrato 4
     * Estrato 5 a 6
     */
    category: string;

    /**
     * Valores correspondientes a la primera serie.
     */
    estrato1: number;

    /**
     * Valores correspondientes a la segunda serie.
     */
    estrato2: number;

    /**
     * Valores correspondientes a la tercera serie.
     */
    estrato3: number;

    /**
     * Valores correspondientes a la cuarta serie.
     */
    estrato4: number;

    /**
     * Valores correspondientes a los estratos 5 y 6.
     */
    estrato5a6: number;

}

/**
 * ============================================================================
 * Tema visual de los indicadores demográficos claves
 * ----------------------------------------------------------------------------
 * Permite asignar el color correspondiente a cada indicador
 * sin utilizar códigos de color directamente en los datos.
 * ============================================================================
 */
export type DemographicKeyIndicatorTheme =
    | "blue"
    | "purple"
    | "orange"
    | "green";

/**
 * ============================================================================
 * Indicadores demográficos claves
 * ----------------------------------------------------------------------------
 * Representa cada uno de los indicadores mostrados dentro de la
 * tarjeta de indicadores demográficos claves.
 *
 * Cada indicador contiene su información principal y una serie
 * de valores para construir el minigráfico de tendencia.
 * ============================================================================
 */
export interface DemographicKeyIndicatorData {

    /**
     * Identificador único del indicador.
     *
     * Ejemplo:
     * youth-dependency
     * elderly-dependency
     * population-aging
     * masculinity-ratio
     */
    id: string;

    /**
     * Nombre principal del indicador.
     */
    title: string;

    /**
     * Descripción o fórmula utilizada para calcular el indicador.
     */
    description: string;

    /**
     * Valor actual del indicador.
     */
    value: number;

    /**
     * Clasificación o interpretación del valor.
     *
     * Ejemplo:
     * Alta dependencia
     * Dependencia moderada
     */
    status: string;

    /**
     * Tema visual utilizado para definir el color
     * del valor y del minigráfico.
     */
    theme: DemographicKeyIndicatorTheme;

    /**
     * Valores utilizados para representar la tendencia
     * dentro del minigráfico.
     *
     * Los valores pueden corresponder a periodos mensuales,
     * trimestrales o anuales según la respuesta del backend.
     */
    trend: number[];

}

/**
 * ============================================================================
 * Tipo de información demográfica
 * ----------------------------------------------------------------------------
 * Define si la tarjeta corresponde a un hallazgo
 * o a una recomendación.
 * ============================================================================
 */
export type DemographicInsightType =
    | "finding"
    | "recommendation";

/**
 * ============================================================================
 * Hallazgos y recomendaciones demográficas
 * ----------------------------------------------------------------------------
 * Representa la información mostrada en las dos tarjetas inferiores
 * del módulo de indicadores demográficos.
 *
 * El tipo permite determinar el icono y los colores de cada tarjeta.
 * ============================================================================
 */
export interface DemographicInsightData {

    /**
     * Identificador único de la tarjeta.
     *
     * Ejemplo:
     * demographic-finding
     * demographic-recommendation
     */
    id: string;

    /**
     * Tipo de información.
     */
    type: DemographicInsightType;

    /**
     * Título principal de la tarjeta.
     */
    title: string;

    /**
     * Texto descriptivo del hallazgo o recomendación.
     */
    description: string;

}