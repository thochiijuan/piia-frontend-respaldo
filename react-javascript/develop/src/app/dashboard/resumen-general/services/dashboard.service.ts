/**
 * ============================================================================
 * Dashboard Service
 * ----------------------------------------------------------------------------
 * Responsabilidad:
 * Centralizar el acceso a los datos del módulo "Resumen General".
 *
 * Actualmente este servicio devuelve datos simulados (Mock), ya que el backend
 * aún no está disponible.
 *
 * Cuando la API sea implementada, únicamente será necesario modificar este
 * archivo para consumir los datos reales, sin afectar los componentes del
 * Dashboard.
 *
 * Flujo de datos:
 *
 * ResumenGeneral
 *        │
 *        ▼
 * dashboard.service.ts
 *        │
 *        ▼
 * dashboardSummary.mock.ts
 *
 * Futuro:
 *
 * ResumenGeneral
 *        │
 *        ▼
 * dashboard.service.ts
 *        │
 *        ▼
 * API REST / Base de datos
 * ============================================================================
 */
import { dashboardSummaryMock } from "../data/dashboardSummary.mock";

/**
 * Recupera toda la información necesaria para construir el
 * Dashboard de Resumen General.
 *
 * Nota:
 * Actualmente consume un Mock local.
 * Cuando el backend esté disponible, este método realizará la llamada
 * al endpoint correspondiente sin necesidad de modificar los componentes.
 */

export async function getDashboardSummary() {

    return dashboardSummaryMock;

}