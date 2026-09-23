import type { ItemBadge, ItemDetail, Offer, RarityVariant, RelatedItem } from "@/modules/items/types";
import type { ItemRow, ItemStyleRow, ListingRow, PricePointRow, RelatedRow } from "./items.types";

const usd = (cents: number) => cents / 100;
const money = (cents: number) => `$${usd(cents).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** `ItemBadge.variant` is a narrower set than the catalog's rarity enum. */
const BADGE_VARIANTS = new Set<string>(["arcana", "exalted", "immortal", "persona", "helm", "cache"]);
const toVariant = (rarity: string | null): RarityVariant =>
  rarity && BADGE_VARIANTS.has(rarity) ? (rarity as RarityVariant) : "cache";

const GAME_LABEL: Record<string, string> = { dota2: "Dota 2", cs2: "Counter-Strike 2", tf2: "Team Fortress 2" };

function toOffer(row: ListingRow, index: number, itemName: string): Offer {
  return {
    id: row.id,
    seller: {
      initials: itemName.slice(0, 2).toUpperCase(),
      name: "Relicto Vault",
      rating: "99.4%",
      tone: index === 0 ? "emerald" : "neutral",
      verified: true,
    },
    style: { label: row.stattrak ? "StatTrak™" : "Standard", tone: row.stattrak ? "amber" : "cyan" },
    quality: row.wear ? row.wear.toUpperCase() : "Standard",
    gems: row.paintSeed ? `Seed #${row.paintSeed}` : "—",
    fulfilment: "bot",
    fulfilmentNote: "Instant bot escrow",
    priceUsd: usd(row.priceCents),
    priceNote: row.float ? `Float ${row.float.toFixed(4)}` : "Verified escrow",
    ...(index === 0 ? { best: true } : {}),
  };
}

function toRelated(row: RelatedRow): RelatedItem {
  return {
    id: row.slug,
    slug: row.slug,
    badge: { label: row.presentation?.badge.label ?? row.name, variant: toVariant(row.rarity) } satisfies ItemBadge,
    kicker: row.presentation?.tag.label ?? "Catalog",
    name: row.name,
    blurb: row.presentation?.detail.label ?? "",
    floorUsd: usd(row.priceCents),
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
  };
}

/**
 * Builds a complete detail page from catalog facts. Items with a hand-authored
 * mock keep it; everything else gets this, so no card on the marketplace 404s.
 */
