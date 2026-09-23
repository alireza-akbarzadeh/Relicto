import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { sellService } from "@/server/modules/sell/sell.service";
import { tradeUpService } from "@/server/modules/trade-ups/trade-ups.service";
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

/** Mobile studio: live vault totals, cashout tray and trade-up chamber, each falling back to its sample. */
export async function getSellMobile(): Promise<SellMobile> {
  const userId = await requireUserId();
  const [studio, contract] = await Promise.all([
    sellService.mobile(userId, sellMobile),
    tradeUpService.contract(userId, sellMobile.contract.bot),
  ]);
  return { ...(studio ?? sellMobile), contract: contract ?? sellMobile.contract };
}
