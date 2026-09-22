import type { IconName } from "@/components/ui/icon";
import type { ItemPresentation, listings, profileEndorsements, profileStatusRows, reviews, showcaseItems } from "@/lib/db/schema";
import type { Endorsement, Listing, ListingBadge, Review, ShowcaseItem, StatusRow, Tone } from "@/modules/profile/types";
import { money } from "./profile.identity";

type Showcase = typeof showcaseItems.$inferSelect;
type StatusRowModel = typeof profileStatusRows.$inferSelect;
type EndorsementModel = typeof profileEndorsements.$inferSelect;
type ReviewModel = typeof reviews.$inferSelect;

export type SellerListingRow = {
  listing: typeof listings.$inferSelect;
  name: string;
  imageUrl: string | null;
  imageAlt: string | null;
  presentation: ItemPresentation | null;
};

const WEAR: Record<string, string> = {
  fn: "Factory New",
  mw: "Minimal Wear",
  ft: "Field-Tested",
  ww: "Well-Worn",
  bs: "Battle-Scarred",
};

/** Item-trait accents map onto the three badge variants the card supports. */
const BADGE_VARIANT: Record<string, ListingBadge> = { amber: "amber", indigo: "indigo", neutral: "indigo" };

export function toShowcase(row: Showcase): ShowcaseItem {
  const p = row.presentation;

  return {
    id: row.id,
    kicker: row.kicker ?? "",
    name: row.name,
    subtitle: row.subtitle ?? "",
    priceUsd: (row.valueCents ?? 0) / 100,
    tone: row.tone as Tone,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    badge: { icon: (p?.badge.icon ?? "verified") as IconName, label: p?.badge.label ?? "" },
    meter: p?.meter ?? { label: "", value: "", pct: 0 },
    foot: p?.foot ?? { left: "", right: "" },
  };
}

/**
 * A seller's own listing card. Price positioning is derived: a listing with a
 * scraped Steam price is judged against it, otherwise the item's own trait tag
 * carries the badge.
 */
export function toSellerListing(row: SellerListingRow): Listing {
  const { listing } = row;
  const wear = listing.wear ? WEAR[listing.wear] : null;
  const tag = row.presentation?.tag;

  // At or below the floor is news; above it, the item's own trait carries the badge.
  const atFloor = listing.floorCents !== null && listing.priceCents <= listing.floorCents;
  const badge: Listing["badge"] = atFloor
    ? {
        label: listing.priceCents === listing.floorCents ? "MATCHES FLOOR" : "UNDERCUTS FLOOR",
        variant: "crimson",
      }
    : { label: (tag?.label ?? "LISTED").toUpperCase(), variant: BADGE_VARIANT[tag?.accent ?? ""] ?? "indigo" };

  const offers =
    listing.offerCount > 0
      ? `${listing.offerCount} Buyer offer${listing.offerCount === 1 ? "" : "s"} waiting review`
      : listing.sellerNote;

  const note =
    listing.steamMarketCents !== null
      ? { note: `Steam Market: ${money(listing.steamMarketCents)}`, noteTone: "cyan" as Tone }
      : listing.floorCents !== null
        ? { note: `Floor: ${money(listing.floorCents)}`, noteTone: "muted" as Tone }
        : { note: "Instant Buy Target", noteTone: "muted" as Tone };

  return {
    id: listing.id,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    badge,
    meta: row.presentation?.subtitle ?? "",
    name: wear ? `${row.name} (${wear})` : row.name,
    detail: [listing.float !== null ? `Float: ${listing.float}` : null, offers].filter(Boolean).join(" • "),
    priceUsd: listing.priceCents / 100,
    priceTone: listing.steamMarketCents !== null ? "white" : "amber",
    ...note,
  };
}

export function toStatusRow(row: StatusRowModel): StatusRow {
  return {
    id: row.id,
    icon: row.icon as IconName,
    iconTone: row.iconTone as Tone,
    title: row.title,
    detail: row.detail ?? "",
    status: row.status,
    statusTone: row.statusTone as Tone,
  };
}

export function toEndorsement(row: EndorsementModel): Endorsement {
  return { label: row.label, value: `${row.pct.toFixed(1)}%`, pct: row.pct, tone: row.tone as Tone };
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/** "2 hours ago", "Yesterday", "4 days ago" — the review list's own rhythm. */
export function reviewAge(at: Date, now: Date): string {
  const elapsed = Math.max(0, now.getTime() - at.getTime());

  if (elapsed < HOUR) return `${Math.max(1, Math.round(elapsed / 60000))} minutes ago`;
  if (elapsed < DAY) {
    const hours = Math.round(elapsed / HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.round(elapsed / DAY);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function toReview(row: ReviewModel, now: Date): Review {
  return { id: row.id, author: row.authorHandle, age: reviewAge(row.createdAt, now), quote: row.quote };
}
