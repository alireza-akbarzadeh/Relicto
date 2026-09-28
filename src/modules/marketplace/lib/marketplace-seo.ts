import type { Metadata } from "next";
import { GAME_SEO, gameMarketPath, isSeoGame } from "@/modules/seo/lib/games";
import { pageMetadata } from "@/modules/seo/lib/metadata";

type RawParams = Record<string, string | string[] | undefined>;

const BASE = {
  title: "Dota 2 & CS2 Item Marketplace — Live Listings & Prices",
  description:
    "Buy and sell Dota 2 and CS2 items from verified sellers. Filter by game, rarity, hero, wear and price, compare live listings and check out with escrow protection.",
};

/**
 * Crawl policy for a URL that can take 16 filters. Indexable: the bare
 * marketplace and one landing per stocked game (`?game=cs2`). Every other
 * combination (sort, view, price, page…) is a view of those pages: noindex so
 * it can't compete, follow so its item links still count, canonical to the
 * landing it narrows.
 */
export function marketplaceMetadata(raw: RawParams): Metadata {
  const present = Object.keys(raw).filter((key) => raw[key] !== undefined && raw[key] !== "");
  const game = typeof raw.game === "string" && isSeoGame(raw.game) ? raw.game : null;

  const landing = game ? { ...GAME_SEO[game], path: gameMarketPath(game) } : { ...BASE, path: "/marketplace" };
  const isLanding = present.length === 0 || (game !== null && present.length === 1);

  return pageMetadata({ title: landing.title, description: landing.description, path: landing.path, index: isLanding });
}
