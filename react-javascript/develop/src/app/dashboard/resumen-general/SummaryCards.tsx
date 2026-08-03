/**
 * ============================================================================
 * SummaryCards
 * ----------------------------------------------------------------------------
 * Responsabilidad:
 * Obtener la información del Dashboard y generar las tarjetas de indicadores
 * principales mostradas en la parte superior del módulo "Resumen General".
 *
 * Flujo de datos:
 *
 * dashboard.service.ts
 *          │
 *          ▼
 * SummaryCards
 *          │
 *          ▼
 * SummaryCard (x4)
 *
 * Este componente actúa como intermediario entre la fuente de datos y el
 * componente visual encargado de renderizar cada tarjeta.
 *
 * Cuando la API esté disponible únicamente cambiará el servicio; la lógica
 * de este componente permanecerá igual.
 * ============================================================================
 */

"use client";

import { useEffect, useState } from "react";

// Componentes
import SummaryCard from "./SummaryCard";

// Servicios
import { getDashboardSummary } from "./services/dashboard.service";

// Tipos
import { DashboardSummary } from "./data/dashboardSummary";

export default function SummaryCards() {

    /**
     * Almacena la información obtenida desde el servicio del Dashboard.
     *
     * Inicialmente es null hasta que finaliza la carga de los datos.
     */
    const [summary, setSummary] =
        useState<DashboardSummary | null>(null);

    /**
     * Carga la información del Dashboard al iniciar el componente.
     *
     * Actualmente consume datos simulados mediante dashboard.service.ts.
     *
     * En producción este método obtendrá la información desde la API.
     */
    useEffect(() => {

        /**
         * Recupera los indicadores principales del Dashboard.
         */
        async function loadDashboard() {

            const data =
                await getDashboardSummary();

            setSummary(data);

        }

        loadDashboard();

    }, []);

    /**
     * Mientras la información aún no está disponible
     * se muestra un estado de carga sencillo.
     */
    if (!summary) {

        return (

            <p className="text-slate-500">

                Cargando indicadores...

            </p>

        );

    }

    /**
     * Adaptación de la información del Dashboard al formato
     * esperado por el componente SummaryCard.
     *
     * Si en el futuro cambia la estructura del backend,
     * únicamente será necesario modificar este bloque.
     */
    const cards = [

        {

            title: "Casos Totales",

            value: summary.indicators.totalCases,

            description: "Total casos reportados",

            color: "#2563EB",

        },

        {

            title: "Dengue",

            value: summary.indicators.dengueCases,

            description: "Casos confirmados",

            color: "#7C3AED",

        },

        {

            title: "IRA",

            value: summary.indicators.iraCases,

            description: "Casos confirmados",

            color: "#10B981",

        },

        {

            title: "Variación semanal",

            value: `${summary.indicators.weeklyVariation}%`,

            description: `+${summary.indicators.newCases} casos`,

            color: "#EF4444",

        },

    ];
    
/**
*Renderiza dinámicamente una tarjeta por cada indicador.
*/
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">



            {cards.map((card) => (

                <SummaryCard

                    key={card.title}

                    {...card}

                />

            ))}

        </div>

    );

}