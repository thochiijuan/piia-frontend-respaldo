import type {
    ReportSummaryData,
    QuickReportData,
    ScheduledReportData,
    ReportDistributionData,
    ExportFormatData,
} from "./reports";


/**
 * ============================================================================
 * MOCK - RESUMEN GENERAL DE REPORTES
 * ============================================================================
 */
export const reportSummaryMock:
    ReportSummaryData[] = [

        {
            id: "generated-reports",

            title:
                "Reportes generados (este año)",

            value:
                128,

            description:
                "↑ 18.7% vs año anterior",

            theme:
                "purple",

            icon:
                "report",
        },

        {
            id: "downloads",

            title:
                "Descargas realizadas",

            value:
                356,

            description:
                "↑ 24.3% vs mes anterior",

            theme:
                "green",

            icon:
                "download",
        },

        {
            id: "users",

            title:
                "Usuarios con acceso a reportes",

            value:
                72,

            description:
                "7 departamentos",

            theme:
                "blue",

            icon:
                "users",
        },

        {
            id: "scheduled",

            title:
                "Programaciones activas",

            value:
                24,

            description:
                "Reportes automáticos",

            theme:
                "orange",

            icon:
                "calendar",
        },

        {
            id: "last-report",

            title:
                "Último reporte generado",

            value:
                "Hoy, 07:45 AM",

            description:
                "Situación Dengue - SE 17",

            theme:
                "pink",

            icon:
                "clock",
        },

    ];

/**
 * ============================================================================
 * MOCK - REPORTES RÁPIDOS
 * ============================================================================
 */

export const quickReportsMock:
    QuickReportData[] = [

        {
            id: "quick-dengue",
            title: "Situación actual Dengue",
            description: "Resumen de casos e indicadores clave",
            theme: "green",
            icon: "dengue",
        },

        {
            id: "quick-ira",
            title: "Situación actual IRA",
            description: "Resumen de casos e indicadores clave",
            theme: "blue",
            icon: "ira",
        },

        {
            id: "quick-comparison",
            title: "Comparativo anual",
            description: "Comparación entre años seleccionados",
            theme: "orange",
            icon: "comparison",
        },

        {
            id: "quick-territory",
            title: "Reporte por departamento",
            description: "Indicadores por entidad territorial",
            theme: "purple",
            icon: "territory",
        },

        {
            id: "quick-bulletin",
            title: "Boletín epidemiológico",
            description: "Boletín semanal automático",
            theme: "pink",
            icon: "bulletin",
        },

    ];

/**
 * ============================================================================
 * MOCK - PROGRAMACIÓN DE REPORTES
 * ============================================================================
 */

export const scheduledReportsMock:
    ScheduledReportData[] = [

        {
            id: "scheduled-1",

            reportName:
                "Boletín Epidemiológico Semanal",

            frequency:
                "Semanal",

            nextExecution:
                "05/05/2026 08:00 AM",

            status:
                "Activo",
        },

        {
            id: "scheduled-2",

            reportName:
                "Situación Dengue por Regiones",

            frequency:
                "Semanal",

            nextExecution:
                "05/05/2026 09:00 AM",

            status:
                "Activo",
        },

        {
            id: "scheduled-3",

            reportName:
                "Informe de Calidad del Dato",

            frequency:
                "Quincenal",

            nextExecution:
                "12/05/2026 08:00 AM",

            status:
                "Activo",
        },

        {
            id: "scheduled-4",

            reportName:
                "Análisis de Brotes",

            frequency:
                "Diario",

            nextExecution:
                "29/04/2026 08:00 AM",

            status:
                "Activo",
        },

        {
            id: "scheduled-5",

            reportName:
                "Indicadores Clínicos",

            frequency:
                "Mensual",

            nextExecution:
                "01/05/2026 08:00 AM",

            status:
                "Pausado",
        },

    ];

    /**
 * ============================================================================
 * MOCK - DISTRIBUCIÓN DE REPORTES
 * ============================================================================
 */

export const reportDistributionMock:
    ReportDistributionData[] = [

    {
        id: "dengue",
        label: "Dengue",
        value: 132,
        color: "#7447F5",
    },

    {
        id: "ira",
        label: "IRA",
        value: 98,
        color: "#3B82F6",
    },

    {
        id: "bulletins",
        label: "Boletines",
        value: 64,
        color: "#4DBB88",
    },

    {
        id: "indicators",
        label: "Indicadores",
        value: 42,
        color: "#F59E0B",
    },

    {
        id: "data-quality",
        label: "Calidad del dato",
        value: 20,
        color: "#94A3B8",
    },

];


/**
 * ============================================================================
 * MOCK - FORMATOS DE EXPORTACIÓN
 * ============================================================================
 */

export const exportFormatsMock:
    ExportFormatData[] = [

    {
        id: "pdf",
        name: "PDF",
        description: "Ideal para impresión",
        secondaryDescription: "Documentos y reportes",
        icon: "pdf",
        theme: "red",
    },

    {
        id: "excel",
        name: "Excel",
        description: "Datos estructurados",
        secondaryDescription: "Tablas y análisis",
        icon: "excel",
        theme: "green",
    },

    {
        id: "csv",
        name: "CSV",
        description: "Datos planos",
        secondaryDescription: "Compatibilidad total",
        icon: "csv",
        theme: "teal",
    },

    {
        id: "png",
        name: "PNG",
        description: "Imágenes",
        secondaryDescription: "Gráficos y mapas",
        icon: "png",
        theme: "purple",
    },

    {
        id: "powerpoint",
        name: "PowerPoint",
        description: "Presentaciones",
        secondaryDescription: "Diapositivas editables",
        icon: "powerpoint",
        theme: "orange",
    },

    {
        id: "word",
        name: "Word",
        description: "Documentos",
        secondaryDescription: "Informes editables",
        icon: "word",
        theme: "blue",
    },

];