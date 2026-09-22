import "server-only";
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

/** The mobile inspector's payload for the same item, when one exists. */
export async function getItemMobile(slug: string): Promise<ItemMobile | null> {
  return MOBILE[slug] ?? null;
}
