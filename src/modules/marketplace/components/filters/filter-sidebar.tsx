"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { criteriaChips } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";
import { GameContext } from "./game-context";
import { HeroFacet } from "./hero-facet";
import { PriceFacet } from "./price-facet";
import { RarityFacet } from "./rarity-facet";
import { SafeguardFacet } from "./safeguard-facet";
import { SlotFacet } from "./slot-facet";
import { WearFacet } from "./wear-facet";

/** Left column: every catalog facet. */
export function FilterSidebar() {
  const { filters, resetAll } = useMarketplace();
  const active = criteriaChips(filters).length;
  const cs2 = filters.ecosystem === "cs2" || filters.ecosystem === "all";
  const dota = filters.ecosystem !== "cs2";

  return (
    <aside className="sticky top-24 w-full self-start overflow-y-auto rounded-xl bg-surface-card p-space-md shadow-lg lg:max-h-[calc(100vh-7rem)] lg:w-92 lg:shrink-0 [scrollbar-width:thin]">
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
      {/* Facets follow the selected economy: heroes & slots for Dota 2, wear & float for CS2. */}
      {dota && <HeroFacet />}
      <RarityFacet />
      {dota && <SlotFacet />}
      {cs2 && <WearFacet />}
      <PriceFacet />
      <SafeguardFacet />
      <div className={cn("flex-col gap-1 rounded-lg bg-surface-container-low p-space-sm", cs2 ? "hidden" : "flex")}>
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
