import { Area, AreaChart, ResponsiveContainer } from "recharts";

/**
 * Tiny inline trend chart. Designed to live under a KPI number.
 * Provide `data` as a number[] or {v:number}[].
 */
export function Sparkline({
  data,
  color = "var(--primary)",
  height = 36,
  className = "",
}: {
  data: number[] | { v: number }[];
  color?: string;
  height?: number;
  className?: string;
}) {
  const series = (data as Array<number | { v: number }>).map((d, i) =>
    typeof d === "number" ? { i, v: d } : { i, v: d.v }
  );

  const gradId = `sl-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className={className} style={{ height, width: "100%" }}>
      <ResponsiveContainer>
        <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.8}
            fill={`url(#${gradId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
