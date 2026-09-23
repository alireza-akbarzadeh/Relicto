import "server-only";
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
 */
export async function getItem(slug: string): Promise<ItemDetail | null> {
  return AUTHORED[slug] ?? (await itemService.detail(slug));
}

/**
 * The mobile inspector for items that have an authored mobile design, with the
 * market facts live. Other items use the responsive desktop view on phones.
 */
export async function getItemMobile(slug: string): Promise<ItemMobile | null> {
  const authored = MOBILE[slug];
  return authored ? itemService.mobile(authored, await requireUserId()) : null;
}
