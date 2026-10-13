import "server-only";

import { FALLBACK_DOTA_HEROES } from "./dota-feed.fallback";
import * as repo from "./dota-feed.repository";
import type { HeroSyncResult, OpenDotaHero } from "./dota-feed.types";

const OPENDOTA_HEROES_URL = "https://api.opendota.com/api/heroes";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const dotaFeedService = {
  /**
   * Fetches latest Dota 2 heroes from OpenDota or fallback dataset,
   * upserts into the catalog heroes table, and links any unlinked marketplace items.
   */
  async sync(): Promise<HeroSyncResult> {
    let heroList: OpenDotaHero[] = [];
    let source: "opendota" | "fallback" = "opendota";

    try {
      const response = await fetch(OPENDOTA_HEROES_URL, {
        signal: AbortSignal.timeout(6000),
        headers: { "User-Agent": "Relicto-DotaFeed/1.0" },
      });

      if (response.ok) {
        const data = (await response.json()) as OpenDotaHero[];
        if (Array.isArray(data) && data.length > 0) {
          heroList = data;
        }
      }
    } catch {
      // Offline, rate-limited, or VPN block - gracefully use canonical fallback
      source = "fallback";
    }

    if (heroList.length === 0) {
      heroList = FALLBACK_DOTA_HEROES;
      source = "fallback";
    }

    const rows: repo.HeroRow[] = heroList.map((hero) => {
      const slug = slugify(hero.localized_name);
      return {
        id: `hero-${slug}`,
        gameId: "dota2",
        slug,
        name: hero.localized_name,
      };
    });

    const upserted = await repo.upsertHeroes(rows);
    const linkedItems = await repo.linkUnlinkedDotaItems();

    try {
      await repo.logDotaFeedRevision(upserted, source);
    } catch {
      // Non-fatal if wiki revision insert is skipped
    }

    return {
      total: heroList.length,
      upserted,
      linkedItems,
      source,
    };
  },
};
