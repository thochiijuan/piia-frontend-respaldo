/**
 * ============================================================================
 * AgeGroupChart
 * ----------------------------------------------------------------------------
 * Componente encargado de visualizar la distribución de casos según
 * grupo de edad.
 *
 * Responsabilidades:
 *
 * - Consultar los datos demográficos por grupo de edad.
 * - Mostrar casos de Dengue e IRA.
 * - Presentar la información mediante un gráfico de barras.
 * - Permitir abrir el detalle epidemiológico en una modal.
 *
 * Flujo:
 *
 * demographicCharts.service.ts
 *            ↓
 *      AgeGroupChart
 *            ↓
 *   Ver más detalles
 *            ↓
 * AgeGroupDetailsModal
 *
 * ============================================================================
 */

"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";


/* ============================================================================
 * DATOS Y SERVICIOS
 * ============================================================================
 */

import type {
    AgeGroupData,
} from "../data/demographicCharts";

import {
    getAgeGroupData,
} from "../services/demographicCharts.service";


/* ============================================================================
 * MODAL DE DETALLE
 * ============================================================================
 */

import AgeGroupDetailsModal
    from "../details/age-group/AgeGroupDetailsModal";


/* ============================================================================
 * ETIQUETAS ABREVIADAS DEL EJE X
 * ============================================================================
 */

const AGE_GROUP_LABELS: Record<string, string> = {

    "<1 Año": "<1",

    "< 1 Año": "<1",

    "<1 año": "<1",

    "1 a 4": "1–4",

    "5 a 9": "5–9",

    "10 a 14": "10–14",

    "15 a 19": "15–19",

    "20 a 29": "20–29",

    "30 a 39": "30–39",

    "40 a 49": "40–49",

    "50 a 59": "50–59",

    "60 años y más": "60+",

    "60 y más": "60+",

};


/**
 * ============================================================================
 * FORMATEAR ETIQUETA DE GRUPO DE EDAD
 * ============================================================================
 */
function formatAgeGroupLabel(
    value: string
) {

    return (
        AGE_GROUP_LABELS[
            value.trim()
        ] ?? value
    );

}


/**
 * ============================================================================
 * COMPONENTE
 * ============================================================================
 */
