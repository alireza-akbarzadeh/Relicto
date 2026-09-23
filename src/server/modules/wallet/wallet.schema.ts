import { z } from "zod";

/** Cashout rails the desktop egress panel offers. */
export const CASHOUT_RAILS = ["usdt", "sepa", "keys", "visa"] as const;

export const cashoutInput = z.object({
  rail: z.enum(CASHOUT_RAILS),
  amountUsd: z.number().positive().max(20_000),
});

export const freezeInput = z.object({ frozen: z.boolean() });
