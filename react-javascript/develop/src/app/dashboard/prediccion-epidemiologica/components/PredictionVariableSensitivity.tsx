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
    Thermometer,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type {
    PredictionClimateInput,
    PredictionClimateRangesResponse,
    PredictionHorizon,
    PredictionMunicipality,
} from "../data/predictionApi";

import {
    createMeanClimateInput,
    getForecastByHorizon,
    getPredictionClimateRanges,
    predictMunicipality,
} from "../services/predictionApi.service";


/* ============================================================================
   TIPOS
============================================================================ */

interface PredictionVariableSensitivityProps {

    municipalities: PredictionMunicipality[];

    selectedMunicipalityCode: string;

    selectedHorizon: PredictionHorizon;

}


type VariableKey =
    keyof PredictionClimateInput;


interface VariableDefinition {

    key: VariableKey;

    label: string;

    shortLabel: string;

    unit: string;

    icon: ReactNode;

    decimals: number;

}


interface SensitivityPoint {

    value: number;

    label: string;

    cases: number;

    incidence: number;

    riskLevel: string;

    riskColor: string;

}


/* ============================================================================
   VARIABLES DISPONIBLES
============================================================================ */

const VARIABLES: VariableDefinition[] = [

    {
        key: "temp_mean",
        label: "Temperatura media",
        shortLabel: "Temp. media",
        unit: "°C",
        icon: (
            <Thermometer size={14} />
        ),
        decimals: 1,
    },

    {
        key: "precip_mean",
        label: "Precipitación media",
        shortLabel: "Precipitación",
        unit: "mm",
        icon: (
            <CloudRain size={14} />
        ),
        decimals: 1,
    },

    {
        key: "rh_mean",
        label: "Humedad relativa",
        shortLabel: "Humedad",
        unit: "%",
        icon: (
            <Droplets size={14} />
        ),
        decimals: 1,
    },

    {
        key: "temp_max_mean",
        label: "Temperatura máxima",
        shortLabel: "Temp. máxima",
        unit: "°C",
        icon: (
            <Thermometer size={14} />
        ),
        decimals: 1,
    },

    {
        key: "temp_min_mean",
        label: "Temperatura mínima",
        shortLabel: "Temp. mínima",
        unit: "°C",
        icon: (
            <Thermometer size={14} />
        ),
        decimals: 1,
    },

    {
        key: "dengue_lag1",
        label: "Casos previos",
        shortLabel: "Casos previos",
        unit: "casos",
        icon: (
            <Activity size={14} />
        ),
        decimals: 0,
    },

];


/* ============================================================================
   FORMATO
============================================================================ */

function formatNumber(
    value: number,
    decimals = 2
): string {

    return new Intl.NumberFormat(
        "es-CO",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }
    ).format(value);

}


/* ============================================================================
   GENERAR VALORES DE SENSIBILIDAD
============================================================================ */

function createSensitivityValues(
    ranges: PredictionClimateRangesResponse,
    variable: VariableDefinition
): number[] {

    const range =
        ranges.ranges[
            variable.key
        ];


    /*
     * Ventana de análisis:
     *
     * media - 2 desviaciones estándar
     *             ↓
     *           media
     *             ↓
     * media + 2 desviaciones estándar
     *
     * Siempre respetando los límites reales
     * entregados por /climate-ranges.
     */

    const lower =
        Math.max(
            range.min,
            range.mean -
            range.std * 2
        );


    const upper =
        Math.min(
            range.max,
            range.mean +
            range.std * 2
        );


    const numberOfPoints =
        7;


    const step =
        (upper - lower) /
        (numberOfPoints - 1);


    const values =
        Array.from(
            {
                length:
                    numberOfPoints,
            },
            (_, index) => {

                let value =
                    lower +
                    step * index;


                /*
                 * dengue_lag1 representa casos,
                 * por lo que debe manejarse como entero.
                 */

                if (
                    variable.key ===
                    "dengue_lag1"
                ) {

                    value =
                        Math.max(
                            1,
                            Math.round(
                                value
                            )
                        );

                }


                return value;

            }
        );


    /*
     * Evitamos valores repetidos después
     * del redondeo de dengue_lag1.
     */

    return Array.from(
        new Set(
            values
        )
    );

}


/* ============================================================================
   COMPONENTE
============================================================================ */

