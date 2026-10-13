import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { heroes, items, wikiGuides, wikiRevisions } from "@/lib/db/schema";

export type HeroRow = {
  id: string;
  gameId: string;
  slug: string;
  name: string;
};

export async function upsertHeroes(rows: HeroRow[]): Promise<number> {
  if (rows.length === 0) return 0;
  await db
    .insert(heroes)
    .values(rows)
    .onConflictDoUpdate({
      target: [heroes.gameId, heroes.slug],
      set: {
        name: sql`excluded.name`,
        updatedAt: new Date(),
      },
    });
  return rows.length;
}

export async function linkUnlinkedDotaItems(): Promise<number> {
  const unlinked = await db
    .select({ id: items.id, name: items.name, presentation: items.presentation })
    .from(items)
    .where(and(eq(items.gameId, "dota2"), isNull(items.heroId)));

  if (unlinked.length === 0) return 0;

  const allHeroes = await db
    .select({ id: heroes.id, name: heroes.name, slug: heroes.slug })
    .from(heroes)
    .where(eq(heroes.gameId, "dota2"));

  let linkedCount = 0;
  for (const item of unlinked) {
    const subtitle = item.presentation?.subtitle?.toLowerCase() ?? "";
    const matched = allHeroes.find((h) => {
      const lower = h.name.toLowerCase();
      return subtitle.includes(lower) || item.name.toLowerCase().includes(lower);
    });

    if (matched) {
      await db.update(items).set({ heroId: matched.id }).where(eq(items.id, item.id));
      linkedCount++;
    }
  }

  return linkedCount;
}

export async function logDotaFeedRevision(count: number, source: string): Promise<void> {
  const [guide] = await db
    .select({ id: wikiGuides.id })
    .from(wikiGuides)
    .where(eq(wikiGuides.slug, "dota-telemetry-feed"))
    .limit(1);

  const guideId = guide?.id ?? null;
  const hash = Math.random().toString(16).substring(2, 9);

  await db.insert(wikiRevisions).values({
    guideId,
    authorHandle: "Sentinel_DotaFeed_Bot",
    trustLabel: "Automated Datafeed Daemon",
    title: `Dota 2 Telemetry Ingest: ${count} heroes synced (${source})`,
    path: "telemetry/dota2/heroes",
    commitHash: hash,
    changes: `+${count} heroes verified, metadata facets aligned with OpenDota API constants.`,
    tone: "cyan",
  });
}
