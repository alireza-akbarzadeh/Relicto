"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { OffersInbox } from "@/modules/offers/components/offers-inbox";
import type { IncomingOffer } from "@/modules/offers/types";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { useListingWrites } from "../hooks/use-listing-writes";
import { sellSearchParams } from "../lib/search-params";
import type { SellData, SellGame } from "../types";
import { ActiveListings } from "./active-listings";
import { InventoryList } from "./inventory-list";
import { ListingFocus } from "./listing-focus";
import { SellGuarantee } from "./sell-guarantee";
import { SellTelemetry } from "./sell-telemetry";
import { SellerHero } from "./seller-hero";

export function SellView({ data, offers }: { data: SellData; offers: IncomingOffer[] }) {
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
            {focus ? <ListingFocus key={focus.id} item={focus} /> : null}
          </div>
        </div>
      </section>

      <ActiveListings data={data} onRefresh={() => router.refresh()} />
      <OffersInbox offers={offers} />
      <SellGuarantee />
      <SiteFooter />
    </div>
  );
}
