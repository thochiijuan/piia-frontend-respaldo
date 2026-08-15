"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    ReactNode,
} from "react";

import {
    Activity,
    CloudRain,
    Droplets,
    Loader2,
    Play,
    RotateCcw,
    Thermometer,
} from "lucide-react";

import type {
    MunicipalityForecast,
    PredictionClimateInput,
    PredictionClimateRangesResponse,
    PredictionHorizon,
    PredictionMunicipality,
} from "../data/predictionApi";

import {
    getForecastByHorizon,
    getPredictionClimateRanges,
    getPredictionMunicipalityFactors,
    predictMunicipality,
} from "../services/predictionApi.service";


/* ============================================================================
   PROPS
============================================================================ */

interface PredictionScenarioSimulatorProps {

    municipalities: PredictionMunicipality[];

    selectedMunicipalityCode: string;

    selectedHorizon: PredictionHorizon;

    onSimulationChange:
        (forecast: MunicipalityForecast | null) => void;

}


/* ============================================================================
   VARIABLES
============================================================================ */

type ClimateVariableKey =
    keyof PredictionClimateInput;


interface VariableConfig {

    key: ClimateVariableKey;

    label: string;

    unit: string;

    step: number;

    icon: ReactNode;

    iconClassName: string;

    integer?: boolean;

}


