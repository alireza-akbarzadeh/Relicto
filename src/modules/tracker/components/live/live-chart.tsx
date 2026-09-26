"use client";

import { Area, AreaChart, CartesianGrid, ReferenceDot, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Icon } from "@/components/ui/icon";
import type { SeriesPoint } from "../../types";

const CONFIG = { price: { label: "Market ask", color: "var(--color-primary)" } } satisfies ChartConfig;

const DAY = 86_400_000;
const WINDOW: Record<string, number | null> = { "7D": 7 * DAY, "30D": 30 * DAY, "90D": 90 * DAY, "1Y": 365 * DAY, ALL: null };

const day = (at: number) => new Date(at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/**
 * The focused item's real price history: the daily market ask as the line,
 * Relicto's settled sales as dots on it. Axes scale from the data.
 */
export function LiveChart({ series, sales, span }: { series: SeriesPoint[]; sales: SeriesPoint[]; span: string }) {
  const window = WINDOW[span] ?? null;
  const newest = series.at(-1)?.at ?? 0;
  const shown = window ? series.filter((point) => newest - point.at <= window) : series;

  if (shown.length < 2) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <Icon name="query_stats" className="text-[28px] text-text-muted" />
        <span className="font-headline-sm text-sm font-semibold text-text-primary">Price history is building</span>
        <span className="max-w-sm font-body-sm text-xs text-text-muted">
          {series.length
            ? `One market observation so far (${day(series[0].at)}, $${series[0].price.toFixed(2)}). The daily feed adds one each day.`
            : "No market observations yet for this item."}
        </span>
      </div>
    );
  }

  const prices = shown.map((point) => point.price);
  const pad = Math.max((Math.max(...prices) - Math.min(...prices)) * 0.15, 0.5);
  const first = shown[0].at;
  const visibleSales = sales.filter((sale) => sale.at >= first);

  return (
    <ChartContainer config={CONFIG} className="h-full w-full">
      <AreaChart data={shown} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="tracker-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-price)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-price)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-on-surface/10" />
        <XAxis dataKey="at" type="number" scale="time" domain={["dataMin", "dataMax"]} tickFormatter={day} tickLine={false} axisLine={false} minTickGap={32} className="font-data-mono-md" />
        <YAxis
          dataKey="price"
          domain={[Math.max(0, Math.min(...prices) - pad), Math.max(...prices) + pad]}
          tickFormatter={(value: number) => `$${value.toFixed(0)}`}
          tickLine={false}
          axisLine={false}
          width={56}
          className="font-data-mono-md"
        />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, payload) => day(Number(payload?.[0]?.payload?.at ?? 0))} />} />
        <Area dataKey="price" type="monotone" stroke="var(--color-price)" strokeWidth={2} fill="url(#tracker-fill)" isAnimationActive={false} />
        {visibleSales.map((sale) => (
          <ReferenceDot key={sale.at} x={sale.at} y={sale.price} r={4} className="fill-status-upcoming stroke-canvas-base" />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
