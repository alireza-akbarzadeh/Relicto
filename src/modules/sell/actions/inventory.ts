"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { parseSteamInput } from "@/lib/steam/steam-id";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { seedTestBackpack } from "@/server/modules/inventory-sync/inventory-test-seed";
import { inventorySyncService, type SyncResult } from "@/server/modules/inventory-sync/inventory-sync.service";

/** The studio's Sync button: pull the trader's Steam inventory now (at most once a minute). */
export async function syncSteamInventory(): Promise<SyncResult> {
  const userId = await requireUserId();
  const result = await inventorySyncService.sync(userId, { force: true });
  revalidatePath("/sell");
  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return result;
}

/** Links a SteamID64 or Trade URL to the trader's profile and immediately synchronizes backpack. */
export async function linkSteamAccountAction(input: string): Promise<{ ok: boolean; error?: string; sync?: SyncResult }> {
  const userId = await requireUserId();
  const parsed = parseSteamInput(input);
  if (!parsed.steamId) {
    return { ok: false, error: parsed.error ?? "Invalid Steam account format." };
  }

  const updates: Partial<typeof profiles.$inferInsert> = {
    steamId: parsed.steamId,
    updatedAt: new Date(),
  };
  if (parsed.tradeUrl) {
    updates.tradeUrl = parsed.tradeUrl;
  }

  await db.update(profiles).set(updates).where(eq(profiles.userId, userId));

  const sync = await inventorySyncService.sync(userId, { force: true });
  revalidatePath("/sell");
  revalidatePath("/profile");
  revalidatePath("/", "layout");

  return { ok: true, sync };
}

/** Instant test action: seeds a full CS2/Dota2 tradable backpack for immediate selling tests. */
export async function seedTestInventoryAction(): Promise<{ ok: boolean; count: number; totalValueUsd: number }> {
  const userId = await requireUserId();
  const res = await seedTestBackpack(userId);
  revalidatePath("/sell");
  revalidatePath("/profile");
  revalidatePath("/", "layout");
  return { ok: true, ...res };
}
