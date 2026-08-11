import type {
    GeovisorFilterOptions,
    DiseaseSummaryData,
    MunicipalityRankingData,
    MunicipalityRankingDisease,
    GeographicQuickFilterOptions,
    HealthUnitLegendData,
    DepartmentCasesData,
    SpatialDistributionData,
    EpidemiologicalMapPointData,
    DepartmentEpidemiologicalMapData,
} from "./geovisor";

/**
 * ============================================================================
 * MOCK - FILTROS DEL GEOVISOR EPIDEMIOLÓGICO
 * ----------------------------------------------------------------------------
 * Datos simulados utilizados para poblar los filtros superiores
 * del Geovisor Epidemiológico.
 * ============================================================================
 */
export const geovisorFilterOptionsMock: GeovisorFilterOptions = {

    /**
     * ========================================================================
     * AÑOS
     * ========================================================================
     */
    years: [

        {
            value: "2025",
            label: "2025",
        },

        {
            value: "2026",
            label: "2026",
        },

    ],

    /**
     * ========================================================================
     * SEMANAS EPIDEMIOLÓGICAS
     * ========================================================================
     */
    epidemiologicalWeeks: Array.from(
        { length: 52 },
        (_, index) => {

            const week = index + 1;

            return {
                value: String(week),
                label: `Semana ${week}`,
            };

        }
    ),

    /**
     * ========================================================================
     * ENFERMEDADES
     * ========================================================================
     */
    diseases: [

        {
            value: "all",
            label: "Todas",
        },

        {
            value: "dengue",
            label: "Dengue",
        },

        {
            value: "ira",
            label: "IRA",
        },

    ],

    /**
     * ========================================================================
     * INDICADORES
     * ========================================================================
     */
    indicators: [

        {
            value: "incidence-rate",
            label: "Tasa de incidencia",
        },

        {
            value: "confirmed-cases",
            label: "Casos confirmados",
        },

        {
            value: "accumulated-cases",
            label: "Casos acumulados",
        },

    ],

    /**
     * ========================================================================
     * DIRECCIONES TERRITORIALES
     * ========================================================================
     */
    territorialDirections: [

        {
            value: "all",
            label: "Todas",
        },

        {
            value: "atlantico",
            label: "Atlántico",
        },

        {
            value: "norte-santander",
            label: "Norte de Santander",
        },

        {
            value: "huila",
            label: "Huila",
        },

        {
            value: "cauca",
            label: "Cauca",
        },

        {
            value: "guaviare",
            label: "Guaviare",
        },

    ],

};

/**
 * ============================================================================
 * MOCK - RESUMEN DE ENFERMEDADES
 * ----------------------------------------------------------------------------
 * Datos simulados utilizados en las tarjetas de Dengue e IRA
 * ubicadas junto al mapa epidemiológico.
 *
 * Los valores de tendencia permiten construir los minigráficos.
 * ============================================================================
 */
export const diseaseSummaryMock: DiseaseSummaryData[] = [

    {
        id: "dengue",
        disease: "Dengue",
        confirmedCases: 25842,
        incidenceRate: 124.7,
        theme: "purple",
        trend: [
            24,
            31,
            37,
            42,
            51,
            62,
            59,
            50,
        ],
    },

    {
        id: "ira",
        disease: "IRA",
        confirmedCases: 42761,
        incidenceRate: 206.4,
        theme: "green",
        trend: [
            21,
            27,
            34,
            40,
            48,
            59,
            66,
            61,
        ],
    },

];

/**
 * ============================================================================
 * MOCK - RANKING DE MUNICIPIOS POR TASA DE INCIDENCIA
 * ----------------------------------------------------------------------------
 * Información simulada utilizada para representar los municipios
 * con mayor tasa de incidencia para Dengue e IRA.
 * ============================================================================
 */
export const municipalityRankingMock: Record<
    MunicipalityRankingDisease,
    MunicipalityRankingData[]
