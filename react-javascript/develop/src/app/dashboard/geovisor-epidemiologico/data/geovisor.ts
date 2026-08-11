/**
 * ============================================================================
 * OPCIÓN GENÉRICA PARA FILTROS
 * ----------------------------------------------------------------------------
 * Estructura reutilizable para las opciones de los diferentes selectores
 * del Geovisor Epidemiológico.
 * ============================================================================
 */
export interface GeovisorFilterOption {

    /**
     * Valor utilizado internamente por el sistema.
     */
    value: string;

    /**
     * Texto mostrado al usuario.
     */
    label: string;

}

/**
 * ============================================================================
 * OPCIONES DE FILTROS DEL GEOVISOR
 * ----------------------------------------------------------------------------
 * Define la información disponible en los filtros superiores.
 *
 * En producción estos valores podrán provenir del Backend.
 * ============================================================================
 */
export interface GeovisorFilterOptions {

    /**
     * Años disponibles.
     */
    years: GeovisorFilterOption[];

    /**
     * Semanas epidemiológicas disponibles.
     */
    epidemiologicalWeeks: GeovisorFilterOption[];

    /**
     * Enfermedades disponibles.
     */
    diseases: GeovisorFilterOption[];

    /**
     * Indicadores disponibles.
     */
    indicators: GeovisorFilterOption[];

    /**
     * Direcciones territoriales disponibles.
     */
    territorialDirections: GeovisorFilterOption[];

}

/**
 * ============================================================================
 * FILTROS SELECCIONADOS
 * ----------------------------------------------------------------------------
 * Representa el estado actual de los filtros del Geovisor.
 * ============================================================================
 */
export interface GeovisorSelectedFilters {

    year: string;

    epidemiologicalWeek: string;

    disease: string;

    indicator: string;

    territorialDirection: string;

}

/**
 * ============================================================================
 * RESUMEN DE ENFERMEDAD
 * ----------------------------------------------------------------------------
 * Representa la información principal mostrada en las tarjetas
 * de Dengue e IRA ubicadas junto al mapa epidemiológico.
 * ============================================================================
 */
export interface DiseaseSummaryData {

    /**
     * Identificador interno.
     */
    id: string;

    /**
     * Nombre de la enfermedad.
     *
     * Ejemplo:
     * Dengue
     * IRA
     */
    disease: string;

    /**
     * Número total de casos confirmados.
     */
    confirmedCases: number;

    /**
     * Tasa de incidencia por cada 100.000 habitantes.
     */
    incidenceRate: number;

    /**
     * Tema visual de la tarjeta.
     */
    theme: "purple" | "green";

    /**
     * Valores utilizados para construir
     * el minigráfico de tendencia.
     */
    trend: number[];

}


/**
 * ============================================================================
 * MUNICIPIO EN RANKING EPIDEMIOLÓGICO
 * ----------------------------------------------------------------------------
 * Representa cada fila de la tabla de ranking de municipios.
 * ============================================================================
 */
export interface MunicipalityRankingData {

    /**
     * Posición dentro del ranking.
     */
    position: number;

    /**
     * Nombre del municipio.
     */
    municipality: string;

    /**
     * Departamento al que pertenece.
     */
    department: string;

    /**
     * Tasa de incidencia por cada 100.000 habitantes.
     */
    incidenceRate: number;

    /**
     * Nivel de riesgo epidemiológico.
     */
    riskLevel:
        | "Muy alto"
        | "Alto"
        | "Medio"
        | "Bajo";

}


/**
 * ============================================================================
 * CAPAS DEL MAPA
 * ----------------------------------------------------------------------------
 * Define las capas epidemiológicas que pueden activarse
 * o desactivarse dentro del mapa.
 * ============================================================================
 */
export interface MapLayerData {

    /**
     * Identificador de la capa.
     */
    id: string;

    /**
     * Nombre mostrado al usuario.
     */
    label: string;

    /**
     * Estado inicial de la capa.
     */
    enabled: boolean;

    /**
     * Tema visual.
     */
    theme: "purple" | "green";

}


/**
 * ============================================================================
 * LEYENDA DE TASA DE INCIDENCIA
 * ----------------------------------------------------------------------------
 * Representa cada intervalo de colores utilizado
 * en el mapa epidemiológico.
 * ============================================================================
 */
export interface IncidenceLegendData {

    /**
     * Identificador del rango.
     */
    id: string;

    /**
     * Etiqueta mostrada.
     *
     * Ejemplo:
     * 0 - 50
     * 50 - 100
     */
    label: string;

    /**
     * Color utilizado en la leyenda.
     */
    color: string;

}


/**
 * ============================================================================
 * INFORMACIÓN GENERAL DEL MAPA
 * ----------------------------------------------------------------------------
 * Define los textos utilizados en la tarjeta principal del mapa.
 * ============================================================================
 */
export interface EpidemiologicalMapInfo {

    /**
     * Título principal.
     */
    title: string;

    /**
     * Descripción o unidad del indicador.
     */
    subtitle: string;

}

/**
 * ============================================================================
 * ENFERMEDAD DEL RANKING
 * ============================================================================
 */
export type MunicipalityRankingDisease =
    | "dengue"
    | "ira";

/**
 * ============================================================================
 * FILTROS GEOGRÁFICOS RÁPIDOS
 * ============================================================================
 */
export interface GeographicQuickFilterOptions {
    regions: GeovisorFilterOption[];
    departments: GeovisorFilterOption[];
    municipalities: GeovisorFilterOption[];
    areas: GeovisorFilterOption[];
}

/**
 * ============================================================================
 * UNIDADES DE SALUD
 * ============================================================================
 */
export interface HealthUnitLegendData {
    id: string;
    label: string;
    color: string;
}

/**
 * ============================================================================
 * CASOS POR DEPARTAMENTO
 * ============================================================================
 */
export interface DepartmentCasesData {
    department: string;
    dengue: number;
    ira: number;
}
/**
 * ============================================================================
 * DISTRIBUCIÓN ESPACIAL
 * ============================================================================
 */
export interface SpatialDistributionData {
    title: string;
    subtitle: string;
}

/**
 * ============================================================================
 * PUNTOS EPIDEMIOLÓGICOS DEL MAPA
 * ============================================================================
 */
export interface EpidemiologicalMapPointData {
    id: string;
    municipality: string;
    department: string;
    latitude: number;
    longitude: number;
    confirmedCases: number;
    incidenceRate: number;
    riskLevel:
        | "Muy alto"
        | "Alto"
        | "Medio"
        | "Bajo";
}

/**
 * ============================================================================
 * DATOS EPIDEMIOLÓGICOS POR DEPARTAMENTO
 * ============================================================================
 */
export interface DepartmentEpidemiologicalMapData {
    department: string;

    dengueCases: number;
    iraCases: number;

    incidenceRate: number;

    riskLevel:
        | "Muy alto"
        | "Alto"
        | "Medio"
        | "Bajo";
}