import "server-only";
import { alerts } from "./alerts.mock";

export async function getAlerts() {
  return alerts;
}
