import "server-only";

import type { CheckoutData, CheckoutItem } from "@/modules/checkout/types";
import { toCheckoutData, toCheckoutItem } from "./checkout.presenter";
import * as repo from "./checkout.repository";
import { settle, type SettleInput, type SettleResult } from "./checkout.settle";

/** `items` is null only before anything is seeded, when there is no server basket to reconcile with. */
export type AddResult = { status: "added" | "own-listing" | "not-listed"; items: CheckoutItem[] | null };

export const checkoutService = {
  /**
   * The trader's basket, priced, with the rails they can pay on. An empty
   * basket is real state; null means nothing has been seeded at all.
   */
  async basket(userId: string): Promise<CheckoutData | null> {
    const [rows, balanceCents] = await Promise.all([repo.findCartLines(userId), repo.findWalletBalance(userId)]);
    if (rows.length === 0 && !(await repo.hasCatalog())) return null;
    return toCheckoutData(rows, balanceCents);
  },

  /** Just the lines, for the header cart every page carries. */
  async lines(userId: string): Promise<CheckoutItem[] | null> {
    const rows = await repo.findCartLines(userId);
    if (rows.length === 0 && !(await repo.hasCatalog())) return null;
    return rows.map(toCheckoutItem);
  },

  /**
   * `ref` is a listing id (that exact copy) or an item slug (its cheapest
   * copy from another seller). Answers with the basket as it now stands.
   */
  async add(userId: string, ref: string): Promise<AddResult> {
    const exact = await repo.findActiveListing(ref);
    if (exact?.sellerId === userId) return { status: "own-listing", items: await checkoutService.lines(userId) };

    const target = exact ?? (await repo.findCheapestFromOthers(ref, userId));
    if (!target) return { status: "not-listed", items: await checkoutService.lines(userId) };

    await repo.insertCartLine(userId, target.id);
    return { status: "added", items: await checkoutService.lines(userId) };
  },

  async remove(userId: string, cartId: string): Promise<CheckoutItem[] | null> {
    await repo.deleteCartLine(userId, cartId);
    return checkoutService.lines(userId);
  },

  async clear(userId: string): Promise<CheckoutItem[] | null> {
    await repo.deleteCart(userId);
    return checkoutService.lines(userId);
  },

  place(userId: string, input: SettleInput): Promise<SettleResult> {
    return settle(userId, input);
  },
};
