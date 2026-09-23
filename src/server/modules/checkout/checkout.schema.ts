import { z } from "zod";

/** Every write is reachable by a raw POST, so inputs are parsed, never trusted. */
export const addToCartInput = z.object({ ref: z.string().trim().min(1).max(128) });

export const removeFromCartInput = z.object({ cartId: z.string().min(1).max(64) });

export const placeOrderInput = z.object({
  rail: z.string().min(1).max(32),
  promo: z.boolean(),
  cartIds: z.array(z.string().min(1).max(64)).min(1).max(50),
});
