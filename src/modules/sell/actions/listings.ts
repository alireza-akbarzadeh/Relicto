"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { bulkListInput, delistInput, listItemInput } from "@/server/modules/sell/sell.schema";
import { sellService } from "@/server/modules/sell/sell.service";

/** Lists an inventory item. Marketplace, profile and studio all change, so every page refreshes. */
export async function listInventoryItem(input: z.input<typeof listItemInput>) {
  const result = await sellService.list(await requireUserId(), listItemInput.parse(input));
  if (result.status === "listed") revalidatePath("/", "layout");
  return { status: result.status };
}

/** Bulk lists multiple selected inventory items at their floor / price. */
export async function bulkListInventory(input: z.input<typeof bulkListInput>) {
  const result = await sellService.bulkList(await requireUserId(), bulkListInput.parse(input));
  if (result.status === "listed") revalidatePath("/", "layout");
  return result;
}

/** Pulls one of the trader's active listings back to their inventory. */
export async function delistListing(input: z.input<typeof delistInput>) {
  const { listingId } = delistInput.parse(input);
  const ok = await sellService.delist(await requireUserId(), listingId);
  if (ok) revalidatePath("/", "layout");
  return { ok };
}