export function toItemDetail(
  item: ItemRow,
  itemListings: ListingRow[],
  styles: ItemStyleRow[],
  history: PricePointRow[],
  related: RelatedRow[],
): ItemDetail {
  const cheapest = itemListings[0];
  const lowestCents = cheapest?.priceCents ?? 0;
  // Several copies can be on offer: the item's move is the first one quoted,
  // and its open offers are every copy's together.
  const quoted = itemListings.find((row) => row.changePercent !== null);
  const changePercent = quoted?.changePercent ?? 0;
  const openOffers = itemListings.reduce((total, row) => total + row.offerCount, 0);
  const rising = changePercent >= 0;
  const gameLabel = GAME_LABEL[item.gameId] ?? item.gameId;

  const prices = history.map((p) => p.priceCents);
  const low = prices.length ? Math.min(...prices) : lowestCents;
  const high = prices.length ? Math.max(...prices) : lowestCents;

  return {
    slug: item.slug,
    appId: item.gameId === "cs2" ? "730" : item.gameId === "tf2" ? "440" : "570",
    classId: item.steamClassId ?? "—",
    syncedAgo: "just now",
    breadcrumb: [
      { label: gameLabel, href: `/marketplace?ecosystem=${item.gameId}` },
      ...(item.heroName ? [{ label: item.heroName }] : []),
      { label: item.name, chip: true },
    ],
    badges: [
      { label: item.presentation?.badge.label ?? gameLabel, variant: toVariant(item.rarity) },
      ...(item.presentation?.tag.label ? [{ label: item.presentation.tag.label, variant: toVariant(item.rarity) }] : []),
    ],
    hero: {
      image: item.imageUrl ?? "",
      imageAlt: item.imageAlt ?? item.name,
      kills: "—",
      spatialNote: item.presentation?.detail.label ?? "",
    },
    inspectModes: [
      { id: "spatial", label: "Spatial" },
      { id: "animations", label: "Animations" },
      { id: "sound", label: "Sound" },
      { id: "equipped", label: "Equipped" },
    ],
    styles: styles.map((style, index) => ({
      id: style.id,
      label: style.label,
      requirement: style.requirement ?? "",
      requirementTone: "muted" as const,
      name: style.name,
      note: style.note ?? "",
      ...(index === 0 ? { active: true } : {}),
    })),
    stylesUnlocked: `${styles.length} styles`,
    eyebrow: { game: gameLabel, slot: item.slot ?? "—", hero: item.heroName ?? "—" },
    name: item.name,
    description: item.description ?? `${item.name} — verified ${gameLabel} cosmetic with instant bot escrow.`,
    price: {
      lowestUsd: usd(lowestCents),
      moveLabel: `${rising ? "+" : ""}${changePercent.toFixed(1)}%`,
      moveNote: quoted?.changeWindow ? `past ${quoted.changeWindow}` : "past 24h",
      trendLabel: rising ? "Trending up" : "Cooling off",
      trendNote: `${itemListings.length} active listing${itemListings.length === 1 ? "" : "s"}`,
      stats: [
        { label: "30d Low", value: money(low), tone: "cyan" },
        { label: "30d High", value: money(high), tone: "amber" },
        { label: "Open Offers", value: String(openOffers), tone: "primary" },
      ],
    },
    escrow: [
      { icon: "verified", tone: "emerald", title: "0-day hold", note: "Instant peer escrow" },
      { icon: "bolt", tone: "cyan", title: "~12s dispatch", note: "Automated bot offer" },
      { icon: "shield_lock", tone: "amber", title: "Multi-sig custody", note: "Funds locked until delivery" },
    ],
    sections: [
      { id: "offers", label: "Offers" },
      { id: "intelligence", label: "Price Intelligence" },
      { id: "related", label: "Related" },
    ],
    offers: itemListings.map((row, index) => toOffer(row, index, item.name)),
    offersNote: `${itemListings.length} verified seller${itemListings.length === 1 ? "" : "s"}`,
    offerStyles: ["All styles"],
    intelligence: {
      ranges: ["24H", "7D", "30D", "90D", "1Y", "ALL"],
      activeRange: "30D",
      modes: ["LINE", "CANDLE"],
      activeMode: "LINE",
      points: history.map((point, index) => ({
        x: index,
        y: usd(point.priceCents),
        ...(index === history.length - 1 ? { marker: "now" as const } : {}),
      })),
      annotations: [],
      axis: history
        .filter((_, index) => index % 7 === 0)
        .map((point) => ({ label: point.recordedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) })),
      stats: [
        { label: "Floor", value: money(lowestCents), note: "lowest active listing", tone: "primary" },
        { label: "30d Range", value: `${money(low)} – ${money(high)}`, note: "observed", tone: "amber" },
      ],
    },
    sell: {
      detected: item.name,
      style: item.presentation?.detail.label ?? "Standard",
      image: item.imageUrl ?? "",
      imageAlt: item.imageAlt ?? item.name,
      rows: [
        { label: "Instant payout", value: money(Math.round(lowestCents * 0.9)), tone: "emerald" },
        { label: "List yourself", value: money(lowestCents), tone: "primary" },
      ],
      note: "Instant payout settles to your wallet immediately.",
    },
    mods: {
      eyebrow: "Engine",
      title: "Item specification",
      items: [],
      lore: { quote: "", source: "", verified: "" },
    },
    replay: {
      eyebrow: "",
      quality: "",
      title: "",
      image: item.imageUrl ?? "",
      imageAlt: item.imageAlt ?? item.name,
      caption: "",
      damage: "",
      alertPrice: money(lowestCents),
    },
    related: { eyebrow: gameLabel, title: "More from this catalog", items: related.map(toRelated) },
  };
}
