"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { getMovers, MOVER_WINDOWS } from "../../data/movers.mock";
import { scrollToListings } from "../../lib/scroll";
import { useMarketplace } from "../../state/marketplace-provider";
import type { MoverWindow } from "../../types";
import { MoverCard } from "./mover-card";

/** "High volatility & trending movers" strip with a 1H / 24H / 7D window. */
export function TrendingMovers() {
  const [range, setRange] = useState<MoverWindow>("24h");
  const { patch } = useMarketplace();
  const movers = getMovers(range);
  const windowLabel = MOVER_WINDOWS.find((w) => w.value === range)?.label.toLowerCase();

  return (
    <div className="w-full px-margin-desktop py-space-md">
      <div className="mx-auto w-full max-w-7xl rounded-xl bg-surface-card/60 p-space-md shadow-lg backdrop-blur-md">
        <div className="mb-space-md flex flex-col justify-between gap-space-sm md:flex-row md:items-center">
          <div className="flex items-center gap-space-sm">
            <span className="h-3 w-3 animate-pulse rounded-full bg-status-live" />
            <h2 className="flex items-center gap-2 font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase">
              High Volatility & Trending Movers
            </h2>
            <span className="rounded bg-tertiary-container/30 px-2 py-0.5 font-label-badge text-label-badge text-tertiary uppercase">
              Live Spikes
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <div role="radiogroup" aria-label="Time window" className="flex items-center rounded bg-surface-container-lowest p-1">
              {MOVER_WINDOWS.map((w) => (
                <button
                  key={w.value}
                  type="button"
                  role="radio"
                  aria-checked={w.value === range}
                  onClick={() => setRange(w.value)}
                  className={cn(
                    "rounded px-2.5 py-1 font-label-badge text-label-badge uppercase transition-colors",
                    w.value === range ? "bg-surface-container font-bold text-tertiary" : "text-text-muted hover:text-text-primary",
                  )}
                >
                  {w.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => toast("Leaderboards are on the roadmap", { description: "Price Tracker ships after launch." })}
              className="flex items-center gap-1 font-label-caps text-label-caps text-tertiary uppercase transition-colors hover:text-primary"
            >
              <span>View {windowLabel} Leaderboard</span>
              <Icon name="arrow_forward" className="text-[16px]" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {movers.map((mover) => (
            <MoverCard
              key={mover.id}
              mover={mover}
              onOpen={(m) => {
                patch({ query: m.name, ecosystem: "all" });
                scrollToListings();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
