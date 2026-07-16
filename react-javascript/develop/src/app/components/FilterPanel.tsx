"use client";

import { useEffect, useState } from "react";

import FilterPanelDengueComponent from "./FilterPanelDengueComponent";

import {
  initialFilterStats,
  type FilterStatus,
} from "./FilterState";

import getDepartamentos from "../../static/js/fetch_petitions_geodesic";

interface FilterPanelProps {
  isAuthenticated?: boolean;
}

interface Departamento {
  id: number | string;
  name: string;
}

export default function FilterPanel({
  isAuthenticated = true,
}: FilterPanelProps) {
  const [statusDict, setStatusDict] =
    useState<FilterStatus>(initialFilterStats);

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(true);
  const [errorDepartamentos, setErrorDepartamentos] = useState("");

  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        setLoadingDepartamentos(true);
        setErrorDepartamentos("");

        const data = await getDepartamentos();
        console.log(data)
        setDepartamentos(data);
      } catch (error) {
        console.error("Error cargando departamentos:", error);

        setErrorDepartamentos(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los departamentos"
        );

        setDepartamentos([]);
      } finally {
        setLoadingDepartamentos(false);
      }
    };

    cargarDepartamentos();
  }, []);

  const handleApplyFilters = () => {
    console.log("Filtros aplicados:", statusDict);
    console.log("Departamentos:", departamentos);
  };

  return (
    <div className="w-[320px] bg-white overflow-y-auto rounded-[8px] border border-slate-200">
      {/* HEADER FILTROS */}
      <div className="px-4 py-4 border-b bg-white">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          🔎 Filtros de Información
        </h2>
      </div>

      {loadingDepartamentos && (
        <p className="p-4 text-sm text-slate-500">
          Cargando departamentos...
        </p>
      )}

      {errorDepartamentos && (
        <p className="p-4 text-sm text-red-500">
          {errorDepartamentos}
        </p>
      )}

      {!loadingDepartamentos && !errorDepartamentos && (
        <FilterPanelDengueComponent
          statusDict={statusDict}
          setStatusDict={setStatusDict}
          departamentos={departamentos}
          isAuthenticated={isAuthenticated}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
}