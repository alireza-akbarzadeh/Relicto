"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { criteriaChips } from "../../lib/filters";
import { useMarketplace } from "../../state/marketplace-provider";
import { GameContext } from "./game-context";
import { HeroFacet } from "./hero-facet";
import { PriceFacet } from "./price-facet";
import { RarityFacet } from "./rarity-facet";
import { SafeguardFacet } from "./safeguard-facet";
import { SlotFacet } from "./slot-facet";
import { WearFacet } from "./wear-facet";

/** Left column: game-specific and universal catalog facets. */
export function FilterSidebar() {
  const { filters, resetAll } = useMarketplace();
  const active = criteriaChips(filters).length;
  const isCs2 = filters.ecosystem === "cs2";
  const isDota = filters.ecosystem === "dota2";
  const isTf2 = filters.ecosystem === "tf2";
  const isAll = filters.ecosystem === "all";

  return (
    <aside className="sticky top-24 w-full self-start overflow-y-auto rounded-xl bg-surface-card p-space-md pb-space-xl shadow-lg lg:max-h-[calc(100vh-7rem)] lg:w-92 lg:shrink-0 [scrollbar-width:thin]">
      <div className="mb-space-md flex items-center justify-between pb-space-sm">
        <div className="flex items-center gap-2">
          <Icon name="tune" className="text-[20px] text-primary" />
          <h3 className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase">Filter Catalog</h3>
        </div>
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={resetAll}
          className="font-label-badge text-label-badge text-text-muted uppercase transition-colors hover:text-primary"
        >
          Reset All
        </Button>
      </div>
      <div className="mb-space-md flex items-center justify-between rounded bg-surface-container-low px-space-sm py-1.5">
        <span className="font-label-badge text-label-badge text-text-secondary uppercase">Active Criteria</span>
        <span className="rounded bg-primary-container px-2 py-0.5 font-label-badge text-label-badge font-bold text-on-primary-container">
          {active} Active
        </span>
      </div>
      <GameContext />

      {/* Dota 2 Dedicated Facets */}
      {isDota && (
        <>
          <HeroFacet />
          <RarityFacet />
          <SlotFacet />
        </>
      )}

      {/* CS2 Dedicated Facets */}
      {isCs2 && (
        <>
          <WearFacet />
          <RarityFacet />
          <SlotFacet />
        </>
      )}

      {/* TF2 Dedicated Facets */}
      {isTf2 && (
        <>
          <SlotFacet />
          <RarityFacet />
        </>
      )}

      {/* Universal Rarity & Slot Facets */}
      {isAll && (
        <>
          <SlotFacet />
          <RarityFacet />
        </>
      )}

      <PriceFacet />
      <SafeguardFacet />
    </aside>
  );
}

