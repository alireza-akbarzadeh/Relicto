import "server-only";
import { cache } from "react";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { itemService } from "@/server/modules/items/items.service";
import type { ItemMobile } from "../mobile.types";
import type { ItemDetail } from "../types";
import { manifoldParadox } from "./manifold-paradox.mock";
import { manifoldParadoxMobile } from "./manifold-paradox.mobile.mock";

/** Hand-authored pages (full lore, replay, engine mods) take precedence. */
const AUTHORED: Record<string, ItemDetail> = { [manifoldParadox.slug]: manifoldParadox };
const MOBILE: Record<string, ItemMobile> = { [manifoldParadoxMobile.slug]: manifoldParadoxMobile };

/**
 * One item page. Authored detail where it exists, otherwise built from the
 * catalog — so every marketplace card resolves instead of 404ing.
 *
 * An authored page keeps its lore and art but trades on the live seller book:
 * its sample sellers can't be bought from or bid on. The book stays authored
 * only when the catalog doesn't carry the item at all.
 */
export const getItem = cache(async (slug: string): Promise<ItemDetail | null> => {
  const viewerId = await requireUserId();
  const authored = AUTHORED[slug];
  if (!authored) return itemService.detail(slug, viewerId);

  const book = await itemService.book(slug, viewerId);
  return book ? { ...authored, ...book } : authored;
});

/**
 * The mobile inspector for items that have an authored mobile design, with the
 * market facts live. Other items use the responsive desktop view on phones.
 */
export async function getItemMobile(slug: string): Promise<ItemMobile | null> {
  const authored = MOBILE[slug];
  return authored ? itemService.mobile(authored, await requireUserId()) : null;
}
