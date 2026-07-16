"use client";

import FilterPanelDengueComponent
  from "./FilterPanelDengueComponent";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import type {
  FilterStatus,
} from "./FilterState";

interface FilterPanelProps {
  statusDict: FilterStatus;

  setStatusDict: Dispatch<
    SetStateAction<FilterStatus>
  >;

  onApply: (
    municipalityIds: string[]
  ) => void;
  isAuthenticated?: boolean;
}

export default function FilterPanel({
  statusDict,
  setStatusDict,
  onApply,
  isAuthenticated = false,
}: FilterPanelProps) {
  return (
    <div className="w-[320px] bg-white overflow-y-auto rounded-[8px] border border-slate-200">
      <div className="px-4 py-4 border-b bg-white">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          🔎 Filtros de Información
        </h2>
      </div>

      <FilterPanelDengueComponent
        statusDict={statusDict}
        setStatusDict={setStatusDict}
        isAuthenticated={isAuthenticated}
        onApply={onApply}
      />
    </div>
  );
}