import { z } from "zod";
import { itemRarity, itemWear } from "@/lib/db/schema";

export const gameIdSchema = z.string().min(1);
export const raritySchema = z.enum(itemRarity.enumValues);
export const wearSchema = z.enum(itemWear.enumValues);

/** Mirrors the marketplace `Filters` type the UI already drives from the URL. */
export const listListingsInput = z.object({
  query: z.string().trim().min(1).optional(),
  gameId: gameIdSchema.optional(),
  heroSlugs: z.array(z.string().min(1)).optional(),
  rarities: z.array(raritySchema).optional(),
  slots: z.array(z.string().min(1)).optional(),
  minCents: z.number().int().nonnegative().optional(),
  maxCents: z.number().int().positive().optional(),
  wear: z.array(wearSchema).optional(),
  /** CS2 float ceiling, e.g. 0.01 for "under 0.01". */
  maxFloat: z.number().min(0).max(1).optional(),
  stattrak: z.boolean().optional(),
  sort: z.enum(["price-asc", "price-desc", "recent"]).default("recent"),
  page: z.number().int().min(1).default(1),
  perPage: z.union([z.literal(24), z.literal(48), z.literal(96)]).default(24),
});

export type ListListingsInput = z.infer<typeof listListingsInput>;

export const listingIdInput = z.object({ id: z.string().min(1) });

export const createListingInput = z.object({
  itemId: z.string().min(1),
  priceCents: z.number().int().positive(),
  styleId: z.string().min(1).optional(),
  wear: wearSchema.optional(),
  float: z.number().min(0).max(1).optional(),
  paintSeed: z.number().int().nonnegative().optional(),
  stattrak: z.boolean().default(false),
});

export type CreateListingInput = z.infer<typeof createListingInput>;
