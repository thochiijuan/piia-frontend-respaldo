/**
 * ============================================================================
 * ComparisonPeriodSelector
 * ----------------------------------------------------------------------------
 * Componente encargado de gestionar los períodos utilizados en la
 * comparación epidemiológica.
 *
 * Permite:
 *
 * - Agregar períodos dinámicamente.
 * - Eliminar períodos.
 * - Seleccionar año.
 * - Seleccionar semana epidemiológica.
 * - Comparar años completos.
 *
 * No existe un número máximo de períodos definido en el frontend.
 *
 * Ejemplo:
 *
 * 2025 · SE 1
 * 2025 · SE 17
 * 2026 · SE 1
 * 2026 · SE 17
 *
 * [+ Agregar período]
 *
 * ============================================================================
 */

"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CalendarDays,
    CalendarRange,
    Plus,
    Trash2,
} from "lucide-react";

import type {
    ComparisonPeriod,
    ComparisonPeriodType,
} from "./ageGroupComparison";

import {
    getAvailableComparisonWeeks,
    getAvailableComparisonYears,
} from "./ageGroupComparison.service";


/**
 * ============================================================================
 * PROPS
 * ============================================================================
 */
interface Props {

    /**
     * Períodos actualmente configurados.
     */
    periods: ComparisonPeriod[];


    /**
     * Notifica al componente padre cada modificación.
     */
    onChange: (
        periods: ComparisonPeriod[]
    ) => void;

}


/**
 * ============================================================================
 * MÍNIMO DE PERÍODOS
 * ----------------------------------------------------------------------------
 * Una comparación necesita al menos dos períodos.
 *
 * No existe máximo.
 * ============================================================================
 */
