"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import type {
    HealthUnitLegendData,
} from "../data/geovisor";

import {
    getHealthUnitLegendData,
} from "../services/geovisor.service";

export default function HealthUnitsLegend() {

    const [data, setData] =
        useState<HealthUnitLegendData[]>([]);

    useEffect(() => {

        async function loadData() {

            const response =
                await getHealthUnitLegendData();

            setData(response);

        }

        void loadData();

    }, []);

    return (

        <section
            className="
                h-full
                rounded-xl
                border
                border-slate-200
                bg-white
                p-3
            "
        >

            <div className="flex items-center gap-2">

                <h2 className="text-[15px] font-bold text-slate-800">
                    Unidades de salud
                </h2>

                <Info
                    size={15}
                    className="text-slate-400"
                />

            </div>

            <div className="mt-6 space-y-6">

                {data.map((item) => (

                    <div
                        key={item.id}
                        className="flex items-center gap-4"
                    >

                        <span
                            className="
                                h-3
                                w-3
                                shrink-0
                                rounded-full
                            "
                            style={{
                                backgroundColor:
                                    item.color,
                            }}
                        />

                        <span className="text-[11px] font-medium text-slate-500">
                            {item.label}
                        </span>

                    </div>

                ))}

            </div>

        </section>

    );

}