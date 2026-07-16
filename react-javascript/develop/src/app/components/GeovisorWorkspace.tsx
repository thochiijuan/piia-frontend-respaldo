"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import FilterPanel from "./FilterPanel";
import MapView from "./MapView";

import {
    initialFilterStatus,
} from "./FilterState";

import {
    usePersistentFilterStatus,
} from "./usePersistentFilterStatus";

import {
    getMunicipiosPorDepartamento,
} from "../../static/js/fetch_petitions_geodesic";

interface GeovisorWorkspaceProps {
    isAuthenticated?: boolean;
}

interface AppliedFilters {
    departamento: string;
    municipio: string;

    /*
     * Municipios disponibles para el departamento.
     */
    municipalityIds: string[];

    applyVersion: number;
}

interface GeographicItem {
    id: number | string;
    name: string;
}

export default function GeovisorWorkspace({
    isAuthenticated = false,
}: GeovisorWorkspaceProps) {
    const {
        statusDict,
        setStatusDict,
        statusLoaded,
    } = usePersistentFilterStatus(
        initialFilterStatus
    );

    const [
        appliedFilters,
        setAppliedFilters,
    ] = useState<AppliedFilters>({
        departamento: "",
        municipio: "",
        municipalityIds: [],
        applyVersion: 0,
    });

    const initialized = useRef(false);

    /*
     * Reconstruye los filtros guardados en localStorage
     * cuando el usuario vuelve a entrar.
     */
    useEffect(() => {
        if (
            !statusLoaded ||
            initialized.current
        ) {
            return;
        }

        initialized.current = true;

        let cancelled = false;

        const initializeAppliedFilters =
            async () => {
                const departamento = String(
                    statusDict.filterPanel
                        .departamento ?? ""
                );

                const municipio = String(
                    statusDict.filterPanel
                        .municipio ?? ""
                );

                let municipalityIds: string[] =
                    [];

                if (departamento) {
                    try {
                        const data =
                            await getMunicipiosPorDepartamento(
                                departamento
                            ) as GeographicItem[];

                        municipalityIds =
                            Array.isArray(data)
                                ? data.map((item) =>
                                    String(item.id)
                                )
                                : [];
                    } catch (error) {
                        console.error(
                            "No se pudieron reconstruir los municipios:",
                            error
                        );
                    }
                }

                if (cancelled) {
                    return;
                }

                setAppliedFilters({
                    departamento,
                    municipio,
                    municipalityIds,
                    applyVersion: 1,
                });
            };

        initializeAppliedFilters();

        return () => {
            cancelled = true;
        };
    }, [
        statusLoaded,
        statusDict.filterPanel.departamento,
        statusDict.filterPanel.municipio,
    ]);

    const applyFilters = (
        municipalityIds: string[]
    ) => {
        setAppliedFilters(
            (previousFilters) => ({
                departamento: String(
                    statusDict.filterPanel
                        .departamento ?? ""
                ),

                municipio: String(
                    statusDict.filterPanel
                        .municipio ?? ""
                ),

                municipalityIds,

                applyVersion:
                    previousFilters.applyVersion +
                    1,
            })
        );
    };

    if (!statusLoaded) {
        return null;
    }

    return (
        <section className="flex-1 flex flex-col h-screen min-h-0 bg-[#f5f6fb]">
            <div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-4 pt-4 gap-4">
                <FilterPanel
                    statusDict={statusDict}
                    setStatusDict={setStatusDict}
                    onApply={applyFilters}
                    isAuthenticated={
                        isAuthenticated
                    }
                />

                <MapView
                    selectedDepartmentId={
                        appliedFilters.departamento
                    }
                    selectedMunicipalityId={
                        appliedFilters.municipio
                    }
                    municipalityIds={
                        appliedFilters.municipalityIds
                    }
                    applyVersion={
                        appliedFilters.applyVersion
                    }
                />
            </div>
        </section>
    );
}