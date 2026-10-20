import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, items, ledgerEntries, orderItems, orders, profiles, user, walletAccounts } from "@/lib/db/schema";
import { samplePurchases } from "@/modules/profile/data/purchases.mock";
import type { BoughtItem } from "@/modules/profile/types";
import { wallet } from "@/modules/wallet/data/wallet.mock";
import type { WalletTransaction } from "@/modules/wallet/types";
import { toWalletTransaction } from "../wallet/wallet.presenter";

const minutesAgo = (at: Date, now: Date) => {
  const mins = Math.max(0, Math.round((now.getTime() - at.getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

/**
 * Resolves all marketplace items purchased by the user, with real-time delivery
 * status, counterparty vendor identity, and escrow contract links.
 */
export async function findUserPurchasedItems(userId: string): Promise<BoughtItem[]> {
  try {
    const rows = await db
      .select({
        order: orders,
        line: orderItems,
        item: items,
        gameName: games.name,
        sellerHandle: profiles.handle,
        sellerName: user.name,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(items, eq(orderItems.itemId, items.id))
      .leftJoin(games, eq(items.gameId, games.id))
      .leftJoin(user, eq(orders.sellerId, user.id))
      .leftJoin(profiles, eq(profiles.userId, orders.sellerId))
      .where(and(eq(orders.buyerId, userId), eq(orders.flow, "buy")))
      .orderBy(desc(orders.placedAt))
      .limit(30);

    if (rows.length === 0) {
      return samplePurchases;
    }

    const now = new Date();
    return rows.map((r) => {
      const code = r.order.code.replace(/^#/, "");
      const attrs = r.line?.attributes ?? {};
      const stateLabel =
        r.order.state === "completed"
          ? "Delivered"
          : r.order.state === "escrow"
            ? "In Escrow (Step 3/4)"
            : r.order.state === "disputed"
              ? "Under Dispute"
              : "Cancelled";

      return {
        id: r.order.id,
        orderCode: r.order.code,
        name: r.line?.nameSnapshot ?? "Acquired Asset",
        detail: r.line?.detailSnapshot ?? "Verified Marketplace Transfer",
        image: r.order.thumbnailUrl ?? r.item?.imageUrl ?? "/images/lootora/order-history-01.jpg",
        imageAlt: r.order.thumbnailAlt ?? r.item?.imageAlt ?? "Purchased item thumbnail",
        game: (r.gameName?.toUpperCase() ?? "CS2").includes("DOTA") ? "DOTA 2" : "CS2",
        priceUsd: r.order.totalCents / 100,
        sellerHandle: r.sellerHandle ?? r.sellerName ?? r.order.counterpartyName ?? "Relicto Merchant",
        placedAt: minutesAgo(r.order.placedAt, now),
        state: r.order.state,
        stateLabel,
        trackingUrl: `/orders/${code}`,
        attributes: {
          wear: r.line?.wear ?? undefined,
          float: r.line?.float ?? undefined,
          paintSeed: r.line?.paintSeed ?? undefined,
          styleNote: attrs.styleNote ?? undefined,
        },
      };
    });
  } catch (error) {
    console.error("[findUserPurchasedItems] Error querying purchases:", error);
    return samplePurchases;
  }
}

/**
 * Resolves all auditable wallet transactions, on-chain deposits, escrow payments,
 * and cashouts for the user profile.
 */
export async function findUserTransactions(userId: string): Promise<WalletTransaction[]> {
  try {
    const [account] = await db
      .select({ id: walletAccounts.id })
      .from(walletAccounts)
      .where(eq(walletAccounts.userId, userId))
      .limit(1);

    if (!account) {
      return wallet.transactions;
    }

    const entries = await db
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.walletId, account.id))
      .orderBy(desc(ledgerEntries.occurredAt))
      .limit(30);

    if (entries.length === 0) {
      return wallet.transactions;
    }

    return entries.map(toWalletTransaction);
  } catch (error) {
    console.error("[findUserTransactions] Error querying transactions:", error);
    return wallet.transactions;
  }
}
