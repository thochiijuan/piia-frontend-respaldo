/**
 * ============================================================================
 * AgeGroupComparisonTable
 * ----------------------------------------------------------------------------
 * Tabla encargada de visualizar la comparación epidemiológica entre una
 * cantidad dinámica de períodos.
 *
 * Características:
 *
 * - Genera automáticamente una columna por período.
 * - No existe un número fijo de columnas.
 * - Muestra los valores por grupo de edad.
 * - Muestra diferencia absoluta.
 * - Muestra variación porcentual.
 * - Soporta scroll horizontal cuando existen muchos períodos.
 *
 * Ejemplo:
 *
 * Grupo edad | 2025-SE1 | 2025-SE17 | 2026-SE1 | Diferencia | Variación
 *
 * ============================================================================
 */

"use client";

import type {
    AgeGroupComparisonResponse,
    ComparisonMetric,
    ComparisonPeriodValue,
} from "./ageGroupComparison";


/**
 * ============================================================================
 * PROPS
 * ============================================================================
 */
interface Props {

    /**
     * Resultado generado por ageGroupComparison.service.ts
     */
    data: AgeGroupComparisonResponse;

}


/**
 * ============================================================================
 * ETIQUETAS DE MÉTRICAS
 * ============================================================================
 */
const METRIC_LABELS: Record<
    ComparisonMetric,
    string
