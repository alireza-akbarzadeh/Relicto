"use client";

import { cn } from "@/lib/cn";
import { SLOTS } from "../../data/facets.mock";
import { toggle } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";

export function SlotFacet() {
  const { filters, patch, results } = useMarketplace();
  /* Live tallies for the selected economy; the mock counts stand in when unseeded. */
  const countFor = (slot: (typeof SLOTS)[number]) =>
    results.facets.total ? (results.facets.slots[slot.value] ?? 0) : slot.count;

  return (
    <div className="mb-space-md">
      <span className="mb-2 block font-label-badge text-label-badge text-text-muted uppercase">Slot Allocation</span>
      <div className="grid grid-cols-2 gap-1.5">
        {SLOTS.map((slot) => {
          const active = filters.slots.includes(slot.value);
          return (
            <button
              key={slot.value}
              type="button"
              aria-pressed={active}
              onClick={() => patch({ slots: toggle(filters.slots, slot.value) })}
              className={cn(
                "rounded px-2 py-1 text-left font-body-sm text-body-sm",
                active
                  ? "bg-primary-container/20 font-bold text-text-primary"
                  : "bg-surface-container-low text-text-secondary hover:bg-surface-container hover:text-text-primary",
              )}
            >
              {slot.value} ({countFor(slot)})
            </button>
          );
        })}
      </div>
    </div>
  );
}
