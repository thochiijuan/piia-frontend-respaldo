/**
 * ============================================================================
 * ResumenGeneral
 * ----------------------------------------------------------------------------
 * Componente contenedor del módulo "Resumen General".
 *
 * Responsabilidades:
 * - Organizar la distribución de los componentes del Dashboard.
 * - Definir la estructura visual mediante filas y columnas.
 * - Mantener desacoplados los componentes funcionales.
 *
 * Este componente NO contiene lógica de negocio ni consultas de datos.
 * Cada componente hijo es responsable de renderizar su propia información.
 *
 * Estructura:
 *
 * ┌────────────────────────────────────────────────────────────┐
 * │                     SummaryCards                           │
 * ├───────────────────────────────┬────────────────────────────┤
 * │ WeeklyCasesChart              │ RegionCasesCard           │
 * ├───────────────────────────────┼────────────────────────────┤
 * │ AgeSexChart                   │ SeverityGauge             │
 * └───────────────────────────────┴────────────────────────────┘
 * ============================================================================
 */



// Componentes principales
import SummaryCards from "./SummaryCards";

// Componentes de gráficos
import AgeSexChart from "./charts/AgeSexChart";
import WeeklyCasesChart from "./charts/WeeklyCasesChart";
import RegionCasesCard from "./charts/RegionCasesCard";
import SeverityGauge from "./charts/SeverityGauge";

export default function ResumenGeneral() {
    return (

        <div className="space-y-6">
            {/* Indicadores principales */}
            <SummaryCards />

            {/* Primera fila del Dashboard */}
            <div className="grid grid-cols-12 gap-6">

                {/* Evolución semanal */}
                <div className="col-span-12 xl:col-span-7">

                    <WeeklyCasesChart />

                </div>

                {/* Distribución geográfica */}
                <div className="col-span-12 xl:col-span-5">

                    <RegionCasesCard />

                </div>

            </div>

            {/* Segunda fila del Dashboard */}
            <div className="grid grid-cols-12 gap-6">

                {/* Distribución por edad y sexo */}
                <div className="col-span-12 xl:col-span-8">

                    <AgeSexChart />

                </div>
                {/* Indicador de gravedad */}
                <div className="col-span-12 xl:col-span-4">

                    <SeverityGauge />

                </div>

            </div>

        </div>

    );
}