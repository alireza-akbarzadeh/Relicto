"use client";

import { useQueryStates } from "nuqs";
import { itemSearchParams } from "../../lib/search-params";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { STAT_TONE } from "../../lib/tones";
import type { PriceIntelligence } from "../../types";

const MARKER_FILL = { patch: "fill-rose-500", event: "fill-cyan-500", now: "fill-tertiary" };
const PILL = "h-auto rounded border-0 px-2 py-1 font-data-mono-md text-xs transition-colors";

function Plot({ data }: { data: PriceIntelligence }) {
  const line = data.points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${line} 960,280 40,280`;
  return (
    <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300" aria-hidden>
      <defs>
        <linearGradient id="item-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-tertiary)", stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-tertiary)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <polygon fill="url(#item-chart-fill)" points={area} />
      <polyline className="stroke-tertiary" fill="none" points={line} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      {data.points.map((point) =>
        point.marker ? (
          <circle
            key={point.x}
            cx={point.x}
            cy={point.y}
            r="5.5"
            className={cn("stroke-white", MARKER_FILL[point.marker])}
            strokeWidth="2"
          />
        ) : (
          <circle key={point.x} cx={point.x} cy={point.y} r="4.5" className="fill-surface stroke-tertiary" strokeWidth="2" />
        ),
      )}
      <line className="stroke-rose-500" opacity="0.8" strokeDasharray="4 4" strokeWidth="1.5" x1="420" x2="420" y1="30" y2="175" />
      <line className="stroke-cyan-500" opacity="0.8" strokeDasharray="4 4" strokeWidth="1.5" x1="700" x2="700" y1="30" y2="110" />
    </svg>
  );
}

/** Historical price telemetry with patch annotations and range switches. */
export function PriceChart({ data }: { data: PriceIntelligence }) {
  const [{ range, chart: mode }, setQuery] = useQueryStates(
    { range: itemSearchParams.range, chart: itemSearchParams.chart },
    { history: "replace", clearOnDefault: true },
  );

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

      <div className="relative flex h-72 w-full flex-col justify-between overflow-hidden rounded-lg border border-border-subtle bg-surface-container-lowest p-4 sm:h-80">
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 opacity-10">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="h-px w-full bg-on-surface" />
          ))}
        </div>
        <div className="relative flex h-full w-full items-center justify-center">
          <Plot data={data} />
          {data.annotations.map((note) => (
            <div key={note.id} className="group absolute top-5 flex -translate-x-1/2 cursor-pointer flex-col items-center" style={{ left: note.left }}>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded border bg-surface-card px-2 py-1 shadow-lg transition-all group-hover:scale-105",
                  note.tone === "crimson" ? "border-primary/40" : "border-status-upcoming/40",
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", note.tone === "crimson" ? "animate-ping bg-status-live" : "bg-status-upcoming")} />
                <span className={cn("font-data-mono-md text-[10px] font-bold", note.tone === "crimson" ? "text-primary-fixed" : "text-status-upcoming")}>
                  {note.label}
                </span>
              </div>
              <div className="pointer-events-none z-30 mt-1 hidden w-52 flex-col rounded border border-border-subtle bg-surface-card p-2 text-center shadow-2xl group-hover:flex">
                <span className="font-label-badge text-[10px] font-bold text-text-primary">{note.title}</span>
                <span className={cn("font-body-sm text-[10px] font-semibold", note.detailTone === "emerald" ? "text-emerald-400" : "text-tertiary")}>
                  {note.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border-subtle/30 pt-2 font-data-mono-md text-[10px] text-text-muted">
          {data.axis.map((tick) => (
            <span key={tick.label} className={tick.strong ? "font-bold text-tertiary" : undefined}>
              {tick.label}
            </span>
          ))}
        </div>
      </div>

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
