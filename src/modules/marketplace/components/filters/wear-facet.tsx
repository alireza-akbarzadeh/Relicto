"use client";

import { cn } from "@/lib/cn";
import { toggle } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";
import type { FloatBand, WearKey } from "../../types";
import { CheckMark, CheckRow } from "./check-row";

const WEARS: { value: WearKey; label: string; range: string }[] = [
  { value: "fn", label: "Factory New", range: "0.00 – 0.07" },
  { value: "mw", label: "Minimal Wear", range: "0.07 – 0.15" },
  { value: "ft", label: "Field-Tested", range: "0.15 – 0.38" },
  { value: "ww", label: "Well-Worn", range: "0.38 – 0.45" },
  { value: "bs", label: "Battle-Scarred", range: "0.45 – 1.00" },
];

const BANDS: { value: FloatBand; label: string }[] = [
  { value: "any", label: "Any float" },
  { value: "under001", label: "< 0.01" },
  { value: "under01", label: "< 0.10" },
  { value: "over01", label: "0.10+" },
];

/** CS2 economy facets: wear tier, float band and StatTrak — the hero facet's counterpart. */
export function WearFacet() {
  const { filters, patch } = useMarketplace();

  return (
    <div className="mb-space-md">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-label-badge text-label-badge text-text-muted uppercase">CS2 Wear Tier</span>
        <span className="font-label-badge text-label-badge text-tertiary">Exterior</span>
      </div>
      <div className="mb-space-sm space-y-1.5">
        {WEARS.map((wear) => {
          const checked = filters.wear.includes(wear.value);
          return (
            <CheckRow
              key={wear.value}
              checked={checked}
              onChange={() => patch({ wear: toggle(filters.wear, wear.value) })}
              className="group flex items-center justify-between rounded p-1.5 transition-colors hover:bg-surface-container-low"
            >
              <div className="flex items-center gap-2">
                <CheckMark checked={checked} checkedClassName="bg-tertiary-container text-on-tertiary-container" />
                <span
                  className={cn(
                    "font-body-sm text-body-sm",
                    checked ? "font-bold text-text-primary" : "text-text-secondary group-hover:text-text-primary",
                  )}
                >
                  {wear.label}
                </span>
              </div>
              <span className="font-data-mono-md text-data-mono-md text-text-muted">{wear.range}</span>
            </CheckRow>
          );
        })}
      </div>

      <span className="mb-1.5 block font-label-badge text-label-badge text-text-muted uppercase">Float Band</span>
      <div className="mb-space-sm grid grid-cols-2 gap-1">
        {BANDS.map((band) => (
          <button
            key={band.value}
            type="button"
            onClick={() => patch({ float: band.value })}
            aria-pressed={filters.float === band.value}
            className={cn(
              "rounded px-2 py-1 font-data-mono-md text-[11px] transition-colors",
              filters.float === band.value
                ? "bg-primary-container font-bold text-on-primary-container"
                : "bg-surface-container-lowest text-text-muted hover:text-text-primary",
            )}
          >
            {band.label}
          </button>
        ))}
      </div>

      <CheckRow
        checked={filters.stattrak}
        onChange={() => patch({ stattrak: !filters.stattrak })}
        className="group flex items-center justify-between rounded bg-surface-container-lowest p-1.5 transition-colors hover:bg-surface-container-low"
      >
        <div className="flex items-center gap-2">
          <CheckMark checked={filters.stattrak} checkedClassName="bg-tertiary-container text-on-tertiary-container" />
          <span className={cn("font-body-sm text-body-sm", filters.stattrak ? "font-bold text-text-primary" : "text-text-secondary")}>
            StatTrak™ only
          </span>
        </div>
        <span className="font-label-badge text-label-badge text-tertiary uppercase">Kills</span>
      </CheckRow>
    </div>
  );
}
