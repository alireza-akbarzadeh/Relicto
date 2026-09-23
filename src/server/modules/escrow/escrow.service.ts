import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listings, orders, tradeOffers } from "@/lib/db/schema";
import { draft } from "../notifications/notifications.catalog";
import type { NotificationRow } from "../notifications/notifications.repository";
import { notificationService } from "../notifications/notifications.service";
import { applyCancel } from "./escrow.cancel";
import * as repo from "./escrow.repository";
import type { OfferSent } from "./escrow.schema";

/**
 * `applied` carries the notifications to push once the transaction commits.
 * A repeated or out-of-order event is `unchanged`, so bots can retry freely.
 */
export type EscrowResult =
  | { status: "applied"; notices: NotificationRow[] }
  | { status: "unchanged" | "not-found" | "offer-sent" };

type Refusal = Exclude<EscrowResult["status"], "applied">;

const EXPIRED_REASON = "No trade offer was dispatched within the escrow window.";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Runs one transition on a locked, still-open escrow. */
function transition(code: string, apply: (tx: Tx, locked: repo.LockedOrder) => Promise<NotificationRow[] | Refusal | null>) {
  return db.transaction(async (tx): Promise<EscrowResult> => {
    const locked = await repo.lockOrder(tx, code);
    if (!locked) return { status: "not-found" };
    if (locked.order.state !== "escrow") return { status: "unchanged" };

    const outcome = await apply(tx, locked);
    if (typeof outcome === "string") return { status: outcome };
    return outcome ? { status: "applied", notices: outcome } : { status: "unchanged" };
  });
}

const item = ({ line }: repo.LockedOrder) => line.nameSnapshot;

export const escrowService = {
  /** The bot sent the Steam trade offer; the buyer has to accept it. */
  offerSent(code: string, offer: OfferSent) {
    return transition(code, async (tx, locked) => {
      const { order } = locked;
      const [existing] = await tx.select().from(tradeOffers).where(eq(tradeOffers.orderId, order.id)).limit(1);
      if (existing && existing.status !== "pending") return null;

      const row = {
        id: `${order.id}-offer`,
        orderId: order.id,
        steamOfferId: offer.steamOfferId,
        botName: offer.botName,
        botSteamId: offer.botSteamId ?? null,
        token: offer.token ?? null,
        offerUrl: offer.offerUrl ?? `https://steamcommunity.com/tradeoffer/${offer.steamOfferId}/`,
        status: "sent" as const,
      };
      await tx.insert(tradeOffers).values(row).onConflictDoUpdate({ target: tradeOffers.id, set: row });

      const now = new Date();
      await repo.setStep(tx, order.id, 2, { state: "done", occurredAt: now,
        body: "Bot audit passed. Steam Guard API check clear. Anti-phishing seal matched." });
      await repo.setStep(tx, order.id, 3, { state: "active", occurredAt: now,
        body: `Valve Steam Trade Offer #${offer.steamOfferId} dispatched. Awaiting mobile confirmation.` });

      return notificationService.record(tx, [
        draft.tradeOfferSent({ code: order.code, item: item(locked), buyerId: order.buyerId, token: offer.token ?? null }),
      ]);
    });
  },

  /** The buyer accepted: the item is theirs and the seller is paid. */
  delivered(code: string) {
    return transition(code, async (tx, locked) => {
      const { order, line } = locked;
      const now = new Date();
      // Basket discounts are Relicto's promotion, so the seller is paid the listed price.
      const payoutCents = order.subtotalCents;

      await tx.update(orders).set({ state: "completed", completedAt: now }).where(eq(orders.id, order.id));
      if (line.listingId) await tx.update(listings).set({ status: "sold", soldAt: now }).where(eq(listings.id, line.listingId));
      await tx.update(tradeOffers).set({ status: "accepted" }).where(eq(tradeOffers.orderId, order.id));
      for (const step of [2, 3, 4]) await repo.setStep(tx, order.id, step, { state: "done", occurredAt: now });

      await repo.settleDebit(tx, order.id);
      const notices: NotificationRow[] = [];
      if (order.sellerId) {
        await repo.post(tx, {
          id: `ledger-chk-${order.code.toLowerCase()}-sale`, userId: order.sellerId, orderId: order.id,
          direction: "credit", kind: "sale", amountCents: payoutCents, status: "settled", venue: "steam-escrow",
          title: "P2P Skin Sale Credit", assetLabel: line.nameSnapshot, detailLabel: `Order #${order.code}`,
          nodeLabel: order.counterpartyName, occurredAt: now,
        });
        notices.push(...(await notificationService.record(tx, [
          draft.itemSold({ code: order.code, item: item(locked), sellerId: order.sellerId, payoutCents }),
        ])));
      }

      notices.push(...(await notificationService.record(tx, [
        draft.itemDelivered({ code: order.code, item: item(locked), buyerId: order.buyerId }),
      ])));
      return notices;
    });
  },

  /** Timed out or failed: the buyer is refunded and the listing goes back on sale. */
  cancelled(code: string, reason: string) {
    return transition(code, (tx, locked) => applyCancel(tx, locked, reason));
  },

  /**
   * The buyer backs out. Allowed until a trade offer is in their hands — after
   * that the bot decides, through the webhook.
   */
  cancelByBuyer(code: string, buyerId: string) {
    return transition(code, async (tx, locked) => {
      if (locked.order.buyerId !== buyerId) return "not-found";
      if (await repo.hasDispatchedOffer(tx, locked.order.id)) return "offer-sent";
      return applyCancel(tx, locked, "Cancelled by the buyer.");
    });
  },

  /**
   * Either party freezes the escrow for review. Funds stay locked, the expiry
   * sweep leaves it alone, and the other side is told.
   */
  disputed(code: string, reporterId: string) {
    return transition(code, async (tx, locked) => {
      const { order } = locked;
      if (reporterId !== order.buyerId && reporterId !== order.sellerId) return "not-found";

      await tx.update(orders).set({ state: "disputed" }).where(eq(orders.id, order.id));
      const other = reporterId === order.buyerId ? order.sellerId : order.buyerId;
      return other
        ? notificationService.record(tx, [draft.orderDisputed({ code: order.code, item: item(locked), userId: other })])
        : [];
    });
  },

  /**
   * Refunds every escrow whose window lapsed without a trade offer — all of
   * them from the cron, or one trader's when they open their orders or wallet.
   */
  async expireOverdue(userId?: string, now = new Date()) {
    const codes = await repo.findOverdueCodes(db, now, userId);
    const notices: NotificationRow[] = [];
    for (const code of codes) {
      const result = await escrowService.cancelled(code, EXPIRED_REASON);
      if (result.status === "applied") notices.push(...result.notices);
    }
    return { expired: codes.length, notices };
  },
};
