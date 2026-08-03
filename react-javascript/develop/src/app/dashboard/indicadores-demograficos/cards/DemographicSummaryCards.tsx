"use client";

import { useEffect, useState } from "react";

import DemographicCard from "./DemographicCard";

import { getDemographicSummary } from "../services/demographics.service";

import { DemographicSummary } from "../data/demographicSummary";

/**
 * ============================================================================
 * DEMOGRAPHIC SUMMARY CARDS
 * ----------------------------------------------------------------------------
 * Obtiene la información del servicio y renderiza las tarjetas resumen
 * del módulo Indicadores Demográficos.
 *
 * Actualmente consume datos Mock.
 * En producción consumirá la API del Backend.
 * ============================================================================
 */

export default function DemographicSummaryCards() {

    const [summary, setSummary] =
        useState<DemographicSummary | null>(null);

    useEffect(() => {

        async function loadSummary() {

            const data =
                await getDemographicSummary();

            setSummary(data);

        }

        loadSummary();

    }, []);

    if (!summary) {

        return (

            <p className="text-slate-500">

                Cargando indicadores...

            </p>

        );

    }

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

            {summary.cards.map((card) => (

                <DemographicCard

                    key={card.id}

                    {...card}

                />

            ))}

        </div>

    );

}