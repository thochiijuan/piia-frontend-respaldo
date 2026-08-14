"use client";

import {
    ChevronDown,
    MapPinned,
} from "lucide-react";

import type {
    PredictionHorizon,
} from "../data/predictionApi";

import type {
    ElevatedRiskMunicipality,
} from "../services/predictionApi.service";


interface RiskMunicipalitiesSummaryCardProps {

    municipalities: ElevatedRiskMunicipality[];

    totalMunicipalities: number;

    selectedHorizon: PredictionHorizon;

}


export default function RiskMunicipalitiesSummaryCard({

    municipalities,

    totalMunicipalities,

    selectedHorizon,

}: RiskMunicipalitiesSummaryCardProps) {

    const horizonLabel =
        `+${selectedHorizon} ${
            selectedHorizon === 1
                ? "semana"
                : "semanas"
        }`;


    return (

        <article
            className="
                relative
                min-h-[150px]
                overflow-visible
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            {/* CABECERA */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <p
                    className="
                        text-[13px]
                        font-semibold
                        leading-[18px]
                        text-slate-800
                    "
                >
                    Municipios en riesgo elevado
                </p>


                <div
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-red-50
                        text-red-500
                    "
                >

                    <MapPinned
                        size={16}
                        strokeWidth={2}
                    />

                </div>

            </div>


            {/* CONTADOR */}

            <p
                className="
                    mt-4
                    text-[28px]
                    font-bold
                    leading-none
                    tracking-tight
                    text-red-500
                "
            >
                {municipalities.length} de{" "}
                {totalMunicipalities}
            </p>


            <p
                className="
                    mt-3
                    text-[11px]
                    text-slate-500
                "
            >
                Nivel alto o crítico · Huila
            </p>


            {/* LISTADO */}

            {municipalities.length > 0 ? (

                <details
                    className="
                        group
                        relative
                        mt-1
                    "
                >

                    <summary
                        className="
                            flex
                            cursor-pointer
                            list-none
                            items-center
                            gap-1
                            text-[10px]
                            font-semibold
                            text-red-500
                        "
                    >

                        Ver municipios
                        {" "}
                        ({municipalities.length})

                        <ChevronDown
                            size={12}
                            className="
                                transition-transform
                                group-open:rotate-180
                            "
                        />

                    </summary>


                    <div
                        className="
                            absolute
                            right-0
                            top-full
                            z-50
                            mt-2
                            w-[270px]
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-xl
                        "
                    >

                        <div
                            className="
                                border-b
                                border-slate-100
                                px-3
                                py-2.5
                            "
                        >

                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Municipios con riesgo elevado
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[9px]
                                    text-slate-400
                                "
                            >
                                Dengue · Huila · {horizonLabel}
                            </p>

                        </div>


                        <div
                            className="
                                max-h-[260px]
                                overflow-y-auto
                                p-2
                            "
                        >

                            {municipalities.map(
                                (municipality) => (

                                    <div
                                        key={
                                            municipality
                                                .municipalityCode
                                        }
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                            rounded-lg
                                            px-2
                                            py-2
                                            hover:bg-slate-50
                                        "
                                    >

                                        <div
                                            className="
                                                min-w-0
                                            "
                                        >

                                            <p
                                                className="
                                                    truncate
                                                    text-[11px]
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >
                                                {
                                                    municipality
                                                        .municipality
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    text-[9px]
                                                    text-slate-400
                                                "
                                            >
                                                {
                                                    municipality
                                                        .predictedCases
                                                        .toFixed(1)
                                                } casos · Inc.{" "}
                                                {
                                                    municipality
                                                        .incidence
                                                        .toFixed(2)
                                                }
                                            </p>

                                        </div>


                                        <span
                                            className="
                                                shrink-0
                                                rounded-full
                                                px-2
                                                py-1
                                                text-[9px]
                                                font-bold
                                            "
                                            style={{
                                                color:
                                                    municipality
                                                        .riskColor,
                                                backgroundColor:
                                                    `${municipality
                                                        .riskColor}15`,
                                            }}
                                        >
                                            {
                                                municipality
                                                    .riskLevel
                                            }
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </details>

            ) : (

                <p
                    className="
                        mt-1
                        text-[10px]
                        text-slate-400
                    "
                >
                    Sin municipios en nivel alto o crítico
                </p>

            )}


            <p
                className="
                    mt-1
                    text-[9px]
                    text-slate-400
                "
            >
                {horizonLabel} · escenario medio
            </p>

        </article>

    );

}