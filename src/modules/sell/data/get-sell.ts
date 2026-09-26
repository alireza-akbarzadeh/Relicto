import "server-only";
import { after } from "next/server";
import { cache } from "react";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { inventorySyncService } from "@/server/modules/inventory-sync/inventory-sync.service";
import { sellService } from "@/server/modules/sell/sell.service";
import { tradeUpService } from "@/server/modules/trade-ups/trade-ups.service";
import type { SellMobile } from "../mobile.types";
import type { SellData, SteamSync } from "../types";
import { sell } from "./sell.mock";
import { sellMobile } from "./sell-mobile.mock";

/**
 * Keeps the studio's mirror of the trader's Steam inventory current. The very
 * first visit waits for the pull, so a new trader lands on their own items;
 * after that a stale mirror refreshes behind the response. Cached per request,
 * so the desktop and mobile loaders share one pull.
 */
const steamMirror = cache(async (userId: string): Promise<SteamSync> => {
  const before = await inventorySyncService.status(userId);
  if (!before.linked) return before;
  if (before.status === null) {
    await inventorySyncService.sync(userId);
    return inventorySyncService.status(userId);
  }
  after(() => inventorySyncService.refreshIfStale(userId));
  return before;
});

/**
 * Seller studio for the signed-in trader, from Postgres. A Steam trader always
 * sees their own studio, even an empty one; only accounts without Steam fall
 * back to the sample studio until they have inventory.
 */
export async function getSell(): Promise<SellData> {
  const userId = await requireUserId();
  const steam = await steamMirror(userId);
  const studio = await sellService.studio(userId);
  return steam.linked || studio.inventory.length > 0 ? { ...studio, steam } : sell;
}

/** Mobile studio: live vault totals, cashout tray and trade-up chamber, each falling back to its sample. */
export async function getSellMobile(): Promise<SellMobile> {
  const userId = await requireUserId();
  await steamMirror(userId);
  const [studio, contract] = await Promise.all([
    sellService.mobile(userId, sellMobile),
    tradeUpService.contract(userId, sellMobile.contract.bot),
  ]);
  return { ...(studio ?? sellMobile), contract: contract ?? sellMobile.contract };
}
