"use client";

import { useEffect, useState } from "react";

import type {
    DiseaseSummaryData,
} from "../data/geovisor";

import {
    getDiseaseSummaryData,
} from "../services/geovisor.service";

import DiseaseSummaryCard from "./DiseaseSummaryCard";

export default function DiseaseSummaryCards() {

    const [data, setData] =
        useState<DiseaseSummaryData[]>([]);

    useEffect(() => {

        async function loadData() {

            const response =
                await getDiseaseSummaryData();

            setData(response);

        }

        void loadData();

    }, []);

    return (

        <section
            className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
            "
        >

            {data.map((item) => (

                <DiseaseSummaryCard
                    key={item.id}
                    data={item}
                />

            ))}

        </section>

    );

}