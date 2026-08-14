/**
 * ============================================================================
 * Prediction API Test
 * ----------------------------------------------------------------------------
 * Página temporal utilizada únicamente para verificar la comunicación entre
 * el frontend Next.js y la API predictiva de Dengue.
 *
 * COBERTURA ACTUAL
 * ----------------------------------------------------------------------------
 *
 * Departamento:
 * Huila
 *
 * Enfermedad:
 * Dengue
 *
 * Endpoints probados:
 *
 * GET /api/v1/municipalities
 * GET /api/v1/metrics
 * GET /api/v1/climate-ranges
 *
 * Esta página podrá eliminarse cuando terminemos de validar la integración.
 * ============================================================================
 */

"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2,
    CircleAlert,
    Database,
    LoaderCircle,
} from "lucide-react";


/* ============================================================================
 * SERVICES
 * ============================================================================
 */

import {
    getPredictionClimateRanges,
    getPredictionMetrics,
    getPredictionMunicipalities,
} from "../services/predictionApi.service";


/* ============================================================================
 * TYPES
 * ============================================================================
 */

import type {
    PredictionClimateRangesResponse,
    PredictionMetricsResponse,
    PredictionMunicipality,
} from "../data/predictionApi";


/**
 * ============================================================================
 * ESTADO DE CONEXIÓN
 * ============================================================================
 */

type ConnectionStatus =
    | "loading"
    | "success"
    | "error";


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */

