import "server-only";
import type { TrackingMobile } from "../mobile.types";
import type { OrderTracking } from "../types";
import { tracking } from "./tracking.mock";
import { trackingMobile } from "./tracking-mobile.mock";

const orderCode = (orderId: string, fallback: string) => (orderId ? `#${orderId.replace(/^#/, "").toUpperCase()}` : fallback);

/** Live escrow state for one order. Mock today; swap for the orders API later. */
export async function getOrderTracking(orderId: string): Promise<OrderTracking> {
  return { ...tracking, code: orderCode(orderId, tracking.code) };
}

/** The mobile tracker's view of the same order. */
export async function getOrderTrackingMobile(orderId: string): Promise<TrackingMobile> {
  return { ...trackingMobile, code: orderCode(orderId, trackingMobile.code) };
}