> = {

    dengue: [

        {
            position: 1,
            municipality: "Santa Marta",
            department: "Magdalena",
            incidenceRate: 882,
            riskLevel: "Muy alto",
        },

        {
            position: 2,
            municipality: "Barranquilla",
            department: "Atlántico",
            incidenceRate: 720,
            riskLevel: "Muy alto",
        },

        {
            position: 3,
            municipality: "Cesar",
            department: "Cesar",
            incidenceRate: 342,
            riskLevel: "Alto",
        },

        {
            position: 4,
            municipality: "Neiva",
            department: "Huila",
            incidenceRate: 285,
            riskLevel: "Medio",
        },

        {
            position: 5,
            municipality: "Popayán",
            department: "Cauca",
            incidenceRate: 148,
            riskLevel: "Bajo",
        },

    ],

    ira: [

        {
            position: 1,
            municipality: "Cúcuta",
            department: "Norte de Santander",
            incidenceRate: 945,
            riskLevel: "Muy alto",
        },

        {
            position: 2,
            municipality: "Neiva",
            department: "Huila",
            incidenceRate: 810,
            riskLevel: "Muy alto",
        },

        {
            position: 3,
            municipality: "Popayán",
            department: "Cauca",
            incidenceRate: 520,
            riskLevel: "Alto",
        },

        {
            position: 4,
            municipality: "Pitalito",
            department: "Huila",
            incidenceRate: 320,
            riskLevel: "Medio",
        },

        {
            position: 5,
            municipality: "Garzón",
            department: "Huila",
            incidenceRate: 170,
            riskLevel: "Bajo",
        },

    ],

};
/**
 * ============================================================================
 * MOCK - FILTROS GEOGRÁFICOS RÁPIDOS
 * ============================================================================
 */
export const geographicQuickFilterOptionsMock:
    GeographicQuickFilterOptions = {

    regions: [
        {
            value: "all",
            label: "Todas",
        },
        {
            value: "caribe",
            label: "Caribe",
        },
        {
            value: "centro-oriente",
            label: "Centro Oriente",
        },
        {
            value: "centro-sur",
            label: "Centro Sur",
        },
        {
            value: "pacifico",
            label: "Pacífico",
        },
        {
            value: "amazonia-orinoquia",
            label: "Amazonía - Orinoquía",
        },
    ],

    departments: [
        {
            value: "all",
            label: "Todos",
        },
        {
            value: "atlantico",
            label: "Atlántico",
        },
        {
            value: "norte-santander",
            label: "Norte de Santander",
        },
        {
            value: "huila",
            label: "Huila",
        },
        {
            value: "cauca",
            label: "Cauca",
        },
        {
            value: "guaviare",
            label: "Guaviare",
        },
    ],

    municipalities: [
        {
            value: "all",
            label: "Todos",
        },
        {
            value: "barranquilla",
            label: "Barranquilla",
        },
        {
            value: "cucuta",
            label: "Cúcuta",
        },
        {
            value: "neiva",
            label: "Neiva",
        },
        {
            value: "popayan",
            label: "Popayán",
        },
        {
            value: "san-jose-guaviare",
            label: "San José del Guaviare",
        },
    ],

    areas: [
        {
            value: "all",
            label: "Todas (Urbana y Rural)",
        },
        {
            value: "urban",
            label: "Urbana",
        },
        {
            value: "rural",
            label: "Rural",
        },
    ],

};


/**
 * ============================================================================
 * MOCK - LEYENDA DE UNIDADES DE SALUD
 * ============================================================================
 */
export const healthUnitLegendMock:
    HealthUnitLegendData[] = [

    {
        id: "high",
        label: "Alta concentración de casos",
        color: "#F43F5E",
    },

    {
        id: "moderate",
        label: "Moderada concentración",
        color: "#FBBF24",
    },

    {
        id: "low",
        label: "Baja concentración",
        color: "#4DBB88",
    },

    {
        id: "none",
        label: "Sin casos reportados",
        color: "#38A3DB",
    },

];


/**
 * ============================================================================
 * MOCK - CASOS POR DEPARTAMENTO
 * ============================================================================
 */
