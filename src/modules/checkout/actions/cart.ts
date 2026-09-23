"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { addToCartInput, placeOrderInput, removeFromCartInput } from "@/server/modules/checkout/checkout.schema";
import { checkoutService } from "@/server/modules/checkout/checkout.service";

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

/** Settles the basket into escrow orders. Orders, wallet and the marketplace all move. */
export async function placeOrder(input: z.input<typeof placeOrderInput>) {
  const parsed = placeOrderInput.parse(input);
  const userId = await requireUserId();
  const result = await checkoutService.place(userId, parsed);

  if (result.status === "placed") revalidatePath("/", "layout");
  return { ...result, items: await checkoutService.lines(userId) };
}
