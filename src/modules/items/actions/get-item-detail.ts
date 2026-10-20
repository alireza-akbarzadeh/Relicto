"use server";

import { getItem } from "../data/get-item";
import type { ItemDetail } from "../types";

/**
 * Server action to fetch comprehensive ItemDetail for Quick Pick and client modal inspectors.
 */
export async function getItemDetailAction(slug: string): Promise<ItemDetail | null> {
  if (!slug) return null;
  return await getItem(slug);
}
