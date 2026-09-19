"use client";

import { cn } from "@/lib/cn";
import { SAFEGUARDS } from "../../data/facets.mock";
import { toggle } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";
import { CheckMark, CheckRow } from "./check-row";

export function SafeguardFacet() {
  const { filters, patch } = useMarketplace();

  return (
    <div className="mb-space-md pt-space-xs">
      <span className="mb-2 block font-label-badge text-label-badge text-text-muted uppercase">Trading Safeguards</span>
      <div className="space-y-2">
        {SAFEGUARDS.map((guard) => {
          const checked = filters.safeguards.includes(guard.value);
          return (
            <CheckRow
              key={guard.value}
              checked={checked}
              onChange={() => patch({ safeguards: toggle(filters.safeguards, guard.value) })}
              className={cn("flex items-center gap-2 select-none", !checked && "opacity-75 hover:opacity-100")}
            >
              <CheckMark checked={checked} size="md" checkedClassName="bg-primary-container text-on-primary-container" />
              <span className={cn("font-body-sm text-body-sm", checked ? "font-medium text-text-primary" : "text-text-secondary")}>
                {guard.label}
              </span>
            </CheckRow>
          );
        })}
      </div>
    </div>
  );
}