const MIN_PERIODS = 2;


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */
export default function ComparisonPeriodSelector({

    periods,

    onChange,

}: Props) {

    /**
     * =========================================================================
     * AÑOS DISPONIBLES
     * =========================================================================
     */
    const [
        availableYears,
        setAvailableYears,
    ] = useState<number[]>([]);


    /**
     * =========================================================================
     * SEMANAS DISPONIBLES POR AÑO
     * ----------------------------------------------------------------------------
     * Ejemplo:
     *
     * {
     *     2025: [15, 16, 17],
     *     2026: [15, 16, 17]
     * }
     * =========================================================================
     */
    const [
        weeksByYear,
        setWeeksByYear,
    ] = useState<Record<number, number[]>>(
        {}
    );


    /**
     * =========================================================================
     * CARGAR AÑOS DISPONIBLES
     * =========================================================================
     */
    useEffect(() => {

        async function loadYears() {

            const years =
                await getAvailableComparisonYears();

            setAvailableYears(
                years
            );

        }


        void loadYears();

    }, []);


    /**
     * =========================================================================
     * OBTENER AÑOS QUE ACTUALMENTE NECESITAN SEMANAS
     * =========================================================================
     */
    const selectedWeekYears =
        useMemo(
            () => {

                return Array.from(
                    new Set(
                        periods
                            .filter(
                                (period) =>
                                    period.type ===
                                    "week" &&
                                    period.year !==
                                    null
                            )
                            .map(
                                (period) =>
                                    period.year as number
                            )
                    )
                );

            },
            [
                periods,
            ]
        );


    /**
     * =========================================================================
     * CARGAR SEMANAS SEGÚN LOS AÑOS SELECCIONADOS
     * =========================================================================
     */
    useEffect(() => {

        async function loadWeeks() {

            const yearsToLoad =
                selectedWeekYears.filter(
                    (year) =>
                        weeksByYear[
                        year
                        ] === undefined
                );


            if (
                yearsToLoad.length ===
                0
            ) {

                return;

            }


            const results =
                await Promise.all(
                    yearsToLoad.map(
                        async (
                            year
                        ) => {

                            const weeks =
                                await getAvailableComparisonWeeks(
                                    year
                                );


                            return {
                                year,
                                weeks,
                            };

                        }
                    )
                );


            setWeeksByYear(
                (previous) => {

                    const next = {
                        ...previous,
                    };


                    results.forEach(
                        ({
                            year,
                            weeks,
                        }) => {

                            next[
                                year
                            ] = weeks;

                        }
                    );


                    return next;

                }
            );

        }


        void loadWeeks();

    }, [
        selectedWeekYears,
        weeksByYear,
    ]);


    /**
     * =========================================================================
     * GENERAR ID
     * =========================================================================
     */
    function createPeriodId() {

        if (
            typeof crypto !==
            "undefined" &&
            typeof crypto.randomUUID ===
            "function"
        ) {

            return crypto.randomUUID();

        }


        return (
            `period-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`
        );

    }


    /**
     * =========================================================================
     * AGREGAR PERÍODO
     * ----------------------------------------------------------------------------
     * No existe máximo.
     * =========================================================================
     */
    function addPeriod() {

        const newPeriod:
            ComparisonPeriod = {

            id:
                createPeriodId(),

            type:
                "week",

            year:
                null,

            week:
                null,

        };


        onChange([
            ...periods,
            newPeriod,
        ]);

    }


    /**
     * =========================================================================
     * ELIMINAR PERÍODO
     * =========================================================================
     */
    function removePeriod(
        periodId: string
    ) {

        if (
            periods.length <=
            MIN_PERIODS
        ) {

            return;

        }


        onChange(
            periods.filter(
                (period) =>
                    period.id !==
                    periodId
            )
        );

    }


    /**
     * =========================================================================
     * ACTUALIZAR PERÍODO
     * =========================================================================
     */
    function updatePeriod(

        periodId: string,

        changes:
            Partial<ComparisonPeriod>

    ) {

        onChange(
            periods.map(
                (period) => {

                    if (
                        period.id !==
                        periodId
                    ) {

                        return period;

                    }


                    return {
                        ...period,
                        ...changes,
                    };

                }
            )
        );

    }


    /**
     * =========================================================================
     * CAMBIAR TIPO DE PERÍODO
     * ----------------------------------------------------------------------------
     * Si cambia a:
     *
     * Año completo
     *
     * la semana deja de ser necesaria.
     * =========================================================================
     */
    function handleTypeChange(

        periodId: string,

        type:
            ComparisonPeriodType

    ) {

        updatePeriod(
            periodId,
            {

                type,

                week:
                    null,

            }
        );

    }


    /**
     * =========================================================================
     * CAMBIAR AÑO
     * ----------------------------------------------------------------------------
     * Cuando cambia el año, reiniciamos la semana.
     * =========================================================================
     */
    function handleYearChange(

        periodId: string,

        value: string

    ) {

        updatePeriod(
            periodId,
            {

                year:
                    value
                        ? Number(
                            value
                        )
                        : null,

                week:
                    null,

            }
        );

    }


    /**
     * =========================================================================
     * RENDER
     * =========================================================================
     */
    return (

        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-slate-50/40
                p-4
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <CalendarRange
                            size={16}
                            className="
                                text-violet-600
                            "
                        />


                        <h3
                            className="
                                text-[13px]
                                font-bold
                                text-slate-700
                            "
                        >
                            Períodos a comparar
                        </h3>

                    </div>


                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-400
                        "
                    >
                        Agrega dos o más períodos epidemiológicos para realizar la comparación.
                    </p>

                </div>


                {/* ========================================================
                    CONTADOR
                ======================================================== */}

                <div
                    className="
                        inline-flex
                        w-fit
                        items-center
                        rounded-full
                        border
                        border-violet-100
                        bg-violet-50
                        px-3
                        py-1
                        text-[10px]
                        font-semibold
                        text-violet-600
                    "
                >
                    {periods.length} períodos
                </div>

            </div>


            {/* ============================================================
                PERÍODOS
            ============================================================ */}

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

                {periods.map(
                    (
                        period,
                        index
                    ) => {

                        const weeks =
                            period.year !==
                                null
                                ? (
                                    weeksByYear[
                                    period.year
                                    ] ?? []
                                )
                                : [];


                        return (

                            <div
                                key={
                                    period.id
                                }
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-3
                                    shadow-sm
                                "
                            >

                                {/* ==========================================
                                    CABECERA DEL PERÍODO
                                ========================================== */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-7
                                                w-7
                                                items-center
                                                justify-center
                                                rounded-lg
                                                bg-violet-50
                                                text-[11px]
                                                font-bold
                                                text-violet-600
                                            "
                                        >
                                            {
                                                index +
                                                1
                                            }
                                        </div>


                                        <div>

                                            <p
                                                className="
                                                    text-[11px]
                                                    font-bold
                                                    text-slate-700
                                                "
                                            >
                                                Período {
                                                    index +
                                                    1
                                                }
                                            </p>


                                            <p
                                                className="
                                                    text-[9px]
                                                    text-slate-400
                                                "
                                            >
                                                Configuración epidemiológica
                                            </p>

                                        </div>

                                    </div>


                                    {/* ======================================
                                        ELIMINAR
                                    ====================================== */}

                                    <button
                                        type="button"
                                        disabled={
                                            periods.length <=
                                            MIN_PERIODS
                                        }
                                        onClick={
                                            () =>
                                                removePeriod(
                                                    period.id
                                                )
                                        }
                                        title={
                                            periods.length <=
                                                MIN_PERIODS
                                                ? "Se requieren al menos dos períodos"
                                                : "Eliminar período"
                                        }
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            items-center
                                            justify-center
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-white
                                            text-slate-400
                                            transition
                                            hover:border-red-200
                                            hover:bg-red-50
                                            hover:text-red-500
                                            disabled:cursor-not-allowed
                                            disabled:opacity-30
                                        "
                                    >

                                        <Trash2
                                            size={14}
                                        />

                                    </button>

                                </div>


                                {/* ==========================================
                                    TIPO
                                ========================================== */}

                                <div className="mt-3">

                                    <label
                                        className="
                                            mb-1.5
                                            block
                                            text-[10px]
                                            font-semibold
                                            text-slate-500
                                        "
                                    >
                                        Tipo de período
                                    </label>


                                    <select
                                        value={period.type}
                                        onChange={(event) =>
                                            handleTypeChange(
                                                period.id,
                                                event.target.value as ComparisonPeriodType
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
                                            text-[11px]
                                            font-medium
                                            text-slate-700
                                            outline-none
                                            transition
                                            focus:border-violet-400
                                            focus:ring-2
                                            focus:ring-violet-100
                                        "
                                    >

                                        <option value="week">
                                            Semana epidemiológica
                                        </option>

                                        <option value="year">
                                            Año completo
                                        </option>

                                    </select>

                                </div>


                                {/* ==========================================
                                    AÑO + SEMANA
                                ========================================== */}

                                <div
                                    className={`
                                        mt-3
                                        grid
                                        gap-3
                                        ${period.type ===
                                            "week"
                                            ? "grid-cols-2"
                                            : "grid-cols-1"
                                        }
                                    `}
                                >

                                    {/* AÑO */}

                                    <div>

                                        <label
                                            className="
                                                mb-1.5
                                                flex
                                                items-center
                                                gap-1
                                                text-[10px]
                                                font-semibold
                                                text-slate-500
                                            "
                                        >

                                            <CalendarDays
                                                size={11}
                                                className="
                                                    text-slate-400
                                                "
                                            />

                                            Año

                                        </label>


                                        <select
                                            value={
                                                period.year ??
                                                ""
                                            }
                                            onChange={
                                                (
                                                    event
                                                ) =>
                                                    handleYearChange(
                                                        period.id,
                                                        event.target.value
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
                                                text-[11px]
                                                text-slate-700
                                                outline-none
                                                transition
                                                focus:border-violet-400
                                                focus:ring-2
                                                focus:ring-violet-100
                                            "
                                        >

                                            <option value="">
                                                Seleccionar
                                            </option>


                                            {availableYears.map(
                                                (
                                                    year
                                                ) => (

                                                    <option
                                                        key={
                                                            year
                                                        }
                                                        value={
                                                            year
                                                        }
                                                    >
                                                        {
                                                            year
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* SEMANA */}

                                    {period.type ===
                                        "week" && (

                                            <div>

                                                <label
                                                    className="
                                                    mb-1.5
                                                    flex
                                                    items-center
                                                    gap-1
                                                    text-[10px]
                                                    font-semibold
                                                    text-slate-500
                                                "
                                                >

                                                    <CalendarDays
                                                        size={11}
                                                        className="
                                                        text-slate-400
                                                    "
                                                    />

                                                    Semana

                                                </label>


                                                <select
                                                    value={
                                                        period.week ??
                                                        ""
                                                    }
                                                    disabled={
                                                        period.year ===
                                                        null
                                                    }
                                                    onChange={
                                                        (
                                                            event
                                                        ) =>
                                                            updatePeriod(
                                                                period.id,
                                                                {
                                                                    week:
                                                                        event.target.value
                                                                            ? Number(
                                                                                event.target.value
                                                                            )
                                                                            : null,
                                                                }
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
                                                    text-[11px]
                                                    text-slate-700
                                                    outline-none
                                                    transition
                                                    focus:border-violet-400
                                                    focus:ring-2
                                                    focus:ring-violet-100
                                                    disabled:cursor-not-allowed
                                                    disabled:bg-slate-50
                                                    disabled:text-slate-400
                                                "
                                                >

                                                    <option value="">
                                                        Seleccionar
                                                    </option>


                                                    {weeks.map(
                                                        (
                                                            week
                                                        ) => (

                                                            <option
                                                                key={
                                                                    week
                                                                }
                                                                value={
                                                                    week
                                                                }
                                                            >
                                                                SE {
                                                                    week
                                                                }
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>

                                        )}

                                </div>


                                {/* ==========================================
                                    RESUMEN DEL PERÍODO
                                ========================================== */}

                                <div
                                    className="
                                        mt-3
                                        rounded-lg
                                        bg-slate-50
                                        px-3
                                        py-2
                                    "
                                >

                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-400
                                        "
                                    >
                                        Período seleccionado
                                    </p>


                                    <p
                                        className="
                                            mt-0.5
                                            text-[11px]
                                            font-bold
                                            text-slate-700
                                        "
                                    >

                                        {
                                            getPeriodDescription(
                                                period
                                            )
                                        }

                                    </p>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>


            {/* ============================================================
                AGREGAR PERÍODO
            ============================================================ */}

            <button
                type="button"
                onClick={
                    addPeriod
                }
                className="
                    mt-3
                    flex
                    h-10
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-dashed
                    border-violet-300
                    bg-violet-50/40
                    text-[11px]
                    font-semibold
                    text-violet-600
                    transition
                    hover:border-violet-400
                    hover:bg-violet-50
                "
            >

                <Plus
                    size={15}
                />

                Agregar período

            </button>

        </div>

    );

}


/**
 * ============================================================================
 * DESCRIPCIÓN DEL PERÍODO
 * ============================================================================
 */
function getPeriodDescription(
    period: ComparisonPeriod
): string {

    /**
     * Sin año.
     */
    if (
        period.year ===
        null
    ) {

        return "Pendiente de configurar";

    }


    /**
     * Año completo.
     */
    if (
        period.type ===
        "year"
    ) {

        return `Año ${period.year}`;

    }


    /**
     * Semana todavía no seleccionada.
     */
    if (
        period.week ===
        null
    ) {

        return `${period.year} · Semana pendiente`;

    }


    /**
     * Año + semana.
     */
    return `${period.year} · SE ${period.week}`;

}