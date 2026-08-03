import { demographicIcons } from "./icons";

interface Props {

    title: string;

    value: string | number;

    description: string;

    color: string;

    icon: string;

}

export default function DemographicCard({

    title,

    value,

    description,

    color,

    icon,

}: Props) {

    const Icon =
        demographicIcons[
            icon as keyof typeof demographicIcons
        ];

    return (

        <div
            className="
                bg-white
                rounded-xl
                border
                border-slate-200
                shadow-sm
                p-4
                transition
                hover:shadow-md
            "
        >

            <div className="flex gap-4">

                <div
                    className="
                        w-12
                        h-12
                        rounded-xl
                        bg-slate-50
                        border
                        border-slate-200
                        flex
                        items-center
                        justify-center
                        shrink-0
                    "
                >

                    {Icon && (

                        <Icon

                            size={28}

                            color={color}

                        />

                    )}

                </div>

                <div className="flex-1">

                    <h3
                        className="
                            text-[13px]
                            font-semibold
                            text-slate-700
                            leading-5
                        "
                    >

                        {title}

                    </h3>

                    <h2
                        className="
                            text-4xl
                            font-bold
                            mt-2
                        "
                        style={{

                            color,

                        }}
                    >

                        {value}

                    </h2>

                    <p
                        className="
                            text-sm
                            text-slate-400
                            mt-1
                        "
                    >

                        {description}

                    </p>

                </div>

            </div>

        </div>

    );

}