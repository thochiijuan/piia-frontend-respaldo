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
    getForecastByHorizon,
    getPredictionClimateRanges,
    getPredictionMunicipalityFactors,
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

   La ventana se construye alrededor del valor BASE DEL MUNICIPIO.

   Ejemplo:

   valor base - 2 desviaciones estándar
                  ↓
              valor base
                  ↓
   valor base + 2 desviaciones estándar

   Los límites siempre se restringen utilizando min/max
   de /climate-ranges.
============================================================================ */

function createSensitivityValues(
    ranges: PredictionClimateRangesResponse,
    variable: VariableDefinition,
    baseValue: number
): number[] {

    const range =
        ranges.ranges[
            variable.key
        ];


    const lower =
        Math.max(
            range.min,
            baseValue -
            range.std * 2
        );


    const upper =
        Math.min(
            range.max,
            baseValue +
            range.std * 2
        );


    /*
     * Generamos tres valores debajo del escenario base,
     * el escenario base y tres valores por encima.
     *
     * Esto garantiza que el punto base esté siempre
     * incluido en el análisis.
     */

    const lowerStep =
        (
            baseValue -
            lower
        ) / 3;


    const upperStep =
        (
            upper -
            baseValue
        ) / 3;


    let values = [

        lower,

        baseValue -
        lowerStep * 2,

        baseValue -
        lowerStep,

        baseValue,

        baseValue +
        upperStep,

        baseValue +
        upperStep * 2,

        upper,

    ];


    /*
     * dengue_lag1 representa número de casos.
     * Debe manejarse como entero.
     */

    if (
        variable.key ===
        "dengue_lag1"
    ) {

        values =
            values.map(
                (value) =>
                    Math.max(
                        range.min,
                        Math.min(
                            range.max,
                            Math.round(
                                value
                            )
                        )
                    )
            );

    }


    /*
     * Eliminamos posibles duplicados.
     *
     * Esto puede ocurrir principalmente cuando:
     *
     * - dengue_lag1 se redondea.
     * - el valor base está cerca de min/max.
     */

    return Array.from(
        new Set(
            values
        )
    ).sort(
        (a, b) =>
            a - b
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


    const [
        baseVariableValue,
        setBaseVariableValue,
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

            setPoints([]);

            setBaseCases(null);

            setBaseVariableValue(null);

            setLoading(false);

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
                   RANGOS + FACTORES BASE DEL MUNICIPIO
                ==================================================== */

                const [
                    rangeResponse,
                    municipalityFactorsResponse,
                ] =
                    await Promise.all([

                        getPredictionClimateRanges(),

                        getPredictionMunicipalityFactors(
                            selectedMunicipality!.name
                        ),

                    ]);


                /*
                 * Escenario base REAL del municipio.
                 *
                 * Ya no usamos createMeanClimateInput().
                 */

                const baseClimate:
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


                /*
                 * Valor base de la variable
                 * que estamos analizando.
                 */

                const currentBaseValue =
                    baseClimate[
                        selectedVariable.key
                    ];


                /*
                 * Los valores de sensibilidad se generan
                 * alrededor del valor base del municipio.
                 */

                const sensitivityValues =
                    createSensitivityValues(
                        rangeResponse,
                        selectedVariable,
                        currentBaseValue
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

                   Las demás permanecen con los valores base
                   propios del municipio.
                ==================================================== */

                const responses =
                    await Promise.all(

                        sensitivityValues.map(
                            async (
                                variableValue
                            ) => {

                                const climate:
                                    PredictionClimateInput = {

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


                setBaseVariableValue(
                    currentBaseValue
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


                setPoints([]);

                setBaseCases(null);

                setBaseVariableValue(null);

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


    /*
     * Conservamos esta referencia por si se necesita
     * mostrar información estadística posteriormente.
     *
     * Actualmente la línea vertical del gráfico
     * utilizará baseVariableValue.
     */

    const statisticalMean =
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
                                        VALOR BASE DEL MUNICIPIO
                                    ==================================== */}

                                    {baseVariableValue !== null && (

                                        <ReferenceLine
                                            x={
                                                formatNumber(
                                                    baseVariableValue,
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


                            {/* VALOR BASE */}

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
                                    Valor base
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-[12px]
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    {baseVariableValue !== null
                                        ? `${formatNumber(
                                            baseVariableValue,
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