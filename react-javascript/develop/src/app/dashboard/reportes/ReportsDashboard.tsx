import ReportSummaryCards from "./components/ReportSummaryCards";
import RecentReports from "./components/RecentReports";
import QuickReports from "./components/QuickReports";
import ScheduledReports from "./components/ScheduledReports";
import ReportsDistribution from "./components/ReportsDistribution";
import ExportFormats from "./components/ExportFormats";

export default function ReportsDashboard() {

    return (

        <div className="w-full space-y-5">

            {/* ============================================================
                RESUMEN GENERAL DE REPORTES
            ============================================================ */}

            <section>

                <ReportSummaryCards />

            </section>

            {/* ============================================================
                REPORTES RECIENTES + REPORTES RÁPIDOS
            ============================================================ */}

            <section
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-4
                    xl:grid-cols-[minmax(0,3fr)_minmax(310px,1fr)]
                    xl:items-stretch
                "
            >

                <div className="h-full min-w-0">
                    <RecentReports />
                </div>

                <div className="h-full min-w-0">
                    <QuickReports />
                </div>

            </section>


            {/* ============================================================
                PROGRAMACIÓN + DISTRIBUCIÓN + FORMATOS
            ============================================================ */}

            {/* ============================================================
                FRANJA INFERIOR
            ============================================================ */}

            <section className="w-full">

                <ScheduledReports />

            </section>


            {/* ============================================================
    DISTRIBUCIÓN + FORMATOS DE EXPORTACIÓN
============================================================ */}

            <section
                className="
        grid
        w-full
        grid-cols-1
        gap-4
        xl:grid-cols-2
        xl:items-stretch
    "
            >

                <div className="h-full min-w-0">

                    <ReportsDistribution />

                </div>


                <div className="h-full min-w-0">

                    <ExportFormats />

                </div>

            </section>

        </div>

    );

}