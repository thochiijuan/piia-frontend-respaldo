"use client";

import dynamic from "next/dynamic";

const EpidemiologicalMapClient =
    dynamic(
        () =>
            import(
                "./EpidemiologicalMapClient"
            ),
        {
            ssr: false,

            loading: () => (

                <div
                    className="
                        flex
                        h-full
                        min-h-[480px]
                        w-full
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        text-sm
                        text-slate-400
                    "
                >

                    Cargando mapa epidemiológico...

                </div>

            ),
        }
    );

export default function EpidemiologicalMap() {

    return (
        <EpidemiologicalMapClient />
    );

}