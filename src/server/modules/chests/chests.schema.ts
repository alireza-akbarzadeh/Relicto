import { z } from "zod";

export const chestSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z0-9_-]+$/, "Invalid chest slug format");

export const openChestInput = z
  .object({
    paymentMethod: z.enum(["coins", "cash_usd", "combination"]).default("coins"),
    splitCoinAmount: z.number().int().finite().nonnegative().max(10_000_000).default(0),
    clientSeed: z.string().trim().max(128).optional(),
  })
  .strict();

export type OpenChestInput = z.infer<typeof openChestInput>;

export const recycleChestItemInput = z
  .object({
    unboxId: z.string().trim().min(1).max(128),
  })
  .strict();

export type RecycleChestItemInput = z.infer<typeof recycleChestItemInput>;

export const buyCoinsInput = z
  .object({
    packageId: z.string().trim().min(1).max(32),
    currency: z.enum(["usd", "toman"]).default("usd"),
  })
  .strict();

export type BuyCoinsInput = z.infer<typeof buyCoinsInput>;

export const simulateChestInput = z
  .object({
    count: z.number().int().finite().min(1).max(10_000).default(1000),
  })
  .strict();

export type SimulateChestInput = z.infer<typeof simulateChestInput>;

