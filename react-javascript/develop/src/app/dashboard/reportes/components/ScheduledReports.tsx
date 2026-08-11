"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ArrowRight,
    Edit3,
    Info,
    MoreVertical,
    Pause,
    Play,
} from "lucide-react";

import type {
    ScheduledReportData,
} from "../data/reports";

import {
    getScheduledReports,
} from "../services/reports.service";


/**
 * ============================================================================
 * PROGRAMACIÓN DE REPORTES
 * ============================================================================
 */
export default function ScheduledReports() {

    const [data, setData] =
        useState<ScheduledReportData[]>([]);


    useEffect(() => {

        async function loadData() {

            const response =
                await getScheduledReports();

            setData(response);

        }

        void loadData();

    }, []);


    return (

        <section
            className="
                flex
                h-full
                w-full
                flex-col
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div
                className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-4
                "
            >

                <h2
                    className="
                        text-[17px]
                        font-bold
                        text-slate-800
                    "
                >
                    Programación de reportes
                </h2>

                <Info
                    size={15}
                    className="text-slate-400"
                />

            </div>


            {/* ============================================================
                TABLA
            ============================================================ */}

            <div className="min-w-0 flex-1 overflow-x-auto">

                <table
                    className="
                        w-full
                        min-w-[760px]
                        border-collapse
                    "
                >

                    {/* ====================================================
                        CABECERA
                    ==================================================== */}

                    <thead>

                        <tr
                            className="
                                border-y
                                border-slate-100
                                bg-slate-50/60
                                text-left
                                text-[11px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <th className="px-5 py-3">
                                Reporte
                            </th>

                            <th className="px-4 py-3">
                                Frecuencia
                            </th>

                            <th className="px-4 py-3">
                                Próxima ejecución
                            </th>

                            <th className="px-4 py-3">
                                Estado
                            </th>

                            <th className="px-4 py-3 text-center">
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    {/* ====================================================
                        CONTENIDO
                    ==================================================== */}

                    <tbody>

                        {data.map((item) => (

                            <tr
                                key={item.id}
                                className="
                                    border-b
                                    border-slate-100
                                    transition
                                    last:border-b-0
                                    hover:bg-slate-50/60
                                "
                            >

                                {/* REPORTE */}

                                <td
                                    className="
                                        px-5
                                        py-3.5
                                        text-[12px]
                                        font-semibold
                                        text-slate-800
                                    "
                                >
                                    {item.reportName}
                                </td>


                                {/* FRECUENCIA */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3.5
                                        text-[12px]
                                        text-slate-600
                                    "
                                >
                                    {item.frequency}
                                </td>


                                {/* PRÓXIMA EJECUCIÓN */}

                                <td
                                    className="
                                        whitespace-nowrap
                                        px-4
                                        py-3.5
                                        text-[11px]
                                        text-slate-500
                                    "
                                >
                                    {item.nextExecution}
                                </td>


                                {/* ESTADO */}

                                <td className="px-4 py-3.5">

                                    <span
                                        className={`
                                            inline-flex
                                            min-w-[62px]
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            px-3
                                            py-1
                                            text-[10px]
                                            font-semibold
                                            ${
                                                item.status === "Activo"
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                                                    : "border-amber-200 bg-amber-50 text-amber-600"
                                            }
                                        `}
                                    >

                                        {item.status}

                                    </span>

                                </td>


                                {/* ACCIONES */}

                                <td className="px-4 py-3.5">

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                        "
                                    >

                                        {/* EDITAR */}

                                        <button
                                            type="button"
                                            title="Editar programación"
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-blue-500
                                                transition
                                                hover:bg-blue-50
                                                hover:text-blue-700
                                            "
                                        >
                                            <Edit3 size={16} />
                                        </button>


                                        {/* PAUSAR / ACTIVAR */}

                                        <button
                                            type="button"
                                            title={
                                                item.status === "Activo"
                                                    ? "Pausar programación"
                                                    : "Activar programación"
                                            }
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-blue-500
                                                transition
                                                hover:bg-blue-50
                                                hover:text-blue-700
                                            "
                                        >

                                            {item.status === "Activo"
                                                ? (
                                                    <Pause size={16} />
                                                )
                                                : (
                                                    <Play size={16} />
                                                )
                                            }

                                        </button>


                                        {/* MÁS OPCIONES */}

                                        <button
                                            type="button"
                                            title="Más opciones"
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-slate-500
                                                transition
                                                hover:bg-slate-100
                                                hover:text-slate-700
                                            "
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* ============================================================
                BOTÓN INFERIOR
            ============================================================ */}

            <div className="p-3">

                <button
                    type="button"
                    className="
                        flex
                        h-10
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-[#DCE7FF]
                        bg-[#F5F8FF]
                        text-[12px]
                        font-semibold
                        text-[#2563EB]
                        transition
                        hover:bg-[#EDF4FF]
                    "
                >

                    Ver todas las programaciones

                    <ArrowRight size={16} />

                </button>

            </div>

        </section>

    );

}