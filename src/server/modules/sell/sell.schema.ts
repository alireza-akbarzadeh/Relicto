import { z } from "zod";

export const listItemInput = z.object({
  inventoryId: z.string().min(1).max(64),
  priceUsd: z.number().positive().max(1_000_000),
  note: z.string().trim().max(200),
});

export const delistInput = z.object({ listingId: z.string().min(1).max(64) });

export const bulkListInput = z.object({
  inventoryIds: z.array(z.string().min(1).max(64)).min(1).max(50),
  discountPercent: z.number().min(-50).max(50).default(0),
});