export default function PredictionApiTestPage() {

    /**
     * ========================================================================
     * MUNICIPIOS
     * ========================================================================
     */

    const [
        municipalities,
        setMunicipalities,
    ] = useState<PredictionMunicipality[]>([]);


    /**
     * ========================================================================
     * MÉTRICAS
     * ========================================================================
     */

    const [
        metrics,
        setMetrics,
    ] = useState<PredictionMetricsResponse | null>(
        null
    );


    /**
     * ========================================================================
     * RANGOS CLIMÁTICOS
     * ========================================================================
     */

    const [
        climateRanges,
        setClimateRanges,
    ] = useState<PredictionClimateRangesResponse | null>(
        null
    );


    /**
     * ========================================================================
     * ESTADO GENERAL
     * ========================================================================
     */

    const [
        status,
        setStatus,
    ] = useState<ConnectionStatus>(
        "loading"
    );


    /**
     * ========================================================================
     * ERROR
     * ========================================================================
     */

    const [
        error,
        setError,
    ] = useState("");


    /**
     * ========================================================================
     * CONSULTAR API
     * ========================================================================
     */

    useEffect(() => {

        let active =
            true;


        async function testConnection() {

            try {

                setStatus(
                    "loading"
                );


                setError(
                    ""
                );


                /**
                 * Ejecutamos las tres consultas simultáneamente.
                 */
                const [
                    municipalitiesResponse,
                    metricsResponse,
                    climateRangesResponse,
                ] = await Promise.all([

                    getPredictionMunicipalities(),

                    getPredictionMetrics(),

                    getPredictionClimateRanges(),

                ]);


                if (
                    !active
                ) {

                    return;

                }


                setMunicipalities(
                    municipalitiesResponse
                );


                setMetrics(
                    metricsResponse
                );


                setClimateRanges(
                    climateRangesResponse
                );


                setStatus(
                    "success"
                );

            }
            catch (
                requestError
            ) {

                console.error(
                    "Error conectando con la API predictiva:",
                    requestError
                );


                if (
                    !active
                ) {

                    return;

                }


                setStatus(
                    "error"
                );


                if (
                    requestError instanceof Error
                ) {

                    setError(
                        requestError.message
                    );

                }
                else {

                    setError(
                        "No fue posible conectar con la API predictiva."
                    );

                }

            }

        }


        void testConnection();


        return () => {

            active =
                false;

        };

    }, []);


    /**
     * ========================================================================
     * RENDER
     * ========================================================================
     */

    return (

        <div
            className="
                space-y-5
                p-6
            "
        >

            {/* ============================================================
                HEADER
            ============================================================ */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-violet-50
                            text-violet-600
                        "
                    >

                        <Database
                            size={21}
                        />

                    </div>


                    <div>

                        <h1
                            className="
                                text-[20px]
                                font-bold
                                text-slate-800
                            "
                        >
                            Prueba API predictiva
                        </h1>


                        <p
                            className="
                                mt-1
                                text-[12px]
                                text-slate-400
                            "
                        >
                            Dengue · Departamento del Huila
                        </p>

                    </div>

                </div>

            </div>


            {/* ============================================================
                ESTADO CARGANDO
            ============================================================ */}

            {status ===
                "loading" && (

                <div
                    className="
                        flex
                        min-h-[200px]
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    <div
                        className="
                            text-center
                        "
                    >

                        <LoaderCircle
                            size={28}
                            className="
                                mx-auto
                                animate-spin
                                text-violet-600
                            "
                        />


                        <p
                            className="
                                mt-3
                                text-[13px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            Conectando con la API...
                        </p>


                        <p
                            className="
                                mt-1
                                text-[11px]
                                text-slate-400
                            "
                        >
                            http://localhost:8000
                        </p>

                    </div>

                </div>

            )}


            {/* ============================================================
                ERROR
            ============================================================ */}

            {status ===
                "error" && (

                <div
                    className="
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <CircleAlert
                            size={20}
                            className="
                                mt-0.5
                                shrink-0
                                text-red-500
                            "
                        />


                        <div>

                            <p
                                className="
                                    text-[13px]
                                    font-bold
                                    text-red-700
                                "
                            >
                                No fue posible conectar con la API
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[11px]
                                    text-red-600
                                "
                            >
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* ============================================================
                CONEXIÓN EXITOSA
            ============================================================ */}

            {status ===
                "success" && (

                <>

                    {/* ====================================================
                        ESTADO GENERAL
                    ==================================================== */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-emerald-200
                            bg-emerald-50
                            p-4
                        "
                    >

                        <CheckCircle2
                            size={21}
                            className="
                                shrink-0
                                text-emerald-600
                            "
                        />


                        <div>

                            <p
                                className="
                                    text-[13px]
                                    font-bold
                                    text-emerald-700
                                "
                            >
                                Conexión exitosa
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[11px]
                                    text-emerald-600
                                "
                            >
                                El frontend está recibiendo información de la API predictiva.
                            </p>

                        </div>

                    </div>


                    {/* ====================================================
                        RESUMEN
                    ==================================================== */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-3
                        "
                    >

                        {/* MUNICIPIOS */}

                        <TestCard
                            title="Municipios"
                            value={municipalities.length}
                            description="Municipios disponibles del Huila"
                        />


                        {/* MODELOS */}

                        <TestCard
                            title="Horizontes"
                            value={
                                metrics
                                    ?.metrics
                                    .length ??
                                0
                            }
                            description="Modelos predictivos t+1 a t+4"
                        />


                        {/* VARIABLES */}

                        <TestCard
                            title="Variables"
                            value={
                                climateRanges
                                    ? Object.keys(
                                        climateRanges.ranges
                                    ).length
                                    : 0
                            }
                            description="Variables utilizadas por el modelo"
                        />

                    </div>


                    {/* ====================================================
                        MUNICIPIOS
                    ==================================================== */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <h2
                            className="
                                text-[16px]
                                font-bold
                                text-slate-800
                            "
                        >
                            Primeros municipios recibidos
                        </h2>


                        <div
                            className="
                                mt-4
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                            "
                        >

                            <table
                                className="
                                    w-full
                                    border-collapse
                                "
                            >

                                <thead>

                                    <tr
                                        className="
                                            border-b
                                            border-slate-200
                                            bg-slate-50
                                        "
                                    >

                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                                            Código
                                        </th>

                                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                                            Municipio
                                        </th>

                                        <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-500">
                                            Población
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {municipalities
                                        .slice(
                                            0,
                                            6
                                        )
                                        .map(
                                            (
                                                municipality
                                            ) => (

                                                <tr
                                                    key={
                                                        municipality.code
                                                    }
                                                    className="
                                                        border-b
                                                        border-slate-100
                                                        last:border-b-0
                                                    "
                                                >

                                                    <td
                                                        className="
                                                            px-4
                                                            py-3
                                                            text-[12px]
                                                            font-medium
                                                            text-slate-600
                                                        "
                                                    >
                                                        {municipality.code}
                                                    </td>


                                                    <td
                                                        className="
                                                            px-4
                                                            py-3
                                                            text-[12px]
                                                            font-semibold
                                                            text-slate-700
                                                        "
                                                    >
                                                        {municipality.name}
                                                    </td>


                                                    <td
                                                        className="
                                                            px-4
                                                            py-3
                                                            text-right
                                                            text-[12px]
                                                            text-slate-600
                                                        "
                                                    >
                                                        {
                                                            municipality.population.toLocaleString(
                                                                "es-CO"
                                                            )
                                                        }
                                                    </td>

                                                </tr>

                                            )
                                        )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* ====================================================
                        MÉTRICAS
                    ==================================================== */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >

                        <h2
                            className="
                                text-[16px]
                                font-bold
                                text-slate-800
                            "
                        >
                            Métricas recibidas
                        </h2>


                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-1
                                gap-3
                                md:grid-cols-4
                            "
                        >

                            {metrics
                                ?.metrics
                                .map(
                                    (
                                        metric
                                    ) => (

                                        <div
                                            key={
                                                metric.horizon
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50/50
                                                p-4
                                            "
                                        >

                                            <p
                                                className="
                                                    text-[11px]
                                                    font-bold
                                                    text-violet-600
                                                "
                                            >
                                                +{metric.horizon} semana
                                            </p>


                                            <p
                                                className="
                                                    mt-2
                                                    text-[20px]
                                                    font-bold
                                                    text-slate-800
                                                "
                                            >
                                                R² {
                                                    metric.r2.toFixed(
                                                        3
                                                    )
                                                }
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-[10px]
                                                    text-slate-500
                                                "
                                            >
                                                MAE {
                                                    metric.mae.toFixed(
                                                        2
                                                    )
                                                }
                                            </p>

                                        </div>

                                    )
                                )}

                        </div>

                    </div>


                    {/* ====================================================
                        RANGOS
                    ==================================================== */}

                    {climateRanges && (

                        <div
                            className="
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                p-5
                                shadow-sm
                            "
                        >

                            <h2
                                className="
                                    text-[16px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Rangos recibidos
                            </h2>


                            <div
                                className="
                                    mt-4
                                    grid
                                    grid-cols-1
                                    gap-3
                                    md:grid-cols-2
                                    xl:grid-cols-3
                                "
                            >

                                {Object.entries(
                                    climateRanges.ranges
                                ).map(
                                    ([
                                        name,
                                        range,
                                    ]) => (

                                        <div
                                            key={
                                                name
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-200
                                                p-3
                                            "
                                        >

                                            <p
                                                className="
                                                    text-[11px]
                                                    font-bold
                                                    text-slate-700
                                                "
                                            >
                                                {name}
                                            </p>


                                            <div
                                                className="
                                                    mt-2
                                                    grid
                                                    grid-cols-3
                                                    gap-2
                                                    text-[10px]
                                                    text-slate-500
                                                "
                                            >

                                                <span>
                                                    Min:{" "}
                                                    {range.min.toFixed(
                                                        2
                                                    )}
                                                </span>


                                                <span>
                                                    Media:{" "}
                                                    {range.mean.toFixed(
                                                        2
                                                    )}
                                                </span>


                                                <span>
                                                    Max:{" "}
                                                    {range.max.toFixed(
                                                        2
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </>

            )}

        </div>

    );

}


/**
 * ============================================================================
 * CARD AUXILIAR
 * ============================================================================
 */

function TestCard({

    title,

    value,

    description,

}: {

    title: string;

    value: number;

    description: string;

}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <p
                className="
                    text-[11px]
                    font-semibold
                    text-slate-500
                "
            >
                {title}
            </p>


            <p
                className="
                    mt-2
                    text-[28px]
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>


            <p
                className="
                    mt-1
                    text-[10px]
                    text-slate-400
                "
            >
                {description}
            </p>

        </div>

    );

}