export const departmentCasesMock:
    DepartmentCasesData[] = [

    {
        department: "Atlántico",
        dengue: 882,
        ira: 682,
    },

    {
        department: "N. Santander",
        dengue: 720,
        ira: 645,
    },

    {
        department: "Huila",
        dengue: 610,
        ira: 590,
    },

    {
        department: "Cauca",
        dengue: 520,
        ira: 480,
    },

    {
        department: "Guaviare",
        dengue: 410,
        ira: 395,
    },

    {
        department: "Magdalena",
        dengue: 342,
        ira: 360,
    },

];


/**
 * ============================================================================
 * MOCK - DISTRIBUCIÓN ESPACIAL
 * ============================================================================
 */
export const spatialDistributionMock:
    SpatialDistributionData = {

    title:
        "Distribución espacial por casos",

    subtitle:
        "Mapa de calor Dengue e IRA",

};

/**
 * ============================================================================
 * MOCK - PUNTOS DEL MAPA EPIDEMIOLÓGICO
 * ============================================================================
 */
export const epidemiologicalMapPointsMock:
    EpidemiologicalMapPointData[] = [

    {
        id: "barranquilla",
        municipality: "Barranquilla",
        department: "Atlántico",
        latitude: 10.9685,
        longitude: -74.7813,
        confirmedCases: 720,
        incidenceRate: 720,
        riskLevel: "Muy alto",
    },

    {
        id: "cucuta",
        municipality: "Cúcuta",
        department: "Norte de Santander",
        latitude: 7.8891,
        longitude: -72.4967,
        confirmedCases: 945,
        incidenceRate: 945,
        riskLevel: "Muy alto",
    },

    {
        id: "neiva",
        municipality: "Neiva",
        department: "Huila",
        latitude: 2.9345,
        longitude: -75.2809,
        confirmedCases: 610,
        incidenceRate: 610,
        riskLevel: "Alto",
    },

    {
        id: "popayan",
        municipality: "Popayán",
        department: "Cauca",
        latitude: 2.4448,
        longitude: -76.6147,
        confirmedCases: 520,
        incidenceRate: 520,
        riskLevel: "Alto",
    },

    {
        id: "pitalito",
        municipality: "Pitalito",
        department: "Huila",
        latitude: 1.8537,
        longitude: -76.0507,
        confirmedCases: 320,
        incidenceRate: 320,
        riskLevel: "Medio",
    },

    {
        id: "san-jose-guaviare",
        municipality: "San José del Guaviare",
        department: "Guaviare",
        latitude: 2.5729,
        longitude: -72.6459,
        confirmedCases: 148,
        incidenceRate: 148,
        riskLevel: "Bajo",
    },

];

/**
 * ============================================================================
 * MOCK - INCIDENCIA EPIDEMIOLÓGICA POR DEPARTAMENTO
 * ============================================================================
 */
export const departmentEpidemiologicalMapMock:
    DepartmentEpidemiologicalMapData[] = [

    {
        department: "Atlántico",
        dengueCases: 2850,
        iraCases: 3680,
        incidenceRate: 720,
        riskLevel: "Muy alto",
    },

    {
        department: "Magdalena",
        dengueCases: 2540,
        iraCases: 3210,
        incidenceRate: 682,
        riskLevel: "Muy alto",
    },

    {
        department: "Norte de Santander",
        dengueCases: 1890,
        iraCases: 2750,
        incidenceRate: 520,
        riskLevel: "Alto",
    },

    {
        department: "Huila",
        dengueCases: 1320,
        iraCases: 1960,
        incidenceRate: 342,
        riskLevel: "Alto",
    },

    {
        department: "Cauca",
        dengueCases: 920,
        iraCases: 1480,
        incidenceRate: 285,
        riskLevel: "Medio",
    },

    {
        department: "Guaviare",
        dengueCases: 310,
        iraCases: 620,
        incidenceRate: 148,
        riskLevel: "Bajo",
    },

];