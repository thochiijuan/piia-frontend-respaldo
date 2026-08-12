/**
 * ============================================================================
 * AgeGroupDetailsModal
 * ----------------------------------------------------------------------------
 * Modal principal del indicador "Casos por grupo de edad".
 *
 * Contiene dos modos:
 *
 * 1. Vista detallada
 *    - Resumen Total / Dengue / IRA
 *    - Filtros
 *    - Buscador
 *    - Tabla
 *    - Paginación
 *
 * 2. Comparar períodos
 *    - Comparación por año y semana epidemiológica
 *    - Períodos dinámicos
 *    - Comparación Total / Dengue / IRA
 *    - Filtros territoriales
 *
 * ============================================================================
 */

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
    Building2,
    Bug,
    CalendarDays,
    MapPin,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Table2,
    UsersRound,
    X,
} from "lucide-react";


/* ============================================================================
 * COMPONENTES
 * ============================================================================
 */

import AgeGroupDetailsTable
    from "./AgeGroupDetailsTable";

import AgeGroupComparison
    from "./comparison/AgeGroupComparison";


/* ============================================================================
 * SERVICE
 * ============================================================================
 */

import {
    getAgeGroupDetails,
} from "./ageGroupDetails.service";


/* ============================================================================
 * TIPOS
 * ============================================================================
 */

import type {
    AgeGroupDetail,
    AgeGroupDetailsFilters,
    AgeGroupDetailsResponse,
} from "./ageGroupDetails";


/* ============================================================================
 * PROPS
 * ============================================================================
 */

interface Props {

    isOpen: boolean;

    onClose: () => void;

}


/* ============================================================================
 * TIPO DE VISTA
 * ============================================================================
 */

type ModalView =
    | "details"
    | "comparison";


/* ============================================================================
 * FILTROS INICIALES
 * ============================================================================
 */

const initialFilters: AgeGroupDetailsFilters = {

    year: null,

    week: null,

    region: "",

    department: "",

    municipality: "",

    ageGroup: "",

    search: "",

};


/* ============================================================================
 * ORDEN DE LOS GRUPOS DE EDAD
 * ============================================================================
 */

const AGE_GROUP_ORDER = [

    "<1 Año",

    "1-4",

    "5-9",

    "10-14",

    "15-19",

    "20-29",

    "30-39",

    "40-49",

    "50-59",

    "60+",

];


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */

