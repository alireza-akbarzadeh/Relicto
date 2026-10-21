"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { Icon } from "@/components/ui/icon";
import { OffersInbox } from "@/modules/offers/components/offers-inbox";
import type { IncomingOffer } from "@/modules/offers/types";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { useListingWrites } from "../hooks/use-listing-writes";
import { sellSearchParams } from "../lib/search-params";
import type { SellMobile } from "../mobile.types";
import type { SellData, SellGame } from "../types";
import { ActiveListings } from "./active-listings";
import { InventoryList } from "./inventory-list";
import { ListingFocus } from "./listing-focus";
import { TradeUpChamber } from "./mobile/trade-up-chamber";
import { SellGuarantee } from "./sell-guarantee";
import { SellerGuideBanner } from "./seller-guide-banner";
import { SellTelemetry } from "./sell-telemetry";
import { SellerHero } from "./seller-hero";

export function SellView({
  data,
  offers,
  contract,
}: {
  data: SellData;
  offers: IncomingOffer[];
  contract: SellMobile["contract"];
}) {
  /* Inventory game, search, trade filter, sort and picks are all URL state. */
  const [{ game, q: query, filter, sort, picks: selected }, setParams] = useQueryStates(
    sellSearchParams,
    { history: "replace", clearOnDefault: true },
  );

  const setGame = (value: SellGame) => void setParams({ game: value });
  const setQuery = (value: string) => void setParams({ q: value });
  const setFilter = (value: "tradable" | "hold") => void setParams({ filter: value });
  const setSort = (value: string) =>
    void setParams({ sort: value as (typeof sellSearchParams.sort)["defaultValue"] });
  const setSelected = (next: string[]) => void setParams({ picks: next });

  const focusRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { pending, bulkList } = useListingWrites();

  const items = useMemo(() => {
    return data.inventory
      .filter((item) => (game === "cs2" ? item.game === "cs2" : item.game === game))
      .filter((item) =>
        `${item.name} ${item.wear} ${item.float} ${item.rarity}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .sort((left, right) =>
        sort === "highest" ? right.price - left.price : left.price - right.price,
      );
  }, [data.inventory, game, query, sort]);

  const focus = data.inventory.find((item) => selected.includes(item.id)) ?? data.inventory[0];

  const toggleItem = (id: string, checked: boolean) =>
    setSelected(
      checked ? [...new Set([...selected, id])] : selected.filter((itemId) => itemId !== id),
    );

  const handleBulkList = (discount = 0) => {
    const ids = selected.length > 0 ? selected : focus ? [focus.id] : [];
    bulkList(ids, discount, () => setSelected([]));
  };

  const tradableCount = data.inventory.length;
  const holdCount = Math.max(0, data.totalInventory - data.inventory.length);

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <SellTelemetry />
        <SellerHero
          game={game}
          setGame={setGame}
          filter={filter}
          setFilter={setFilter}
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          selected={selected}
          onSelectAll={() => setSelected(items.map((item) => item.id))}
          onBulkList={handleBulkList}
          pending={pending}
          tradableCount={tradableCount}
          holdCount={holdCount}
          gameCounts={data.gameCounts}
        />
      </main>

      <SellerGuideBanner steam={data.steam} />

      <section className="w-full px-margin-desktop py-space-lg">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
          <div className="lg:col-span-7">
            <InventoryList
              items={items}
              selected={selected}
              onToggle={toggleItem}
              game={game}
              totalInventory={data.totalInventory}
              readyToList={data.readyToList}
              steam={data.steam}
            />
          </div>
          <div ref={focusRef} className="scroll-mt-24 lg:col-span-5">
            {focus ? (
              <ListingFocus key={focus.id} item={focus} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 bg-surface-card/40 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-highest text-text-muted">
                  <Icon name="touch_app" className="text-[24px]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-headline-sm text-sm font-semibold text-text-primary uppercase">No Item Focused</span>
                  <span className="max-w-xs font-body-sm text-xs text-text-secondary">
                    Select any item from your backpack to configure floor pricing, instant bot liquidation, and counter-offers.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ActiveListings data={data} onRefresh={() => router.refresh()} />

      <section id="trade-up" className="w-full scroll-mt-20 border-t border-white/6 bg-surface-deep/30 px-margin-desktop py-space-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-lg">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-space-sm">
              <span className="rounded border border-primary/30 bg-primary/20 px-2 py-0.5 font-label-badge text-[10px] font-bold tracking-widest text-primary uppercase">
                Trade-Up Forge
              </span>
              <span className="rounded bg-surface-container-highest px-2 py-0.5 font-data-mono-md text-[10px] text-secondary">
                10-SLOT PRO CONVERTER
              </span>
            </div>
            <h2 className="font-headline-xl text-xl font-bold tracking-tight text-text-primary uppercase lg:text-2xl">
              Contract Chamber & Float Forge
            </h2>
            <p className="max-w-3xl font-body-md text-xs leading-relaxed text-text-secondary sm:text-sm">
              Commit ten weapons of identical grade to forge higher-tier classified or covert outcomes. Calculated mathematically with real-time float simulation and instant escrow liquidation.
            </p>
          </div>

          <TradeUpChamber contract={contract} className="mt-0 px-0" />
        </div>
      </section>

      <OffersInbox offers={offers} />
      <SellGuarantee />
      <SiteFooter />
    </div>
  );
}
