import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { sellService } from "@/server/modules/sell/sell.service";
import type { SellMobile } from "../mobile.types";
import type { SellData } from "../types";
import { sell } from "./sell.mock";
import { sellMobile } from "./sell-mobile.mock";

/**
 * Seller studio for the signed-in trader, from Postgres. Falls back to the
 * sample studio until the account has inventory of its own.
 */
export async function getSell(): Promise<SellData> {
  const studio = await sellService.studio(await requireUserId());
  return studio.inventory.length > 0 ? studio : sell;
}

/** Mobile studio: live vault totals and cashout tray; the trade-up contract stays authored for now. */
export async function getSellMobile(): Promise<SellMobile> {
  return (await sellService.mobile(await requireUserId(), sellMobile)) ?? sellMobile;
}
