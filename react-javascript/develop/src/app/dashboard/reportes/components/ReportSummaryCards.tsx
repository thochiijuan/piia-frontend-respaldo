"use client";

import {
    useEffect,
    useState,
} from "react";

import type {
    ReportSummaryData,
} from "../data/reports";

import {
    getReportSummaryData,
} from "../services/reports.service";

import ReportSummaryCard from "./ReportSummaryCard";


/**
 * ============================================================================
 * TARJETAS SUPERIORES DEL MÓDULO DE REPORTES
 * ============================================================================
 */
export default function ReportSummaryCards() {

    const [data, setData] =
        useState<ReportSummaryData[]>([]);


    useEffect(() => {

        async function loadData() {

            const response =
                await getReportSummaryData();

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
                gap-3
                sm:grid-cols-2
                lg:grid-cols-3
                2xl:grid-cols-5
            "
        >

            {data.map((item) => (

                <ReportSummaryCard
                    key={item.id}
                    data={item}
                />

            ))}

        </section>

    );

}