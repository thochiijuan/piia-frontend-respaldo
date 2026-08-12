interface WeeklyCase {
    week: string;
    dengue: number;
    ira: number;
}

interface Props {
    title: string;
    value: string | number;
    description: string;
    color: string;
    trend?: number[];
    weeklyCases?: WeeklyCase[];
    chartType?: "area" | "bars";
}

export default function SummaryCard({
    title,
    value,
    description,
    color,
    trend = [],
    weeklyCases = [],
    chartType = "area",
}: Props) {
    function renderAreaChart() {
        if (!trend.length) return null;

        const width = 130;
        const height = 72;
        const padding = 8;

        const maxValue = Math.max(...trend);
        const minValue = Math.min(...trend);
        const range = maxValue - minValue || 1;

        const stepX =
            trend.length > 1
                ? (width - padding * 2) / (trend.length - 1)
                : 0;

        const points = trend.map((value, index) => {
            const x = padding + index * stepX;
            const y =
                height -
                padding -
                ((value - minValue) / range) * (height - padding * 2);

            return `${x},${y}`;
        });

        const linePath = points.join(" ");

        const areaPath = `
            M ${padding},${height - padding}
            L ${points.join(" L ")}
            L ${width - padding},${height - padding}
            Z
        `;

        return (
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[72px] w-[130px]"
                preserveAspectRatio="none"
            >
                {/* EJE Y */}
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="#D1D5DB"
                    strokeWidth="1"
                />

                {/* EJE X */}
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="#D1D5DB"
                    strokeWidth="1"
                />

                <path
                    d={areaPath}
                    fill={color}
                    opacity="0.12"
                />

                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePath}
                />

                {trend.map((value, index) => {
                    const x = padding + index * stepX;
                    const y =
                        height -
                        padding -
                        ((value - minValue) / range) * (height - padding * 2);

                    return (
                        <circle
                            key={`${title}-${index}`}
                            cx={x}
                            cy={y}
                            r="2.5"
                            fill={color}
                        />
                    );
                })}
            </svg>
        );
    }

    function renderBarChart() {
        if (!weeklyCases.length) return null;

        const width = 130;
        const height = 72;
        const padding = 8;

        const maxValue = Math.max(
            ...weeklyCases.flatMap((item) => [item.dengue, item.ira])
        );

        const innerHeight = height - padding * 2;
        const chartBottom = height - padding;

        const groupWidth = 18;
        const barWidth = 6;
        const gapBetweenGroups = 10;

        const dengueColor = "#EF4444";
        const iraColor = "#FCA5A5";

        return (
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[72px] w-[130px]"
                preserveAspectRatio="none"
            >
                {/* EJE Y */}
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={chartBottom}
                    stroke="#D1D5DB"
                    strokeWidth="1"
                />

                {/* EJE X */}
                <line
                    x1={padding}
                    y1={chartBottom}
                    x2={width - padding}
                    y2={chartBottom}
                    stroke="#D1D5DB"
                    strokeWidth="1"
                />

                {weeklyCases.map((item, index) => {
                    const baseX =
                        padding + 6 + index * (groupWidth + gapBetweenGroups);

                    const dengueHeight = (item.dengue / maxValue) * innerHeight;
                    const iraHeight = (item.ira / maxValue) * innerHeight;

                    return (
                        <g key={`${item.week}-${index}`}>
                            {/* Dengue */}
                            <rect
                                x={baseX}
                                y={chartBottom - dengueHeight}
                                width={barWidth}
                                height={dengueHeight}
                                rx="1"
                                fill={dengueColor}
                            />

                            {/* IRA */}
                            <rect
                                x={baseX + barWidth + 3}
                                y={chartBottom - iraHeight}
                                width={barWidth}
                                height={iraHeight}
                                rx="1"
                                fill={iraColor}
                            />
                        </g>
                    );
                })}
            </svg>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-slate-800">
                        {title}
                    </h3>

                    <h2
                        className="mt-4 text-[30px] font-bold leading-none"
                        style={{ color }}
                    >
                        {value}
                    </h2>

                    <p className="mt-4 text-sm text-slate-400">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div
                        className="h-3 w-3 rounded-full"
                        style={{ background: color }}
                    />

                    {chartType === "bars"
                        ? renderBarChart()
                        : renderAreaChart()}
                </div>
            </div>
        </div>
    );
}