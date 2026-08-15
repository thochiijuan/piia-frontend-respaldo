"use client";

import PredictionScenarios
    from "./components/PredictionScenarios";

import PredictionRecommendations
    from "./components/PredictionRecommendations";

import PredictionAlerts
    from "./components/PredictionAlerts";

import {
    useEffect,
    useState,
} from "react";

import PredictionVariableImpact
    from "./components/PredictionVariableImpact";

import PredictionVariableSensitivity
    from "./components/PredictionVariableSensitivity";

import PredictionControls
    from "./components/PredictionControls";

import PredictionSummaryCards
    from "./components/PredictionSummaryCards";

import PredictionPanel
    from "./components/PredictionPanel";

import PredictionHistoryForecastChart
    from "./components/PredictionHistoryForecastChart";

import PredictionScenarioFactors
    from "./components/PredictionScenarioFactors";

import PredictionScenarioSimulator
    from "./components/PredictionScenarioSimulator";

import PredictionRiskComparison
    from "./components/PredictionRiskComparison";

import type {
    MunicipalityForecast,
    PredictionHorizon,
    PredictionMunicipality,
} from "./data/predictionApi";

import {
    getPredictionMunicipalities,
} from "./services/predictionApi.service";


export default function PredictionDashboard() {

    /* ============================================================
       ESTADO GLOBAL
    ============================================================ */

    const [
        municipalities,
        setMunicipalities,
    ] = useState<PredictionMunicipality[]>([]);


    const [
        selectedMunicipalityCode,
        setSelectedMunicipalityCode,
    ] = useState<string>("");


    const [
        selectedHorizon,
        setSelectedHorizon,
    ] = useState<PredictionHorizon>(1);


    const [
        simulatedForecast,
        setSimulatedForecast,
    ] = useState<MunicipalityForecast | null>(
        null
    );


    const [
        loading,
        setLoading,
    ] = useState<boolean>(true);


    const [
        error,
        setError,
    ] = useState<string | null>(null);


    /* ============================================================
       CARGA INICIAL
       MUNICIPIOS REALES DESDE FASTAPI
    ============================================================ */

    useEffect(() => {

        let isMounted = true;


        async function loadInitialData() {

            try {

                setLoading(true);

                setError(null);


                const municipalitiesData =
                    await getPredictionMunicipalities();


                if (!isMounted) {
                    return;
                }


                setMunicipalities(
                    municipalitiesData
                );


                /* ====================================================
                   MUNICIPIO INICIAL
                   Acevedo por defecto.
                ==================================================== */

                const acevedo =
                    municipalitiesData.find(
                        (municipality) =>
                            municipality.name
                                .trim()
                                .toLowerCase() ===
                            "acevedo"
                    );


                const initialMunicipality =
                    acevedo ??
                    municipalitiesData[0];


                if (initialMunicipality) {

                    setSelectedMunicipalityCode(
                        initialMunicipality.code
                    );

                }

            } catch (loadError) {

                console.error(
                    "Error cargando municipios predictivos:",
                    loadError
                );


                if (!isMounted) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar la información predictiva."
                );

            } finally {

                if (isMounted) {

                    setLoading(false);

                }

            }

        }


        void loadInitialData();


        return () => {

            isMounted = false;

        };

    }, []);


    /* ============================================================
       CAMBIO DE MUNICIPIO

       Al cambiar de municipio descartamos cualquier simulación
       anterior para evitar comparar municipios diferentes.
    ============================================================ */

    function handleMunicipalityChange(
        municipalityCode: string
    ) {

        setSelectedMunicipalityCode(
            municipalityCode
        );


        setSimulatedForecast(
            null
        );

    }


    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div
            className="
                w-full
                space-y-4
            "
        >

            {/* ============================================================
                ERROR GLOBAL
            ============================================================ */}

            {error && (

                <div
                    className="
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                    "
                >

                    <p
                        className="
                            text-[12px]
                            font-semibold
                            text-red-700
                        "
                    >
                        No fue posible cargar los municipios del Huila
                    </p>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-red-600
                        "
                    >
                        {error}
                    </p>

                </div>

            )}


            {/* ============================================================
                CONFIGURACIÓN GLOBAL
                MUNICIPIO + HORIZONTE
            ============================================================ */}

            <PredictionControls
                municipalities={
                    municipalities
                }
                selectedMunicipalityCode={
                    selectedMunicipalityCode
                }
                selectedHorizon={
                    selectedHorizon
                }
                onMunicipalityChange={
                    handleMunicipalityChange
                }
                onHorizonChange={
                    setSelectedHorizon
                }
                disabled={
                    loading ||
                    Boolean(error)
                }
            />


            {/* ============================================================
                TARJETAS RESUMEN
            ============================================================ */}

            <section>

                <PredictionSummaryCards
                    municipalities={
                        municipalities
                    }
                    selectedMunicipalityCode={
                        selectedMunicipalityCode
                    }
                    selectedHorizon={
                        selectedHorizon
                    }
                />

            </section>


            {/* ============================================================
                BLOQUE PRINCIPAL
                MAPA + OBSERVADOS VS PREDICCIÓN + FACTORES
            ============================================================ */}

            <section
                className="
                    grid
                    w-full
                    grid-cols-1
                    gap-4
                    xl:grid-cols-[1.45fr_1.15fr_0.8fr]
                    xl:items-start
                "
            >

                {/* ========================================================
                    MAPA DE RIESGO
                    SE IMPLEMENTARÁ AL FINAL
                ======================================================== */}

                <div
                    className="
                        min-w-0
                        xl:h-[460px]
                    "
                >

                    <PredictionPanel
                        title="Mapa de riesgo epidémico"
                        subtitle={`Dengue · Huila · +${selectedHorizon} ${selectedHorizon === 1
                            ? "semana"
                            : "semanas"
                            }`}
                        minHeight="min-h-[460px]"
                    />

                </div>


                {/* ========================================================
                    OBSERVADOS VS PREDICCIÓN
                ======================================================== */}

                <div
                    className="
                        min-w-0
                        xl:h-[460px]
                    "
                >

                    <PredictionHistoryForecastChart
                        municipalities={
                            municipalities
                        }
                        selectedMunicipalityCode={
                            selectedMunicipalityCode
                        }
                        selectedHorizon={
                            selectedHorizon
                        }
                    />

                </div>


                {/* ========================================================
                    FACTORES DEL ESCENARIO
                ======================================================== */}

                <div
                    className="
                        min-w-0
                        xl:h-[460px]
                    "
                >

                    <PredictionScenarioFactors
                        municipalities={
                            municipalities
                        }
                        selectedMunicipalityCode={
                            selectedMunicipalityCode
                        }
                    />

                </div>

            </section>


            {/* ============================================================
                BLOQUE DE ANÁLISIS Y SIMULACIÓN
            ============================================================ */}

            <section
                className="
                    w-full
                    space-y-4
                "
            >

                {/* ========================================================
                    FILA SUPERIOR
                    SENSIBILIDAD + SIMULADOR + BASE VS SIMULADO
                ======================================================== */}

                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        gap-4
                        xl:grid-cols-[1fr_1.3fr_1fr]
                        xl:items-stretch
                    "
                >

                    {/* ====================================================
                        RELACIÓN VARIABLES - CASOS
                    ==================================================== */}

                    <div
                        className="
                            min-w-0
                            xl:h-[420px]
                        "
                    >

                        <PredictionVariableSensitivity
                            municipalities={
                                municipalities
                            }
                            selectedMunicipalityCode={
                                selectedMunicipalityCode
                            }
                            selectedHorizon={
                                selectedHorizon
                            }
                        />

                    </div>


                    {/* ====================================================
                        SIMULADOR
                    ==================================================== */}

                    <div
                        className="
                            min-w-0
                            xl:h-[420px]
                        "
                    >

                        <PredictionScenarioSimulator
                            municipalities={
                                municipalities
                            }
                            selectedMunicipalityCode={
                                selectedMunicipalityCode
                            }
                            selectedHorizon={
                                selectedHorizon
                            }
                            onSimulationChange={
                                setSimulatedForecast
                            }
                        />

                    </div>


                    {/* ====================================================
                        COMPORTAMIENTO DEL RIESGO
                        BASE VS SIMULADO
                    ==================================================== */}

                    <div
                        className="
                            min-w-0
                            xl:h-[420px]
                        "
                    >

                        <PredictionRiskComparison
                            municipalities={
                                municipalities
                            }
                            selectedMunicipalityCode={
                                selectedMunicipalityCode
                            }
                            selectedHorizon={
                                selectedHorizon
                            }
                            simulatedForecast={
                                simulatedForecast
                            }
                        />

                    </div>

                </div>


                {/* ========================================================
                    FILA INFERIOR
                    IMPACTO DE VARIABLES — ANCHO COMPLETO
                ======================================================== */}

                <div
                    className="
                        w-full
                        min-w-0
                    "
                >

                    <PredictionVariableImpact
                        municipalities={
                            municipalities
                        }
                        selectedMunicipalityCode={
                            selectedMunicipalityCode
                        }
                        selectedHorizon={
                            selectedHorizon
                        }
                    />

                </div>

            </section>


            {/* ============================================================
                BLOQUE FINAL
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
                    ALERTAS
                ======================================================== */}

                <div
                    className="
                        h-full
                        min-w-0
                    "
                >

                    <PredictionAlerts
                        municipalities={
                            municipalities
                        }
                        selectedMunicipalityCode={
                            selectedMunicipalityCode
                        }
                        selectedHorizon={
                            selectedHorizon
                        }
                    />

                </div>


                {/* ========================================================
                    RECOMENDACIONES
                ======================================================== */}

                <div
                    className="
                        h-full
                        min-w-0
                    "
                >

                    <PredictionRecommendations
                        municipalities={
                            municipalities
                        }
                        selectedMunicipalityCode={
                            selectedMunicipalityCode
                        }
                        selectedHorizon={
                            selectedHorizon
                        }
                    />

                </div>


                {/* ========================================================
                    ESCENARIOS
                ======================================================== */}

                <div
                    className="
                        h-full
                        min-w-0
                    "
                >

                    <PredictionScenarios
                        municipalities={
                            municipalities
                        }
                        selectedMunicipalityCode={
                            selectedMunicipalityCode
                        }
                    />

                </div>

            </section>

        </div>

    );

}