> = {

    total:
        "Total de casos",

    dengue:
        "Dengue",

    ira:
        "IRA",

};


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */
export default function AgeGroupComparisonTable({

    data,

}: Props) {

    const {
        metric,
        periods,
        summaries,
        rows,
    } = data;


    /**
     * =========================================================================
     * ESTADO SIN PERÍODOS
     * =========================================================================
     */
    if (
        periods.length < 2
    ) {

        return (

            <div
                className="
                    flex
                    min-h-[260px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50/40
                "
            >

                <div className="max-w-[420px] text-center">

                    <p
                        className="
                            text-[14px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Selecciona al menos dos períodos
                    </p>


                    <p
                        className="
                            mt-1
                            text-[11px]
                            leading-5
                            text-slate-400
                        "
                    >
                        Agrega dos o más períodos epidemiológicos para
                        visualizar la comparación.
                    </p>

                </div>

            </div>

        );

    }


    /**
     * =========================================================================
     * ESTADO SIN REGISTROS
     * =========================================================================
     */
    if (
        rows.length === 0
    ) {

        return (

            <div
                className="
                    flex
                    min-h-[260px]
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50/40
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
                        No se encontraron datos
                    </p>


                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-400
                        "
                    >
                        Modifica los períodos o los filtros seleccionados.
                    </p>

                </div>

            </div>

        );

    }


    /**
     * =========================================================================
     * ANCHO DINÁMICO
     * ----------------------------------------------------------------------------
     * La tabla aumenta de ancho automáticamente dependiendo de la cantidad
     * de períodos seleccionados.
     *
     * Después se utiliza overflow-x-auto para permitir desplazamiento
     * horizontal.
     * =========================================================================
     */
    const minimumTableWidth =
        Math.max(
            950,
            220 +
            periods.length * 155 +
            300
        );


    return (

        <div
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
            "
        >

            {/* ============================================================
                CABECERA DE LA TABLA
            ============================================================ */}

            <div
                className="
                    flex
                    flex-col
                    gap-2
                    border-b
                    border-slate-200
                    bg-slate-50/60
                    px-4
                    py-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <p
                        className="
                            text-[12px]
                            font-bold
                            text-slate-700
                        "
                    >
                        Comparación por grupo de edad
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[10px]
                            text-slate-400
                        "
                    >
                        Métrica:{" "}
                        <span
                            className="
                                font-semibold
                                text-slate-600
                            "
                        >
                            {METRIC_LABELS[metric]}
                        </span>
                    </p>

                </div>


                <div
                    className="
                        inline-flex
                        w-fit
                        items-center
                        rounded-full
                        bg-violet-50
                        px-3
                        py-1
                        text-[10px]
                        font-semibold
                        text-violet-600
                    "
                >
                    {periods.length} períodos comparados
                </div>

            </div>


            {/* ============================================================
                SCROLL HORIZONTAL
            ============================================================ */}

            <div
                className="
                    w-full
                    overflow-x-auto
                "
            >

                <table
                    className="
                        border-collapse
                        text-left
                    "
                    style={{
                        minWidth:
                            minimumTableWidth,
                        width: "100%",
                    }}
                >

                    {/* ====================================================
                        ENCABEZADOS
                    ==================================================== */}

                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-200
                                bg-white
                            "
                        >

                            {/* =================================================
                                GRUPO DE EDAD
                            ================================================= */}

                            <th
                                className="
                                    sticky
                                    left-0
                                    z-20
                                    min-w-[180px]
                                    border-r
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                Grupo de edad
                            </th>


                            {/* =================================================
                                PERÍODOS DINÁMICOS
                            ================================================= */}

                            {summaries.map(
                                (
                                    summary,
                                    index
                                ) => {

                                    const isFirst =
                                        index ===
                                        0;

                                    const isLast =
                                        index ===
                                        summaries.length -
                                        1;


                                    return (

                                        <th
                                            key={
                                                summary.periodId
                                            }
                                            className={`
                                                min-w-[155px]
                                                border-r
                                                border-slate-100
                                                px-4
                                                py-3
                                                text-center
                                                ${
                                                    isFirst
                                                        ? "bg-slate-50/70"
                                                        : ""
                                                }
                                                ${
                                                    isLast
                                                        ? "bg-violet-50/50"
                                                        : ""
                                                }
                                            `}
                                        >

                                            <p
                                                className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wide
                                                    text-slate-600
                                                "
                                            >
                                                {summary.label}
                                            </p>


                                            <p
                                                className="
                                                    mt-1
                                                    text-[9px]
                                                    font-medium
                                                    text-slate-400
                                                "
                                            >

                                                {isFirst
                                                    ? "Período inicial"
                                                    : isLast
                                                        ? "Período final"
                                                        : `Período ${index + 1}`}

                                            </p>

                                        </th>

                                    );

                                }
                            )}


                            {/* =================================================
                                DIFERENCIA
                            ================================================= */}

                            <th
                                className="
                                    min-w-[135px]
                                    bg-slate-50/70
                                    px-4
                                    py-3
                                    text-center
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                Diferencia
                            </th>


                            {/* =================================================
                                VARIACIÓN
                            ================================================= */}

                            <th
                                className="
                                    min-w-[150px]
                                    bg-slate-50/70
                                    px-4
                                    py-3
                                    text-center
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                Variación
                            </th>

                        </tr>

                    </thead>


                    {/* ====================================================
                        CUERPO
                    ==================================================== */}

                    <tbody>

                        {rows.map(
                            (row) => (

                                <tr
                                    key={
                                        row.id
                                    }
                                    className="
                                        border-b
                                        border-slate-100
                                        transition-colors
                                        last:border-b-0
                                        hover:bg-slate-50/50
                                    "
                                >

                                    {/* =========================================
                                        GRUPO DE EDAD
                                    ========================================= */}

                                    <td
                                        className="
                                            sticky
                                            left-0
                                            z-10
                                            border-r
                                            border-slate-200
                                            bg-white
                                            px-4
                                            py-3
                                            text-[12px]
                                            font-bold
                                            text-slate-700
                                        "
                                    >
                                        {row.ageGroup}
                                    </td>


                                    {/* =========================================
                                        VALORES DE LOS PERÍODOS
                                    ========================================= */}

                                    {periods.map(
                                        (
                                            period,
                                            index
                                        ) => {

                                            const value =
                                                getPeriodValue(
                                                    row.values,
                                                    period.id
                                                );


                                            const isFirst =
                                                index ===
                                                0;

                                            const isLast =
                                                index ===
                                                periods.length -
                                                1;


                                            return (

                                                <td
                                                    key={
                                                        period.id
                                                    }
                                                    className={`
                                                        border-r
                                                        border-slate-100
                                                        px-4
                                                        py-3
                                                        text-center
                                                        ${
                                                            isFirst
                                                                ? "bg-slate-50/40"
                                                                : ""
                                                        }
                                                        ${
                                                            isLast
                                                                ? "bg-violet-50/30"
                                                                : ""
                                                        }
                                                    `}
                                                >

                                                    <span
                                                        className={`
                                                            inline-flex
                                                            min-w-[58px]
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            px-2.5
                                                            py-1.5
                                                            text-[12px]
                                                            font-bold
                                                            ${
                                                                isLast
                                                                    ? "bg-violet-100 text-violet-700"
                                                                    : isFirst
                                                                        ? "bg-slate-100 text-slate-700"
                                                                        : "bg-blue-50 text-blue-700"
                                                            }
                                                        `}
                                                    >
                                                        {value.toLocaleString(
                                                            "es-CO"
                                                        )}
                                                    </span>

                                                </td>

                                            );

                                        }
                                    )}


                                    {/* =========================================
                                        DIFERENCIA ABSOLUTA
                                    ========================================= */}

                                    <td
                                        className="
                                            bg-slate-50/30
                                            px-4
                                            py-3
                                            text-center
                                        "
                                    >

                                        <AbsoluteVariationBadge
                                            value={
                                                row.absoluteVariation
                                            }
                                        />

                                    </td>


                                    {/* =========================================
                                        VARIACIÓN PORCENTUAL
                                    ========================================= */}

                                    <td
                                        className="
                                            bg-slate-50/30
                                            px-4
                                            py-3
                                            text-center
                                        "
                                    >

                                        <PercentageVariationBadge
                                            value={
                                                row.percentageVariation
                                            }
                                        />

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>


                    {/* ====================================================
                        TOTAL POR PERÍODO
                    ==================================================== */}

                    <tfoot>

                        <tr
                            className="
                                border-t-2
                                border-slate-200
                                bg-slate-50
                            "
                        >

                            <td
                                className="
                                    sticky
                                    left-0
                                    z-20
                                    border-r
                                    border-slate-200
                                    bg-slate-50
                                    px-4
                                    py-3
                                "
                            >

                                <p
                                    className="
                                        text-[11px]
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-600
                                    "
                                >
                                    Total
                                </p>


                                <p
                                    className="
                                        mt-0.5
                                        text-[9px]
                                        text-slate-400
                                    "
                                >
                                    {METRIC_LABELS[metric]}
                                </p>

                            </td>


                            {summaries.map(
                                (
                                    summary,
                                    index
                                ) => {

                                    const isLast =
                                        index ===
                                        summaries.length -
                                        1;


                                    return (

                                        <td
                                            key={
                                                summary.periodId
                                            }
                                            className="
                                                border-r
                                                border-slate-200
                                                px-4
                                                py-3
                                                text-center
                                            "
                                        >

                                            <span
                                                className={`
                                                    text-[13px]
                                                    font-bold
                                                    ${
                                                        isLast
                                                            ? "text-violet-700"
                                                            : "text-slate-700"
                                                    }
                                                `}
                                            >
                                                {summary.value.toLocaleString(
                                                    "es-CO"
                                                )}
                                            </span>

                                        </td>

                                    );

                                }
                            )}


                            {/* =============================================
                                DIFERENCIA TOTAL
                            ============================================= */}

                            <td
                                className="
                                    px-4
                                    py-3
                                    text-center
                                "
                            >

                                <AbsoluteVariationBadge
                                    value={
                                        calculateSummaryAbsoluteVariation(
                                            summaries
                                        )
                                    }
                                />

                            </td>


                            {/* =============================================
                                VARIACIÓN TOTAL
                            ============================================= */}

                            <td
                                className="
                                    px-4
                                    py-3
                                    text-center
                                "
                            >

                                <PercentageVariationBadge
                                    value={
                                        calculateSummaryPercentageVariation(
                                            summaries
                                        )
                                    }
                                />

                            </td>

                        </tr>

                    </tfoot>

                </table>

            </div>

        </div>

    );

}


/**
 * ============================================================================
 * OBTENER VALOR DEL PERÍODO
 * ============================================================================
 */
function getPeriodValue(

    values: ComparisonPeriodValue[],

    periodId: string

): number {

    return (
        values.find(
            (item) =>
                item.periodId ===
                periodId
        )?.value ?? 0
    );

}


/**
 * ============================================================================
 * DIFERENCIA TOTAL
 * ----------------------------------------------------------------------------
 * Calcula:
 *
 * último período - primer período
 * ============================================================================
 */
function calculateSummaryAbsoluteVariation(

    summaries:
        AgeGroupComparisonResponse["summaries"]

): number | null {

    if (
        summaries.length < 2
    ) {

        return null;

    }


    const first =
        summaries[0].value;


    const last =
        summaries[
            summaries.length -
            1
        ].value;


    return (
        last -
        first
    );

}


/**
 * ============================================================================
 * VARIACIÓN TOTAL
 * ============================================================================
 */
function calculateSummaryPercentageVariation(

    summaries:
        AgeGroupComparisonResponse["summaries"]

): number | null {

    if (
        summaries.length < 2
    ) {

        return null;

    }


    const first =
        summaries[0].value;


    const last =
        summaries[
            summaries.length -
            1
        ].value;


    if (
        first === 0
    ) {

        return null;

    }


    return (
        (
            last -
            first
        ) /
        first
    ) * 100;

}


/**
 * ============================================================================
 * BADGE DE DIFERENCIA ABSOLUTA
 * ============================================================================
 */
function AbsoluteVariationBadge({

    value,

}: {

    value: number | null;

}) {

    if (
        value === null
    ) {

        return (

            <span
                className="
                    inline-flex
                    rounded-md
                    bg-slate-100
                    px-2
                    py-1
                    text-[11px]
                    font-semibold
                    text-slate-400
                "
            >
                —
            </span>

        );

    }


    if (
        value > 0
    ) {

        return (

            <span
                className="
                    inline-flex
                    min-w-[64px]
                    items-center
                    justify-center
                    rounded-md
                    bg-red-50
                    px-2
                    py-1
                    text-[11px]
                    font-bold
                    text-red-600
                "
            >
                +{value.toLocaleString("es-CO")}
            </span>

        );

    }


    if (
        value < 0
    ) {

        return (

            <span
                className="
                    inline-flex
                    min-w-[64px]
                    items-center
                    justify-center
                    rounded-md
                    bg-emerald-50
                    px-2
                    py-1
                    text-[11px]
                    font-bold
                    text-emerald-600
                "
            >
                {value.toLocaleString("es-CO")}
            </span>

        );

    }


    return (

        <span
            className="
                inline-flex
                min-w-[64px]
                items-center
                justify-center
                rounded-md
                bg-slate-100
                px-2
                py-1
                text-[11px]
                font-bold
                text-slate-500
            "
        >
            0
        </span>

    );

}


/**
 * ============================================================================
 * BADGE DE VARIACIÓN PORCENTUAL
 * ============================================================================
 */
function PercentageVariationBadge({

    value,

}: {

    value: number | null;

}) {

    if (
        value === null
    ) {

        return (

            <span
                className="
                    inline-flex
                    rounded-md
                    bg-slate-100
                    px-2
                    py-1
                    text-[11px]
                    font-semibold
                    text-slate-400
                "
            >
                N/D
            </span>

        );

    }


    if (
        value > 0
    ) {

        return (

            <span
                className="
                    inline-flex
                    min-w-[72px]
                    items-center
                    justify-center
                    rounded-full
                    bg-red-50
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-red-600
                "
            >
                ↑ {value.toFixed(1)}%
            </span>

        );

    }


    if (
        value < 0
    ) {

        return (

            <span
                className="
                    inline-flex
                    min-w-[72px]
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-[11px]
                    font-bold
                    text-emerald-600
                "
            >
                ↓ {Math.abs(value).toFixed(1)}%
            </span>

        );

    }


    return (

        <span
            className="
                inline-flex
                min-w-[72px]
                items-center
                justify-center
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[11px]
                font-bold
                text-slate-500
            "
        >
            0.0%
        </span>

    );

}