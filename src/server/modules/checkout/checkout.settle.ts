import "server-only";

import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems, escrowEvents, items, ledgerEntries, listings, orderItems, orders, walletAccounts } from "@/lib/db/schema";
import { draft, type NotificationDraft } from "../notifications/notifications.catalog";
import type { NotificationRow } from "../notifications/notifications.repository";
import { notificationService } from "../notifications/notifications.service";
import { buildOrderRows, orderCode } from "./checkout.order-rows";
import { authorize, depositRow, isExternalRail, mockPaymentsEnabled, railLabel, VAULT_RAIL } from "./checkout.payment";
import { allocate, quote } from "@/modules/checkout/lib/pricing";
import { cartLinesWhere, LINE } from "./checkout.repository";

export type SettleInput = { rail: string; promo: boolean; cartIds: string[] };

export type SettleResult =
  /** `notices` are both sides' notifications, for push once the transaction has committed. */
  | { status: "placed"; codes: string[]; notices: NotificationRow[] }
  | { status: "rail-unavailable" | "empty" | "stale" | "insufficient-funds" | "vault-frozen" };

const key = (ids: string[]) => [...ids].sort().join("|");

/**
 * The vault always settles. Card, crypto and Steam settle through the mock
 * provider until a real one is chosen — and nowhere at all if mock payments
 * are off, which is the default in production.
 */
const canSettle = (rail: string) => rail === VAULT_RAIL || (isExternalRail(rail) && mockPaymentsEnabled());

/**
 * Turns the basket into one escrow order per line, paid from the vault. The
 * wallet and every basket listing are locked for the duration, so two tabs —
 * or two buyers — can't spend the same balance or reserve the same copy.
 */
export async function settle(userId: string, input: SettleInput): Promise<SettleResult> {
  if (!canSettle(input.rail)) return { status: "rail-unavailable" };

  return db.transaction(async (tx): Promise<SettleResult> => {
    const [wallet] = await tx.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).for("update");

    const lines = await tx
      .select(LINE)
      .from(cartItems)
      .innerJoin(listings, eq(cartItems.listingId, listings.id))
      .innerJoin(items, eq(listings.itemId, items.id))
      .where(cartLinesWhere(userId))
      .orderBy(asc(cartItems.createdAt))
      .for("update", { of: [cartItems, listings] });

    if (lines.length === 0) return { status: "empty" };

    // The buyer pays for exactly the basket they saw. A line added, dropped or
    // sold elsewhere since then means they need a fresh look first.
    const changed = key(input.cartIds) !== key(lines.map((line) => line.cartId));
    if (changed || lines.some((line) => line.listing.sellerId === userId)) return { status: "stale" };

    const prices = lines.map((line) => line.listing.priceCents);
    const due = quote(prices, input.promo);
    if (wallet?.frozenAt) return { status: "vault-frozen" };
    if (!wallet) return { status: "insufficient-funds" };

    const now = new Date();
    let balance = wallet.balanceCents;

    /*
     * An external rail is authorized by the mock provider and funds the vault
     * for exactly what's due, so the purchase debits below are the same rows a
     * vault payment writes. Nothing is charged — see checkout.payment.ts.
     */
    const auth = authorize(input.rail, due.dueCents);
    if (auth) {
      balance += due.dueCents;
      await tx.insert(ledgerEntries).values(
        depositRow({ walletId: wallet.id, auth, amountCents: due.dueCents, balanceAfterCents: balance, now }),
      );
    }

    if (balance < due.dueCents) return { status: "insufficient-funds" };

    const shares = allocate(prices, due.comboCents + due.promoCents);
    const codes: string[] = [];
    const drafts: NotificationDraft[] = [];

    for (const [index, line] of lines.entries()) {
      const totalCents = prices[index] - shares[index];
      const code = orderCode();
      balance -= totalCents;

      const rows = buildOrderRows(line, {
        buyerId: userId, code, totalCents, walletId: wallet.id, balanceAfterCents: balance, now,
        fundingLabel: railLabel(input.rail),
      });

      await tx.insert(orders).values(rows.order);
      await tx.insert(orderItems).values(rows.item);
      await tx.insert(escrowEvents).values(rows.events);
      await tx.insert(ledgerEntries).values(rows.debit);
      codes.push(code);
      drafts.push(
        draft.orderReceived({ code, item: line.name, sellerId: line.listing.sellerId, totalCents }),
        draft.orderPlaced({ code, item: line.name, buyerId: userId, totalCents }),
      );
    }

    await tx
      .update(listings)
      .set({ status: "reserved" })
      .where(inArray(listings.id, lines.map((line) => line.listing.id)));
    await tx.update(walletAccounts).set({ balanceCents: balance }).where(eq(walletAccounts.id, wallet.id));
    await tx.delete(cartItems).where(inArray(cartItems.id, lines.map((line) => line.cartId)));

    // Both sides hear about it in the same transaction, so a rolled-back order never notifies.
    const notices = await notificationService.record(tx, drafts);

    return { status: "placed", codes, notices };
  });
}
