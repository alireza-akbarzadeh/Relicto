import "server-only";
import { rethrowNextSignals } from "@/lib/next-signals";
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
  const userId = await requireUserId();
  try {
    const live = await alertService.list(userId);
    return live.length > 0 ? live : alerts;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getAlerts] Fallback to mock:", err);
    return alerts;
  }
}

/** Mobile sniper terminal: the same rules as desktop, with live floors, price lines and push status. */
export async function getAlertsMobile(): Promise<AlertsMobile> {
  const userId = await requireUserId();
  try {
    return (await alertService.mobile(userId, alertsMobile)) ?? alertsMobile;
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getAlertsMobile] Fallback to mock:", err);
    return alertsMobile;
  }
}
