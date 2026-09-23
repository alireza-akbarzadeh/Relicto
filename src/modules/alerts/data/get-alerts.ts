import "server-only";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { alertService } from "@/server/modules/alerts/alerts.service";
import type { AlertsMobile } from "../mobile.types";
import type { PriceAlert } from "../types";
import { alerts } from "./alerts.mock";
import { alertsMobile } from "./alerts-mobile.mock";

/**
 * Price rules for the signed-in trader, from Postgres. Falls back to the sample
 * rules until the account has any of its own.
 */
export async function getAlerts(): Promise<PriceAlert[]> {
  const live = await alertService.list(await requireUserId());
  return live.length > 0 ? live : alerts;
}

/** Mobile sniper terminal: the same rules as desktop, with live floors, price lines and push status. */
export async function getAlertsMobile(): Promise<AlertsMobile> {
  return (await alertService.mobile(await requireUserId(), alertsMobile)) ?? alertsMobile;
}
