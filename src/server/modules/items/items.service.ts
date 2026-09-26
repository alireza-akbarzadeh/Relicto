import "server-only";

import type { ItemMobile } from "@/modules/items/mobile.types";
import type { ItemDetail } from "@/modules/items/types";
import { offerService } from "../offers/offers.service";
import { toSellerBook, type SellerBook } from "./items.book";
import { toItemMobile } from "./items-mobile.presenter";
import { toItemDetail } from "./items.presenter";
import * as repository from "./items.repository";
import type { SellerRow } from "./items.repository";

/** The copies the viewer can buy or bid on, with their open bids attached. */
async function book(sellers: SellerRow[], viewerId: string): Promise<SellerBook> {
  const others = sellers.filter((row) => row.listing.sellerId !== viewerId).map((row) => row.listing.id);
  return toSellerBook(sellers, viewerId, await offerService.bids(viewerId, others));
}

export const itemService = {
  /** Full detail page for a catalog item, or null when the slug is unknown. */
  async detail(slug: string, viewerId: string): Promise<ItemDetail | null> {
    const item = await repository.findItemBySlug(slug);
    if (!item) return null;

    const [sellers, styles, history, related] = await Promise.all([
      repository.findItemSellers(item.id),
      repository.findItemStyles(item.id),
      repository.findPriceHistory(item.id),
      repository.findRelatedItems(item.slug, item.gameId),
    ]);

    // Price facts cover every copy on the market; the book only what the viewer can buy.
    const listings = sellers.map((row) => row.listing);
    return toItemDetail(item, listings, await book(sellers, viewerId), styles, history, related);
  },

  /**
   * The live seller book alone, for hand-authored pages whose sample sellers
   * can't be bought from. Null when the item isn't in the catalog.
   */
  async book(slug: string, viewerId: string): Promise<SellerBook | null> {
    const item = await repository.findItemBySlug(slug);
    if (!item) return null;
    return book(await repository.findItemSellers(item.id), viewerId);
  },

  /** An authored mobile inspector with live floor, move and seller book for the viewer. */
  async mobile(authored: ItemMobile, viewerId: string): Promise<ItemMobile> {
    const item = await repository.findItemBySlug(authored.slug);
    if (!item) return authored;
    return toItemMobile(authored, await repository.findItemSellers(item.id), viewerId);
  },

  async exists(slug: string) {
    return (await repository.findItemBySlug(slug)) !== null;
  },
};