export default function AgeGroupDetailsModal({

    isOpen,

    onClose,

}: Props) {

    /* ========================================================================
     * VISTA ACTUAL
     * ========================================================================
     */

    const [
        activeView,
        setActiveView,
    ] = useState<ModalView>(
        "details"
    );


    /* ========================================================================
     * FILTROS PENDIENTES
     * ----------------------------------------------------------------------------
     * Son los valores que el usuario está modificando.
     * No afectan la tabla hasta pulsar "Aplicar filtros".
     * ========================================================================
     */

    const [
        pendingFilters,
        setPendingFilters,
    ] = useState<AgeGroupDetailsFilters>(
        initialFilters
    );


    /* ========================================================================
     * FILTROS APLICADOS
     * ========================================================================
     */

    const [
        appliedFilters,
        setAppliedFilters,
    ] = useState<AgeGroupDetailsFilters>(
        initialFilters
    );


    /* ========================================================================
     * RESPUESTA
     * ========================================================================
     */

    const [
        response,
        setResponse,
    ] = useState<AgeGroupDetailsResponse>({

        data: [],

        summary: {

            dengue: 0,

            ira: 0,

            total: 0,

        },

    });


    /* ========================================================================
     * TODOS LOS REGISTROS
     * ----------------------------------------------------------------------------
     * Utilizados para construir los selectores.
     * ========================================================================
     */

    const [
        allData,
        setAllData,
    ] = useState<AgeGroupDetail[]>([]);


    /* ========================================================================
     * CARGA
     * ========================================================================
     */

    const [
        loading,
        setLoading,
    ] = useState(false);


    /* ========================================================================
     * PAGINACIÓN
     * ========================================================================
     */

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);


    const [
        itemsPerPage,
        setItemsPerPage,
    ] = useState(8);


    /* ========================================================================
     * CUANDO SE ABRE LA MODAL
     * ----------------------------------------------------------------------------
     * Empezamos siempre mostrando la vista detallada.
     * ========================================================================
     */

    useEffect(() => {

        if (
            isOpen
        ) {

            setActiveView(
                "details"
            );

        }

    }, [
        isOpen,
    ]);


    /* ========================================================================
     * CARGAR TODOS LOS DATOS
     * ========================================================================
     */

    useEffect(() => {

        if (
            !isOpen
        ) {

            return;

        }


        async function loadInitialData() {

            const result =
                await getAgeGroupDetails();


            setAllData(
                result.data
            );

        }


        void loadInitialData();

    }, [
        isOpen,
    ]);


    /* ========================================================================
     * CARGAR DATOS FILTRADOS
     * ========================================================================
     */

    useEffect(() => {

        if (
            !isOpen
        ) {

            return;

        }


        let active = true;


        async function loadFilteredData() {

            setLoading(
                true
            );


            const result =
                await getAgeGroupDetails(
                    appliedFilters
                );


            if (
                !active
            ) {

                return;

            }


            setResponse(
                result
            );


            setCurrentPage(
                1
            );


            setLoading(
                false
            );

        }


        void loadFilteredData();


        return () => {

            active = false;

        };

    }, [
        isOpen,
        appliedFilters,
    ]);


    /* ========================================================================
     * CERRAR CON ESC
     * ========================================================================
     */

    useEffect(() => {

        if (
            !isOpen
        ) {

            return;

        }


        function handleKeyDown(
            event: KeyboardEvent
        ) {

            if (
                event.key ===
                "Escape"
            ) {

                onClose();

            }

        }


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        isOpen,
        onClose,
    ]);


    /* ========================================================================
     * BLOQUEAR SCROLL DE LA PÁGINA
     * ========================================================================
     */

    useEffect(() => {

        if (
            !isOpen
        ) {

            return;

        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [
        isOpen,
    ]);


    /* ========================================================================
     * OPCIONES: AÑOS
     * ========================================================================
     */

    const years =
        useMemo(
            () => {

                return Array
                    .from(
                        new Set(
                            allData.map(
                                (item) =>
                                    item.year
                            )
                        )
                    )
                    .sort(
                        (a, b) =>
                            b - a
                    );

            },
            [
                allData,
            ]
        );


    /* ========================================================================
     * OPCIONES: SEMANAS
     * ========================================================================
     */

    const weeks =
        useMemo(
            () => {

                return Array
                    .from(
                        new Set(
                            allData.map(
                                (item) =>
                                    item.week
                            )
                        )
                    )
                    .sort(
                        (a, b) =>
                            a - b
                    );

            },
            [
                allData,
            ]
        );


    /* ========================================================================
     * OPCIONES: REGIONES
     * ========================================================================
     */

    const regions =
        useMemo(
            () => {

                return Array
                    .from(
                        new Set(
                            allData.map(
                                (item) =>
                                    item.region
                            )
                        )
                    )
                    .sort();

            },
            [
                allData,
            ]
        );


    /* ========================================================================
     * OPCIONES: DEPARTAMENTOS
     * ========================================================================
     */

    const departments =
        useMemo(
            () => {

                const source =
                    pendingFilters.region
                        ? allData.filter(
                            (item) =>
                                item.region ===
                                pendingFilters.region
                        )
                        : allData;


                return Array
                    .from(
                        new Set(
                            source.map(
                                (item) =>
                                    item.department
                            )
                        )
                    )
                    .sort();

            },
            [
                allData,
                pendingFilters.region,
            ]
        );


    /* ========================================================================
     * OPCIONES: MUNICIPIOS
     * ========================================================================
     */

    const municipalities =
        useMemo(
            () => {

                let source =
                    allData;


                if (
                    pendingFilters.region
                ) {

                    source =
                        source.filter(
                            (item) =>
                                item.region ===
                                pendingFilters.region
                        );

                }


                if (
                    pendingFilters.department
                ) {

                    source =
                        source.filter(
                            (item) =>
                                item.department ===
                                pendingFilters.department
                        );

                }


                return Array
                    .from(
                        new Set(
                            source.map(
                                (item) =>
                                    item.municipality
                            )
                        )
                    )
                    .sort();

            },
            [
                allData,
                pendingFilters.region,
                pendingFilters.department,
            ]
        );


    /* ========================================================================
     * OPCIONES: GRUPOS DE EDAD
     * ========================================================================
     */

    const ageGroups =
        useMemo(
            () => {

                const groups =
                    Array.from(
                        new Set(
                            allData.map(
                                (item) =>
                                    item.ageGroup
                            )
                        )
                    );


                return groups.sort(
                    (
                        a,
                        b
                    ) => {

                        const indexA =
                            AGE_GROUP_ORDER.indexOf(
                                a
                            );


                        const indexB =
                            AGE_GROUP_ORDER.indexOf(
                                b
                            );


                        if (
                            indexA !== -1 &&
                            indexB !== -1
                        ) {

                            return (
                                indexA -
                                indexB
                            );

                        }


                        if (
                            indexA !== -1
                        ) {

                            return -1;

                        }


                        if (
                            indexB !== -1
                        ) {

                            return 1;

                        }


                        return a.localeCompare(
                            b
                        );

                    }
                );

            },
            [
                allData,
            ]
        );


    /* ========================================================================
     * PORCENTAJES
     * ========================================================================
     */

    const denguePercentage =
        response.summary.total > 0
            ? (
                response.summary.dengue /
                response.summary.total
            ) * 100
            : 0;


    const iraPercentage =
        response.summary.total > 0
            ? (
                response.summary.ira /
                response.summary.total
            ) * 100
            : 0;


    /* ========================================================================
     * PAGINACIÓN
     * ========================================================================
     */

    const totalPages =
        Math.max(
            Math.ceil(
                response.data.length /
                itemsPerPage
            ),
            1
        );


    const paginatedData =
        useMemo(
            () => {

                const start =
                    (
                        currentPage -
                        1
                    ) *
                    itemsPerPage;


                return response.data.slice(
                    start,
                    start +
                    itemsPerPage
                );

            },
            [
                response.data,
                currentPage,
                itemsPerPage,
            ]
        );


    /* ========================================================================
     * ACTUALIZAR FILTRO
     * ========================================================================
     */

    function updateFilter<
        K extends keyof AgeGroupDetailsFilters
    >(
        key: K,

        value:
            AgeGroupDetailsFilters[K]

    ) {

        setPendingFilters(
            (previous) => ({

                ...previous,

                [key]:
                    value,

            })
        );

    }


    /* ========================================================================
     * CAMBIO DE REGIÓN
     * ========================================================================
     */

    function handleRegionChange(
        region: string
    ) {

        setPendingFilters(
            (previous) => ({

                ...previous,

                region,

                department: "",

                municipality: "",

            })
        );

    }


    /* ========================================================================
     * CAMBIO DE DEPARTAMENTO
     * ========================================================================
     */

    function handleDepartmentChange(
        department: string
    ) {

        setPendingFilters(
            (previous) => ({

                ...previous,

                department,

                municipality: "",

            })
        );

    }


    /* ========================================================================
     * APLICAR FILTROS
     * ========================================================================
     */

    function applyFilters() {

        setAppliedFilters({
            ...pendingFilters,
        });


        setCurrentPage(
            1
        );

    }


    /* ========================================================================
     * LIMPIAR FILTROS
     * ========================================================================
     */

    function clearFilters() {

        setPendingFilters({
            ...initialFilters,
        });


        setAppliedFilters({
            ...initialFilters,
        });


        setCurrentPage(
            1
        );

    }


    /* ========================================================================
     * MODAL CERRADA
     * ========================================================================
     */

    if (
        !isOpen
    ) {

        return null;

    }


    /* ========================================================================
     * RENDER
     * ========================================================================
     */

    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-slate-950/45
                p-3
                backdrop-blur-[2px]
            "
            onMouseDown={
                (event) => {

                    if (
                        event.target ===
                        event.currentTarget
                    ) {

                        onClose();

                    }

                }
            }
        >

            {/* ============================================================
                MODAL
            ============================================================ */}

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="age-group-modal-title"
                className="
                    flex
                    max-h-[94vh]
                    w-full
                    max-w-[1500px]
                    flex-col
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >

                {/* ========================================================
                    HEADER
                ======================================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-violet-100
                                text-violet-600
                            "
                        >

                            <Table2
                                size={19}
                            />

                        </div>


                        <div className="min-w-0">

                            <h2
                                id="age-group-modal-title"
                                className="
                                    truncate
                                    text-[18px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Casos por grupo de edad
                            </h2>


                            <p
                                className="
                                    mt-0.5
                                    text-[12px]
                                    text-slate-400
                                "
                            >
                                Análisis detallado y comparación epidemiológica
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        aria-label="Cerrar"
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-200
                            text-slate-500
                            transition
                            hover:bg-slate-50
                            hover:text-slate-800
                        "
                    >

                        <X
                            size={17}
                        />

                    </button>

                </div>


                {/* ========================================================
                    PESTAÑAS
                ======================================================== */}

                <div
                    className="
                        shrink-0
                        border-b
                        border-slate-200
                        bg-slate-50/40
                        px-5
                        pt-3
                    "
                >

                    <div
                        className="
                            flex
                            items-end
                            gap-1
                        "
                    >

                        {/* VISTA DETALLADA */}

                        <button
                            type="button"
                            onClick={
                                () =>
                                    setActiveView(
                                        "details"
                                    )
                            }
                            className={`
                                relative
                                flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-t-lg
                                px-4
                                text-[11px]
                                font-semibold
                                transition
                                ${
                                    activeView ===
                                    "details"
                                        ? "bg-white text-violet-700"
                                        : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
                                }
                            `}
                        >

                            <Table2
                                size={14}
                            />

                            Vista detallada


                            {activeView ===
                                "details" && (

                                <span
                                    className="
                                        absolute
                                        bottom-0
                                        left-3
                                        right-3
                                        h-[2px]
                                        rounded-full
                                        bg-violet-600
                                    "
                                />

                            )}

                        </button>


                        {/* COMPARAR */}

                        <button
                            type="button"
                            onClick={
                                () =>
                                    setActiveView(
                                        "comparison"
                                    )
                            }
                            className={`
                                relative
                                flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-t-lg
                                px-4
                                text-[11px]
                                font-semibold
                                transition
                                ${
                                    activeView ===
                                    "comparison"
                                        ? "bg-white text-violet-700"
                                        : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
                                }
                            `}
                        >

                            <SlidersHorizontal
                                size={14}
                            />

                            Comparar períodos


                            {activeView ===
                                "comparison" && (

                                <span
                                    className="
                                        absolute
                                        bottom-0
                                        left-3
                                        right-3
                                        h-[2px]
                                        rounded-full
                                        bg-violet-600
                                    "
                                />

                            )}

                        </button>

                    </div>

                </div>


                {/* ========================================================
                    CONTENIDO
                ======================================================== */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        px-5
                        py-4
                    "
                >

                    {/* ====================================================
                        VISTA DETALLADA
                    ==================================================== */}

                    {activeView ===
                        "details" && (

                        <div>

                            {/* ============================================
                                CARDS RESUMEN
                            ============================================ */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-4
                                    md:grid-cols-3
                                "
                            >

                                {/* TOTAL */}

                                <div
                                    className="
                                        flex
                                        min-h-[92px]
                                        items-center
                                        gap-4
                                        rounded-xl
                                        border
                                        border-blue-100
                                        bg-gradient-to-r
                                        from-blue-50
                                        to-slate-50
                                        px-4
                                        py-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-blue-100
                                            text-blue-600
                                        "
                                    >

                                        <UsersRound
                                            size={22}
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                text-slate-500
                                            "
                                        >
                                            Total de casos
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[24px]
                                                font-bold
                                                leading-none
                                                text-slate-800
                                            "
                                        >
                                            {
                                                response.summary.total.toLocaleString(
                                                    "es-CO"
                                                )
                                            }
                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-medium
                                                text-emerald-600
                                            "
                                        >
                                            {
                                                response.data.length
                                            }{" "}
                                            registros analizados
                                        </p>

                                    </div>

                                </div>


                                {/* DENGUE */}

                                <div
                                    className="
                                        flex
                                        min-h-[92px]
                                        items-center
                                        gap-4
                                        rounded-xl
                                        border
                                        border-violet-100
                                        bg-gradient-to-r
                                        from-violet-50
                                        to-purple-50/40
                                        px-4
                                        py-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-violet-100
                                            text-violet-600
                                        "
                                    >

                                        <Bug
                                            size={22}
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                text-violet-600
                                            "
                                        >
                                            Dengue
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[24px]
                                                font-bold
                                                leading-none
                                                text-violet-600
                                            "
                                        >
                                            {
                                                response.summary.dengue.toLocaleString(
                                                    "es-CO"
                                                )
                                            }
                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-semibold
                                                text-violet-500
                                            "
                                        >
                                            {
                                                denguePercentage.toFixed(
                                                    1
                                                )
                                            }
                                            % del total
                                        </p>

                                    </div>

                                </div>


                                {/* IRA */}

                                <div
                                    className="
                                        flex
                                        min-h-[92px]
                                        items-center
                                        gap-4
                                        rounded-xl
                                        border
                                        border-blue-100
                                        bg-gradient-to-r
                                        from-blue-50
                                        to-sky-50/50
                                        px-4
                                        py-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-blue-100
                                            text-blue-600
                                        "
                                    >

                                        <Activity
                                            size={22}
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                text-blue-600
                                            "
                                        >
                                            IRA
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-[24px]
                                                font-bold
                                                leading-none
                                                text-blue-600
                                            "
                                        >
                                            {
                                                response.summary.ira.toLocaleString(
                                                    "es-CO"
                                                )
                                            }
                                        </p>


                                        <p
                                            className="
                                                mt-2
                                                text-[10px]
                                                font-semibold
                                                text-blue-500
                                            "
                                        >
                                            {
                                                iraPercentage.toFixed(
                                                    1
                                                )
                                            }
                                            % del total
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ============================================
                                FILTROS
                            ============================================ */}

                            <div
                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-4
                                "
                            >

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-3
                                        md:grid-cols-2
                                        xl:grid-cols-6
                                    "
                                >

                                    {/* AÑO */}

                                    <FilterField
                                        label="Año"
                                        icon={
                                            <CalendarDays
                                                size={12}
                                            />
                                        }
                                    >

                                        <select
                                            value={
                                                pendingFilters.year ??
                                                ""
                                            }
                                            onChange={
                                                (event) =>
                                                    updateFilter(
                                                        "year",
                                                        event.target.value
                                                            ? Number(
                                                                event.target.value
                                                            )
                                                            : null
                                                    )
                                            }
                                            className={
                                                selectClass
                                            }
                                        >

                                            <option value="">
                                                Todos
                                            </option>


                                            {years.map(
                                                (year) => (

                                                    <option
                                                        key={
                                                            year
                                                        }
                                                        value={
                                                            year
                                                        }
                                                    >
                                                        {year}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </FilterField>


                                    {/* SEMANA */}

                                    <FilterField
                                        label="Semana"
                                        icon={
                                            <CalendarDays
                                                size={12}
                                            />
                                        }
                                    >

                                        <select
                                            value={
                                                pendingFilters.week ??
                                                ""
                                            }
                                            onChange={
                                                (event) =>
                                                    updateFilter(
                                                        "week",
                                                        event.target.value
                                                            ? Number(
                                                                event.target.value
                                                            )
                                                            : null
                                                    )
                                            }
                                            className={
                                                selectClass
                                            }
                                        >

                                            <option value="">
                                                Todas
                                            </option>


                                            {weeks.map(
                                                (week) => (

                                                    <option
                                                        key={
                                                            week
                                                        }
                                                        value={
                                                            week
                                                        }
                                                    >
                                                        SE {week}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </FilterField>


                                    {/* REGIÓN */}

                                    <FilterField
                                        label="Región"
                                        icon={
                                            <MapPin
                                                size={12}
                                            />
                                        }
                                    >

                                        <select
                                            value={
                                                pendingFilters.region
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

                                    </FilterField>


                                    {/* DEPARTAMENTO */}

                                    <FilterField
                                        label="Departamento"
                                        icon={
                                            <Building2
                                                size={12}
                                            />
                                        }
                                    >

                                        <select
                                            value={
                                                pendingFilters.department
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
                                                        {
                                                            department
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </FilterField>


                                    {/* MUNICIPIO */}

                                    <FilterField
                                        label="Municipio"
                                        icon={
                                            <MapPin
                                                size={12}
                                            />
                                        }
                                    >

                                        <select
                                            value={
                                                pendingFilters.municipality
                                            }
                                            onChange={
                                                (event) =>
                                                    updateFilter(
                                                        "municipality",
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
                                                        {
                                                            municipality
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </FilterField>


                                    {/* GRUPO DE EDAD */}

                                    <FilterField
                                        label="Grupo de edad"
                                        icon={
                                            <UsersRound
                                                size={12}
                                            />
                                        }
                                    >

                                        <select
                                            value={
                                                pendingFilters.ageGroup
                                            }
                                            onChange={
                                                (event) =>
                                                    updateFilter(
                                                        "ageGroup",
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
                                                        {
                                                            ageGroup
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </FilterField>

                                </div>


                                {/* ========================================
                                    BUSCADOR + ACCIONES
                                ======================================== */}

                                <div
                                    className="
                                        mt-3
                                        flex
                                        flex-col
                                        gap-3
                                        lg:flex-row
                                        lg:items-center
                                    "
                                >

                                    <div
                                        className="
                                            relative
                                            w-full
                                            lg:max-w-[520px]
                                        "
                                    >

                                        <Search
                                            size={15}
                                            className="
                                                absolute
                                                left-3
                                                top-1/2
                                                -translate-y-1/2
                                                text-slate-400
                                            "
                                        />


                                        <input
                                            type="text"
                                            value={
                                                pendingFilters.search
                                            }
                                            onChange={
                                                (event) =>
                                                    updateFilter(
                                                        "search",
                                                        event.target.value
                                                    )
                                            }
                                            onKeyDown={
                                                (event) => {

                                                    if (
                                                        event.key ===
                                                        "Enter"
                                                    ) {

                                                        applyFilters();

                                                    }

                                                }
                                            }
                                            placeholder="Buscar por región, departamento, municipio o grupo de edad..."
                                            className="
                                                h-10
                                                w-full
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                pl-9
                                                pr-3
                                                text-[12px]
                                                text-slate-700
                                                outline-none
                                                transition
                                                placeholder:text-slate-400
                                                focus:border-violet-400
                                                focus:ring-2
                                                focus:ring-violet-100
                                            "
                                        />

                                    </div>


                                    <div
                                        className="
                                            ml-auto
                                            flex
                                            gap-2
                                        "
                                    >

                                        <button
                                            type="button"
                                            onClick={
                                                clearFilters
                                            }
                                            className="
                                                flex
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
                                            "
                                        >

                                            <RotateCcw
                                                size={14}
                                            />

                                            Limpiar filtros

                                        </button>


                                        <button
                                            type="button"
                                            onClick={
                                                applyFilters
                                            }
                                            className="
                                                flex
                                                h-10
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-lg
                                                bg-violet-600
                                                px-5
                                                text-[11px]
                                                font-semibold
                                                text-white
                                                shadow-sm
                                                transition
                                                hover:bg-violet-700
                                            "
                                        >

                                            <SlidersHorizontal
                                                size={14}
                                            />

                                            Aplicar filtros

                                        </button>

                                    </div>

                                </div>

                            </div>


                            {/* ============================================
                                REGISTROS ENCONTRADOS
                            ============================================ */}

                            <div
                                className="
                                    mb-2
                                    mt-4
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <p
                                    className="
                                        text-[12px]
                                        font-medium
                                        text-slate-500
                                    "
                                >
                                    {
                                        response.data.length.toLocaleString(
                                            "es-CO"
                                        )
                                    }{" "}
                                    registros encontrados
                                </p>

                            </div>


                            {/* ============================================
                                TABLA
                            ============================================ */}

                            <div
                                className={
                                    loading
                                        ? "opacity-50 transition"
                                        : "opacity-100 transition"
                                }
                            >

                                <AgeGroupDetailsTable
                                    data={
                                        paginatedData
                                    }
                                />

                            </div>


                            {/* ============================================
                                FOOTER
                            ============================================ */}

                            <div
                                className="
                                    mt-3
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                {/* REGISTROS POR PÁGINA */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[11px]
                                        text-slate-500
                                    "
                                >

                                    <span>
                                        Mostrar
                                    </span>


                                    <select
                                        value={
                                            itemsPerPage
                                        }
                                        onChange={
                                            (event) => {

                                                setItemsPerPage(
                                                    Number(
                                                        event.target.value
                                                    )
                                                );


                                                setCurrentPage(
                                                    1
                                                );

                                            }
                                        }
                                        className="
                                            h-8
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-white
                                            px-2
                                            text-[11px]
                                            font-medium
                                            text-slate-700
                                            outline-none
                                        "
                                    >

                                        <option value={8}>
                                            8
                                        </option>

                                        <option value={10}>
                                            10
                                        </option>

                                        <option value={15}>
                                            15
                                        </option>

                                        <option value={20}>
                                            20
                                        </option>

                                    </select>


                                    <span>
                                        registros por página
                                    </span>

                                </div>


                                {/* PAGINACIÓN */}

                                {totalPages >
                                    1 && (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <button
                                            type="button"
                                            disabled={
                                                currentPage ===
                                                1
                                            }
                                            onClick={
                                                () =>
                                                    setCurrentPage(
                                                        (
                                                            previous
                                                        ) =>
                                                            Math.max(
                                                                1,
                                                                previous -
                                                                1
                                                            )
                                                    )
                                            }
                                            className="
                                                flex
                                                h-8
                                                min-w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                px-2
                                                text-[11px]
                                                text-slate-600
                                                transition
                                                hover:bg-slate-50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-35
                                            "
                                        >
                                            ‹
                                        </button>


                                        {Array.from(
                                            {
                                                length:
                                                    totalPages,
                                            },
                                            (
                                                _,
                                                index
                                            ) => {

                                                const page =
                                                    index +
                                                    1;


                                                return (

                                                    <button
                                                        key={
                                                            page
                                                        }
                                                        type="button"
                                                        onClick={
                                                            () =>
                                                                setCurrentPage(
                                                                    page
                                                                )
                                                        }
                                                        className={`
                                                            flex
                                                            h-8
                                                            min-w-8
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            text-[11px]
                                                            font-semibold
                                                            transition
                                                            ${
                                                                currentPage ===
                                                                page
                                                                    ? "border-violet-600 bg-violet-600 text-white"
                                                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                            }
                                                        `}
                                                    >
                                                        {
                                                            page
                                                        }
                                                    </button>

                                                );

                                            }
                                        )}


                                        <button
                                            type="button"
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            onClick={
                                                () =>
                                                    setCurrentPage(
                                                        (
                                                            previous
                                                        ) =>
                                                            Math.min(
                                                                totalPages,
                                                                previous +
                                                                1
                                                            )
                                                    )
                                            }
                                            className="
                                                flex
                                                h-8
                                                min-w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                border
                                                border-slate-200
                                                bg-white
                                                px-2
                                                text-[11px]
                                                text-slate-600
                                                transition
                                                hover:bg-slate-50
                                                disabled:cursor-not-allowed
                                                disabled:opacity-35
                                            "
                                        >
                                            ›
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    )}


                    {/* ====================================================
                        VISTA COMPARACIÓN
                    ==================================================== */}

                    {activeView ===
                        "comparison" && (

                        <AgeGroupComparison />

                    )}

                </div>

            </div>

        </div>

    );

}


/* ============================================================================
 * FILTER FIELD
 * ============================================================================
 */

interface FilterFieldProps {

    label: string;

    icon: ReactNode;

    children: ReactNode;

}


function FilterField({

    label,

    icon,

    children,

}: FilterFieldProps) {

    return (

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

                <span
                    className="
                        text-slate-400
                    "
                >
                    {icon}
                </span>

                {label}

            </label>


            {children}

        </div>

    );

}


/* ============================================================================
 * CLASE COMPARTIDA DE LOS SELECTS
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