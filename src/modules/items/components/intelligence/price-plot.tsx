"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { ChartAnnotation, ChartMode, PricePoint } from "../../types";

const CONFIG = {
  price: { label: "Price", color: "var(--color-tertiary)" },
} satisfies ChartConfig;

const ANNOTATION_STROKE = { crimson: "var(--color-primary)", cyan: "var(--color-status-upcoming)" };

const day = (at: number) => new Date(at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const money = (value: number) => `$${value.toFixed(2)}`;

/**
 * The price series, drawn by Recharts so both axes are scaled from the data
 * rather than hand-placed. `CANDLE` has no OHLC behind it yet — the catalog
 * stores one close per day — so it renders those closes as bars.
 */
export function PricePlot({
  points,
  annotations,
  mode,
}: {
  points: PricePoint[];
  annotations: ChartAnnotation[];
  mode: ChartMode;
}) {
  /* A little headroom so the line never touches the frame. */
  const prices = points.map((point) => point.price);
  const pad = Math.max((Math.max(...prices) - Math.min(...prices)) * 0.15, 0.5);
  const domain: [number, number] = [Math.max(0, Math.min(...prices) - pad), Math.max(...prices) + pad];

  const axes = (
    <>
      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-on-surface/10" />
      <XAxis
        dataKey="at"
        type="number"
        scale="time"
        domain={["dataMin", "dataMax"]}
        tickFormatter={day}
        tickLine={false}
        axisLine={false}
        minTickGap={32}
        className="font-data-mono-md"
      />
      <YAxis
        dataKey="price"
        domain={domain}
        tickFormatter={(value: number) => money(value)}
        tickLine={false}
        axisLine={false}
        width={64}
        className="font-data-mono-md"
      />
      <ChartTooltip
        content={
          <ChartTooltipContent
            labelFormatter={(_, payload) => day(Number(payload?.[0]?.payload?.at))}
            formatter={(value) => money(Number(value))}
          />
        }
      />
      {annotations.map((note) => (
        <ReferenceLine
          key={note.id}
          x={note.at}
          stroke={ANNOTATION_STROKE[note.tone]}
          strokeDasharray="4 4"
          strokeOpacity={0.8}
        />
      ))}
    </>
  );

  if (mode === "CANDLE") {
    return (
      <ChartContainer config={CONFIG} className="aspect-auto h-full w-full">
        <BarChart data={points} margin={{ left: 4, right: 12, top: 8 }}>
          {axes}
          <Bar dataKey="price" fill="var(--color-price)" radius={2} />
        </BarChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer config={CONFIG} className="aspect-auto h-full w-full">
      <AreaChart data={points} margin={{ left: 4, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="item-price-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--color-price)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-price)" stopOpacity={0} />
          </linearGradient>
        </defs>
        {axes}
        <Area
          dataKey="price"
          type="monotone"
          stroke="var(--color-price)"
          strokeWidth={2.5}
          fill="url(#item-price-fill)"
          dot={false}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
