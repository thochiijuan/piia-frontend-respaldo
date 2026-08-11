"use client";

import {
    FileText,
    Info,
} from "lucide-react";

import type {
    RecentReportData,
} from "../data/reports";


/**
 * ============================================================================
 * PROPIEDADES
 * ============================================================================
 */
interface RecentReportsProps {

    reports?: RecentReportData[];

}


/**
 * ============================================================================
 * REPORTES RECIENTES
 * ----------------------------------------------------------------------------
 * La tabla está preparada para recibir los reportes que se generen
 * posteriormente desde el módulo.
 *
 * Mientras no existan reportes, se muestra un estado vacío.
 * ============================================================================
 */
export default function RecentReports({
    reports = [],
}: RecentReportsProps) {

    return (

        <section
            className="
                flex
                h-full
                min-h-[480px]
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
                    Reportes recientes
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
                        min-w-[950px]
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
                                bg-slate-50/50
                                text-left
                                text-[10px]
                                font-semibold
                                text-slate-500
                            "
                        >

                            <th className="px-4 py-3">
                                Nombre del reporte
                            </th>

                            <th className="px-3 py-3">
                                Enfermedad
                            </th>

                            <th className="px-3 py-3">
                                Región / Departamento
                            </th>

                            <th className="px-3 py-3">
                                Periodo
                            </th>

                            <th className="px-3 py-3">
                                Generado por
                            </th>

                            <th className="px-3 py-3">
                                Fecha de generación
                            </th>

                            <th className="px-3 py-3">
                                Formato
                            </th>

                            <th className="px-3 py-3 text-center">
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    {/* ====================================================
                        CONTENIDO
                    ==================================================== */}

                    <tbody>

                        {reports.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={8}
                                    className="
                                        h-[270px]
                                        px-4
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-full
                                            flex-col
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-violet-100
                                                bg-violet-50
                                                text-[#7447F5]
                                            "
                                        >

                                            <FileText
                                                size={24}
                                            />

                                        </div>

                                        <p
                                            className="
                                                mt-3
                                                text-[13px]
                                                font-semibold
                                                text-slate-600
                                            "
                                        >
                                            No hay reportes generados
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[11px]
                                                text-slate-400
                                            "
                                        >
                                            Los reportes que se generen aparecerán aquí.
                                        </p>

                                    </div>

                                </td>

                            </tr>

                        ) : (

                            reports.map((report) => (

                                <tr
                                    key={report.id}
                                    className="
                                        border-b
                                        border-slate-100
                                    "
                                >

                                    <td className="px-4 py-3">
                                        {report.name}
                                    </td>

                                    <td className="px-3 py-3">
                                        {report.disease}
                                    </td>

                                    <td className="px-3 py-3">
                                        {report.territory}
                                    </td>

                                    <td className="px-3 py-3">
                                        {report.period}
                                    </td>

                                    <td className="px-3 py-3">
                                        {report.generatedBy}
                                    </td>

                                    <td className="px-3 py-3">
                                        {report.generatedAt}
                                    </td>

                                    <td className="px-3 py-3">
                                        {report.format}
                                    </td>

                                    <td className="px-3 py-3 text-center">
                                        —
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </section>

    );

}