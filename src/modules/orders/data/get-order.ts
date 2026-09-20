import "server-only";
import type { OrderTracking } from "../types";
import { tracking } from "./tracking.mock";

/** Live escrow state for one order. Mock today; swap for the orders API later. */
export async function getOrderTracking(orderId: string): Promise<OrderTracking> {
  return { ...tracking, code: orderId ? `#${orderId.replace(/^#/, "").toUpperCase()}` : tracking.code };
}
