/**
 * ============================================================================
 * RegionLegend
 * ----------------------------------------------------------------------------
 * Componente encargado de mostrar la leyenda de las regiones naturales
 * representadas en el mapa del Dashboard.
 *
 * Responsabilidades:
 * - Mostrar el nombre de cada región.
 * - Mostrar el color asociado a la región.
 * - Mostrar el número de casos.
 * - Mostrar el porcentaje de participación.
 *
 * Este componente únicamente representa información visual.
 * No contiene lógica geoespacial ni realiza consultas de datos.
 * ============================================================================
 */

"use client";
import { REGIONS } from "./map/regions";
const regions = Object.values(REGIONS);[


    {

        name: "Región Caribe",

        color: "#F4B63D",

        cases: 4562,

        percentage: 28.8,

    },

    {

        name: "Región Orinoquía",

        color: "#BEDB74",

        cases: 3825,

        percentage: 24.1,

    },

    {

        name: "Región Amazonía",

        color: "#5BA66F",

        cases: 3642,

        percentage: 23,

    },

    {

        name: "Región Andina",

        color: "#D89159",

        cases: 2141,

        percentage: 13.5,

    },

    {

        name: "Región Pacífica",

        color: "#8998C3",

        cases: 1672,

        percentage: 10.6,

    },

];

export default function RegionLegend() {

    return (

        <div className="space-y-5">

            {regions.map((region) => (

                <div
                    key={region.name}
                    className="flex items-center justify-between"
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="w-4 h-4 rounded-full"
                            style={{
                                backgroundColor: region.color,
                            }}
                        />

                        <span className="text-sm font-medium">

                            {region.name}

                        </span>

                    </div>

                    <div className="text-right text-sm">

                        <div className="font-semibold">

                            {region.cases.toLocaleString("es-CO")}

                        </div>

                        <div className="text-slate-500">

                            {region.percentage}%

                        </div>

                    </div>

                </div>

            ))}

        </div>

    );

}