export default function PredictionVariableSensitivity({

    municipalities,

    selectedMunicipalityCode,

    selectedHorizon,

}: PredictionVariableSensitivityProps) {

    /* ============================================================
       VARIABLE SELECCIONADA
    ============================================================ */

    const [
        selectedVariableKey,
        setSelectedVariableKey,
    ] = useState<VariableKey>(
        "temp_mean"
    );


    /* ============================================================
       DATOS
    ============================================================ */

    const [
        ranges,
        setRanges,
    ] = useState<PredictionClimateRangesResponse | null>(
        null
    );


    const [
        points,
        setPoints,
    ] = useState<SensitivityPoint[]>([]);


    const [
        baseCases,
        setBaseCases,
    ] = useState<number | null>(
        null
    );


    /* ============================================================
       ESTADO
    ============================================================ */

    const [
        loading,
        setLoading,
    ] = useState<boolean>(
        true
    );


    const [
        error,
        setError,
    ] = useState<string | null>(
        null
    );


    /* ============================================================
       MUNICIPIO
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
       CONFIGURACIÓN DE VARIABLE
    ============================================================ */

    const selectedVariable =
        useMemo(
            () =>
                VARIABLES.find(
                    (variable) =>
                        variable.key ===
                        selectedVariableKey
                ) ??
                VARIABLES[0],
            [
                selectedVariableKey,
            ]
        );


    /* ============================================================
       ANÁLISIS DE SENSIBILIDAD
    ============================================================ */

    useEffect(() => {

        if (!selectedMunicipality) {
            return;
        }


        let cancelled =
            false;


        async function loadSensitivity() {

            try {

                setLoading(
                    true
                );


                setError(
                    null
                );


                /* ====================================================
                   RANGOS + ESCENARIO BASE
                ==================================================== */

                const rangeResponse =
                    await getPredictionClimateRanges();


                const baseClimate =
                    createMeanClimateInput(
                        rangeResponse
                    );


                const sensitivityValues =
                    createSensitivityValues(
                        rangeResponse,
                        selectedVariable
                    );


                /* ====================================================
                   PREDICCIÓN BASE
                ==================================================== */

                const basePrediction =
                    await predictMunicipality({

                        municipality:
                            selectedMunicipality!.name,

                        climate:
                            baseClimate,

                    });


                const baseForecast =
                    getForecastByHorizon(
                        basePrediction,
                        selectedHorizon
                    );


                /* ====================================================
                   PREDICCIONES DE SENSIBILIDAD

                   Modificamos una sola variable.
                   Las demás permanecen en el escenario base.
                ==================================================== */

                const responses =
                    await Promise.all(

                        sensitivityValues.map(
                            async (
                                variableValue
                            ) => {

                                const climate: PredictionClimateInput = {

                                    ...baseClimate,

                                    [selectedVariable.key]:
                                        variableValue,

                                };


                                const prediction =
                                    await predictMunicipality({

                                        municipality:
                                            selectedMunicipality!.name,

                                        climate,

                                    });


                                const forecast =
                                    getForecastByHorizon(
                                        prediction,
                                        selectedHorizon
                                    );


                                if (!forecast) {

                                    return null;

                                }


                                return {

                                    value:
                                        variableValue,

                                    label:
                                        formatNumber(
                                            variableValue,
                                            selectedVariable.decimals
                                        ),

                                    cases:
                                        forecast.predicted_cases,

                                    incidence:
                                        forecast.incidence,

                                    riskLevel:
                                        forecast.risk_level,

                                    riskColor:
                                        forecast.risk_color,

                                } satisfies SensitivityPoint;

                            }
                        )

                    );


                if (cancelled) {
                    return;
                }


                setRanges(
                    rangeResponse
                );


                setBaseCases(
                    baseForecast
                        ?.predicted_cases ??
                    null
                );


                setPoints(
                    responses.filter(
                        (
                            point
                        ): point is SensitivityPoint =>
                            point !== null
                    )
                );

            } catch (loadError) {

                console.error(
                    "Error calculando sensibilidad:",
                    loadError
                );


                if (cancelled) {
                    return;
                }


                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "No fue posible calcular la sensibilidad."
                );

            } finally {

                if (!cancelled) {

                    setLoading(
                        false
                    );

                }

            }

        }


        void loadSensitivity();


        return () => {

            cancelled =
                true;

        };

    }, [
        selectedMunicipality,
        selectedHorizon,
        selectedVariable,
    ]);


    /* ============================================================
       RESUMEN DEL ANÁLISIS
    ============================================================ */

    const firstPoint =
        points[0];


    const lastPoint =
        points[
            points.length - 1
        ];


    const totalVariation =
        firstPoint &&
        lastPoint &&
        firstPoint.cases !== 0

            ? (
                (
                    lastPoint.cases -
                    firstPoint.cases
                ) /
                firstPoint.cases
            ) * 100

            : null;


    const meanValue =
        ranges
            ? ranges.ranges[
                selectedVariable.key
            ].mean
            : null;


    /* ============================================================
       PANEL
    ============================================================ */

    return (

        <article
            className="
                flex
                h-full
                min-h-[320px]
                flex-col
                overflow-hidden
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
                HEADER
            ======================================================== */}

            <div
                className="
                    shrink-0
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Relación variables - casos
                </h2>


                <p
                    className="
                        mt-1
                        text-[10px]
                        text-slate-500
                    "
                >
                    Sensibilidad del modelo ante cambios controlados
                </p>

            </div>


            {/* ========================================================
                SELECTOR
            ======================================================== */}

            <div
                className="
                    mt-3
                    shrink-0
                "
            >

                <label
                    htmlFor="sensitivity-variable"
                    className="
                        mb-1
                        block
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-slate-400
                    "
                >
                    Variable analizada
                </label>


                <select
                    id="sensitivity-variable"
                    value={
                        selectedVariableKey
                    }
                    onChange={(
                        event
                    ) =>
                        setSelectedVariableKey(
                            event.target.value as VariableKey
                        )
                    }
                    className="
                        h-9
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-[10px]
                        font-semibold
                        text-slate-700
                        outline-none
                        focus:border-violet-300
                        focus:ring-2
                        focus:ring-violet-100
                    "
                >

                    {VARIABLES.map(
                        (variable) => (

                            <option
                                key={
                                    variable.key
                                }
                                value={
                                    variable.key
                                }
                            >
                                {variable.label}
                            </option>

                        )
                    )}

                </select>

            </div>


            {/* ========================================================
                CONTENIDO PRINCIPAL
            ======================================================== */}

            <div
                className="
                    flex
                    min-h-0
                    flex-1
                    flex-col
                "
            >

                {/* ====================================================
                    LOADING
                ==================================================== */}

                {loading && (

                    <div
                        className="
                            flex
                            min-h-0
                            flex-1
                            items-center
                            justify-center
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
                                    text-[9px]
                                "
                            >
                                Analizando sensibilidad...
                            </span>

                        </div>

                    </div>

                )}


                {/* ====================================================
                    ERROR
                ==================================================== */}

                {!loading &&
                    error && (

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


                {/* ====================================================
                    RESULTADO
                ==================================================== */}

                {!loading &&
                    !error &&
                    points.length > 0 && (

                    <>

                        {/* ================================================
                            GRÁFICO

                            flex-1 hace que utilice el espacio
                            restante dentro de los 420 px.
                        ================================================ */}

                        <div
                            className="
                                mt-2
                                min-h-[145px]
                                w-full
                                flex-1
                            "
                        >

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <LineChart
                                    data={
                                        points
                                    }
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        bottom: 2,
                                        left: -22,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E2E8F0"
                                    />


                                    <XAxis
                                        dataKey="label"
                                        tick={{
                                            fontSize: 8,
                                            fill:
                                                "#64748B",
                                        }}
                                        axisLine={{
                                            stroke:
                                                "#CBD5E1",
                                        }}
                                        tickLine={false}
                                    />


                                    <YAxis
                                        tick={{
                                            fontSize: 8,
                                            fill:
                                                "#64748B",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />


                                    <Tooltip
                                        content={({
                                            active,
                                            payload,
                                        }) => {

                                            if (
                                                !active ||
                                                !payload ||
                                                payload.length === 0
                                            ) {
                                                return null;
                                            }


                                            const point =
                                                payload[0]
                                                    .payload as SensitivityPoint;


                                            return (

                                                <div
                                                    className="
                                                        min-w-[140px]
                                                        rounded-lg
                                                        border
                                                        border-slate-200
                                                        bg-white
                                                        px-3
                                                        py-2
                                                        shadow-lg
                                                    "
                                                >

                                                    <p
                                                        className="
                                                            text-[9px]
                                                            font-semibold
                                                            text-slate-700
                                                        "
                                                    >
                                                        {
                                                            selectedVariable.shortLabel
                                                        }:{" "}
                                                        {
                                                            point.label
                                                        }{" "}
                                                        {
                                                            selectedVariable.unit
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[11px]
                                                            font-bold
                                                            text-violet-600
                                                        "
                                                    >
                                                        {
                                                            point.cases.toFixed(
                                                                2
                                                            )
                                                        } casos
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[8px]
                                                            text-slate-400
                                                        "
                                                    >
                                                        Incidencia:{" "}
                                                        {
                                                            point.incidence.toFixed(
                                                                2
                                                            )
                                                        }
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-[8px]
                                                            font-semibold
                                                        "
                                                        style={{
                                                            color:
                                                                point.riskColor,
                                                        }}
                                                    >
                                                        Riesgo:{" "}
                                                        {
                                                            point.riskLevel
                                                        }
                                                    </p>

                                                </div>

                                            );

                                        }}
                                    />


                                    {/* ====================================
                                        VALOR MEDIO
                                    ==================================== */}

                                    {meanValue !== null && (

                                        <ReferenceLine
                                            x={
                                                formatNumber(
                                                    meanValue,
                                                    selectedVariable.decimals
                                                )
                                            }
                                            stroke="#94A3B8"
                                            strokeDasharray="4 4"
                                        />

                                    )}


                                    {/* ====================================
                                        CURVA DE SENSIBILIDAD
                                    ==================================== */}

                                    <Line
                                        type="monotone"
                                        dataKey="cases"
                                        stroke="#7C3AED"
                                        strokeWidth={2.5}
                                        dot={{
                                            r: 3,
                                            fill:
                                                "#7C3AED",
                                            stroke:
                                                "#FFFFFF",
                                            strokeWidth: 1.5,
                                        }}
                                        activeDot={{
                                            r: 5,
                                        }}
                                        isAnimationActive={false}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>


                        {/* ================================================
                            RESUMEN
                        ================================================ */}

                        <div
                            className="
                                mt-2
                                grid
                                shrink-0
                                grid-cols-2
                                gap-2
                            "
                        >

                            {/* ESCENARIO BASE */}

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50/50
                                    px-3
                                    py-1.5
                                "
                            >

                                <p
                                    className="
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    Escenario base
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-[12px]
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    {baseCases !== null
                                        ? `${formatNumber(
                                            baseCases,
                                            2
                                        )} casos`
                                        : "Sin dato"}
                                </p>

                            </div>


                            {/* VALOR MEDIO */}

                            <div
                                className="
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-slate-50/50
                                    px-3
                                    py-1.5
                                "
                            >

                                <p
                                    className="
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    Valor medio
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-[12px]
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    {meanValue !== null
                                        ? `${formatNumber(
                                            meanValue,
                                            selectedVariable.decimals
                                        )} ${selectedVariable.unit}`
                                        : "Sin dato"}
                                </p>

                            </div>

                        </div>


                        {/* ================================================
                            VARIACIÓN ENTRE EXTREMOS
                        ================================================ */}

                        {totalVariation !== null && (

                            <div
                                className="
                                    mt-2
                                    flex
                                    shrink-0
                                    items-center
                                    justify-between
                                    rounded-lg
                                    border
                                    border-slate-200
                                    px-3
                                    py-1.5
                                "
                            >

                                <span
                                    className="
                                        text-[8px]
                                        text-slate-500
                                    "
                                >
                                    Cambio entre extremos analizados
                                </span>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    {totalVariation > 0 ? (

                                        <TrendingUp
                                            size={12}
                                            className="
                                                text-red-500
                                            "
                                        />

                                    ) : totalVariation < 0 ? (

                                        <TrendingDown
                                            size={12}
                                            className="
                                                text-emerald-500
                                            "
                                        />

                                    ) : null}


                                    <span
                                        className={`
                                            text-[10px]
                                            font-bold
                                            ${
                                                totalVariation > 0
                                                    ? "text-red-500"
                                                    : totalVariation < 0
                                                        ? "text-emerald-600"
                                                        : "text-slate-600"
                                            }
                                        `}
                                    >
                                        {totalVariation > 0
                                            ? "+"
                                            : ""}

                                        {totalVariation.toFixed(
                                            1
                                        )}
                                        %
                                    </span>

                                </div>

                            </div>

                        )}

                    </>

                )}

            </div>

        </article>

    );

}