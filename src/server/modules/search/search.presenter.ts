import type {
  SearchItem,
  SearchTournament,
  SearchTrader,
} from "@/modules/search/types";
import { initials } from "../shared/initials";
import type * as entities from "./search.entities";
import type * as repo from "./search.repository";

type Copy = Awaited<ReturnType<typeof repo.findCheapestCopies>>[number];
type Trader = Awaited<ReturnType<typeof entities.findTraders>>[number];
type Tournament = Awaited<ReturnType<typeof entities.findTournaments>>[number];

type Game = SearchItem["game"];
const asGame = (gameId: string): Game =>
  gameId === "dota2" || gameId === "tf2" ? gameId : "cs2";

const EXTERIOR: Record<string, string> = {
  fn: "Factory New",
  mw: "Minimal Wear",
  ft: "Field-Tested",
  ww: "Well-Worn",
  bs: "Battle-Scarred",
};

/** "covert" → "Covert"; the catalog stores grades lower-case. */
const grade = (rarity: string | null) =>
  rarity ? rarity[0].toUpperCase() + rarity.slice(1) : null;

/**
 * One result row. The reference price prefers Steam's (scraped per copy) over
 * Skinport's daily ask, and the delta says how Relicto's floor compares.
 */
export function toSearchItem(
  item: repo.ItemMatch,
  copy: Copy,
  skinportCents: number | undefined,
): SearchItem {
  const game = asGame(item.gameId);
  const exterior = copy.wear ? EXTERIOR[copy.wear] : null;
  const referenceCents = copy.steamMarketCents ?? skinportCents ?? null;
  const floorCents = copy.priceCents;

  return {
    slug: item.slug,
    name: item.name,
    game,
    image: item.imageUrl ?? "",
    imageAlt: item.imageAlt ?? item.name,
    corner: copy.wear
      ? copy.wear.toUpperCase()
      : (grade(item.rarity)?.toUpperCase() ?? null),
    chips: [exterior, item.heroName, grade(item.rarity)].filter(
      (chip): chip is string => Boolean(chip),
    ),
    listingId: copy.id,
    floorUsd: floorCents / 100,
    floatValue: copy.float,
    paintSeed: copy.paintSeed,
    copies: item.copies,
    reference: referenceCents
      ? {
          usd: referenceCents / 100,
          venue: copy.steamMarketCents ? "Steam" : "Skinport",
        }
      : null,
    deltaPct: referenceCents
      ? ((floorCents - referenceCents) / referenceCents) * 100
      : null,
  };
}

export const toSearchTrader = (row: Trader): SearchTrader => ({
  handle: row.handle,
  initials: initials(row.handle),
  avatar: row.avatar,
  level: row.level,
  role: row.role,
  verified: row.verified,
  trust: row.trustScore ? `${row.trustScore / 10}%` : null,
  trades: row.tradeCount ?? 0,
  portfolioUsd: (row.portfolioCents ?? 0) / 100,
  listings: row.listings,
});

export const toSearchTournament = (row: Tournament): SearchTournament => ({
  slug: row.slug,
  name: row.name,
  status: row.status,
  format: row.format,
  prizeUsd: row.prizePoolCents !== null ? row.prizePoolCents / 100 : null,
  game: asGame(row.gameId),
});
