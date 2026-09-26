"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { inventorySyncService } from "@/server/modules/inventory-sync/inventory-sync.service";

/** The studio's Sync button: pull the trader's Steam inventory now (at most once a minute). */
export async function syncSteamInventory() {
  const result = await inventorySyncService.sync(await requireUserId(), { force: true });
  if (result.status === "ok") revalidatePath("/", "layout");
  return result;
}