export default function AgeGroupChart() {

    /**
     * =========================================================================
     * DATOS DEL GRÁFICO
     * =========================================================================
     */

    const [
        data,
        setData,
    ] = useState<AgeGroupData[]>([]);


    /**
     * =========================================================================
     * ESTADO DE LA MODAL
     * -------------------------------------------------------------------------
     * false = cerrada
     * true  = abierta
     * =========================================================================
     */

    const [
        isDetailsOpen,
        setIsDetailsOpen,
    ] = useState(false);


    /**
     * =========================================================================
     * CARGA DE DATOS
     * =========================================================================
     */

    useEffect(() => {

        async function loadChart() {

            const response =
                await getAgeGroupData();

            setData(
                response
            );

        }


        void loadChart();

    }, []);


    /**
     * =========================================================================
     * RENDER
     * =========================================================================
     */

    return (

        <>

            {/* ============================================================
                TARJETA PRINCIPAL
            ============================================================ */}

            <div
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

                {/* ========================================================
                    TÍTULO
                ======================================================== */}

                <h2
                    className="
                        text-[20px]
                        font-semibold
                        text-slate-800
                    "
                >

                    Casos por grupo de edad

                </h2>


                {/* ========================================================
                    SUBTÍTULO
                ======================================================== */}

                <p
                    className="
                        mt-1
                        text-sm
                        text-slate-400
                    "
                >

                    Distribución de casos por grupos de edad

                </p>


                {/* ========================================================
                    GRÁFICO
                ======================================================== */}

                <div
                    className="
                        relative
                        mt-4
                        min-h-0
                        flex-1
                        pl-4
                    "
                >

                    {/* ====================================================
                        TÍTULO DEL EJE Y
                    ==================================================== */}

                    <span
                        className="
                            pointer-events-none
                            absolute
                            -left-2
                            top-1/2
                            -translate-y-1/2
                            -rotate-90
                            whitespace-nowrap
                            text-[12px]
                            font-semibold
                            text-slate-600
                        "
                    >

                        Casos

                    </span>


                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={data}
                            barGap={4}
                            barCategoryGap="18%"
                            margin={{
                                top: 10,
                                right: 0,
                                left: -6,
                                bottom: 0,
                            }}
                        >

                            {/* ============================================
                                CUADRÍCULA
                            ============================================ */}

                            <CartesianGrid
                                stroke="#ECEFF5"
                            />


                            {/* ============================================
                                EJE X
                            ============================================ */}

                            <XAxis
                                dataKey="ageGroup"
                                interval={0}
                                height={30}
                                tickLine={false}
                                tickMargin={8}
                                tickFormatter={
                                    formatAgeGroupLabel
                                }
                                tick={{
                                    fontSize: 10,
                                    fontWeight: 500,
                                    fill: "#475569",
                                }}
                            />


                            {/* ============================================
                                EJE Y
                            ============================================ */}

                            <YAxis
                                width={32}
                                allowDecimals={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 11,
                                    fill: "#475569",
                                }}
                            />


                            {/* ============================================
                                TOOLTIP
                            ============================================ */}

                            <Tooltip
                                cursor={{
                                    fill: "#F8FAFC",
                                }}
                                contentStyle={{
                                    borderRadius: 12,
                                    border:
                                        "1px solid #E5E7EB",
                                    boxShadow:
                                        "0 8px 20px rgba(0,0,0,0.08)",
                                }}
                            />


                            {/* ============================================
                                DENGUE
                            ============================================ */}

                            <Bar
                                dataKey="dengue"
                                name="Dengue"
                                fill="#6D4CFF"
                                radius={[
                                    4,
                                    4,
                                    0,
                                    0,
                                ]}
                            />


                            {/* ============================================
                                IRA
                            ============================================ */}

                            <Bar
                                dataKey="ira"
                                name="IRA"
                                fill="#5BC98C"
                                radius={[
                                    4,
                                    4,
                                    0,
                                    0,
                                ]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>


                {/* ========================================================
                    TÍTULO DEL EJE X
                ======================================================== */}

                <p
                    className="
                        mt-1
                        shrink-0
                        text-center
                        text-[12px]
                        font-semibold
                        leading-none
                        text-slate-600
                    "
                >

                    Grupo de edad (años)

                </p>


                {/* ========================================================
                    LEYENDA PERSONALIZADA
                ======================================================== */}

                <div
                    className="
                        flex
                        h-7
                        shrink-0
                        items-center
                        justify-center
                        gap-3
                        text-sm
                    "
                >

                    {/* DENGUE */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-[#6D4CFF]
                        "
                    >

                        <span
                            className="
                                h-3
                                w-3
                                rounded-[3px]
                                bg-[#6D4CFF]
                            "
                        />

                        <span>
                            Dengue
                        </span>

                    </div>


                    {/* IRA */}

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                            text-[#5BC98C]
                        "
                    >

                        <span
                            className="
                                h-3
                                w-3
                                rounded-[3px]
                                bg-[#5BC98C]
                            "
                        />

                        <span>
                            IRA
                        </span>

                    </div>

                </div>


                {/* ========================================================
                    BOTÓN VER MÁS DETALLES
                ======================================================== */}

                <div
                    className="
                        shrink-0
                        pt-3
                    "
                >

                    <button
                        type="button"
                        onClick={
                            () =>
                                setIsDetailsOpen(
                                    true
                                )
                        }
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[#DCE7FF]
                            bg-[#F5F8FF]
                            font-semibold
                            text-[#2563EB]
                            transition
                            hover:bg-[#EDF4FF]
                        "
                    >

                        Ver más detalles →

                    </button>

                </div>

            </div>


            {/* ============================================================
                MODAL DE DETALLE
            ============================================================ */}

            <AgeGroupDetailsModal
                isOpen={
                    isDetailsOpen
                }
                onClose={
                    () =>
                        setIsDetailsOpen(
                            false
                        )
                }
            />

        </>

    );

}