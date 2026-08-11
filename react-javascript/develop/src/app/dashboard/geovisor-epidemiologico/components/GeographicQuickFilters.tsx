"use client";

import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

import type {
    GeographicQuickFilterOptions,
} from "../data/geovisor";

import {
    getGeographicQuickFilterOptions,
} from "../services/geovisor.service";

export default function GeographicQuickFilters() {

    const [options, setOptions] =
        useState<GeographicQuickFilterOptions | null>(
            null
        );

    const [region, setRegion] =
        useState("all");

    const [department, setDepartment] =
        useState("all");

    const [municipality, setMunicipality] =
        useState("all");

    const [area, setArea] =
        useState("all");

    useEffect(() => {

        async function loadOptions() {

            const response =
                await getGeographicQuickFilterOptions();

            setOptions(response);

        }

        void loadOptions();

    }, []);

    function clearFilters() {

        setRegion("all");
        setDepartment("all");
        setMunicipality("all");
        setArea("all");

    }

    if (!options) {

        return (
            <div className="h-full min-h-[250px] animate-pulse rounded-xl border border-slate-200 bg-white" />
        );

    }

    const selectClass = `
        h-8
        w-full
        rounded-md
        border
        border-slate-200
        bg-white
        px-2
        text-[11px]
        text-slate-700
        outline-none
        transition
        focus:border-blue-400
    `;

    return (

        <section
            className="
                flex
                h-full
                flex-col
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
            "
        >

            <h2 className="text-[15px] font-bold text-slate-800">
                Filtros geográficos rápidos
            </h2>

            <div className="mt-2 space-y-2">

                <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                        Región
                    </label>

                    <select
                        className={selectClass}
                        value={region}
                        onChange={(event) =>
                            setRegion(event.target.value)
                        }
                    >
                        {options.regions.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                        Departamento
                    </label>

                    <select
                        className={selectClass}
                        value={department}
                        onChange={(event) =>
                            setDepartment(event.target.value)
                        }
                    >
                        {options.departments.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                        Municipio
                    </label>

                    <select
                        className={selectClass}
                        value={municipality}
                        onChange={(event) =>
                            setMunicipality(event.target.value)
                        }
                    >
                        {options.municipalities.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-600">
                        Área
                    </label>

                    <select
                        className={selectClass}
                        value={area}
                        onChange={(event) =>
                            setArea(event.target.value)
                        }
                    >
                        {options.areas.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <button
                type="button"
                onClick={clearFilters}
                className="
                    mt-3
                    flex
                    h-9
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-[#DCE7FF]
                    bg-[#F5F8FF]
                    text-[12px]
                    font-semibold
                    text-[#2563EB]
                    transition
                    hover:bg-[#EDF4FF]
                "
            >

                <RotateCcw size={16} />

                Limpiar filtros

            </button>

        </section>

    );

}