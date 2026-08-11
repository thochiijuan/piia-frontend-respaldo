import DiseaseSummaryCards from "./components/DiseaseSummaryCards";
import MunicipalityRanking from "./components/MunicipalityRanking";

import GeographicQuickFilters from "./components/GeographicQuickFilters";
import HealthUnitsLegend from "./components/HealthUnitsLegend";
import DepartmentCases from "./components/DepartmentCases";
import SpatialDistribution from "./components/SpatialDistribution";
import EpidemiologicalMap from "./map/EpidemiologicalMap";

export default function EpidemiologicalGeovisor() {

    return (

        <div className="w-full space-y-5">

            {/* ============================================================
                BLOQUE PRINCIPAL
                MAPA + PANEL DERECHO
            ============================================================ */}

            <div
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-5
                    lg:grid-cols-[minmax(0,1.6fr)_minmax(430px,1fr)]
                    lg:items-stretch
                "
            >

                {/* ========================================================
                    MAPA EPIDEMIOLÓGICO
                ======================================================== */}

                <div className="h-full min-w-0">

                    <EpidemiologicalMap />

                </div>

                {/* ========================================================
                    PANEL DERECHO
                ======================================================== */}

                <div className="h-full min-w-0">

                    <div className="space-y-3">

                        <DiseaseSummaryCards />

                        <MunicipalityRanking />

                    </div>

                </div>

            </div>

            {/* ============================================================
                FRANJA INFERIOR
            ============================================================ */}

            <div
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-3
                    md:grid-cols-2
                    xl:grid-cols-[240px_240px_280px_minmax(0,1fr)]
                    xl:items-stretch
                "
            >

                {/* FILTROS GEOGRÁFICOS */}

                <div className="min-w-0">

                    <GeographicQuickFilters />

                </div>


                {/* UNIDADES DE SALUD */}

                <div className="min-w-0">

                    <HealthUnitsLegend />

                </div>


                {/* CASOS POR DEPARTAMENTO */}

                <div className="min-w-0">

                    <DepartmentCases />

                </div>


                {/* DISTRIBUCIÓN ESPACIAL */}

                <div className="min-w-0">

                    <SpatialDistribution />

                </div>

            </div>

        </div>

    );

}