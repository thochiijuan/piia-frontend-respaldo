/**
 * ============================================================================
 * AgeGroupComparison
 * ----------------------------------------------------------------------------
 * Componente principal de la funcionalidad de comparación epidemiológica
 * correspondiente al indicador "Casos por grupo de edad".
 *
 * Responsabilidades:
 *
 * - Seleccionar la métrica a comparar:
 *      Total
 *      Dengue
 *      IRA
 *
 * - Aplicar filtros territoriales:
 *      Región
 *      Departamento
 *      Municipio
 *      Grupo de edad
 *
 * - Gestionar períodos dinámicos.
 * - Ejecutar la comparación.
 * - Mostrar resumen por período.
 * - Mostrar tabla comparativa.
 *
 * ============================================================================
 */

"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    Building2,
    MapPin,
    SlidersHorizontal,
    UsersRound,
} from "lucide-react";


/* ============================================================================
 * COMPONENTES
 * ============================================================================
 */

import ComparisonPeriodSelector
    from "./ComparisonPeriodSelector";

import AgeGroupComparisonTable
    from "./AgeGroupComparisonTable";


/* ============================================================================
 * SERVICIOS
 * ============================================================================
 */

import {
    getAgeGroupComparison,
    getAvailableComparisonAgeGroups,
    getAvailableComparisonDepartments,
    getAvailableComparisonMunicipalities,
    getAvailableComparisonRegions,
} from "./ageGroupComparison.service";


/* ============================================================================
 * TIPOS
 * ============================================================================
 */

import type {
    AgeGroupComparisonFilters,
    AgeGroupComparisonResponse,
    ComparisonMetric,
    ComparisonPeriod,
} from "./ageGroupComparison";


/* ============================================================================
 * FILTROS INICIALES
 * ============================================================================
 */

const INITIAL_FILTERS: AgeGroupComparisonFilters = {

    region: "",

    department: "",

    municipality: "",

    ageGroup: "",

};


/* ============================================================================
 * PERÍODOS INICIALES
 * ----------------------------------------------------------------------------
 * Toda comparación necesita inicialmente dos períodos.
 *
 * Posteriormente el usuario puede agregar tantos como quiera.
 * ============================================================================
 */

const INITIAL_PERIODS: ComparisonPeriod[] = [

    {
        id: "initial-period-1",
        type: "week",
        year: null,
        week: null,
    },

    {
        id: "initial-period-2",
        type: "week",
        year: null,
        week: null,
    },

];


/* ============================================================================
 * ETIQUETAS DE MÉTRICAS
 * ============================================================================
 */

const METRIC_OPTIONS: {
    value: ComparisonMetric;
    label: string;
    description: string;
}[] = [

    {
        value: "total",
        label: "Total de casos",
        description: "Dengue + IRA",
    },

    {
        value: "dengue",
        label: "Dengue",
        description: "Solo casos de Dengue",
    },

    {
        value: "ira",
        label: "IRA",
        description: "Solo casos de IRA",
    },

];


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */

