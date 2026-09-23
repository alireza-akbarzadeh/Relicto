"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { watchlistService } from "@/server/modules/watchlist/watchlist.service";

const input = z.object({ slug: z.string().trim().min(1).max(128), watched: z.boolean() });

/** Watch or unwatch an item; the tracker board follows. Answers with the full watched set. */
export async function setWatched(raw: z.input<typeof input>) {
  const { slug, watched } = input.parse(raw);
  const userId = await requireUserId();
  const known = await watchlistService.set(userId, slug, watched);
  if (known) revalidatePath("/tracker");
  return { known, slugs: await watchlistService.slugs(userId) };
}
