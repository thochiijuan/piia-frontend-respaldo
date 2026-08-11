"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";

import type {
    DepartmentCasesData,
} from "../data/geovisor";

import {
    getDepartmentCasesData,
} from "../services/geovisor.service";

export default function DepartmentCases() {

    const [data, setData] =
        useState<DepartmentCasesData[]>([]);

    useEffect(() => {

        async function loadData() {

            const response =
                await getDepartmentCasesData();

            setData(response);

        }

        void loadData();

    }, []);

    const maximumValue = useMemo(() => {

        return Math.max(
            ...data.flatMap((item) => [
                item.dengue,
                item.ira,
            ]),
            1
        );

    }, [data]);

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
                        Casos por departamento
                    </h2>

                    <Info
                        size={15}
                        className="text-slate-400"
                    />

                </div>

            </div>

            <div className="mt-2 flex-1 overflow-hidden">

                <div
                    className="
                        grid
                        grid-cols-[1fr_55px_55px]
                        border-b
                        border-slate-100
                        px-3
                        py-2
                        text-[9px]
                        font-semibold
                        text-slate-400
                    "
                >
                    <span>Departamento</span>
                    <span>Dengue</span>
                    <span>IRA</span>
                </div>

                {data.map((item) => {

                    const dengueWidth =
                        (item.dengue /
                            maximumValue) *
                        100;

                    const iraWidth =
                        (item.ira /
                            maximumValue) *
                        100;

                    return (

                        <div
                            key={item.department}
                            className="
                                grid
                                grid-cols-[1fr_55px_55px]
                                items-center
                                gap-1
                                px-3
                                py-[5px]
                                text-[10px]
                            "
                        >

                            <span
                                className="
                                    truncate
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                {item.department}
                            </span>

                            <div className="flex items-center gap-1">

                                <span className="w-[23px] text-right font-semibold text-slate-700">
                                    {item.dengue}
                                </span>

                                <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-[#7447F5]"
                                        style={{
                                            width:
                                                `${dengueWidth}%`,
                                        }}
                                    />

                                </div>

                            </div>

                            <div className="flex items-center gap-1">

                                <span className="w-[23px] text-right font-semibold text-slate-700">
                                    {item.ira}
                                </span>

                                <div className="h-[8px] flex-1 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className="h-full rounded-full bg-[#4DBB88]"
                                        style={{
                                            width:
                                                `${iraWidth}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    );

                })}

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

                    Ver tabla completa

                    <ArrowRight size={16} />

                </button>

            </div>

        </section>

    );

}