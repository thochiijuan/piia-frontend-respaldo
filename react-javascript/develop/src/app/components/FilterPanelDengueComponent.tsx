"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import {
    getDepartamentos,
    getMunicipiosPorDepartamento,
} from "../../static/js/fetch_petitions_geodesic";

import type { Dispatch, SetStateAction } from "react";
import type { FilterStatus } from "./FilterState";
import { departmentsIDs } from "../../static/js/endpoint_var";


interface GeographicItem {
    id: number | string;
    name: string;
}

interface SelectOption {
    value: string;
    label: string;
}

interface FilterPanelDengueComponentProps {
    statusDict: FilterStatus;

    setStatusDict: Dispatch<
        SetStateAction<FilterStatus>
    >;

    isAuthenticated?: boolean;
    onApply: (
        municipalityIds: string[]
    ) => void;
}
function createOptions(
    items: GeographicItem[],
    defaultLabel: string
): SelectOption[] {
    return [
        {
            value: "",
            label: defaultLabel,
        },
        ...items.map((item) => ({
            value: String(item.id),
            label: item.name,
        })),
    ];
}

function findSelectedOption(
    options: SelectOption[],
    value: string
): SelectOption {
    return (
        options.find((option) => option.value === value) ??
        options[0]
    );
}


export default function FilterPanelDengueComponent({
    statusDict,
    setStatusDict,
    isAuthenticated = false,
    onApply,
}: FilterPanelDengueComponentProps) {
    const [departamentos, setDepartamentos] = useState<
        GeographicItem[]
    >([]);

    const [municipios, setMunicipios] = useState<
        GeographicItem[]
    >([]);

    const [loadingDepartamentos, setLoadingDepartamentos] =
        useState(false);

    const [loadingMunicipios, setLoadingMunicipios] =
        useState(false);

    const departamentoId = String(
        statusDict.filterPanel.departamento ?? ""
    );

    const municipioId = String(
        statusDict.filterPanel.municipio ?? ""
    );

    const updateFilterPanel = (
        values: Partial<FilterStatus["filterPanel"]>
    ) => {
        setStatusDict((previousStatus) => ({
            ...previousStatus,

            filterPanel: {
                ...previousStatus.filterPanel,
                ...values,
            },
        }));
    };

    useEffect(() => {
        const cargarDepartamentos = async () => {
            setLoadingDepartamentos(true);

            try {
                const data =
                    await getDepartamentos();

                const allDepartments =
                    Array.isArray(data)
                        ? data
                        : [];

                const allowedDepartments =
                    allDepartments.filter(
                        (department) =>
                            allowedDepartmentIds.has(
                                normalizeGeographicId(
                                    department.id
                                )
                            )
                    );

                setDepartamentos(
                    allowedDepartments
                );
            } catch (error) {
                console.error(
                    "Error cargando departamentos:",
                    error
                );

                setDepartamentos([]);
            } finally {
                setLoadingDepartamentos(false);
            }
        };

        cargarDepartamentos();
    }, []);

    useEffect(() => {
        if (!departamentoId) {
            setMunicipios([]);
            return;
        }

        const cargarMunicipios = async () => {
            setLoadingMunicipios(true);

            try {
                const data =
                    await getMunicipiosPorDepartamento(
                        departamentoId
                    );

                setMunicipios(
                    Array.isArray(data) ? data : []
                );
            } catch (error) {
                console.error(
                    "Error cargando municipios:",
                    error
                );

                setMunicipios([]);
            } finally {
                setLoadingMunicipios(false);
            }
        };

        cargarMunicipios();
    }, [departamentoId]);

    const departamentoOptions = useMemo(
        () =>
            createOptions(
                departamentos,
                "Todos los Departamentos"
            ),
        [departamentos]
    );

    const municipioOptions = useMemo(
        () =>
            createOptions(
                municipios,
                "Todos los Municipios"
            ),
        [municipios]
    );

    const selectedDepartamento = findSelectedOption(
        departamentoOptions,
        departamentoId
    );

    const selectedMunicipio = findSelectedOption(
        municipioOptions,
        municipioId
    );

    const handleDepartamentoChange = (
        option: SelectOption | null
    ) => {
        setMunicipios([]);

        updateFilterPanel({
            departamento: option?.value ?? "",
            municipio: "",
        });
    };

    const handleMunicipioChange = (
        option: SelectOption | null
    ) => {
        updateFilterPanel({
            municipio: option?.value ?? "",
        });
    };

    const limpiarDepartamento = () => {
        setMunicipios([]);

        updateFilterPanel({
            departamento: "",
            municipio: "",
        });
    };

    function normalizeGeographicId(
        value: string | number
    ): string {
        const normalizedValue = String(
            value
        ).trim();

        /*
         * Permite comparar correctamente:
         * "05" con 5
         * "08" con 8
         */
        if (/^\d+$/.test(normalizedValue)) {
            return String(
                Number(normalizedValue)
            );
        }

        return normalizedValue;
    }

    const allowedDepartmentIds = new Set(
        departmentsIDs.map((departmentId) =>
            normalizeGeographicId(departmentId)
        )
    );

    return (
        <div className="p-4 space-y-5 bg-white">
            <div>
                <label className="text-xs text-slate-500 block mb-2">
                    Departamento
                </label>

                <Select<SelectOption, false>
                    instanceId="departamento-select"
                    options={departamentoOptions}
                    value={selectedDepartamento}
                    onChange={handleDepartamentoChange}
                    isSearchable
                    isClearable={false}
                    isLoading={loadingDepartamentos}
                    placeholder="Todos los Departamentos"
                    noOptionsMessage={() =>
                        "No se encontraron departamentos"
                    }
                    className="text-sm"
                />
            </div>

            <div>
                <label className="text-xs text-slate-500 block mb-2">
                    Municipio
                </label>

                <Select<SelectOption, false>
                    instanceId="municipio-select"
                    options={municipioOptions}
                    value={selectedMunicipio}
                    onChange={handleMunicipioChange}
                    isSearchable
                    isClearable={false}
                    isLoading={loadingMunicipios}
                    isDisabled={
                        !departamentoId ||
                        loadingMunicipios
                    }
                    placeholder={
                        departamentoId
                            ? "Todos los Municipios"
                            : "Seleccione un departamento"
                    }
                    noOptionsMessage={() =>
                        "No se encontraron municipios"
                    }
                    className="text-sm"
                />
            </div>

            {isAuthenticated && (
                <>
                    <div>
                        <label className="text-xs text-slate-500 block mb-3">
                            Evento Epidemiológico
                        </label>

                        <div className="space-y-3 text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                Dengue
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                IRA (Infección Resp.)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-500 block mb-3">
                            Capas del mapa
                        </label>

                        <div className="space-y-3 text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                Niveles de riesgo
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                />
                                Casos
                            </label>
                        </div>
                    </div>
                </>
            )}

            <div className="space-y-4 pt-4">
                <button
                    type="button"
                    onClick={() =>
                        onApply(
                            municipios.map((municipio) =>
                                String(municipio.id)
                            )
                        )
                    }
                    className="w-full bg-[#2F80ED] hover:bg-blue-700 transition text-white rounded-[8px] py-3 text-sm"
                >
                    Aplicar Filtros
                </button>
                <button
                    type="button"
                    onClick={limpiarDepartamento}
                    disabled={!departamentoId}
                    className={`
                        w-full border rounded-[8px] py-3 text-sm transition
                        ${departamentoId
                            ? "bg-white hover:bg-slate-100 text-slate-600"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }
                    `}
                >
                    Limpiar Filtros
                </button>
            </div>
        </div>
    );
}