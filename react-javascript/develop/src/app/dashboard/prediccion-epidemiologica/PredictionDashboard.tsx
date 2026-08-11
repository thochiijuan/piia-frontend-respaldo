import PredictionSummaryCards
    from "./components/PredictionSummaryCards";

import PredictionPanel
    from "./components/PredictionPanel";


export default function PredictionDashboard() {

    return (

        <div className="w-full space-y-4">

            {/* ============================================================
                TARJETAS SUPERIORES
            ============================================================ */}

            <section>

                <PredictionSummaryCards />

            </section>


            {/* ============================================================
                BLOQUE PRINCIPAL
                MAPA + PREDICCIÓN + FACTORES CLIMÁTICOS
            ============================================================ */}

            <section
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-4
                    xl:grid-cols-[1.45fr_1.15fr_0.8fr]
                    xl:items-stretch
                "
            >

                {/* MAPA DE RIESGO */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Mapa de riesgo epidémico"
                        subtitle="Próximas 4 semanas"
                        minHeight="min-h-[460px]"
                    />

                </div>


                {/* PREDICCIÓN VS OBSERVADOS */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Predicción de casos vs Observados"
                        minHeight="min-h-[460px]"
                    />

                </div>


                {/* FACTORES CLIMÁTICOS */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Factores climáticos que más influyen"
                        minHeight="min-h-[460px]"
                    />

                </div>

            </section>


            {/* ============================================================
                BLOQUE CLIMÁTICO
            ============================================================ */}

            <section
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-4
                    xl:grid-cols-[1fr_1.3fr_1fr]
                    xl:items-stretch
                "
            >

                {/* RELACIÓN CLIMA - CASOS */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Relación clima - casos"
                        subtitle="Análisis integrado"
                        minHeight="min-h-[320px]"
                    />

                </div>


                {/* VARIABLES CLIMÁTICAS */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Variables climáticas actuales"
                        subtitle="Promedio del periodo analizado"
                        minHeight="min-h-[320px]"
                    />

                </div>


                {/* IMPACTO CLIMÁTICO */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Impacto climático en el riesgo epidémico"
                        minHeight="min-h-[320px]"
                    />

                </div>

            </section>


            {/* ============================================================
                ALERTAS + RECOMENDACIONES + ESCENARIOS
            ============================================================ */}

            <section
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-4
                    xl:grid-cols-[1fr_1.1fr_1.7fr]
                    xl:items-stretch
                "
            >

                {/* ========================================================
                    ALERTAS ACTIVAS
                ======================================================== */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Alertas activas"
                        subtitle="Basadas en datos SIVIGILA + clima"
                        minHeight="min-h-[360px]"
                    />

                </div>


                {/* ========================================================
                    RECOMENDACIONES
                ======================================================== */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Recomendaciones ante el riesgo"
                        subtitle="SIVIGILA + clima"
                        minHeight="min-h-[360px]"
                    />

                </div>


                {/* ========================================================
                    ESCENARIOS DE RIESGO
                ======================================================== */}

                <div className="h-full min-w-0">

                    <PredictionPanel
                        title="Escenarios de riesgo"
                        subtitle="Próximas 4 semanas"
                        minHeight="min-h-[360px]"
                    />

                </div>

            </section>

        </div>

    );

}