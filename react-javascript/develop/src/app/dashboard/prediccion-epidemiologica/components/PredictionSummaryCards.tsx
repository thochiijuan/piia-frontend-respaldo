"use client";

import {
    useEffect,
    useState,
} from "react";

import type {
    PredictionSummaryData,
} from "../data/prediction";

import {
    getPredictionSummaryData,
} from "../services/prediction.service";

import PredictionSummaryCard
    from "./PredictionSummaryCard";


export default function PredictionSummaryCards() {

    const [data, setData] =
        useState<PredictionSummaryData[]>([]);


    useEffect(() => {

        async function loadData() {

            const response =
                await getPredictionSummaryData();

            setData(response);

        }

        void loadData();

    }, []);


    return (

        <section
            className="
                grid
                w-full
                grid-cols-1
                gap-4
                sm:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-6
            "
        >

            {data.map((item) => (

                <PredictionSummaryCard
                    key={item.id}
                    data={item}
                />

            ))}

        </section>

    );

}