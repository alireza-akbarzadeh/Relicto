import "server-only";

import { randomInt } from "node:crypto";
import { db } from "@/lib/db";
import { tradeOffers } from "@/lib/db/schema";
import { mockPaymentsEnabled } from "../checkout/checkout.payment";
import { draft } from "../notifications/notifications.catalog";
import type { NotificationRow } from "../notifications/notifications.repository";
import { notificationService } from "../notifications/notifications.service";
import * as repo from "./escrow.repository";

/**
 * Peer-to-peer fulfilment, until Relicto runs its own escrow bots: the seller
 * sends the Steam trade offer from their own account and says so here; the
 * buyer accepts it in Steam and confirms receipt, which completes the order
 * through the same `delivered` transition the bot webhook uses.
 */

export type P2PResult =
  | { status: "applied"; notices: NotificationRow[] }
  | { status: "not-found" | "unchanged" | "not-sent" | "test-mode-off" };

/** "https://steamcommunity.com/tradeoffer/6012345678/" or a bare id → the offer id. */
export function parseOfferRef(ref: string) {
  const trimmed = ref.trim();
  const id = trimmed.match(/tradeoffer\/(\d{6,})/)?.[1] ?? (/^\d{6,}$/.test(trimmed) ? trimmed : null);
  return id ? { id, url: `https://steamcommunity.com/tradeoffer/${id}/` } : null;
}

/** The seller sent the trade offer. The buyer is told to accept it in Steam. */
export async function markDispatched(code: string, sellerId: string, offerId: string): Promise<P2PResult> {
  return db.transaction(async (tx): Promise<P2PResult> => {
    const locked = await repo.lockOrder(tx, code);
    if (!locked || locked.order.sellerId !== sellerId) return { status: "not-found" };
    const { order, line } = locked;
    if (order.state !== "escrow" || (await repo.hasDispatchedOffer(tx, order.id))) return { status: "unchanged" };

    const row = {
      id: `${order.id}-offer`,
      orderId: order.id,
      steamOfferId: offerId,
      botName: null,
      offerUrl: `https://steamcommunity.com/tradeoffer/${offerId}/`,
      status: "sent" as const,
    };
    await tx.insert(tradeOffers).values(row).onConflictDoUpdate({ target: tradeOffers.id, set: row });

    const now = new Date();
    await repo.setStep(tx, order.id, 2, { state: "done", occurredAt: now, body: "The seller sent the Steam trade offer." });
    await repo.setStep(tx, order.id, 3, {
      state: "active",
      occurredAt: now,
      body: `Steam trade offer #${offerId} is waiting in your Steam account. Accept it, then confirm receipt here.`,
    });

    return {
      status: "applied",
      notices: await notificationService.record(tx, [
        draft.tradeOfferSent({ code: order.code, item: line.nameSnapshot, buyerId: order.buyerId, token: null }),
      ]),
    };
  });
}

/** Whether the buyer may confirm: their order, and the seller has sent the offer. */
export async function canConfirm(code: string, buyerId: string) {
  return db.transaction(async (tx) => {
    const locked = await repo.lockOrder(tx, code);
    if (!locked || locked.order.buyerId !== buyerId) return "not-found" as const;
    if (locked.order.state !== "escrow") return "unchanged" as const;
    return (await repo.hasDispatchedOffer(tx, locked.order.id)) ? ("ok" as const) : ("not-sent" as const);
  });
}

/**
 * Test mode only: the buyer plays the seller's part, so one person can walk an
 * order to completion against the seeded sellers. The same switch as mock
 * payments — never available in production unless deliberately enabled.
 */
export async function simulateDispatch(code: string, buyerId: string): Promise<P2PResult> {
  if (!mockPaymentsEnabled()) return { status: "test-mode-off" };
  const row = await repo.lockOrder(db, code);
  if (!row || row.order.buyerId !== buyerId || !row.order.sellerId) return { status: "not-found" };
  return markDispatched(code, row.order.sellerId, String(randomInt(1_000_000_000, 9_999_999_999)));
}

/** Test mode is a property of the environment, surfaced so the tracker can offer the simulator. */
export const p2pTestMode = mockPaymentsEnabled;
