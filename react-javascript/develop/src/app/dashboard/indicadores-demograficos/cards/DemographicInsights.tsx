"use client";

import { useEffect, useState } from "react";

import type {
    DemographicInsightData,
    DemographicInsightType,
} from "../data/demographicCharts";

import {
    getDemographicInsightsData,
} from "../services/demographicCharts.service";

/**
 * ============================================================================
 * ICONO DE HALLAZGOS
 * ============================================================================
 */
function FindingIcon() {

    return (

        <svg
            viewBox="0 0 48 48"
            className="h-12 w-12"
            fill="none"
            aria-hidden="true"
        >

            <rect
                x="7"
                y="12"
                width="34"
                height="25"
                rx="2"
                stroke="currentColor"
                strokeWidth="3"
            />

            <path
                d="M7 17H4V38H35"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <rect
                x="13"
                y="18"
                width="10"
                height="12"
                rx="1"
                stroke="currentColor"
                strokeWidth="3"
            />

            <path
                d="M28 19H36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <path
                d="M28 25H36"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

            <path
                d="M28 31H34"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />

        </svg>

    );

}

/**
 * ============================================================================
 * ICONO DE RECOMENDACIÓN
 * ============================================================================
 */
function RecommendationIcon() {

    return (

        <svg
            viewBox="0 0 48 48"
            className="h-12 w-12"
            fill="none"
            aria-hidden="true"
        >

            <path
                d="M8 8V39H41"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M14 31L23 19L30 26L40 13"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            <path
                d="M33 13H40V20"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

        </svg>

    );

}

/**
 * ============================================================================
 * CONFIGURACIÓN VISUAL
 * ============================================================================
 */
interface InsightTheme {
    iconContainerClass: string;
    iconClass: string;
}

const INSIGHT_THEMES: Record<
    DemographicInsightType,
    InsightTheme
> = {

    finding: {
        iconContainerClass: "bg-[#FCE4F4]",
        iconClass: "text-[#FF55B5]",
    },

    recommendation: {
        iconContainerClass: "bg-[#FFF4E4]",
        iconClass: "text-[#F8B323]",
    },

};

/**
 * ============================================================================
 * TARJETA INDIVIDUAL
 * ============================================================================
 */
interface InsightCardProps {
    insight: DemographicInsightData;
}

function InsightCard({
    insight,
}: InsightCardProps) {

    const theme = INSIGHT_THEMES[insight.type];

    return (

        <article
            className="
                flex
                min-h-[190px]
                items-start
                gap-5
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-6
                py-7
                shadow-sm
            "
        >

            {/* ============================================================
                ICONO
            ============================================================ */}

            <div
                className={`
                    flex
                    h-[92px]
                    w-[92px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${theme.iconContainerClass}
                    ${theme.iconClass}
                `}
            >

                {insight.type === "finding"
                    ? <FindingIcon />
                    : <RecommendationIcon />
                }

            </div>

            {/* ============================================================
                CONTENIDO
            ============================================================ */}

            <div className="min-w-0 pt-1">

                <h2 className="text-[21px] font-semibold leading-tight text-slate-800">

                    {insight.title}

                </h2>

                <p className="mt-3 text-[14px] leading-6 text-slate-400">

                    {insight.description}

                </p>

            </div>

        </article>

    );

}

/**
 * ============================================================================
 * HALLAZGOS Y RECOMENDACIÓN
 * ============================================================================
 */
export default function DemographicInsights() {

    const [insights, setInsights] =
        useState<DemographicInsightData[]>([]);

    useEffect(() => {

        async function loadInsights() {

            const response =
                await getDemographicInsightsData();

            setInsights(response);

        }

        void loadInsights();

    }, []);

    return (

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {insights.map((insight) => (

                <InsightCard
                    key={insight.id}
                    insight={insight}
                />

            ))}

        </section>

    );

}