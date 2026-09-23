"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { addToCartInput, placeOrderInput, removeFromCartInput } from "@/server/modules/checkout/checkout.schema";
import { checkoutService } from "@/server/modules/checkout/checkout.service";
import { notificationService } from "@/server/modules/notifications/notifications.service";

/**
 * Basket writes. Each one checks the session itself (actions are plain POST
 * endpoints) and answers with the basket as the server now holds it, so the
 * client cart reconciles instead of guessing.
 */

export async function addToCart(input: z.input<typeof addToCartInput>) {
  const { ref } = addToCartInput.parse(input);
  const result = await checkoutService.add(await requireUserId(), ref);
  if (result.status === "added") revalidatePath("/checkout");
  return result;
}

export async function removeFromCart(input: z.input<typeof removeFromCartInput>) {
  const { cartId } = removeFromCartInput.parse(input);
  const items = await checkoutService.remove(await requireUserId(), cartId);
  revalidatePath("/checkout");
  return items;
}

export async function clearCart() {
  const items = await checkoutService.clear(await requireUserId());
  revalidatePath("/checkout");
  return items;
}

/**
 * Settles the basket into escrow orders. Orders, wallet and the marketplace all
 * move, and each seller is notified — pushed to their devices after the response.
 */
export async function placeOrder(input: z.input<typeof placeOrderInput>) {
  const parsed = placeOrderInput.parse(input);
  const userId = await requireUserId();
  const result = await checkoutService.place(userId, parsed);
  const items = await checkoutService.lines(userId);

  if (result.status !== "placed") return { status: result.status, items };

  revalidatePath("/", "layout");
  // Sellers' notifications stay server-side; the buyer only learns the codes.
  after(() => notificationService.deliver(result.notices));
  return { status: result.status, codes: result.codes, items };
}
