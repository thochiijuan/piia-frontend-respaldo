"use client";

import { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import { getDashboardSummary } from "./services/dashboard.service";
import type { DashboardSummary } from "./data/dashboardSummary";

export default function SummaryCards() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            const data = await getDashboardSummary();
            setSummary(data);
        }

        void loadDashboard();
    }, []);

    if (!summary) {
        return null;
    }

    const cards = [
        {
            title: "Casos Totales",
            value: summary.indicators.totalCases.toLocaleString("es-CO"),
            description: "Total casos reportados",
            color: "#2563EB",
            trend: summary.trends.totalCases,
            chartType: "area" as const,
        },
        {
            title: "Dengue",
            value: summary.indicators.dengueCases.toLocaleString("es-CO"),
            description: "Casos confirmados",
            color: "#7C3AED",
            trend: summary.trends.dengueCases,
            chartType: "area" as const,
        },
        {
            title: "IRA",
            value: summary.indicators.iraCases.toLocaleString("es-CO"),
            description: "Casos confirmados",
            color: "#10B981",
            trend: summary.trends.iraCases,
            chartType: "area" as const,
        },
        {
            title: "Variación semanal",
            value: `${summary.indicators.weeklyVariation}%`,
            description: `+${summary.indicators.newCases.toLocaleString("es-CO")} casos`,
            color: "#EF4444",
            weeklyCases: summary.weeklyCases,
            chartType: "bars" as const,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <SummaryCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    description={card.description}
                    color={card.color}
                    trend={card.trend}
                    weeklyCases={card.weeklyCases}
                    chartType={card.chartType}
                />
            ))}
        </div>
    );
}