const VARIABLES: VariableConfig[] = [

    {
        key: "precip_mean",
        label: "Precipitación",
        unit: "mm",
        step: 0.1,
        icon: (
            <CloudRain size={14} />
        ),
        iconClassName:
            "bg-blue-50 text-blue-600",
    },

    {
        key: "temp_mean",
        label: "Temperatura media",
        unit: "°C",
        step: 0.1,
        icon: (
            <Thermometer size={14} />
        ),
        iconClassName:
            "bg-orange-50 text-orange-500",
    },

    {
        key: "temp_max_mean",
        label: "Temperatura máxima",
        unit: "°C",
        step: 0.1,
        icon: (
            <Thermometer size={14} />
        ),
        iconClassName:
            "bg-red-50 text-red-500",
    },

    {
        key: "temp_min_mean",
        label: "Temperatura mínima",
        unit: "°C",
        step: 0.1,
        icon: (
            <Thermometer size={14} />
        ),
        iconClassName:
            "bg-cyan-50 text-cyan-600",
    },

    {
        key: "rh_mean",
        label: "Humedad relativa",
        unit: "%",
        step: 0.1,
        icon: (
            <Droplets size={14} />
        ),
        iconClassName:
            "bg-sky-50 text-sky-600",
    },

    {
        key: "dengue_lag1",
        label: "Casos previos",
        unit: "casos",
        step: 1,
        integer: true,
        icon: (
            <Activity size={14} />
        ),
        iconClassName:
            "bg-violet-50 text-violet-600",
    },

];


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionScenarioSimulator({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

    onSimulationChange,

}: PredictionScenarioSimulatorProps) {

    const [
        ranges,
        setRanges,
    ] = useState<PredictionClimateRangesResponse | null>(
        null
    );


    const [
        values,
        setValues,
    ] = useState<PredictionClimateInput | null>(
        null
    );


    const [
        baseValues,
        setBaseValues,
    ] = useState<PredictionClimateInput | null>(
        null
    );


    const [
        simulation,
        setSimulation,
    ] = useState<MunicipalityForecast | null>(
        null
    );


    const [
        loading,
        setLoading,
    ] = useState<boolean>(true);


    const [
        simulating,
        setSimulating,
    ] = useState<boolean>(false);


    const [
        error,
        setError,
    ] = useState<string | null>(null);


    /* ============================================================
       MUNICIPIO SELECCIONADO
    ============================================================ */

    const selectedMunicipality =
        useMemo(
            () =>
                municipalities.find(
                    (municipality) =>
                        municipality.code ===
                        selectedMunicipalityCode
                ),
            [
                municipalities,
                selectedMunicipalityCode,
            ]
        );


    /* ============================================================
       CARGA DE RANGOS + FACTORES REALES DEL MUNICIPIO

       /climate-ranges
       → únicamente límites estadísticos de sliders.

       /municipality-factors/{municipality}
       → valores iniciales reales del municipio.
    ============================================================ */

    useEffect(() => {

        let cancelled = false;


        async function loadScenario() {

            if (!selectedMunicipality) {

                setRanges(null);

                setValues(null);

                setBaseValues(null);

                setSimulation(null);

                setLoading(false);

                onSimulationChange(
                    null
                );

                return;

            }


            try {

                setLoading(true);

                setError(null);


                const [
                    rangesResponse,
                    municipalityFactorsResponse,
                ] =
                    await Promise.all([

                        getPredictionClimateRanges(),

                        getPredictionMunicipalityFactors(
                            selectedMunicipality.name
                        ),

                    ]);


                if (cancelled) {
                    return;
                }


                const municipalityBase:
                    PredictionClimateInput = {

                    precip_mean:
                        municipalityFactorsResponse
                            .factors
                            .precip_mean,

                    temp_mean:
                        municipalityFactorsResponse
                            .factors
                            .temp_mean,

                    temp_max_mean:
                        municipalityFactorsResponse
                            .factors
                            .temp_max_mean,

                    temp_min_mean:
                        municipalityFactorsResponse
                            .factors
                            .temp_min_mean,

                    rh_mean:
                        municipalityFactorsResponse
                            .factors
                            .rh_mean,

                    dengue_lag1:
                        Math.round(
                            municipalityFactorsResponse
                                .factors
                                .dengue_lag1
                        ),

                };


                setRanges(
                    rangesResponse
                );


                setValues({
                    ...municipalityBase,
                });


                setBaseValues({
                    ...municipalityBase,
                });


                setSimulation(
                    null
                );


                onSimulationChange(
                    null
                );

            } catch (loadError) {

                console.error(
                    "Error cargando escenario del simulador:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible cargar el simulador."
                );


                setValues(
                    null
                );


                setBaseValues(
                    null
                );


                setSimulation(
                    null
                );


                onSimulationChange(
                    null
                );

            } finally {

                if (!cancelled) {

                    setLoading(false);

                }

            }

        }


        void loadScenario();


        return () => {

            cancelled = true;

        };

    }, [
        selectedMunicipality,
        onSimulationChange,
    ]);


    /* ============================================================
       ACTUALIZAR VARIABLE
    ============================================================ */

    function updateVariable(
        key: ClimateVariableKey,
        rawValue: number
    ) {

        if (
            !values ||
            !ranges
        ) {
            return;
        }


        const range =
            ranges.ranges[key];


        let safeValue =
            Math.min(
                range.max,
                Math.max(
                    range.min,
                    rawValue
                )
            );


        if (
            key === "dengue_lag1"
        ) {

            safeValue =
                Math.round(
                    safeValue
                );

        }


        setValues({

            ...values,

            [key]:
                safeValue,

        });


        /*
         * Si una variable cambia,
         * el resultado anterior ya no representa
         * el escenario actual.
         */

        setSimulation(
            null
        );


        onSimulationChange(
            null
        );

    }


    /* ============================================================
       RESTABLECER
    ============================================================ */

    function resetScenario() {

        if (!baseValues) {
            return;
        }


        setValues({
            ...baseValues,
        });


        setSimulation(
            null
        );


        onSimulationChange(
            null
        );


        setError(
            null
        );

    }


    /* ============================================================
       EJECUTAR SIMULACIÓN
    ============================================================ */

    async function handleSimulate() {

        if (
            !selectedMunicipality ||
            !values
        ) {
            return;
        }


        try {

            setSimulating(true);

            setError(null);


            const response =
                await predictMunicipality({

                    municipality:
                        selectedMunicipality.name,

                    climate:
                        values,

                });


            setSimulation(
                response
            );


            /*
             * Compartimos la simulación con
             * PredictionDashboard.
             */

            onSimulationChange(
                response
            );

        } catch (simulationError) {

            console.error(
                "Error simulando escenario:",
                simulationError
            );


            setError(
                simulationError instanceof Error
                    ? simulationError.message
                    : "No fue posible ejecutar la simulación."
            );

        } finally {

            setSimulating(false);

        }

    }


    /* ============================================================
       HORIZONTE SELECCIONADO
    ============================================================ */

    const selectedForecast =
        simulation
            ? getForecastByHorizon(
                simulation,
                selectedHorizon
            )
            : null;


    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {

        return (

            <article
                className="
                    flex
                    h-full
                    min-h-[320px]
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    xl:min-h-0
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-2
                        text-slate-400
                    "
                >

                    <Loader2
                        size={20}
                        className="animate-spin"
                    />


                    <span
                        className="
                            text-[10px]
                        "
                    >
                        Cargando variables...
                    </span>

                </div>

            </article>

        );

    }


    /* ============================================================
       ERROR DE CARGA
    ============================================================ */

    if (
        !ranges ||
        !values
    ) {

        return (

            <article
                className="
                    h-full
                    min-h-[320px]
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                    shadow-sm
                    xl:min-h-0
                "
            >

                <p
                    className="
                        text-[11px]
                        text-red-500
                    "
                >
                    {error ??
                        "No fue posible cargar las variables."}
                </p>

            </article>

        );

    }


    /* ============================================================
       PANEL PRINCIPAL

       IMPORTANTE:
       - h-full: respeta los 420 px del Dashboard.
       - xl:min-h-0: evita que el contenido fuerce crecimiento.
       - overflow-y-auto: aparece scroll interno si se simula.
    ============================================================ */

    return (

        <article
            className="
                h-full
                min-h-[320px]
                overflow-y-auto
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                xl:min-h-0
            "
        >

            {/* ========================================================
                ENCABEZADO
            ======================================================== */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div
                    className="
                        min-w-0
                    "
                >

                    <h2
                        className="
                            text-[17px]
                            font-bold
                            text-slate-800
                        "
                    >
                        Variables del escenario predictivo
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Modifica las entradas del modelo y ejecuta una simulación
                    </p>

                </div>


                <span
                    className="
                        shrink-0
                        rounded-lg
                        border
                        border-violet-100
                        bg-violet-50
                        px-2.5
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-violet-700
                    "
                >
                    {selectedMunicipality?.name ??
                        "Municipio"}
                </span>

            </div>


            {/* ========================================================
                VARIABLES
            ======================================================== */}

            <div
                className="
                    mt-4
                    grid
                    grid-cols-1
                    gap-3
                    md:grid-cols-2
                "
            >

                {VARIABLES.map(
                    (variable) => {

                        const range =
                            ranges.ranges[
                                variable.key
                            ];


                        const value =
                            values[
                                variable.key
                            ];


                        return (

                            <div
                                key={
                                    variable.key
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50/40
                                    p-3
                                "
                            >

                                {/* ========================================
                                    VARIABLE + VALOR
                                ======================================== */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-2
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            min-w-0
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <div
                                            className={`
                                                flex
                                                h-7
                                                w-7
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-lg
                                                ${variable.iconClassName}
                                            `}
                                        >
                                            {variable.icon}
                                        </div>


                                        <p
                                            className="
                                                truncate
                                                text-[10px]
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            {variable.label}
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                        "
                                    >

                                        <input
                                            type="number"
                                            min={
                                                range.min
                                            }
                                            max={
                                                range.max
                                            }
                                            step={
                                                variable.step
                                            }
                                            value={
                                                variable.integer
                                                    ? Math.round(
                                                        value
                                                    )
                                                    : Number(
                                                        value.toFixed(
                                                            2
                                                        )
                                                    )
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                updateVariable(
                                                    variable.key,
                                                    Number(
                                                        event.target.value
                                                    )
                                                )
                                            }
                                            className="
                                                h-8
                                                w-[74px]
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                px-2
                                                text-right
                                                text-[10px]
                                                font-semibold
                                                text-slate-700
                                                outline-none
                                                focus:border-violet-300
                                                focus:ring-2
                                                focus:ring-violet-100
                                            "
                                        />


                                        <span
                                            className="
                                                min-w-[28px]
                                                text-[9px]
                                                text-slate-400
                                            "
                                        >
                                            {variable.unit}
                                        </span>

                                    </div>

                                </div>


                                {/* ========================================
                                    SLIDER
                                ======================================== */}

                                <input
                                    type="range"
                                    min={
                                        range.min
                                    }
                                    max={
                                        range.max
                                    }
                                    step={
                                        variable.step
                                    }
                                    value={
                                        value
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        updateVariable(
                                            variable.key,
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                    className="
                                        mt-3
                                        w-full
                                        accent-violet-600
                                    "
                                />


                                {/* ========================================
                                    MIN / MEDIA / MAX
                                ======================================== */}

                                <div
                                    className="
                                        mt-1
                                        flex
                                        items-center
                                        justify-between
                                        text-[8px]
                                        text-slate-400
                                    "
                                >

                                    <span>
                                        Min{" "}
                                        {range.min.toFixed(
                                            variable.integer
                                                ? 0
                                                : 1
                                        )}
                                    </span>


                                    <span>
                                        Media{" "}
                                        {range.mean.toFixed(
                                            variable.integer
                                                ? 0
                                                : 1
                                        )}
                                    </span>


                                    <span>
                                        Max{" "}
                                        {range.max.toFixed(
                                            variable.integer
                                                ? 0
                                                : 1
                                        )}
                                    </span>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            {/* ========================================================
                BOTONES
            ======================================================== */}

            <div
                className="
                    mt-4
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <button
                    type="button"
                    onClick={
                        resetScenario
                    }
                    disabled={
                        simulating
                    }
                    className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-4
                        text-[11px]
                        font-semibold
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <RotateCcw
                        size={14}
                    />

                    Restablecer

                </button>


                <button
                    type="button"
                    onClick={
                        handleSimulate
                    }
                    disabled={
                        simulating ||
                        !selectedMunicipality
                    }
                    className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-violet-200
                        bg-violet-600
                        px-5
                        text-[11px]
                        font-semibold
                        text-white
                        transition
                        hover:bg-violet-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {simulating ? (

                        <Loader2
                            size={14}
                            className="
                                animate-spin
                            "
                        />

                    ) : (

                        <Play
                            size={14}
                        />

                    )}


                    {simulating
                        ? "Simulando..."
                        : "Simular escenario"}

                </button>

            </div>


            {/* ========================================================
                ERROR DE SIMULACIÓN
            ======================================================== */}

            {error && (

                <div
                    className="
                        mt-3
                        rounded-lg
                        border
                        border-red-100
                        bg-red-50
                        px-3
                        py-2
                    "
                >

                    <p
                        className="
                            text-[9px]
                            text-red-600
                        "
                    >
                        {error}
                    </p>

                </div>

            )}


            {/* ========================================================
                RESULTADO SIMULADO

                Aparece debajo de los controles.
                Debido al overflow-y-auto del article,
                la tarjeta NO aumenta de altura.
            ======================================================== */}

            {selectedForecast && (

                <div
                    className="
                        mt-4
                        rounded-xl
                        border
                        border-violet-100
                        bg-violet-50/60
                        p-3
                    "
                >

                    {/* ================================================
                        CABECERA DEL RESULTADO
                    ================================================ */}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-violet-500
                                "
                            >
                                Resultado simulado
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Horizonte +{selectedHorizon}{" "}
                                {selectedHorizon === 1
                                    ? "semana"
                                    : "semanas"}
                            </p>

                        </div>


                        <span
                            className="
                                rounded-full
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                            "
                            style={{
                                color:
                                    selectedForecast
                                        .risk_color,

                                backgroundColor:
                                    `${selectedForecast
                                        .risk_color}15`,
                            }}
                        >
                            {
                                selectedForecast
                                    .risk_level
                            }
                        </span>

                    </div>


                    {/* ================================================
                        CASOS + INCIDENCIA
                    ================================================ */}

                    <div
                        className="
                            mt-3
                            grid
                            grid-cols-2
                            gap-2
                        "
                    >

                        {/* CASOS */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-violet-100
                                bg-white
                                px-3
                                py-2
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                Casos esperados
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[15px]
                                    font-bold
                                    text-violet-600
                                "
                            >
                                {
                                    selectedForecast
                                        .predicted_cases
                                        .toFixed(2)
                                }
                            </p>

                        </div>


                        {/* INCIDENCIA */}

                        <div
                            className="
                                rounded-lg
                                border
                                border-violet-100
                                bg-white
                                px-3
                                py-2
                            "
                        >

                            <p
                                className="
                                    text-[8px]
                                    text-slate-400
                                "
                            >
                                Incidencia
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[15px]
                                    font-bold
                                    text-orange-500
                                "
                            >
                                {
                                    selectedForecast
                                        .incidence
                                        .toFixed(2)
                                }
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </article>

    );

}