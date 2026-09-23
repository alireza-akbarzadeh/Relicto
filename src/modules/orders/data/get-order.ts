import "server-only";
import { notFound } from "next/navigation";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { orderService } from "@/server/modules/orders/orders.service";
import type { TrackingMobile } from "../mobile.types";
import type { OrderTracking } from "../types";
import { tracking } from "./tracking.mock";
import { trackingMobile } from "./tracking-mobile.mock";

const orderCode = (orderId: string, fallback: string) => (orderId ? `#${orderId.replace(/^#/, "").toUpperCase()}` : fallback);

/**
 * Live escrow state for one of the viewer's orders. Someone else's code is a
 * 404, exactly like a code that doesn't exist, so codes can't be probed. The
 * sample escrow only stands in on a database nobody has seeded.
 */
export async function getOrderTracking(orderId: string): Promise<OrderTracking> {
  const live = await orderService.tracking(orderId, await requireUserId());
  if (live) return live;
  if (await orderService.hasOrders()) notFound();
  return { ...tracking, code: orderCode(orderId, tracking.code) };
}

/** The mobile tracker's view of the same order. */
export async function getOrderTrackingMobile(orderId: string): Promise<TrackingMobile> {
  return { ...trackingMobile, code: orderCode(orderId, trackingMobile.code) };
}
