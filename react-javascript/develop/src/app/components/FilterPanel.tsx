"use client";

import { useState } from "react";
import { departamentos } from "@/app/data/departamentos";

interface FilterPanelProps {
  isAuthenticated?: boolean;
}

export default function FilterPanel({
  isAuthenticated = false,
}: FilterPanelProps) {

  const [searchDepartamento, setSearchDepartamento] = useState("");
  const [selectedDepartamento, setSelectedDepartamento] = useState("");

  const filteredDepartamentos = departamentos.filter((dep) =>
    dep.toLowerCase().includes(searchDepartamento.toLowerCase())
  );

  return (
    <div className="w-[320px] bg-white overflow-y-auto rounded-[8px] border border-slate-200">

      {/* HEADER FILTROS */}
      <div className="px-4 py-4 border-b bg-white">
        <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          🔎 Filtros de Información
        </h2>
      </div>

      {/* FORM */}
      <div className="p-4 space-y-5 bg-white">

        {/* DEPARTAMENTO */}
        <div>

          <label className="text-xs text-slate-500 block mb-2">
            Departamento
          </label>

          <input
            type="text"
            placeholder="Departamento (Todos)"
            value={searchDepartamento}
            onChange={(e) => setSearchDepartamento(e.target.value)}
            className="w-full border border-slate-300 rounded-[8px] p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />

          {searchDepartamento && (
            <div className="mt-2 border border-slate-200 rounded-[8px] bg-white max-h-48 overflow-y-auto shadow-sm">

              {filteredDepartamentos.length > 0 ? (

                filteredDepartamentos.map((dep) => (
                  <button
                    key={dep}
                    type="button"
                    onClick={() => {
                      setSelectedDepartamento(dep);
                      setSearchDepartamento(dep);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition hover:bg-blue-50 ${
                      selectedDepartamento === dep
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-slate-700"
                    }`}
                  >
                    {dep}
                  </button>
                ))

              ) : (

                <div className="px-4 py-3 text-sm text-slate-400">
                  No se encontraron resultados
                </div>

              )}

            </div>
          )}

        </div>

        {/* MUNICIPIO */}
        <div>

          <label className="text-xs text-slate-500 block mb-2">
            Municipio
          </label>

          <input
            type="text"
            placeholder="Municipio (Todos)"
            className="w-full border border-slate-300 rounded-[8px] p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
          />

        </div>

        {/* PERIODO */}
        <div>

          <label className="text-xs text-slate-500 block mb-2">
            Periodo de Tiempo
          </label>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Año"
              className="w-full border border-slate-300 rounded-[8px] p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />

            <input
              type="text"
              placeholder="Semana"
              className="w-full border border-slate-300 rounded-[8px] p-3 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />

          </div>

        </div>

        {/* SOLO USUARIOS AUTENTICADOS */}
        {isAuthenticated && (
          <>
            {/* EVENTOS */}
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

            {/* CAPAS */}
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

          <button className="w-full bg-[#2F80ED] hover:bg-blue-700 transition text-white rounded-[8px] py-3 text-sm">
            Aplicar Filtros
          </button>

          <button className="w-full border bg-white hover:bg-slate-100 transition rounded-[8px] py-3 text-sm text-slate-600">
            Limpiar Filtros
          </button>

        </div>

      </div>

    </div>
  );
}