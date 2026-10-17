/**
 * Art direction for generated catalog rows. The designed 18 items carry
 * hand-authored `presentation` blobs; these are derived from rarity and a hash
 * of the slug, so a re-seed always produces the same card.
 *
 * Artwork is reused from the eight shots in `public/images/lootora/items/`,
 * picked by game + slot. Depth rows therefore repeat art — real per-item
 * photography is a content job, not a seeding one.
 */
import type { ItemPresentation } from "../../../lib/db/schema";
import type { CatalogSeedItem } from "./catalog.types";

/** Stable small hash, so every derived choice is deterministic per slug. */
export function hash(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const pick = <T>(list: readonly T[], slug: string, salt: number) =>
  list[(hash(slug) + salt) % list.length];

function imageFor(item: CatalogSeedItem): string {
  const slug = item.slug.toLowerCase();
  if (slug.includes("karambit"))
    return "/images/lootora/items/karambit-doppler.jpg";
  if (slug.includes("butterfly"))
    return "/images/lootora/items/butterfly-doppler.jpg";
  if (slug.includes("talon")) return "/images/lootora/sell-items-07.jpg";
  if (
    slug.includes("vulcan") ||
    slug.includes("bloodsport") ||
    slug.includes("neon-rider")
  ) {
    return "/images/lootora/items/ak47-vulcan.jpg";
  }
  if (slug.includes("ak-") || slug.includes("case-hardened"))
    return "/images/lootora/sell-items-04.jpg";
  if (
    slug.includes("printstream") ||
    slug.includes("deagle") ||
    slug.includes("desert")
  ) {
    return "/images/lootora/items/deagle-printstream.jpg";
  }
  if (slug.includes("howl")) return "/images/lootora/market-mobile-06.jpg";
  if (slug.includes("m4a1") || slug.includes("m4a4"))
    return "/images/lootora/sell-items-06.jpg";
  if (slug.includes("dragon-lore")) return "/images/lootora/sell-items-02.jpg";
  if (slug.includes("awp")) return "/images/lootora/items/awp-fade.jpg";
  if (slug.includes("specialist")) return "/images/lootora/sell-items-09.jpg";
  if (slug.includes("glove") || item.slot === "Gloves")
    return "/images/lootora/items/sport-gloves-vice.jpg";

  if (
    slug.includes("abscession") ||
    (item.hero === "Pudge" && item.rarity === "arcana")
  ) {
    return "/images/lootora/items/pudge-feast-abscession.jpg";
  }
  if (
    slug.includes("frost-avalanche") ||
    (item.hero === "Crystal Maiden" && item.rarity === "arcana")
  ) {
    return "/images/lootora/items/crystal-maiden-frost-avalanche.jpg";
  }
  if (item.hero === "Pudge") return "/images/lootora/items/dragonclaw-hook.jpg";
  if (item.hero === "Phantom Assassin")
    return "/images/lootora/items/manifold-paradox.jpg";
  if (item.hero === "Juggernaut")
    return "/images/lootora/items/bladeform-legacy.jpg";
  if (item.hero === "Invoker")
    return "/images/lootora/items/dark-artistry-cape.jpg";

  if (item.gameId === "tf2")
    return "/images/lootora/items/tf2-australium-rocket.jpg";
  if (item.slot === "Head") return "/images/lootora/items/codicil-veiled.jpg";
  if (item.slot === "Armor")
    return "/images/lootora/items/bladeform-legacy.jpg";
  return "/images/lootora/items/dark-artistry-cape.jpg";
}

/** Resolves bespoke artwork per hero, weapon class and skin family. */
export function artworkFor(item: CatalogSeedItem) {
  return { url: imageFor(item), alt: `${item.name} listed on Relicto` };
}

const BADGE: Record<string, { label: string; style: string }> = {
  arcana: { label: "Arcana", style: "arcana" },
  immortal: { label: "Immortal", style: "immortal" },
  ancient: { label: "Ancient", style: "immortal" },
  mythical: { label: "Mythical", style: "covert" },
  rare: { label: "Rare", style: "covert" },
  covert: { label: "Covert", style: "covert" },
  melee: { label: "★ Melee", style: "melee" },
  gloves: { label: "★ Gloves", style: "gloves" },
};

const TAG_ACCENT = [
  "amber",
  "indigo",
  "cyan",
  "pink",
  "gold",
  "neutral",
] as const;
const BLOBS = ["primary", "secondary", "amber", "indigo"] as const;
const SHADOWS = [
  "crimson-30",
  "crimson-20",
  "amber-20",
  "amber-25",
  "cyan-20",
  "indigo-30",
  "indigo-25",
] as const;

const GAME_TAG: Record<string, string> = {
  dota2: "Dota 2",
  cs2: "CS2",
  tf2: "TF2",
};

const WEAR_LABEL: Record<string, string> = {
  fn: "Factory New",
  mw: "Minimal Wear",
  ft: "Field-Tested",
  ww: "Well-Worn",
  bs: "Battle-Scarred",
};

/**
 * Every generated row carries instant escrow (these are bot-held copies).
 * The other three safeguards vary, so each facet narrows the grid to a real subset.
 */
export function safeguardsFor(item: CatalogSeedItem): string[] {
  const h = hash(item.slug);
  const safeguards = ["instantEscrow"];
  if (h % 3 !== 0) safeguards.push("verifiedSellers");
  if (h % 5 === 0) safeguards.push("gems");
  if (item.gameId === "dota2" && h % 4 === 0) safeguards.push("allStyles");
  return safeguards;
}

export function presentationFor(
  item: CatalogSeedItem,
  offers: number,
): ItemPresentation {
  const badge = BADGE[item.rarity] ?? { label: item.rarity, style: "covert" };
  const subtitle =
    item.hero ?? (item.wear ? WEAR_LABEL[item.wear] : GAME_TAG[item.gameId]);

  return {
    badge,
    tag: {
      label: GAME_TAG[item.gameId],
      accent: pick(TAG_ACCENT, item.slug, 0),
      bold: item.gameId === "cs2",
    },
    subtitle,
    detail: {
      label: item.wear ? `Float ${item.float?.toFixed(4)}` : item.slot,
      accent: item.stattrak ? "amber" : "neutral",
    },
    glow: {
      blob: pick(BLOBS, item.slug, 1),
      shadow: pick(SHADOWS, item.slug, 2),
    },
    mediaBadge: item.wear
      ? { kind: "float", value: item.float!.toFixed(3) }
      : { kind: "escrow", label: "Instant Escrow" },
    safeguards: safeguardsFor(item),
    meta: [`Floor: $${item.priceUsd.toFixed(2)}`, `${offers} active offers`],
  };
}
