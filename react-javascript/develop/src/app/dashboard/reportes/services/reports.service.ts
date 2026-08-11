import {
    reportSummaryMock,
    quickReportsMock,
    scheduledReportsMock,
    reportDistributionMock,
    exportFormatsMock,
} from "../data/reports.mock";

import type {
    ReportSummaryData,
    QuickReportData,
    ScheduledReportData,
    ReportDistributionData,
    ExportFormatData,

} from "../data/reports";


/**
 * ============================================================================
 * SERVICIO - REPORTES
 * ----------------------------------------------------------------------------
 * Actualmente utiliza información Mock.
 * Posteriormente será reemplazada por información proveniente del backend.
 * ============================================================================
 */

export async function getReportSummaryData():
    Promise<ReportSummaryData[]> {

    return Promise.resolve(
        reportSummaryMock
    );

}

export async function getQuickReports():
    Promise<QuickReportData[]> {

    return Promise.resolve(
        quickReportsMock
    );

}

/**
 * ============================================================================
 * Obtiene las programaciones de reportes
 * ============================================================================
 */
export async function getScheduledReports():
    Promise<ScheduledReportData[]> {

    return Promise.resolve(
        scheduledReportsMock
    );

}

/**
 * ============================================================================
 * Obtiene la distribución de reportes
 * ============================================================================
 */
export async function getReportDistribution():
    Promise<ReportDistributionData[]> {

    return Promise.resolve(
        reportDistributionMock
    );

}


/**
 * ============================================================================
 * Obtiene los formatos de exportación
 * ============================================================================
 */
export async function getExportFormats():
    Promise<ExportFormatData[]> {

    return Promise.resolve(
        exportFormatsMock
    );

}