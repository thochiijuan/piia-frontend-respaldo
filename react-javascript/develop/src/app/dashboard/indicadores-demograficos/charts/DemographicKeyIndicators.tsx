"use client";

import { useEffect, useState } from "react";

import {
    Area,
    AreaChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

import type {
    DemographicKeyIndicatorData,
    DemographicKeyIndicatorTheme,
} from "../data/demographicCharts";

import {
    getDemographicKeyIndicatorsData,
} from "../services/demographicCharts.service";

interface ThemeConfig {
    color: string;
    lightColor: string;
    textClass: string;
}

const THEMES: Record<
    DemographicKeyIndicatorTheme,
    ThemeConfig
> = {

    blue: {
        color: "#1769F4",
        lightColor: "#DCEAFF",
        textClass: "text-[#1769F4]",
    },

    purple: {
        color: "#8138CC",
        lightColor: "#EEDCFA",
        textClass: "text-[#8138CC]",
    },

    orange: {
        color: "#FFA05A",
        lightColor: "#FFF0E3",
        textClass: "text-[#FFA05A]",
    },

    green: {
        color: "#55B98D",
        lightColor: "#E2F4EC",
        textClass: "text-[#55B98D]",
    },

};

interface IndicatorCardProps {
    indicator: DemographicKeyIndicatorData;
}

function IndicatorCard({
    indicator,
}: IndicatorCardProps) {

    const theme = THEMES[indicator.theme];

    const chartData = indicator.trend.map(
        (value, index) => ({
            index,
            value,
        })
    );

    const minimumValue = Math.min(...indicator.trend);
    const maximumValue = Math.max(...indicator.trend);

    const difference = maximumValue - minimumValue;

    const padding = Math.max(
        difference * 0.25,
        5
    );

    const gradientId =
        `indicator-gradient-${indicator.id}`;

    const formattedValue =
        indicator.value.toLocaleString("es-CO", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });

    return (

        <article
            className="
                flex
                min-h-0
                flex-col
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
            "
        >

            <h3 className="text-[15px] font-semibold leading-tight text-slate-800">

                {indicator.title}

            </h3>

            <p className="mt-1 text-[12px] leading-tight text-slate-400">

                {indicator.description}

            </p>

            <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1fr_120px] items-end gap-2">

                <div className="min-w-0 pb-1">

                    <p
                        className={`
                            text-[27px]
                            font-bold
                            leading-none
                            ${theme.textClass}
                        `}
                    >

                        {formattedValue}

                    </p>

                    <p className="mt-6 truncate text-[12px] text-slate-400">

                        {indicator.status}

                    </p>

                </div>

                <div className="h-[72px] min-w-0">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 6,
                                right: 2,
                                bottom: 0,
                                left: 2,
                            }}
                        >

                            <defs>

                                <linearGradient
                                    id={gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="5%"
                                        stopColor={theme.color}
                                        stopOpacity={0.28}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor={theme.lightColor}
                                        stopOpacity={0.7}
                                    />

                                </linearGradient>

                            </defs>

                            <XAxis
                                dataKey="index"
                                hide
                            />

                            <YAxis
                                hide
                                domain={[
                                    minimumValue - padding,
                                    maximumValue + padding,
                                ]}
                            />

                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={theme.color}
                                strokeWidth={3}
                                fill={`url(#${gradientId})`}
                                isAnimationActive={false}
                                dot={{
                                    r: 3,
                                    fill: theme.color,
                                    stroke: theme.color,
                                    strokeWidth: 1,
                                }}
                                activeDot={{
                                    r: 4,
                                    fill: theme.color,
                                    stroke: "#FFFFFF",
                                    strokeWidth: 2,
                                }}
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </article>

    );

}

export default function DemographicKeyIndicators() {

    const [indicators, setIndicators] =
        useState<DemographicKeyIndicatorData[]>([]);

    useEffect(() => {

        async function loadIndicators() {

            const response =
                await getDemographicKeyIndicatorsData();

            setIndicators(response);

        }

        void loadIndicators();

    }, []);

    return (

        <section
            className="
                flex
                h-[430px]
                flex-col
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-6
                shadow-sm
            "
        >

            <h2 className="shrink-0 text-[20px] font-semibold text-slate-800">

                Indicadores demográficos claves

            </h2>

            <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3">

                {indicators.map((indicator) => (

                    <IndicatorCard
                        key={indicator.id}
                        indicator={indicator}
                    />

                ))}

            </div>

        </section>

    );

}