import type {
    LucideIcon,
} from "lucide-react";


type PredictionCardTone =
    | "red"
    | "blue"
    | "violet"
    | "orange"
    | "emerald"
    | "slate";


const TONES = {

    red: {
        value: "text-red-500",
        iconBackground: "bg-red-50",
        iconColor: "text-red-500",
    },

    blue: {
        value: "text-blue-600",
        iconBackground: "bg-blue-50",
        iconColor: "text-blue-600",
    },

    violet: {
        value: "text-violet-600",
        iconBackground: "bg-violet-50",
        iconColor: "text-violet-600",
    },

    orange: {
        value: "text-orange-500",
        iconBackground: "bg-orange-50",
        iconColor: "text-orange-500",
    },

    emerald: {
        value: "text-emerald-600",
        iconBackground: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },

    slate: {
        value: "text-slate-700",
        iconBackground: "bg-slate-100",
        iconColor: "text-slate-600",
    },

};


interface PredictionSummaryCardProps {

    title: string;

    value: string;

    description: string;

    secondary?: string;

    badge?: string;

    icon?: LucideIcon;

    tone?: PredictionCardTone;

    accentColor?: string;

}


export default function PredictionSummaryCard({

    title,

    value,

    description,

    secondary,

    badge,

    icon: Icon,

    tone = "blue",

    accentColor,

}: PredictionSummaryCardProps) {

    const theme =
        TONES[tone];


    return (

        <article
            className="
                min-h-[150px]
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-3
                "
            >

                <div className="min-w-0">

                    <p
                        className="
                            text-[13px]
                            font-semibold
                            leading-[18px]
                            text-slate-800
                        "
                    >
                        {title}
                    </p>


                    {badge && (

                        <span
                            className="
                                mt-1.5
                                inline-flex
                                rounded-md
                                border
                                border-slate-200
                                bg-slate-50
                                px-2
                                py-0.5
                                text-[9px]
                                font-semibold
                                text-slate-500
                            "
                        >
                            {badge}
                        </span>

                    )}

                </div>


                {Icon && (

                    <div
                        className={`
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            ${theme.iconBackground}
                            ${theme.iconColor}
                        `}
                    >

                        <Icon
                            size={16}
                            strokeWidth={2}
                        />

                    </div>

                )}

            </div>


            <p
                className={`
                    mt-4
                    text-[28px]
                    font-bold
                    leading-none
                    tracking-tight
                    ${accentColor ? "" : theme.value}
                `}
                style={
                    accentColor
                        ? {
                            color: accentColor,
                        }
                        : undefined
                }
            >
                {value}
            </p>


            <p
                className="
                    mt-3
                    text-[11px]
                    leading-[15px]
                    text-slate-500
                "
            >
                {description}
            </p>


            {secondary && (

                <p
                    className="
                        mt-1
                        text-[10px]
                        leading-[14px]
                        text-slate-400
                    "
                >
                    {secondary}
                </p>

            )}

        </article>

    );

}