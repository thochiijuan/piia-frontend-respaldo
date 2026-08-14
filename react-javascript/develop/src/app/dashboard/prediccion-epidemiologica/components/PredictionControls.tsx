"use client";

import { CalendarRange, MapPin } from "lucide-react";

import type {
    PredictionHorizon,
    PredictionMunicipality,
} from "../data/predictionApi";

interface PredictionControlsProps {
    municipalities: PredictionMunicipality[];
    selectedMunicipalityCode: string;
    selectedHorizon: PredictionHorizon;
    onMunicipalityChange: (municipalityCode: string) => void;
    onHorizonChange: (horizon: PredictionHorizon) => void;
    disabled?: boolean;
}

const horizons: PredictionHorizon[] = [1, 2, 3, 4];

export default function PredictionControls({
    municipalities,
    selectedMunicipalityCode,
    selectedHorizon,
    onMunicipalityChange,
    onHorizonChange,
    disabled = false,
}: PredictionControlsProps) {
    const selectedMunicipality = municipalities.find(
        (municipality) => municipality.code === selectedMunicipalityCode
    );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Encabezado */}
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-[17px] font-bold text-slate-800">
                        Configuración de la predicción
                    </h2>

                    <p className="mt-1 text-[11px] text-slate-500">
                        Selecciona el municipio y el horizonte temporal que deseas analizar.
                    </p>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-violet-100 bg-violet-50 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-violet-500" />

                    <span className="text-[11px] font-semibold text-violet-700">
                        Cobertura actual: Dengue · Huila
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(420px,1.5fr)]">
                {/* Municipio */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <MapPin size={16} strokeWidth={2} />
                        </div>

                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800">
                                Municipio
                            </h3>

                            <p className="text-[10px] text-slate-500">
                                36 municipios disponibles
                            </p>
                        </div>
                    </div>

                    <label
                        htmlFor="prediction-municipality"
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500"
                    >
                        Municipio del Huila
                    </label>

                    <select
                        id="prediction-municipality"
                        value={selectedMunicipalityCode}
                        disabled={disabled}
                        onChange={(event) =>
                            onMunicipalityChange(event.target.value)
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {municipalities.map((municipality) => (
                            <option
                                key={municipality.code}
                                value={municipality.code}
                            >
                                {municipality.name}
                            </option>
                        ))}
                    </select>

                    {selectedMunicipality && (
                        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                            <span className="text-[10px] text-slate-500">
                                Población
                            </span>

                            <span className="text-[12px] font-bold text-slate-700">
                                {selectedMunicipality.population.toLocaleString(
                                    "es-CO"
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Horizonte */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                            <CalendarRange size={16} strokeWidth={2} />
                        </div>

                        <div>
                            <h3 className="text-[13px] font-bold text-slate-800">
                                Horizonte predictivo
                            </h3>

                            <p className="text-[10px] text-slate-500">
                                Modelos independientes de t+1 a t+4 semanas
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {horizons.map((horizon) => {
                            const isActive =
                                selectedHorizon === horizon;

                            return (
                                <button
                                    key={horizon}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() =>
                                        onHorizonChange(horizon)
                                    }
                                    className={[
                                        "flex min-h-[64px] flex-col items-center justify-center rounded-lg border px-3 py-2 transition",
                                        isActive
                                            ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50",
                                        disabled
                                            ? "cursor-not-allowed opacity-60"
                                            : "",
                                    ].join(" ")}
                                >
                                    <span className="text-[14px] font-bold">
                                        +{horizon}
                                    </span>

                                    <span className="mt-0.5 text-[10px] font-medium">
                                        {horizon === 1
                                            ? "semana"
                                            : "semanas"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                        <p className="text-[10px] text-slate-500">
                            Horizonte seleccionado
                        </p>

                        <p className="mt-0.5 text-[12px] font-bold text-slate-700">
                            Predicción a +{selectedHorizon}{" "}
                            {selectedHorizon === 1
                                ? "semana"
                                : "semanas"}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}