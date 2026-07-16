// src/app/components/MapView.tsx

"use client";

import dynamic from "next/dynamic";

const GeoViewerClient = dynamic(
  () => import("./GeoViewerClient"),
  {
    ssr: false,

    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        Cargando mapa...
      </div>
    ),
  }
);

interface MapViewProps {
  selectedDepartmentId: string;
  selectedMunicipalityId: string;
  municipalityIds: string[];
  applyVersion: number;
}

export default function MapView({
  selectedDepartmentId,
  selectedMunicipalityId,
  municipalityIds,
  applyVersion,
}: MapViewProps) {
  return (
    <div className="flex-1 h-full min-h-0 relative rounded-[10px] overflow-hidden border border-slate-200">
      <GeoViewerClient
        selectedDepartmentId={
          selectedDepartmentId
        }
        selectedMunicipalityId={
          selectedMunicipalityId
        }
        municipalityIds={
          municipalityIds
        }
        applyVersion={
          applyVersion
        }
      />

      <div className="absolute inset-0 bg-white/10 pointer-events-none" />

      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-[10px] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">
              Estado de Carga
            </p>

            <p className="text-sm text-slate-700">
              Sincronizado
            </p>
          </div>

          <div className="flex items-center gap-10 text-right">
            <div>
              <p className="text-xs text-slate-500">
                Alertas Activas
              </p>

              <p className="text-sm font-semibold text-slate-700">
                12
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Tendencia
              </p>

              <p className="text-sm font-semibold text-slate-700">
                +5.2%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}