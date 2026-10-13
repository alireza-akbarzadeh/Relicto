"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useMarketplace } from "../../state/marketplace-provider";
import type { EcosystemFilter } from "../../types";

const ENGINES: {
  id: EcosystemFilter;
  label: string;
  name: string;
  version: string;
  icon: "apps" | "target" | "shield" | "military_tech";
  badgeTone: string;
  dotColor: string;
}[] = [
  {
    id: "all",
    label: "All",
    name: "Unified Catalog",
    version: "Cross-Game",
    icon: "apps",
    badgeTone: "text-text-secondary",
    dotColor: "bg-text-secondary",
  },
  {
    id: "cs2",
    label: "CS2",
    name: "CS2 Economy",
    version: "v1.40",
    icon: "target",
    badgeTone: "text-tertiary",
    dotColor: "bg-tertiary",
  },
  {
    id: "dota2",
    label: "Dota 2",
    name: "Dota 2 Economy",
    version: "v7.38c",
    icon: "shield",
    badgeTone: "text-primary-container",
    dotColor: "bg-primary-container",
  },
  {
    id: "tf2",
    label: "TF2",
    name: "TF2 Economy",
    version: "v2.0",
    icon: "military_tech",
    badgeTone: "text-status-upcoming",
    dotColor: "bg-status-upcoming",
  },
];

/** Which economy's facets drive the catalog: Unified, CS2, Dota 2, or TF2. */
export function GameContext() {
  const { filters, setGame } = useMarketplace();
  const current = ENGINES.find((e) => e.id === filters.ecosystem) ?? ENGINES[0];

  return (
    <div className="mb-space-md">
      <span className="mb-1.5 block font-label-badge text-label-badge text-text-muted uppercase">
        Game Context Engine
      </span>

      {/* Dynamic Active Engine Indicator */}
      <div className="flex items-center justify-between rounded bg-surface-container-lowest p-2 text-text-primary shadow-xs">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", current.dotColor)} />
          <span className="font-headline-sm text-[13px] font-bold">{current.name}</span>
        </div>
        <span className={cn("font-label-badge text-[10px] font-bold uppercase", current.badgeTone)}>
          {current.version}
        </span>
      </div>

      {/* Interactive 4-Way Engine Switcher */}
      <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-surface-container-lowest p-1">
        {ENGINES.map((engine) => {
          const active = filters.ecosystem === engine.id;
          return (
            <Button
              key={engine.id}
              type="button"
              variant={null}
              size={null}
              onClick={() => setGame(engine.id)}
              className={cn(
                "flex items-center justify-center gap-1 rounded py-1.5 font-label-badge text-[11px] font-bold uppercase transition-all",
                active
                  ? "bg-surface-container text-text-primary shadow-xs ring-1 ring-white/10"
                  : "text-text-muted hover:bg-surface-container-low hover:text-text-secondary",
              )}
            >
              <Icon name={engine.icon} className={cn("text-[13px]", active && current.badgeTone)} />
              <span>{engine.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

