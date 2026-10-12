import "server-only";

import type { ItemMobile } from "@/modules/items/mobile.types";
import type { ItemDetail } from "@/modules/items/types";
import { offerService } from "../offers/offers.service";
import { toSellerBook, type SellerBook } from "./items.book";
import { toItemMobile } from "./items-mobile.presenter";
import { toItemDetail } from "./items.presenter";
import * as repository from "./items.repository";
import type { SellerRow } from "./items.repository";

import { watchlistService } from "../watchlist/watchlist.service";

/** The copies the viewer can buy or bid on, with their open bids attached. A guest sees every copy and has no bids. */
async function book(sellers: SellerRow[], viewerId: string | null): Promise<SellerBook> {
  if (!viewerId) return toSellerBook(sellers, null, {});
  const others = sellers.filter((row) => row.listing.sellerId !== viewerId).map((row) => row.listing.id);
  return toSellerBook(sellers, viewerId, await offerService.bids(viewerId, others));
}

export const itemService = {
  /** Full detail page for a catalog item, or null when the slug is unknown. */
  async detail(slug: string, viewerId: string | null): Promise<ItemDetail | null> {
    const item = await repository.findItemBySlug(slug);
    if (!item) return null;

    const [sellers, styles, history, related, watcherMap] = await Promise.all([
      repository.findItemSellers(item.id),
      repository.findItemStyles(item.id),
      repository.findPriceHistory(item.id),
      repository.findRelatedItems(item.slug, item.gameId),
      watchlistService.watchers([item.slug]),
    ]);

    // Price facts cover every copy on the market; the book only what the viewer can buy.
    const listings = sellers.map((row) => row.listing);
    const watchers = watcherMap.get(item.slug) ?? 0;
    return toItemDetail(item, listings, await book(sellers, viewerId), styles, history, related, watchers);
  },

  /**
   * The live seller book alone, for hand-authored pages whose sample sellers
   * can't be bought from. Null when the item isn't in the catalog.
   */
  async book(slug: string, viewerId: string | null): Promise<SellerBook | null> {
    const item = await repository.findItemBySlug(slug);
    if (!item) return null;
    return book(await repository.findItemSellers(item.id), viewerId);
  },

  /** An authored mobile inspector with live floor, move and seller book for the viewer. */
  async mobile(authored: ItemMobile, viewerId: string | null): Promise<ItemMobile> {
    const item = await repository.findItemBySlug(authored.slug);
    if (!item) return authored;
    const [sellers, watcherMap] = await Promise.all([
      repository.findItemSellers(item.id),
      watchlistService.watchers([authored.slug]),
    ]);
    const watchers = watcherMap.get(authored.slug) ?? 0;
    const others = viewerId ? sellers.filter((row) => row.listing.sellerId !== viewerId).map((row) => row.listing.id) : [];
    const bids = viewerId ? await offerService.bids(viewerId, others) : {};
    return toItemMobile(authored, sellers, viewerId, watchers, bids);
  },

  async exists(slug: string) {
    return (await repository.findItemBySlug(slug)) !== null;
  },
};
