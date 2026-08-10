"use client";

import { useEffect, useState } from "react";

import type {
    GeovisorFilterOptions,
    GeovisorSelectedFilters,
} from "../data/geovisor";

import {
    getGeovisorFilterOptions,
} from "../services/geovisor.service";

/**
 * ============================================================================
 * ESTADO INICIAL DE LOS FILTROS
 * ============================================================================
 */
const INITIAL_FILTERS: GeovisorSelectedFilters = {
    year: "",
    epidemiologicalWeek: "",
    disease: "",
    indicator: "",
    territorialDirection: "",
};

/**
 * ============================================================================
 * FILTROS SUPERIORES DEL GEOVISOR
 * ============================================================================
 */
export default function GeovisorFilters() {

    const [options, setOptions] =
        useState<GeovisorFilterOptions | null>(null);

    const [filters, setFilters] =
        useState<GeovisorSelectedFilters>(INITIAL_FILTERS);

    useEffect(() => {

        async function loadFilters() {

            const response =
                await getGeovisorFilterOptions();

            setOptions(response);

            /**
             * Valores iniciales.
             *
             * Posteriormente estos valores también podrán
             * ser definidos por el backend.
             */
            setFilters({
                year:
                    response.years.at(-1)?.value ?? "",

                epidemiologicalWeek:
                    response.epidemiologicalWeeks[0]?.value ?? "",

                disease:
                    response.diseases[0]?.value ?? "",

                indicator:
                    response.indicators[0]?.value ?? "",

                territorialDirection:
                    response.territorialDirections[0]?.value ?? "",
            });

        }

        void loadFilters();

    }, []);

    /**
     * ============================================================================
     * ACTUALIZACIÓN DE FILTROS
     * ============================================================================
     */
    function updateFilter(
        field: keyof GeovisorSelectedFilters,
        value: string
    ) {

        setFilters((previous) => ({
            ...previous,
            [field]: value,
        }));

    }

    if (!options) {

        return (

            <div className="h-[68px] animate-pulse rounded-xl border border-slate-200 bg-white" />

        );

    }

    return (

        <section
    className="
        grid
        min-w-0
        grid-cols-1
        gap-3
        sm:grid-cols-2
        lg:grid-cols-5
    "
>

            {/* ============================================================
                AÑO
            ============================================================ */}

            <div className="min-w-0">

                <label
                    htmlFor="geovisor-year"
                    className="mb-1 block text-[11px] font-semibold text-slate-500"
                >
                    Año
                </label>

                <select
                    id="geovisor-year"
                    value={filters.year}
                    onChange={(event) =>
                        updateFilter(
                            "year",
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.years.map((option) => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>

            </div>

            {/* ============================================================
                SEMANA EPIDEMIOLÓGICA
            ============================================================ */}

            <div className="min-w-0">

                <label
                    htmlFor="geovisor-week"
                    className="mb-1 block text-[11px] font-semibold text-slate-500"
                >
                    Semana epidemiológica
                </label>

                <select
                    id="geovisor-week"
                    value={filters.epidemiologicalWeek}
                    onChange={(event) =>
                        updateFilter(
                            "epidemiologicalWeek",
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.epidemiologicalWeeks.map(
                        (option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        )
                    )}

                </select>

            </div>

            {/* ============================================================
                ENFERMEDAD
            ============================================================ */}

            <div className="min-w-0">

                <label
                    htmlFor="geovisor-disease"
                    className="mb-1 block text-[11px] font-semibold text-slate-500"
                >
                    Enfermedad
                </label>

                <select
                    id="geovisor-disease"
                    value={filters.disease}
                    onChange={(event) =>
                        updateFilter(
                            "disease",
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.diseases.map((option) => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>

            </div>

            {/* ============================================================
                INDICADOR
            ============================================================ */}

            <div className="min-w-0">

                <label
                    htmlFor="geovisor-indicator"
                    className="mb-1 block text-[11px] font-semibold text-slate-500"
                >
                    Indicador
                </label>

                <select
                    id="geovisor-indicator"
                    value={filters.indicator}
                    onChange={(event) =>
                        updateFilter(
                            "indicator",
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.indicators.map((option) => (

                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>

                    ))}

                </select>

            </div>

            {/* ============================================================
                DIRECCIÓN TERRITORIAL
            ============================================================ */}

            <div className="min-w-0">

                <label
                    htmlFor="geovisor-territory"
                    className="mb-1 block text-[11px] font-semibold text-slate-500"
                >
                    Dirección territorial
                </label>

                <select
                    id="geovisor-territory"
                    value={filters.territorialDirection}
                    onChange={(event) =>
                        updateFilter(
                            "territorialDirection",
                            event.target.value
                        )
                    }
                    className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-3
                        text-sm
                        text-slate-700
                        outline-none
                        transition
                        focus:border-blue-400
                        focus:ring-2
                        focus:ring-blue-100
                    "
                >

                    {options.territorialDirections.map(
                        (option) => (

                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>

                        )
                    )}

                </select>

            </div>

        </section>

    );

}