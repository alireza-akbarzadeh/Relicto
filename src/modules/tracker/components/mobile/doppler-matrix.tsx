"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useDopplerPhase } from "../../hooks/use-doppler-phase";
import type { DopplerPhase, TrackerMobileData } from "../../mobile.types";

const LABEL: Record<DopplerPhase["tone"], string> = {
  muted: "text-text-secondary",
  live: "font-semibold text-status-live",
  indigo: "font-semibold text-secondary",
};

/** Swipeable phase / gem chips; picking one re-prices the terminal. */
export function DopplerMatrix({ data }: { data: TrackerMobileData }) {
  const { active, select } = useDopplerPhase(data.phases, data.defaultPhase);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between px-4">
        <span className="font-label-caps text-label-caps text-text-muted uppercase">Doppler Tier Matrix</span>
        <span className="font-label-badge text-label-badge text-primary">Live Liquidity</span>
      </div>
      <div className="no-scrollbar w-full overflow-x-auto">
        <div className="flex min-w-max gap-2.5 px-4 pb-1">
          {data.phases.map((phase) => {
            const current = phase.id === active.id;
            return (
              <Button
                key={phase.id}
                variant={null}
                size={null}
                aria-pressed={current}
                onClick={() => select(phase.id)}
                className={cn(
                  "h-auto min-h-[44px] flex-col items-start justify-start gap-0 rounded-lg border-0 py-2 text-left font-normal",
                  current ? "bg-primary-container px-3.5 text-on-primary-container shadow-md" : "bg-surface-container px-3",
                )}
              >
                <span
                  className={cn(
                    "font-label-badge text-label-badge",
                    current ? "font-bold tracking-wider uppercase" : LABEL[phase.tone],
                  )}
                >
                  {current ? `${phase.label} • Active` : phase.label}
                </span>
                <span className={cn("font-data-mono-md text-data-mono-md font-bold", !current && "text-text-primary")}>
                  {formatMoney(phase.priceUsd, { whole: true })}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
