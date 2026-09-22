import "server-only";
import { orderService } from "@/server/modules/orders/orders.service";
import type { TrackingMobile } from "../mobile.types";
import type { OrderTracking } from "../types";
import { tracking } from "./tracking.mock";
import { trackingMobile } from "./tracking-mobile.mock";

const orderCode = (orderId: string, fallback: string) => (orderId ? `#${orderId.replace(/^#/, "").toUpperCase()}` : fallback);

/**
 * Live escrow state for one order, from Postgres. Unknown codes fall back to
 * the sample escrow so the tracker demo still runs on an unseeded database.
 */
export async function getOrderTracking(orderId: string): Promise<OrderTracking> {
  const live = await orderService.tracking(orderId);
  return live ?? { ...tracking, code: orderCode(orderId, tracking.code) };
}

/** The mobile tracker's view of the same order. */
export async function getOrderTrackingMobile(orderId: string): Promise<TrackingMobile> {
  return { ...trackingMobile, code: orderCode(orderId, trackingMobile.code) };
}
