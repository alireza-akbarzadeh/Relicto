"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { TRACKER_SPANS } from "../../lib/search-params";
import type { TrackerLive } from "../../types";
import { LiveChart } from "./live-chart";

const TONE = { primary: "text-primary", cyan: "text-status-upcoming", amber: "text-tertiary", muted: "text-text-primary" };

/** The focused item's header, computed stat tiles, span pills and real chart. */
export function LiveTerminal({ live, span, setSpan }: { live: TrackerLive; span: string; setSpan: (span: string) => void }) {
  const { focus, book } = live;
  return (
    <section className="flex flex-col gap-space-md rounded-xl border border-white/8 bg-surface-card p-space-lg shadow-xl">
      <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
        <div className="flex items-center gap-space-sm">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-surface-container-low">
            {focus.image && <Image src={focus.image} alt={focus.imageAlt} fill sizes="48px" className="object-cover" />}
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-text-primary">{focus.name}</h1>
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{focus.detail}</span>
          </div>
        </div>
        <div className="text-left lg:text-right">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">Current Best Ask</span>
          <div className="font-data-mono-lg text-3xl font-bold text-primary">
            {book.bestAsk !== null ? formatMoney(book.bestAsk) : "—"} <span className="text-sm text-text-muted">USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {live.stats.map((stat) => (
          <div key={stat.label} className="rounded bg-surface-container-lowest p-2">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">{stat.label}</span>
            <span className={cn("block font-data-mono-md font-bold", TONE[stat.tone])}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded bg-surface-container-lowest p-1">
          {TRACKER_SPANS.map((option) => (
            <Button
              key={option}
              variant={null}
              size={null}
              aria-pressed={span === option}
              onClick={() => setSpan(option)}
              className={cn("h-auto rounded px-2 py-1 font-label-badge text-[10px]", span === option ? "bg-primary-container text-on-primary-container" : "text-text-muted hover:text-text-primary")}
            >
              {option}
            </Button>
          ))}
        </div>
        <span className="font-body-sm text-[11px] text-text-muted">Daily lowest Skinport ask · dots are Relicto sales</span>
      </div>

      <div className="relative h-64 overflow-hidden rounded-lg border border-white/6 bg-surface-container-lowest p-3">
        <LiveChart series={live.series} sales={live.sales} span={span} />
      </div>
    </section>
  );
}
