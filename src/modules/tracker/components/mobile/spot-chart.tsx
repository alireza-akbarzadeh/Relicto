"use client";

import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useDopplerPhase } from "../../hooks/use-doppler-phase";
import { trackerSearchParams } from "../../lib/search-params";
import type { Candle, TrackerMobileData } from "../../mobile.types";

const MOBILE_RANGES = ["15M", "1H", "4H", "1D", "1W"] as const;

const CANDLE: Record<Candle["tone"], { wick: string; body: string; width: string }> = {
  down: { wick: "stroke-status-live", body: "fill-status-live", width: "1.2" },
  rise: { wick: "stroke-tertiary", body: "fill-tertiary-container", width: "1.2" },
  up: { wick: "stroke-tertiary", body: "fill-tertiary", width: "1.2" },
  now: { wick: "stroke-primary-container", body: "fill-primary-container", width: "1.5" },
};

const BAR = { down: "bg-status-live", up: "bg-tertiary", now: "bg-primary shadow-[0_0_6px_var(--color-primary-container)]" };

function Candles({ chart }: { chart: TrackerMobileData["chart"] }) {
  return (
    <svg className="my-auto h-28 w-full" preserveAspectRatio="none" viewBox="0 0 320 110" aria-hidden>
      {[20, 55, 90].map((y) => (
        <line key={y} className="stroke-white/5" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1={y} y2={y} />
      ))}
      <path d={chart.emaPath} fill="none" opacity="0.8" className="stroke-secondary" strokeLinecap="round" strokeWidth="1.5" />
      {chart.candles.map((candle) => {
        const tone = CANDLE[candle.tone];
        return (
          <g key={candle.x}>
            <line className={tone.wick} strokeWidth={tone.width} x1={candle.x} x2={candle.x} y1={candle.wick[0]} y2={candle.wick[1]} />
            <rect className={tone.body} height={candle.body[1]} rx="1" width="8" x={candle.x - 4} y={candle.body[0]} />
          </g>
        );
      })}
    </svg>
  );
}

/** Spot price of the tracked phase, timeframe switch (`?range=`, shared with desktop) and the candle chart. */
export function SpotChart({ data }: { data: TrackerMobileData }) {
  const [range, setRange] = useQueryState("range", trackerSearchParams.range.withOptions({ history: "replace", clearOnDefault: true }));
  const { active } = useDopplerPhase(data.phases, data.defaultPhase);
  const { chart } = data;

  return (
    <div className="px-4">
      <div className="flex flex-col gap-3 rounded-xl bg-surface-container p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">Spot Execution</span>
            <div className="flex items-baseline gap-2">
              <span className="font-data-mono-lg text-data-mono-lg font-bold text-text-primary">{formatMoney(active.priceUsd)}</span>
              <span className="rounded bg-tertiary-container/30 px-1.5 py-0.5 font-label-badge text-label-badge font-bold text-tertiary">
                ▲ {data.asset.changePct.toFixed(2)}% 24h
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-surface-container-low p-1">
            {MOBILE_RANGES.map((option) => (
              <Button
                key={option}
                variant={null}
                size={null}
                aria-pressed={range === option}
                onClick={() => void setRange(option)}
                className={cn(
                  "h-auto min-h-[32px] min-w-[32px] rounded border-0 py-1 font-label-caps text-label-caps font-bold",
                  range === option ? "bg-primary px-2.5 text-on-primary shadow-xs" : "px-2 text-text-muted",
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="relative flex h-44 w-full flex-col justify-between overflow-hidden rounded-lg bg-surface-container-low p-2">
          <div className="flex justify-between px-1 font-label-badge text-label-badge text-text-muted">
            <span>
              HIGH <strong className="font-bold text-tertiary">{formatMoney(chart.high)}</strong>
            </span>
            <span className="font-medium text-secondary">20 EMA: {chart.ema}</span>
            <span>
              LOW <strong className="font-bold text-status-live">{formatMoney(chart.low)}</strong>
            </span>
          </div>
          <Candles chart={chart} />
          <div className="flex h-4 items-end justify-between gap-1 px-3">
            {chart.volume.map((bar, index) => (
              <div key={index} className={cn("w-1.5 rounded-xs", BAR[bar.tone])} style={{ height: bar.height, opacity: bar.opacity }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
