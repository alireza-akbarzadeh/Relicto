import { z } from "zod";

/** Cashout rails the desktop egress panel offers. */
export const CASHOUT_RAILS = ["usdt", "sepa", "keys", "visa"] as const;

export const cashoutInput = z.object({
  rail: z.enum(CASHOUT_RAILS),
  amountUsd: z.number().positive().max(20_000),
});

export const freezeInput = z.object({ frozen: z.boolean() });

/** Money rails the deposit panel offers. "skins" is liquidation, which the sell studio handles. */
export const DEPOSIT_RAILS = ["crypto", "cards", "bank"] as const;

export const depositInput = z.object({
  rail: z.enum(DEPOSIT_RAILS),
  amountUsd: z.number().min(10).max(10_000),
});
