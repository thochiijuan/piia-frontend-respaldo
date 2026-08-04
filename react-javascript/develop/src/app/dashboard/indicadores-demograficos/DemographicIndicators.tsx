import DemographicSummaryCards from "./cards/DemographicSummaryCards";
import AgeGroupChart from "./charts/AgeGroupChart";
import GenderChart from "./charts/GenderChart";
import LifeCycleChart from "./charts/LifeCycleChart";

export default function DemographicIndicators() {

    return (

        <div className="space-y-6">

            {/* Tarjetas superiores */}

            <DemographicSummaryCards />

            {/* Primera fila de gráficos */}

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

        </div>

    );

}