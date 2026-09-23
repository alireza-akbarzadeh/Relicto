import "server-only";

import { eq } from "drizzle-orm";
import { listings, orders, tradeOffers } from "@/lib/db/schema";
import { draft } from "../notifications/notifications.catalog";
import { notificationService } from "../notifications/notifications.service";
import type { Executor } from "../notifications/notifications.repository";
import { usd } from "../wallet/wallet.presenter";
import * as repo from "./escrow.repository";

/**
 * Unwinds an open escrow: the order is cancelled, the listing goes back on
 * sale, the buyer is refunded, and both sides are told. Shared by the bot
 * webhook, the buyer's own cancel and the expiry sweep, so all three refund
 * the same way.
 */
export async function applyCancel(tx: Executor, locked: repo.LockedOrder, reason: string) {
  const { order, line } = locked;
  const now = new Date();

  await tx.update(orders).set({ state: "cancelled", completedAt: now }).where(eq(orders.id, order.id));
  if (line.listingId) await tx.update(listings).set({ status: "active" }).where(eq(listings.id, line.listingId));
  await tx.update(tradeOffers).set({ status: "declined" }).where(eq(tradeOffers.orderId, order.id));
  await repo.setStep(tx, order.id, 2, {
    state: "done", occurredAt: now, title: "Escrow Cancelled",
    body: `${reason} ${usd(order.totalCents)} returned to your vault.`,
  });
  await repo.queueAfter(tx, order.id, 2);

  await repo.settleDebit(tx, order.id);
  await repo.post(tx, {
    id: `ledger-chk-${order.code.toLowerCase()}-refund`, userId: order.buyerId, orderId: order.id,
    direction: "credit", kind: "refund", amountCents: order.totalCents, status: "settled", venue: "steam-escrow",
    title: "Escrow Refund", assetLabel: line.nameSnapshot, detailLabel: reason, nodeLabel: order.counterpartyName,
    occurredAt: now,
  });

  const shared = { code: order.code, item: line.nameSnapshot, refundCents: order.totalCents, reason };
  return notificationService.record(tx, [
    draft.orderCancelled({ ...shared, userId: order.buyerId, role: "buyer" }),
    ...(order.sellerId ? [draft.orderCancelled({ ...shared, userId: order.sellerId, role: "seller" })] : []),
  ]);
}
