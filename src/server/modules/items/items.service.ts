import "server-only";

import type { ItemMobile } from "@/modules/items/mobile.types";
import type { ItemDetail } from "@/modules/items/types";
import { toItemMobile } from "./items-mobile.presenter";
import { toItemDetail } from "./items.presenter";
import * as repository from "./items.repository";

export const itemService = {
  /** Full detail page for a catalog item, or null when the slug is unknown. */
  async detail(slug: string): Promise<ItemDetail | null> {
    const item = await repository.findItemBySlug(slug);
    if (!item) return null;

    const [itemListings, styles, history, related] = await Promise.all([
      repository.findItemListings(item.id),
      repository.findItemStyles(item.id),
      repository.findPriceHistory(item.id),
      repository.findRelatedItems(item.slug, item.gameId),
    ]);

    return toItemDetail(item, itemListings, styles, history, related);
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
