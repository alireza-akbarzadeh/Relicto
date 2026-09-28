"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatCount, formatMoney } from "@/lib/format";
import type { MarketHealth } from "../../hooks/use-market-stream";
import { TRACKER_MARKETS } from "../../lib/search-params";
import { shortAgo, STREAM_STATE } from "../../lib/terminal-format";
import type { MarketTelemetry as Telemetry, TrackerMarket } from "../../market.types";

type MarketTelemetryProps = {
  telemetry: Telemetry;
  health: MarketHealth;
  now: number;
  market: TrackerMarket;
  setMarket: (market: TrackerMarket) => void;
};

/** The strip above the terminal: stream state, feed freshness, market totals and the market switch — all live. */
export function MarketTelemetry({ telemetry, health, now, market, setMarket }: MarketTelemetryProps) {
  const status = STREAM_STATE[health.state];
  const feed = telemetry.feedAt ? `${shortAgo(now - Date.parse(telemetry.feedAt))} ago` : "not synced";

  return (
    <section className="border-b border-white/6 bg-surface-container-lowest px-gutter-desktop py-space-sm">
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-space-sm lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-space-sm font-label-badge text-label-badge uppercase">
          <span className="text-tertiary">Portal</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-secondary">Market Telemetry</span>
          <span className="text-text-muted">/</span>
          <span className={cn("flex items-center gap-1", status.tone)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
          <span className="hidden text-text-muted xl:inline">
            • Frame: <b className="text-text-primary">{health.lastFrameAt ? `${shortAgo(now - health.lastFrameAt)} ago` : "—"}</b> • Latency:{" "}
            <b className="text-status-upcoming">{health.latencyMs === null ? "—" : `${health.latencyMs}ms`}</b> • Skinport feed: <b className="text-primary">{feed}</b>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-space-sm">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">
            Listed <b className="text-tertiary">{formatMoney(telemetry.listedUsd)}</b> · {formatCount(telemetry.listings)} copies ·{" "}
            {formatCount(telemetry.bids)} bids · 24H Sales <b className="text-tertiary">{formatMoney(telemetry.sales24hUsd)}</b>
          </span>
          <div className="flex rounded bg-surface-container-high p-0.5">
            {TRACKER_MARKETS.map((item) => (
              <Button
                key={item}
                variant={null}
                size={null}
                onClick={() => setMarket(item)}
                aria-pressed={market === item}
                className={cn(
                  "h-auto rounded px-2 py-1 font-label-caps text-[10px] uppercase",
                  market === item ? "bg-primary-container text-on-primary-container" : "text-text-muted hover:text-text-primary",
                )}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
