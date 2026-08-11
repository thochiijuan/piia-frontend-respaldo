import { Info } from "lucide-react";

interface PredictionPanelProps {
    title: string;
    subtitle?: string;
    minHeight?: string;
}

export default function PredictionPanel({
    title,
    subtitle,
    minHeight = "min-h-[420px]",
}: PredictionPanelProps) {

    return (

        <section
            className={`
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
                ${minHeight}
            `}
        >

            {/* ============================================================
                ENCABEZADO
            ============================================================ */}

            <div
                className="
                    px-5
                    py-4
                "
            >

                <div className="flex items-center gap-2">

                    <h2
                        className="
                            text-[17px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {title}
                    </h2>

                    <Info
                        size={15}
                        className="text-slate-400"
                    />

                </div>

                {subtitle && (

                    <p
                        className="
                            mt-1
                            text-[11px]
                            text-slate-500
                        "
                    >
                        {subtitle}
                    </p>

                )}

            </div>


            {/* ============================================================
                CONTENIDO
                Se implementará posteriormente
            ============================================================ */}

            <div className="flex-1" />

        </section>

    );

}