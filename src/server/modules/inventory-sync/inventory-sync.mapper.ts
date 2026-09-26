import type { inventoryItems } from "@/lib/db/schema";
import { steamIconUrl, type SteamItem } from "@/lib/steam/inventory";

/** The games Relicto trades, by Steam app id. */
export const STEAM_GAMES = [
  { appId: 730, gameId: "cs2" },
  { appId: 570, gameId: "dota2" },
  { appId: 440, gameId: "tf2" },
] as const;

const GAME_BY_APP = new Map<number, string>(
  STEAM_GAMES.map((game) => [game.appId, game.gameId]),
);

/** Synced rows' asset ids look like `730-38471928374`; seeded and forged rows never do. */
export const SYNCED_ASSET = /^(730|570|440)-\d+$/;
export const syncedAssetId = (item: SteamItem) =>
  `${item.appId}-${item.assetId}`;

/** What the studio's wear column shows: exterior for CS2, hero for Dota 2, quality for TF2. */
const WEAR_CATEGORY: Record<string, string> = {
  cs2: "Exterior",
  dota2: "Hero",
  tf2: "Quality",
};

/** Wear bar fill by exterior — Steam doesn't expose the float itself. */
const WEAR_FILL: Record<string, number> = {
  "Factory New": 95,
  "Minimal Wear": 80,
  "Field-Tested": 60,
  "Well-Worn": 35,
  "Battle-Scarred": 15,
};

/** Rarity → the studio's accent. Unlisted grades stay muted. */
const RARITY_TONE: Record<string, string> = {
  Contraband: "primary",
  Covert: "amber",
  Extraordinary: "amber",
  Arcana: "amber",
  Immortal: "amber",
  Unusual: "amber",
  Classified: "indigo",
  Legendary: "indigo",
  Mythical: "indigo",
  Restricted: "cyan",
  Rare: "cyan",
  Exotic: "cyan",
};

const tag = (item: SteamItem, category: string) =>
  item.description.tags?.find((t) => t.category === category)
    ?.localized_tag_name ?? null;

/** Corner chip: StatTrak™ and Souvenir copies are worth telling apart at a glance. */
function marker(name: string) {
  if (name.startsWith("StatTrak™")) return "ST";
  if (name.startsWith("Souvenir")) return "SV";
  return null;
}

/** Catalog names drop the StatTrak™ prefix; try the exact name first, then without it. */
export const catalogNames = (name: string) => [
  name,
  name.replace(/^StatTrak™\s+/, ""),
];

export type CatalogMatch = { itemId: string; floorCents: number | null };

/**
 * One marketable Steam copy as an inventory row, minus the owner. Price and
 * floor come from Relicto's own market for the item when it's in the catalog,
 * and stay 0 when nobody here trades it yet.
 */
export function toInventoryRow(
  item: SteamItem,
  match: CatalogMatch | undefined,
) {
  const gameId = GAME_BY_APP.get(item.appId) ?? "cs2";
  const { name } = item.description;
  const rarity = tag(item, "Rarity");
  const wear = tag(item, WEAR_CATEGORY[gameId]);
  const floor = match?.floorCents ?? 0;

  return {
    gameId,
    assetId: syncedAssetId(item),
    itemId: match?.itemId ?? null,
    name,
    marker: marker(name),
    rarityLabel: rarity,
    wearLabel: wear,
    floatLabel: null,
    imageUrl: item.description.icon_url
      ? steamIconUrl(item.description.icon_url)
      : null,
    imageAlt: name,
    priceCents: floor,
    floorCents: floor,
    wearPct: wear ? (WEAR_FILL[wear] ?? 100) : 100,
    tone: (rarity && RARITY_TONE[rarity]) || "muted",
  } satisfies Omit<typeof inventoryItems.$inferInsert, "userId">;
}
