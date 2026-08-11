/**
 * ============================================================================
 * LEYENDA FLOTANTE - TASA DE INCIDENCIA
 * ----------------------------------------------------------------------------
 * Los colores representan rangos de tasa por 100.000 habitantes.
 * Aplica a la enfermedad seleccionada: Dengue, IRA o Todas.
 * ============================================================================
 */

const LEGEND_ITEMS = [
    {
        label: "0 - 50",
        color: "#35B779",
    },
    {
        label: "50 - 100",
        color: "#8CCB6B",
    },
    {
        label: "100 - 200",
        color: "#F9C23C",
    },
    {
        label: "200 - 400",
        color: "#F98C2B",
    },
    {
        label: "400 - 800",
        color: "#F65341",
    },
    {
        label: "> 800",
        color: "#D92F3D",
    },
    {
        label: "Sin datos",
        color: "#D7DEE8",
    },
];

export default function IncidenceLegend() {

    return (

        <div
            className="
                pointer-events-none
                absolute
                bottom-5
                right-4
                z-[1000]
                w-[145px]
                rounded-lg
                border
                border-slate-200
                bg-white/95
                p-3
                shadow-lg
                backdrop-blur-sm
            "
        >

            <p className="text-[11px] font-bold text-slate-800">
                Tasa de incidencia
            </p>

            <p className="mt-0.5 text-[8px] text-slate-400">
                por 100.000 Hab.
            </p>

            <div className="mt-3 space-y-2">

                {LEGEND_ITEMS.map((item) => (

                    <div
                        key={item.label}
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                h-4
                                w-4
                                shrink-0
                                rounded
                                border
                                border-black/5
                            "
                            style={{
                                backgroundColor:
                                    item.color,
                            }}
                        />

                        <span
                            className="
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            {item.label}
                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}