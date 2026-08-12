/**
 * ============================================================================
 * AgeGroupDetailsTable
 * ----------------------------------------------------------------------------
 * Tabla de detalle epidemiológico correspondiente al indicador
 * "Casos por grupo de edad".
 * ============================================================================
 */

"use client";

import {
    MapPin,
} from "lucide-react";

import type {
    AgeGroupDetail,
} from "./ageGroupDetails";


interface Props {
    data: AgeGroupDetail[];
}


export default function AgeGroupDetailsTable({
    data,
}: Props) {

    /**
     * =========================================================================
     * ESTADO VACÍO
     * =========================================================================
     */
    if (data.length === 0) {

        return (

            <div
                className="
                    flex
                    min-h-[280px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50/50
                "
            >

                <div className="text-center">

                    <p
                        className="
                            text-[14px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        No se encontraron registros
                    </p>

                    <p
                        className="
                            mt-1
                            text-[12px]
                            text-slate-400
                        "
                    >
                        Intenta modificar los filtros seleccionados.
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div
            className="
                w-full
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            "
        >

            <div className="w-full overflow-x-auto">

                <table
                    className="
                        w-full
                        min-w-[1180px]
                        border-collapse
                    "
                >

                    {/* ========================================================
                        ENCABEZADO
                    ======================================================== */}

                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-200
                                bg-slate-50/80
                            "
                        >

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Año
                            </th>

                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Semana
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Región
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Departamento
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Municipio
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Grupo de edad
                            </th>

                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Dengue
                            </th>

                            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                IRA
                            </th>

                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                Total
                            </th>

                        </tr>

                    </thead>


                    {/* ========================================================
                        FILAS
                    ======================================================== */}

                    <tbody>

                        {data.map((item) => (

                            <tr
                                key={item.id}
                                className="
                                    border-b
                                    border-slate-100
                                    transition-colors
                                    last:border-b-0
                                    hover:bg-slate-50/80
                                "
                            >

                                {/* AÑO */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-[12px]
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {item.year}
                                </td>


                                {/* SEMANA */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-center
                                        text-[12px]
                                        text-slate-600
                                    "
                                >
                                    {item.week}
                                </td>


                                {/* REGIÓN */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-[12px]
                                        text-slate-600
                                    "
                                >

                                    <div className="flex items-center gap-2">

                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-blue-400
                                            "
                                        />

                                        {item.region}

                                    </div>

                                </td>


                                {/* DEPARTAMENTO */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-[12px]
                                        text-slate-600
                                    "
                                >
                                    {item.department}
                                </td>


                                {/* MUNICIPIO */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-[12px]
                                        font-medium
                                        text-slate-700
                                    "
                                >

                                    <div className="flex items-center gap-1.5">

                                        <MapPin
                                            size={13}
                                            className="text-slate-400"
                                        />

                                        {item.municipality}

                                    </div>

                                </td>


                                {/* GRUPO DE EDAD */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-[12px]
                                        font-semibold
                                        text-slate-700
                                    "
                                >
                                    {item.ageGroup}
                                </td>


                                {/* DENGUE */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >

                                    <span
                                        className="
                                            inline-flex
                                            min-w-[34px]
                                            items-center
                                            justify-center
                                            rounded-md
                                            bg-violet-50
                                            px-2
                                            py-1
                                            text-[11px]
                                            font-bold
                                            text-violet-600
                                        "
                                    >
                                        {item.dengue.toLocaleString("es-CO")}
                                    </span>

                                </td>


                                {/* IRA */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-center
                                    "
                                >

                                    <span
                                        className="
                                            inline-flex
                                            min-w-[34px]
                                            items-center
                                            justify-center
                                            rounded-md
                                            bg-blue-50
                                            px-2
                                            py-1
                                            text-[11px]
                                            font-bold
                                            text-blue-600
                                        "
                                    >
                                        {item.ira.toLocaleString("es-CO")}
                                    </span>

                                </td>


                                {/* TOTAL */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3
                                        text-right
                                        text-[12px]
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    {item.total.toLocaleString("es-CO")}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}