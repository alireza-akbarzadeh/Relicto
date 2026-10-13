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
  const { filters, resetAll, setGame } = useMarketplace();
  const active = criteriaChips(filters).length;
  const isCs2 = filters.ecosystem === "cs2";
  const isDota = filters.ecosystem === "dota2";
  const isTf2 = filters.ecosystem === "tf2";
  const isAll = filters.ecosystem === "all";

  return (
    <aside className="sticky top-24 w-full self-start overflow-y-auto rounded-xl bg-surface-card p-space-md shadow-lg lg:max-h-[calc(100vh-7rem)] lg:w-92 lg:shrink-0 [scrollbar-width:thin]">
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
        </>
      )}

      {/* TF2 Dedicated Facets */}
      {isTf2 && (
        <>
          <SlotFacet />
          <RarityFacet />
        </>
      )}

      {/* Unified Multi-Game View with Engine Switch Shortcuts */}
      {isAll && (
        <>
          <div className="mb-space-md flex flex-col gap-2 rounded-lg border border-white/6 bg-surface-container-low p-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-badge text-[11px] font-bold uppercase text-text-primary">
                Specialized Filters
              </span>
              <Icon name="tune" className="text-[14px] text-tertiary" />
            </div>
            <p className="font-body-sm text-[11px] leading-relaxed text-text-muted">
              Select an engine above or below to unlock CS2 wear & float or Dota 2 heroes & slots:
            </p>
            <div className="mt-0.5 grid grid-cols-2 gap-1.5">
              <Button
                type="button"
                variant={null}
                size={null}
                onClick={() => setGame("cs2")}
                className="flex items-center justify-center gap-1.5 rounded bg-surface-container px-2 py-1.5 font-label-badge text-[11px] font-bold text-tertiary transition-colors hover:bg-surface-container-high"
              >
                <Icon name="target" className="text-[14px]" />
                CS2 Engine
              </Button>
              <Button
                type="button"
                variant={null}
                size={null}
                onClick={() => setGame("dota2")}
                className="flex items-center justify-center gap-1.5 rounded bg-surface-container px-2 py-1.5 font-label-badge text-[11px] font-bold text-primary-container transition-colors hover:bg-surface-container-high"
              >
                <Icon name="shield" className="text-[14px]" />
                Dota 2 Engine
              </Button>
            </div>
          </div>
          <RarityFacet />
        </>
      )}

      <PriceFacet />
      <SafeguardFacet />
    </aside>
  );
}

