"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { itemSearchParams } from "../../lib/search-params";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { withinRange } from "../../lib/chart-range";
import { STAT_TONE } from "../../lib/tones";
import type { PriceIntelligence } from "../../types";
import { PricePlot } from "./price-plot";

const PILL = "h-auto rounded border-0 px-2 py-1 font-data-mono-md text-xs transition-colors";

/** Historical price telemetry with patch annotations and range switches. */
export function PriceChart({ data }: { data: PriceIntelligence }) {
  const [{ range, chart: mode }, setQuery] = useQueryStates(
    { range: itemSearchParams.range, chart: itemSearchParams.chart },
    { history: "replace", clearOnDefault: true },
  );

  /* The range pills used to be inert; they now pick the slice the chart draws. */
  const series = useMemo(() => withinRange(data.points, range ?? data.activeRange), [data.points, data.activeRange, range]);

  return (
    <section id="intelligence" className="flex w-full scroll-mt-40 flex-col gap-4 rounded-lg border border-border-subtle bg-surface-card p-6 shadow-xl">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="query_stats" className="text-[24px] text-status-upcoming" />
            <h2 className="font-headline-lg text-2xl font-bold tracking-tight text-text-primary">Financial Price Intelligence</h2>
            <span className="rounded bg-surface-container-highest px-2 py-0.5 font-label-badge text-[10px] font-bold text-tertiary">BETA ENGINE</span>
          </div>
          <p className="mt-1 font-body-md text-sm text-text-muted">Historical transaction telemetry mapped alongside Valve gameplay patches and meta shifts.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded border border-border-subtle bg-surface-container-lowest p-1">
            {data.ranges.map((option) => (
              <Button
                key={option}
                variant={null}
                size={null}
                onClick={() => void setQuery({ range: option })}
                aria-pressed={range === option}
                className={cn(
                  PILL,
                  range === option ? "border border-border-tactical bg-surface-container-high font-bold text-tertiary" : "font-normal text-text-muted hover:text-text-primary",
                )}
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded border border-border-subtle bg-surface-container-lowest p-1">
            {data.modes.map((option) => (
              <Button
                key={option}
                variant={null}
                size={null}
                onClick={() => void setQuery({ chart: option })}
                aria-pressed={mode === option}
                className={cn(
                  PILL,
                  "px-2.5 font-label-caps",
                  mode === option ? "bg-surface-container font-bold text-text-primary" : "font-normal text-text-muted hover:text-text-primary",
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex h-72 w-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface-container-lowest p-4 sm:h-80">
        <PricePlot points={series} annotations={data.annotations} mode={mode ?? data.activeMode} />
      </div>

      {data.annotations.length > 0 && (
        <div className="flex flex-wrap items-start gap-2">
          {data.annotations.map((note) => (
            <div
              key={note.id}
              className={cn(
                "flex flex-col gap-0.5 rounded border bg-surface-card px-2.5 py-1.5 shadow-lg",
                note.tone === "crimson" ? "border-primary/40" : "border-status-upcoming/40",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", note.tone === "crimson" ? "bg-status-live" : "bg-status-upcoming")} />
                <span className={cn("font-data-mono-md text-[10px] font-bold", note.tone === "crimson" ? "text-primary-fixed" : "text-status-upcoming")}>
                  {note.label}
                </span>
              </span>
              <span className="font-label-badge text-[10px] font-bold text-text-primary">{note.title}</span>
              <span className={cn("font-body-sm text-[10px] font-semibold", note.detailTone === "emerald" ? "text-emerald-400" : "text-tertiary")}>
                {note.detail}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-1 lg:grid-cols-4">
        {data.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col rounded border border-border-subtle bg-surface-container-lowest p-3">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">{stat.label}</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className={cn("font-data-mono-md text-lg font-bold", STAT_TONE[stat.tone])}>{stat.value}</span>
              {stat.badge && (
                <span className="rounded border border-emerald-500/30 bg-emerald-950/80 px-1.5 font-label-badge text-[9px] font-bold text-emerald-400">
                  {stat.badge}
                </span>
              )}
            </div>
            <span className="mt-0.5 font-body-sm text-[10px] text-text-muted">{stat.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