export default function AgeGroupComparison() {

    /* ========================================================================
     * MÉTRICA
     * ========================================================================
     */

    const [
        metric,
        setMetric,
    ] = useState<ComparisonMetric>(
        "total"
    );


    /* ========================================================================
     * FILTROS
     * ========================================================================
     */

    const [
        filters,
        setFilters,
    ] = useState<AgeGroupComparisonFilters>(
        INITIAL_FILTERS
    );


    /* ========================================================================
     * PERÍODOS
     * ========================================================================
     */

    const [
        periods,
        setPeriods,
    ] = useState<ComparisonPeriod[]>(
        INITIAL_PERIODS
    );


    /* ========================================================================
     * RESULTADO
     * ========================================================================
     */

    const [
        result,
        setResult,
    ] = useState<AgeGroupComparisonResponse | null>(
        null
    );


    /* ========================================================================
     * CARGA
     * ========================================================================
     */

    const [
        loading,
        setLoading,
    ] = useState(false);


    /* ========================================================================
     * ERROR / VALIDACIÓN
     * ========================================================================
     */

    const [
        error,
        setError,
    ] = useState("");


    /* ========================================================================
     * OPCIONES TERRITORIALES
     * ========================================================================
     */

    const [
        regions,
        setRegions,
    ] = useState<string[]>([]);


    const [
        departments,
        setDepartments,
    ] = useState<string[]>([]);


    const [
        municipalities,
        setMunicipalities,
    ] = useState<string[]>([]);


    const [
        ageGroups,
        setAgeGroups,
    ] = useState<string[]>([]);


    /**
     * ========================================================================
     * CARGAR OPCIONES GENERALES
     * ========================================================================
     */

    useEffect(() => {

        async function loadInitialOptions() {

            const [
                regionsResponse,
                ageGroupsResponse,
            ] = await Promise.all([

                getAvailableComparisonRegions(),

                getAvailableComparisonAgeGroups(),

            ]);


            setRegions(
                regionsResponse
            );


            setAgeGroups(
                ageGroupsResponse
            );

        }


        void loadInitialOptions();

    }, []);


    /**
     * ========================================================================
     * CARGAR DEPARTAMENTOS
     * ----------------------------------------------------------------------------
     * Dependen de la región seleccionada.
     * ========================================================================
     */

    useEffect(() => {

        async function loadDepartments() {

            const response =
                await getAvailableComparisonDepartments(
                    filters.region
                );


            setDepartments(
                response
            );

        }


        void loadDepartments();

    }, [
        filters.region,
    ]);


    /**
     * ========================================================================
     * CARGAR MUNICIPIOS
     * ----------------------------------------------------------------------------
     * Dependen de:
     *
     * Región
     * Departamento
     * ========================================================================
     */

    useEffect(() => {

        async function loadMunicipalities() {

            const response =
                await getAvailableComparisonMunicipalities(
                    filters.region,
                    filters.department
                );


            setMunicipalities(
                response
            );

        }


        void loadMunicipalities();

    }, [
        filters.region,
        filters.department,
    ]);


    /**
     * ========================================================================
     * CAMBIO DE REGIÓN
     * ========================================================================
     */

    function handleRegionChange(
        region: string
    ) {

        setFilters(
            (previous) => ({

                ...previous,

                region,

                department: "",

                municipality: "",

            })
        );


        setResult(
            null
        );

    }


    /**
     * ========================================================================
     * CAMBIO DE DEPARTAMENTO
     * ========================================================================
     */

    function handleDepartmentChange(
        department: string
    ) {

        setFilters(
            (previous) => ({

                ...previous,

                department,

                municipality: "",

            })
        );


        setResult(
            null
        );

    }


    /**
     * ========================================================================
     * CAMBIO DE MUNICIPIO
     * ========================================================================
     */

    function handleMunicipalityChange(
        municipality: string
    ) {

        setFilters(
            (previous) => ({

                ...previous,

                municipality,

            })
        );


        setResult(
            null
        );

    }


    /**
     * ========================================================================
     * CAMBIO DE GRUPO DE EDAD
     * ========================================================================
     */

    function handleAgeGroupChange(
        ageGroup: string
    ) {

        setFilters(
            (previous) => ({

                ...previous,

                ageGroup,

            })
        );


        setResult(
            null
        );

    }


    /**
     * ========================================================================
     * CAMBIO DE MÉTRICA
     * ========================================================================
     */

    function handleMetricChange(
        value: ComparisonMetric
    ) {

        setMetric(
            value
        );


        setResult(
            null
        );

    }


    /**
     * ========================================================================
     * CAMBIO DE PERÍODOS
     * ========================================================================
     */

    function handlePeriodsChange(
        updatedPeriods: ComparisonPeriod[]
    ) {

        setPeriods(
            updatedPeriods
        );


        setResult(
            null
        );


        setError(
            ""
        );

    }


    /**
     * ========================================================================
     * LIMPIAR CONFIGURACIÓN
     * ========================================================================
     */

    function clearComparison() {

        setMetric(
            "total"
        );


        setFilters({
            ...INITIAL_FILTERS,
        });


        setPeriods(
            INITIAL_PERIODS.map(
                (period) => ({
                    ...period,
                })
            )
        );


        setResult(
            null
        );


        setError(
            ""
        );

    }


    /**
     * ========================================================================
     * VALIDAR PERÍODOS
     * ========================================================================
     */

    function validatePeriods():
        string | null {

        /**
         * Filtramos únicamente los períodos completamente configurados.
         */
        const validPeriods =
            periods.filter(
                (period) => {

                    if (
                        period.year ===
                        null
                    ) {

                        return false;

                    }


                    if (
                        period.type ===
                            "week" &&
                        period.week ===
                            null
                    ) {

                        return false;

                    }


                    return true;

                }
            );


        /**
         * Se necesitan mínimo dos.
         */
        if (
            validPeriods.length <
            2
        ) {

            return (
                "Debes configurar al menos dos períodos para realizar la comparación."
            );

        }


        /**
         * No permitimos períodos repetidos.
         */
        const comparisonKeys =
            validPeriods.map(
                (period) => {

                    return [
                        period.type,
                        period.year,
                        period.week ??
                            "all",
                    ].join("-");

                }
            );


        const uniqueKeys =
            new Set(
                comparisonKeys
            );


        if (
            uniqueKeys.size !==
            comparisonKeys.length
        ) {

            return (
                "Hay períodos repetidos. Selecciona años o semanas diferentes."
            );

        }


        return null;

    }


    /**
     * ========================================================================
     * REALIZAR COMPARACIÓN
     * ========================================================================
     */

    async function handleCompare() {

        const validationError =
            validatePeriods();


        if (
            validationError
        ) {

            setError(
                validationError
            );

            return;

        }


        setError(
            ""
        );


        setLoading(
            true
        );


        try {

            const response =
                await getAgeGroupComparison({

                    metric,

                    filters,

                    periods,

                });


            setResult(
                response
            );

        }
        catch (
            comparisonError
        ) {

            console.error(
                comparisonError
            );


            setError(
                "No fue posible realizar la comparación."
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /**
     * ========================================================================
     * RENDER
     * ========================================================================
     */

    return (

        <div
            className="
                space-y-4
            "
        >

            {/* ============================================================
                CONFIGURACIÓN GENERAL
            ============================================================ */}

            <div
                className="
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-4
                "
            >

                <div>

                    <h3
                        className="
                            text-[14px]
                            font-bold
                            text-slate-700
                        "
                    >
                        Configurar comparación
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-400
                        "
                    >
                        Selecciona qué información deseas comparar y configura los períodos epidemiológicos.
                    </p>

                </div>


                {/* ========================================================
                    MÉTRICA
                ======================================================== */}

                <div
                    className="
                        mt-4
                    "
                >

                    <p
                        className="
                            mb-2
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Métrica a comparar
                    </p>


                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-2
                            sm:grid-cols-3
                        "
                    >

                        {METRIC_OPTIONS.map(
                            (option) => {

                                const active =
                                    metric ===
                                    option.value;


                                return (

                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={
                                            () =>
                                                handleMetricChange(
                                                    option.value
                                                )
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            px-4
                                            py-3
                                            text-left
                                            transition
                                            ${
                                                active
                                                    ? "border-violet-300 bg-violet-50 ring-1 ring-violet-100"
                                                    : "border-slate-200 bg-white hover:bg-slate-50"
                                            }
                                        `}
                                    >

                                        <p
                                            className={`
                                                text-[12px]
                                                font-bold
                                                ${
                                                    active
                                                        ? "text-violet-700"
                                                        : "text-slate-700"
                                                }
                                            `}
                                        >
                                            {option.label}
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[10px]
                                                text-slate-400
                                            "
                                        >
                                            {option.description}
                                        </p>

                                    </button>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* ========================================================
                    FILTROS
                ======================================================== */}

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-1
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    {/* REGIÓN */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <MapPin
                                size={11}
                                className="
                                    text-slate-400
                                "
                            />

                            Región

                        </label>


                        <select
                            value={
                                filters.region
                            }
                            onChange={
                                (event) =>
                                    handleRegionChange(
                                        event.target.value
                                    )
                            }
                            className={
                                selectClass
                            }
                        >

                            <option value="">
                                Todas las regiones
                            </option>


                            {regions.map(
                                (region) => (

                                    <option
                                        key={
                                            region
                                        }
                                        value={
                                            region
                                        }
                                    >
                                        {region}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* DEPARTAMENTO */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <Building2
                                size={11}
                                className="
                                    text-slate-400
                                "
                            />

                            Departamento

                        </label>


                        <select
                            value={
                                filters.department
                            }
                            onChange={
                                (event) =>
                                    handleDepartmentChange(
                                        event.target.value
                                    )
                            }
                            className={
                                selectClass
                            }
                        >

                            <option value="">
                                Todos
                            </option>


                            {departments.map(
                                (
                                    department
                                ) => (

                                    <option
                                        key={
                                            department
                                        }
                                        value={
                                            department
                                        }
                                    >
                                        {department}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* MUNICIPIO */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <MapPin
                                size={11}
                                className="
                                    text-slate-400
                                "
                            />

                            Municipio

                        </label>


                        <select
                            value={
                                filters.municipality
                            }
                            onChange={
                                (event) =>
                                    handleMunicipalityChange(
                                        event.target.value
                                    )
                            }
                            className={
                                selectClass
                            }
                        >

                            <option value="">
                                Todos
                            </option>


                            {municipalities.map(
                                (
                                    municipality
                                ) => (

                                    <option
                                        key={
                                            municipality
                                        }
                                        value={
                                            municipality
                                        }
                                    >
                                        {municipality}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* GRUPO DE EDAD */}

                    <div>

                        <label
                            className="
                                mb-1.5
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <UsersRound
                                size={11}
                                className="
                                    text-slate-400
                                "
                            />

                            Grupo de edad

                        </label>


                        <select
                            value={
                                filters.ageGroup
                            }
                            onChange={
                                (event) =>
                                    handleAgeGroupChange(
                                        event.target.value
                                    )
                            }
                            className={
                                selectClass
                            }
                        >

                            <option value="">
                                Todos
                            </option>


                            {ageGroups.map(
                                (
                                    ageGroup
                                ) => (

                                    <option
                                        key={
                                            ageGroup
                                        }
                                        value={
                                            ageGroup
                                        }
                                    >
                                        {ageGroup}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

                </div>

            </div>


            {/* ============================================================
                SELECTOR DINÁMICO DE PERÍODOS
            ============================================================ */}

            <ComparisonPeriodSelector
                periods={
                    periods
                }
                onChange={
                    handlePeriodsChange
                }
            />


            {/* ============================================================
                ERROR
            ============================================================ */}

            {error && (

                <div
                    className="
                        rounded-lg
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-[11px]
                        font-medium
                        text-red-600
                    "
                >
                    {error}
                </div>

            )}


            {/* ============================================================
                ACCIONES
            ============================================================ */}

            <div
                className="
                    flex
                    flex-col
                    gap-2
                    sm:flex-row
                    sm:justify-end
                "
            >

                <button
                    type="button"
                    onClick={
                        clearComparison
                    }
                    className="
                        h-10
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-5
                        text-[11px]
                        font-semibold
                        text-slate-600
                        transition
                        hover:bg-slate-50
                    "
                >
                    Limpiar comparación
                </button>


                <button
                    type="button"
                    onClick={
                        handleCompare
                    }
                    disabled={
                        loading
                    }
                    className="
                        flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-violet-600
                        px-6
                        text-[11px]
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-violet-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    <SlidersHorizontal
                        size={14}
                    />


                    {loading
                        ? "Comparando..."
                        : "Realizar comparación"}

                </button>

            </div>


            {/* ============================================================
                RESULTADOS
            ============================================================ */}

            {result && (

                <div
                    className="
                        space-y-4
                    "
                >

                    {/* ====================================================
                        RESUMEN POR PERÍODO
                    ==================================================== */}

                    {result.summaries.length >
                        0 && (

                        <div>

                            <div
                                className="
                                    mb-2
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-[12px]
                                            font-bold
                                            text-slate-700
                                        "
                                    >
                                        Resumen de períodos
                                    </p>


                                    <p
                                        className="
                                            mt-0.5
                                            text-[10px]
                                            text-slate-400
                                        "
                                    >
                                        La variación compara el primer período con el último.
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    gap-3
                                    overflow-x-auto
                                    pb-2
                                "
                            >

                                {result.summaries.map(
                                    (
                                        summary,
                                        index
                                    ) => {

                                        const isFirst =
                                            index ===
                                            0;

                                        const isLast =
                                            index ===
                                            result.summaries.length -
                                            1;


                                        return (

                                            <div
                                                key={
                                                    summary.periodId
                                                }
                                                className={`
                                                    min-w-[180px]
                                                    rounded-xl
                                                    border
                                                    px-4
                                                    py-3
                                                    ${
                                                        isLast
                                                            ? "border-violet-200 bg-violet-50"
                                                            : isFirst
                                                                ? "border-slate-200 bg-slate-50"
                                                                : "border-blue-100 bg-blue-50/40"
                                                    }
                                                `}
                                            >

                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        text-slate-500
                                                    "
                                                >
                                                    {summary.label}
                                                </p>


                                                <p
                                                    className={`
                                                        mt-1
                                                        text-[22px]
                                                        font-bold
                                                        ${
                                                            isLast
                                                                ? "text-violet-700"
                                                                : "text-slate-800"
                                                        }
                                                    `}
                                                >
                                                    {summary.value.toLocaleString(
                                                        "es-CO"
                                                    )}
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-[9px]
                                                        font-medium
                                                        text-slate-400
                                                    "
                                                >

                                                    {isFirst
                                                        ? "Período inicial"
                                                        : isLast
                                                            ? "Período final"
                                                            : `Período ${index + 1}`}

                                                </p>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    )}


                    {/* ====================================================
                        TABLA
                    ==================================================== */}

                    <AgeGroupComparisonTable
                        data={
                            result
                        }
                    />

                </div>

            )}


            {/* ============================================================
                ESTADO INICIAL
            ============================================================ */}

            {!result &&
                !loading && (

                <div
                    className="
                        flex
                        min-h-[150px]
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-dashed
                        border-slate-200
                        bg-slate-50/30
                        px-6
                    "
                >

                    <div
                        className="
                            max-w-[520px]
                            text-center
                        "
                    >

                        <p
                            className="
                                text-[13px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            Configura los períodos para iniciar
                        </p>


                        <p
                            className="
                                mt-1
                                text-[11px]
                                leading-5
                                text-slate-400
                            "
                        >
                            Selecciona dos o más períodos, define la métrica
                            que deseas analizar y pulsa "Realizar comparación".
                        </p>

                    </div>

                </div>

            )}

        </div>

    );

}


/* ============================================================================
 * CLASE COMPARTIDA PARA SELECTS
 * ============================================================================
 */

const selectClass = `
    h-10
    w-full
    rounded-lg
    border
    border-slate-200
    bg-white
    px-3
    text-[11px]
    text-slate-700
    outline-none
    transition
    focus:border-violet-400
    focus:ring-2
    focus:ring-violet-100
`;