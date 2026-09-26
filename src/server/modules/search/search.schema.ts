import { z } from "zod";
import { itemRarity, itemWear } from "@/lib/db/schema";

/** `GET /api/search` — every field optional, so an empty query returns what's trending. */
export const searchInput = z.object({
  q: z.string().trim().max(80).default(""),
  game: z.enum(["all", "dota2", "cs2", "tf2"]).default("all"),
  rarity: z.enum(itemRarity.enumValues).optional(),
  wear: z.enum(itemWear.enumValues).optional(),
  /** Lowest floor to include, in dollars. */
  min: z.coerce.number().min(0).max(1_000_000).optional(),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

export type SearchInput = z.infer<typeof searchInput>;
