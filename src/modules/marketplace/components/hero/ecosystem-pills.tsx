"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { ECOSYSTEMS } from "../../data/facets.mock";
import { useMarketplace } from "../../state/marketplace-provider";

/** Game ecosystem switch under the search bar. */
export function EcosystemPills() {
  const { filters, patch } = useMarketplace();

  return (
    <div role="radiogroup" aria-label="Game ecosystem" className="mb-space-md flex flex-wrap items-center justify-center gap-space-sm">
      {ECOSYSTEMS.map((eco) => {
        const active = filters.ecosystem === eco.value;
        return (
          <button
            key={eco.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => patch({ ecosystem: eco.value })}
            className={cn(
              "flex items-center gap-space-xs rounded px-space-md py-2 transition-all",
              active
                ? "bg-primary-container/20 text-text-primary shadow-xs hover:bg-primary-container/30"
                : "bg-surface-container text-text-secondary hover:bg-surface-container-high hover:text-text-primary",
            )}
          >
            <Icon
              name={eco.icon}
              filled={active}
              className={cn(eco.value === "all" ? "text-[16px]" : "text-[18px]", active ? "text-primary-container" : eco.tone)}
            />
            <span className={cn("font-label-caps text-label-caps uppercase", active && "font-bold text-primary")}>
              {eco.label}
            </span>
            <span
              className={cn(
                "ml-1 rounded px-1.5 py-0.5 font-data-mono-md text-data-mono-md",
                active ? "bg-primary-container font-bold text-on-primary-container" : "bg-surface-container-lowest text-text-muted",
              )}
            >
              {formatCount(eco.count)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
