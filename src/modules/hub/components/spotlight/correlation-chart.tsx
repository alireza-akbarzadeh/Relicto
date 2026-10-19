"use client";

import { useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SpotlightChart, SpotlightChartPoint } from "../../types";

const TIME_WINDOWS = ["24H", "7D", "30D"] as const;

function CorrelationTooltip({
  active,
  payload,
  label,
  series,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
  series: [string, string];
}) {
  if (!active || !payload?.length) return null;
  const floorVal = payload.find((p) => p.dataKey === "floor")?.value;
  const metricVal = payload.find((p) => p.dataKey === "metric")?.value;

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-surface-card/95 p-2.5 shadow-xl backdrop-blur-md">
      <span className="font-data-mono-md text-[10px] text-text-muted">{label} · Live Observation</span>
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="font-body-sm text-[11px] text-text-secondary">{series[0]}:</span>
        </div>
        <span className="font-data-mono-md font-bold text-text-primary">
          ${floorVal != null ? floorVal.toFixed(2) : "—"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-tertiary" />
          <span className="font-body-sm text-[11px] text-text-secondary">{series[1]}:</span>
        </div>
        <span className="font-data-mono-md font-bold text-tertiary">
          {metricVal != null ? `${metricVal.toFixed(1)}%` : "—"}
        </span>
      </div>
    </div>
  );
}

/** Floor price vs pro performance, driven by Recharts with dual-axis telemetry and interactive window switching. */
export function CorrelationChart({ chart }: { chart: SpotlightChart }) {
  const [windowKey, setWindowKey] = useState<string>("7D");
  const data: SpotlightChartPoint[] = chart.windows?.[windowKey] ?? chart.points ?? [];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-dark bg-surface p-4 shadow-inner">
      {/* Header with Title and Interactive Window Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-bold text-white">{chart.title}</span>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-surface-container-high/60 p-0.5">
          {TIME_WINDOWS.map((win) => {
            const active = win === windowKey;
            return (
              <button
                key={win}
                type="button"
                onClick={() => setWindowKey(win)}
                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold transition-all ${
                  active
                    ? "bg-tertiary/20 text-tertiary shadow-xs"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {win === "7D" ? "7-DAY LIVE" : win}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Plot Frame */}
      <div className="relative h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ left: -10, right: -5, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="hub-floor-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#9ca3af", fontFamily: "var(--font-data-mono)" }}
            />
            <YAxis
              yAxisId="floor"
              orientation="left"
              domain={["dataMin - 5", "dataMax + 5"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#9ca3af", fontFamily: "var(--font-data-mono)" }}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              width={38}
            />
            <YAxis
              yAxisId="metric"
              orientation="right"
              domain={["dataMin - 2", "dataMax + 2"]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#f59e0b", fontFamily: "var(--font-data-mono)" }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
              width={34}
            />
            <Tooltip content={<CorrelationTooltip series={chart.series} />} />
            <Area
              yAxisId="floor"
              type="monotone"
              dataKey="floor"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              fill="url(#hub-floor-gradient)"
              dot={{ r: 3, fill: "var(--color-primary)" }}
              activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Line
              yAxisId="metric"
              type="monotone"
              dataKey="metric"
              stroke="var(--color-tertiary)"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={{ r: 2.5, fill: "var(--color-tertiary)" }}
              activeDot={{ r: 4.5, fill: "var(--color-tertiary)" }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Peak Callout Badge */}
        <div className="pointer-events-none absolute top-1 right-2 rounded border border-border-dark bg-surface-card/90 px-2.5 py-1 text-right shadow-sm backdrop-blur-xs">
          <div className="font-mono text-xs font-bold text-primary">{chart.peak}</div>
          <div className="font-mono text-[8px] text-text-muted uppercase">{chart.peakLabel}</div>
        </div>
      </div>

      {/* Footer Legend and Trade Volume */}
      <div className="flex items-center justify-between border-t border-border-dark pt-1.5 text-xs leading-4 text-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1 w-3 rounded-full bg-primary" />
            <span className="font-mono text-[10px] text-white uppercase">{chart.series[0]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 border border-dashed border-tertiary bg-tertiary" />
            <span className="font-mono text-[10px] text-text-muted uppercase">{chart.series[1]}</span>
          </div>
        </div>
        <span className="font-mono text-[10px] text-text-muted">{chart.volume}</span>
      </div>
    </div>
  );
}
