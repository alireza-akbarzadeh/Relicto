import "server-only";
import type { AlertsMobile } from "../mobile.types";
import { alerts } from "./alerts.mock";
import { alertsMobile } from "./alerts-mobile.mock";

export async function getAlerts() {
  return alerts;
}

/** Mobile sniper terminal: telemetry, trigger rules and dispatch channels. */
export async function getAlertsMobile(): Promise<AlertsMobile> {
  return alertsMobile;
}
