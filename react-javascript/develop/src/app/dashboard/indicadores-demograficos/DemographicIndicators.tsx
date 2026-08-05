import DemographicSummaryCards from "./cards/DemographicSummaryCards";
import DemographicInsights from "./cards/DemographicInsights";

import AgeGroupChart from "./charts/AgeGroupChart";
import GenderChart from "./charts/GenderChart";
import LifeCycleChart from "./charts/LifeCycleChart";
import IncidenceRateChart from "./charts/IncidenceRateChart";
import SocioeconomicStratumChart from "./charts/SocioeconomicStratumChart";
import DemographicKeyIndicators from "./charts/DemographicKeyIndicators";

export default function DemographicIndicators() {

    return (

        <div className="space-y-6">

            {/* ============================================================
                TARJETAS SUPERIORES
            ============================================================ */}

            <DemographicSummaryCards />

            {/* ============================================================
                PRIMERA FILA DE GRÁFICOS
            ============================================================ */}

            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-12 lg:col-span-4">

                    <AgeGroupChart />

                </div>

                <div className="col-span-12 lg:col-span-4">

                    <GenderChart />

                </div>

                <div className="col-span-12 lg:col-span-4">

                    <LifeCycleChart />

                </div>

            </div>

            {/* ============================================================
                SEGUNDA FILA DE GRÁFICOS
            ============================================================ */}

            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-12 lg:col-span-4">

                    <IncidenceRateChart />

                </div>

                <div className="col-span-12 lg:col-span-4">

                    <SocioeconomicStratumChart />

                </div>

                <div className="col-span-12 lg:col-span-4">

                    <DemographicKeyIndicators />

                </div>

            </div>

            {/* ============================================================
                HALLAZGOS Y RECOMENDACIÓN
            ============================================================ */}

            <DemographicInsights />

        </div>

    );

}