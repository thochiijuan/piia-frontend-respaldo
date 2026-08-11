/**
 * ============================================================================
 * TIPOS - MÓDULO DE REPORTES
 * ============================================================================
 */

export type ReportSummaryTheme =
    | "purple"
    | "green"
    | "blue"
    | "orange"
    | "pink";

export type ReportSummaryIcon =
    | "report"
    | "download"
    | "users"
    | "calendar"
    | "clock";


/**
 * ============================================================================
 * TARJETAS SUPERIORES
 * ============================================================================
 */
export interface ReportSummaryData {

    id: string;

    title: string;

    value: string | number;

    description: string;

    theme: ReportSummaryTheme;

    icon: ReportSummaryIcon;

}

/**
 * ============================================================================
 * REPORTES GENERADOS
 * ----------------------------------------------------------------------------
 * Representa un reporte creado por el usuario o por el sistema.
 * ============================================================================
 */
export interface RecentReportData {
    id: string;

    name: string;

    disease:
        | "Dengue"
        | "IRA"
        | "Dengue / IRA"
        | "General";

    territory: string;

    period: string;

    generatedBy: string;

    generatedAt: string;

    format:
        | "PDF"
        | "Excel"
        | "CSV"
        | "PNG"
        | "PowerPoint"
        | "Word";
}

/**
 * ============================================================================
 * REPORTES RÁPIDOS
 * ============================================================================
 */

export type QuickReportTheme =
    | "green"
    | "blue"
    | "orange"
    | "purple"
    | "pink";

export type QuickReportIcon =
    | "dengue"
    | "ira"
    | "comparison"
    | "territory"
    | "bulletin";


export interface QuickReportData {

    id: string;

    title: string;

    description: string;

    theme: QuickReportTheme;

    icon: QuickReportIcon;

}

/**
 * ============================================================================
 * PROGRAMACIÓN DE REPORTES
 * ============================================================================
 */

export type ScheduledReportFrequency =
    | "Diario"
    | "Semanal"
    | "Quincenal"
    | "Mensual";

export type ScheduledReportStatus =
    | "Activo"
    | "Pausado";


export interface ScheduledReportData {

    id: string;

    reportName: string;

    frequency: ScheduledReportFrequency;

    nextExecution: string;

    status: ScheduledReportStatus;

}

/**
 * ============================================================================
 * DISTRIBUCIÓN DE REPORTES
 * ============================================================================
 */

export interface ReportDistributionData {

    id: string;

    label: string;

    value: number;

    color: string;

}


/**
 * ============================================================================
 * FORMATOS DE EXPORTACIÓN
 * ============================================================================
 */

export type ExportFormatIcon =
    | "pdf"
    | "excel"
    | "csv"
    | "png"
    | "powerpoint"
    | "word";


export type ExportFormatTheme =
    | "red"
    | "green"
    | "teal"
    | "purple"
    | "orange"
    | "blue";


export interface ExportFormatData {

    id: string;

    name: string;

    description: string;

    secondaryDescription: string;

    icon: ExportFormatIcon;

    theme: ExportFormatTheme;

}