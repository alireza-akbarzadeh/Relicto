"use client";

import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";
import { RARITIES } from "../../data/facets.mock";
import { toggle } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";
import { CheckMark, CheckRow } from "./check-row";

export function RarityFacet() {
  const { filters, patch } = useMarketplace();

  return (
    <div className="mb-space-md">
      <span className="mb-2 block font-label-badge text-label-badge text-text-muted uppercase">Item Rarity / Tier</span>
      <div className="space-y-1.5">
        {RARITIES.map((rarity) => {
          const checked = filters.rarities.includes(rarity.value);
          return (
            <CheckRow
              key={rarity.value}
              checked={checked}
              onChange={() => patch({ rarities: toggle(filters.rarities, rarity.value) })}
              className="group flex items-center justify-between rounded p-1.5 transition-colors hover:bg-surface-container-low"
            >
              <div className="flex items-center gap-2">
                <CheckMark checked={checked} checkedClassName={rarity.check} />
                <span
                  className={cn(
                    "font-body-sm text-body-sm",
                    checked ? "font-bold text-text-primary" : "text-text-secondary group-hover:text-text-primary",
                  )}
                >
                  {rarity.label}
                </span>
              </div>
              <span className="font-data-mono-md text-data-mono-md text-text-muted">{formatCount(rarity.count)}</span>
            </CheckRow>
          );
        })}
      </div>
    </div>
  );
}
