"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Info, Map } from "lucide-react";

import type {
    SpatialDistributionData,
} from "../data/geovisor";

import {
    getSpatialDistributionData,
} from "../services/geovisor.service";

export default function SpatialDistribution() {

    const [data, setData] =
        useState<SpatialDistributionData | null>(
            null
        );

    useEffect(() => {

        async function loadData() {

            const response =
                await getSpatialDistributionData();

            setData(response);

        }

        void loadData();

    }, []);

    if (!data) {

        return (
            <div className="h-full min-h-[250px] animate-pulse rounded-xl border border-slate-200 bg-white" />
        );

    }

    return (

        <section
            className="
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            "
        >

            <div className="px-3 pt-3">

                <div className="flex items-center gap-2">

                    <h2 className="text-[15px] font-bold text-slate-800">
                        {data.title}
                    </h2>

                    <Info
                        size={15}
                        className="text-slate-400"
                    />

                </div>

                <p className="mt-0.5 text-[10px] text-slate-400">
                    {data.subtitle}
                </p>

            </div>

            <div
                className="
                    m-3
                    flex
                    min-h-[150px]
                    flex-1
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-50
                "
            >

                <div className="text-center text-slate-400">

                    <Map
                        size={30}
                        className="mx-auto"
                    />

                    <p className="mt-2 text-[11px]">
                        Mapa de calor
                    </p>

                </div>

            </div>

            <div className="border-t border-slate-100 p-2">

                <button
                    type="button"
                    className="
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
                    "
                >

                    Ver mapa de calor completo

                    <ArrowRight size={16} />

                </button>

            </div>

        </section>

    );

}
