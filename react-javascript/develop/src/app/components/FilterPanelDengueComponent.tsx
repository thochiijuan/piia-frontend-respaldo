"use client";

import { useMemo } from "react";
import Select from "react-select";

import type { Dispatch, SetStateAction } from "react";
import type { FilterStatus } from "./FilterState";

interface Departamento {
    id: number | string;
    name: string;
}

interface DepartamentoOption {
    value: string;
    label: string;
}

interface FilterPanelDengueComponentProps {
    statusDict: FilterStatus;
    setStatusDict: Dispatch<SetStateAction<FilterStatus>>;
    departamentos?: Departamento[];
    isAuthenticated?: boolean;
    onApply?: () => void;
}

export default function FilterPanelDengueComponent({
    statusDict,
    setStatusDict,
    departamentos = [],
    isAuthenticated,
    onApply,
}: FilterPanelDengueComponentProps) {
    console.log(isAuthenticated)
    const departamentoOptions = useMemo<DepartamentoOption[]>(() => {
        return [
            {
                value: "",
                label: "Todos los Departamentos",
            },
            ...departamentos.map((departamento) => ({
                value: String(departamento.id),
                label: departamento.name,
            })),
        ];
    }, [departamentos]);

    const selectedDepartamento =
        departamentoOptions.find(
            (option) =>
                option.value === String(statusDict.filterPanel.FilterPanelDengueComponent.departamento ?? "")
        ) ?? departamentoOptions[0];

    const handleDepartamentoChange = (
        option: DepartamentoOption | null
    ) => {
        setStatusDict((previousStatus) => ({
            ...previousStatus,
            departamento: option?.value ?? "",
        }));
    };

    return (
        <div className="p-4 space-y-5 bg-white">
            <div>
                <label className="text-xs text-slate-500 block mb-2">
                    Departamento
                </label>

                <Select<DepartamentoOption, false>
                    instanceId="departamento-select"
                    options={departamentoOptions}
                    value={selectedDepartamento}
                    onChange={handleDepartamentoChange}
                    isSearchable
                    isClearable={false}
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

                <input
                    type="text"
                    placeholder="Municipio (Todos)"
                    value={statusDict.filterPanel.FilterPanelDengueComponent.municipio ?? ""}
                    onChange={(event) =>
                        setStatusDict((previousStatus) => ({
                            ...previousStatus,
                            municipio: event.target.value,
                        }))
                    }
                    className="w-full border border-slate-300 rounded-[8px] p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
            </div>

            {/* SOLO USUARIOS AUTENTICADOS */}
            {isAuthenticated && (
                <>
                    <div>
                        <label className="text-xs text-slate-500 block mb-3">
                            Evento Epidemiológico
                        </label>

                        <div className="space-y-3 text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked />
                                Dengue
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked />
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
                                <input type="checkbox" defaultChecked />
                                Niveles de riesgo
                            </label>

                            <label className="flex items-center gap-2">
                                <input type="checkbox" defaultChecked />
                                Casos
                            </label>
                        </div>
                    </div>
                </>
            )}

            {/* BOTONES */}
            <div className="space-y-4 pt-4">
                <button
                    type="button"
                    onClick={onApply}
                    className="w-full bg-[#2F80ED] hover:bg-blue-700 transition text-white rounded-[8px] py-3 text-sm"
                >
                    Aplicar Filtros
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setStatusDict((previousStatus) => ({
                            ...previousStatus,
                            departamento: "",
                        }))
                    }
                    className="w-full border bg-white hover:bg-slate-100 transition rounded-[8px] py-3 text-sm text-slate-600"
                >
                    Limpiar Departamento
                </button>
            </div>
        </div>
    );
}