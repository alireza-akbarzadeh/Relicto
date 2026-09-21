import "server-only";
import type { ItemMobile } from "../mobile.types";
import type { ItemDetail } from "../types";
import { manifoldParadox } from "./manifold-paradox.mock";
import { manifoldParadoxMobile } from "./manifold-paradox.mobile.mock";

const CATALOG: Record<string, ItemDetail> = { [manifoldParadox.slug]: manifoldParadox };
const MOBILE: Record<string, ItemMobile> = { [manifoldParadoxMobile.slug]: manifoldParadoxMobile };

/** One item page. Mock today; swap for the catalog API without touching the UI. */
export async function getItem(slug: string): Promise<ItemDetail | null> {
  return CATALOG[slug] ?? null;
}

/** The mobile inspector's payload for the same item, when one exists. */
export async function getItemMobile(slug: string): Promise<ItemMobile | null> {
  return MOBILE[slug] ?? null;
}
