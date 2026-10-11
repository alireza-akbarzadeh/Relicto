"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { isValidTradeUrl } from "@/lib/steam/trade-url";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { inventorySyncService } from "@/server/modules/inventory-sync/inventory-sync.service";

export type SaveSteamTradeUrlResult =
  | { success: true; tradeUrl: string }
  | { success: false; error: string };

export async function saveSteamTradeUrl(tradeUrl: string): Promise<SaveSteamTradeUrlResult> {
  const userId = await requireUserId();
  const trimmed = tradeUrl.trim();

  if (!isValidTradeUrl(trimmed)) {
    return {
      success: false,
      error: "Invalid Steam Trade URL. Please ensure it contains partner and token parameters.",
    };
  }

  await db
    .update(profiles)
    .set({ tradeUrl: trimmed })
    .where(eq(profiles.userId, userId));

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true, tradeUrl: trimmed };
}

export type ManualSyncResult =
  | { success: true; message: string; count: number }
  | { success: false; error: string };

export async function triggerManualSteamSync(): Promise<ManualSyncResult> {
  const userId = await requireUserId();
  const result = await inventorySyncService.sync(userId, { force: true });

  if (result.status === "ok") {
    revalidatePath("/profile");
    revalidatePath("/sell");
    return {
      success: true,
      message: `Synced ${result.itemCount} items from Steam.`,
      count: result.itemCount,
    };
  }

  const errorMessages: Record<string, string> = {
    "no-steam": "No Steam account linked. Sign in with Steam to link.",
    throttled: "Steam was synced recently. Please wait a moment before syncing again.",
    private: "Your Steam inventory is set to private. Make it public in Steam privacy settings.",
    "rate-limited": "Steam is rate limiting inventory queries. Please try again shortly.",
    unavailable: "Steam community servers are currently unreachable.",
  };

  return {
    success: false,
    error: errorMessages[result.status] ?? "Steam sync failed.",
  };
}
