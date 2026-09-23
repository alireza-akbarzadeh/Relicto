import { z } from "zod";

/** The mobile "Deploy Snipe Rule" form: an asset, a price to buy under, an optional float cap. */
export const createRuleInput = z.object({
  name: z.string().trim().min(2).max(80),
  targetUsd: z.number().positive().max(1_000_000),
  maxFloat: z.number().min(0).max(1).nullable(),
  autoBuy: z.boolean(),
});

export const setArmedInput = z.object({ id: z.string().min(1).max(64), armed: z.boolean() });
