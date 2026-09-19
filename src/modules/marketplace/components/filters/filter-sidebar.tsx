"use client";

import { Icon } from "@/components/ui/icon";
import { criteriaChips } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";
import { GameContext } from "./game-context";
import { HeroFacet } from "./hero-facet";
import { PriceFacet } from "./price-facet";
import { RarityFacet } from "./rarity-facet";
import { SafeguardFacet } from "./safeguard-facet";
import { SlotFacet } from "./slot-facet";

/** Left column: every catalog facet. */
export function FilterSidebar() {
  const { filters, resetAll } = useMarketplace();
  const active = criteriaChips(filters).length;

  return (
    <aside className="sticky top-20 w-full rounded-xl bg-surface-card p-space-md shadow-lg lg:w-72 lg:shrink-0">
      <div className="mb-space-md flex items-center justify-between pb-space-sm">
        <div className="flex items-center gap-2">
          <Icon name="tune" className="text-[20px] text-primary" />
          <h3 className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase">Filter Catalog</h3>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="font-label-badge text-label-badge text-text-muted uppercase transition-colors hover:text-primary"
        >
          Reset All
        </button>
      </div>
      <div className="mb-space-md flex items-center justify-between rounded bg-surface-container-low px-space-sm py-1.5">
        <span className="font-label-badge text-label-badge text-text-secondary uppercase">Active Criteria</span>
        <span className="rounded bg-primary-container px-2 py-0.5 font-label-badge text-label-badge font-bold text-on-primary-container">
          {active} Active
        </span>
      </div>
      <GameContext />
      {filters.ecosystem !== "cs2" && <HeroFacet />}
      <RarityFacet />
      <SlotFacet />
      <PriceFacet />
      <SafeguardFacet />
      <div className="flex flex-col gap-1 rounded-lg bg-surface-container-low p-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-badge text-label-badge font-bold text-tertiary uppercase">CS2 Engine Ready</span>
          <Icon name="bolt" className="text-[16px] text-tertiary" />
        </div>
        <p className="font-body-sm text-[12px] text-text-muted">
          Toggle Wear (FN, MW, FT, WW, BS), Float {"<"}0.01, and StatTrak™ telemetry.
        </p>
      </div>
    </aside>
  );
}
