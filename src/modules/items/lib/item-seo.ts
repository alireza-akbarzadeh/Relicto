import type { Metadata } from "next";
import { formatMoney } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, type JsonLdObject } from "@/modules/seo/lib/json-ld";
import { gameLabel, gameMarketPath } from "@/modules/seo/lib/games";
import { pageMetadata } from "@/modules/seo/lib/metadata";
import type { ItemSeoRow } from "@/server/modules/items/items.seo";

/** Rarities that are really categories ("melee", "gloves") say nothing a slot doesn't. */
const CATEGORY_RARITIES = new Set(["melee", "gloves"]);

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
const usd = (cents: number | string | null) => formatMoney(Number(cents ?? 0) / 100);

export const itemPath = (slug: string) => `/items/${slug}`;

/** "Arcana Dota 2 persona", "Covert CS2 knife", "CS2 item". */
function kind(item: ItemSeoRow) {
  const rarity = item.rarity && !CATEGORY_RARITIES.has(item.rarity) ? capitalize(item.rarity) : null;
  const slot = item.slot?.toLowerCase() ?? "item";
  return [rarity, gameLabel(item.gameId, item.gameName), slot].filter(Boolean).join(" ");
}

/** Worth indexing: it has art to show, and either words about it or a live market. */
export const isIndexableItem = (item: ItemSeoRow) => Boolean(item.imageUrl) && (Boolean(item.description) || item.offerCount > 0);

/** Built from the live book, so it can't promise a price the page doesn't show. */
export function itemDescription(item: ItemSeoRow) {
  const hero = item.heroName ? ` for ${item.heroName}` : "";
  const intro = `${item.name} is ${/^[AEIOU]/.test(kind(item)) ? "an" : "a"} ${kind(item)}${hero}.`;
  if (item.offerCount === 0) return `${intro} No live listings right now — watch it on Relicto to hear when a copy is listed.`;

  const copies = `${item.offerCount} live listing${item.offerCount === 1 ? "" : "s"}`;
  const range = Number(item.highCents) > Number(item.lowCents) ? `from ${usd(item.lowCents)} to ${usd(item.highCents)}` : `at ${usd(item.lowCents)}`;
  return `${intro} ${copies} ${range}. Compare sellers, price history and buy with escrow protection.`;
}

export function itemMetadata(item: ItemSeoRow): Metadata {
  return pageMetadata({
    title: `${item.name} — ${gameLabel(item.gameId, item.gameName)} Price & Market`,
    description: itemDescription(item),
    path: itemPath(item.slug),
    image: item.imageUrl ? { url: item.imageUrl, alt: item.imageAlt ?? item.name } : undefined,
    index: isIndexableItem(item),
  });
}

/**
 * Product + AggregateOffer from the live seller book, and the breadcrumb trail.
 * No Product without a live copy: an offer-less Product is invalid for rich
 * results, and there's no price to state honestly.
 */
export function itemJsonLd(item: ItemSeoRow): JsonLdObject[] {
  const label = gameLabel(item.gameId, item.gameName);
  const url = absoluteUrl(itemPath(item.slug));
  const crumbs = breadcrumbJsonLd([
    { name: "Marketplace", path: "/marketplace" },
    { name: `${label} items`, path: gameMarketPath(item.gameId) },
    { name: item.name, path: itemPath(item.slug) },
  ]);
  if (item.offerCount === 0 || !item.imageUrl) return [crumbs];

  const product: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    url,
    image: [absoluteUrl(item.imageUrl)],
    description: item.description ?? itemDescription(item),
    category: kind(item),
    offers: {
      "@type": "AggregateOffer",
      url,
      priceCurrency: "USD",
      lowPrice: (Number(item.lowCents) / 100).toFixed(2),
      highPrice: (Number(item.highCents) / 100).toFixed(2),
      offerCount: item.offerCount,
      availability: "https://schema.org/InStock",
    },
  };
  return [product, crumbs];
}
