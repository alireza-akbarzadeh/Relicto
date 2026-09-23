import type { profiles } from "@/lib/db/schema";
import type { ProfileMobile, QuickLink, ShowcaseCard, Tone, TrustStat } from "@/modules/profile/mobile.types";
import type { countActivity, findShowcaseCards } from "./profile-mobile.repository";
import { ratingTier } from "./profile.identity";

type Profile = typeof profiles.$inferSelect;
type Card = Awaited<ReturnType<typeof findShowcaseCards>>[number];
type Activity = Awaited<ReturnType<typeof countActivity>>;
type Escrow = { escrowCents: number; escrowHolds: number };

/** The mobile screen's authored furniture: bot/node chrome, security checks and the link list. */
export type ProfileChrome = Pick<ProfileMobile, "ping" | "botId" | "node" | "savedAccounts" | "security" | "links">;

const TONES = new Set<Tone>(["plain", "amber", "cyan", "crimson", "indigo", "muted"]);
const tone = (value: string): Tone => (TONES.has(value as Tone) ? (value as Tone) : value === "primary" ? "crimson" : "muted");
const plural = (n: number, word: string) => `${n.toLocaleString("en-US")} ${word}${n === 1 ? "" : "s"}`;

/** "Tier-1 Elite" → { tier: "TIER 1", badge: "ELITE" }; the desktop tile reads the same tier. */
function reputation(rating: number) {
  const label = ratingTier(rating);
  const tier = label.match(/Tier-(\d)/)?.[1] ?? "3";
  return { tier: `TIER ${tier}`, badge: label.split(" ").pop()!.toUpperCase() };
}

function trust(profile: Profile, activity: Activity): TrustStat[] {
  const rating = profile.ratingHundredths / 100;
  const disputeRate = activity.trades === 0 ? 0 : (activity.disputed / activity.trades) * 100;

  return [
    {
      label: "Trust Score", value: `${(profile.trustScore / 10).toFixed(1)}%`, tone: "plain",
      suffix: { text: reputation(rating).badge, chip: true },
      note: `${plural(profile.tradeCount, "Completed Trade")}`, noteTone: "secondary", truncate: true,
    },
    {
      label: "Feedback Rating", value: rating.toFixed(1), tone: "amber", rating,
      note: `${plural(profile.reviewCount, "Verified Review")}`, noteTone: "secondary", truncate: true,
    },
    {
      label: "Dispute Rate", value: `${disputeRate.toFixed(2)}%`, tone: "cyan",
      note: activity.disputed === 0 ? "Clean Arbitration Record" : plural(activity.disputed, "Disputed Trade"),
      noteTone: "secondary",
    },
    {
      label: "Avg Dispatch", value: `${profile.fulfillmentSeconds ?? 0}s`, tone: "plain",
      suffix: { text: "p2p", chip: false }, note: "Instant Auto-Accept", noteTone: "cyan", live: true,
    },
  ];
}

/** "WEAR FLOAT" / "0.18204918 (Low FT)" → "FLOAT" / "0.18204918": the mobile chip's short form. */
function toShowcaseCard({ card, slug, listed }: Card): ShowcaseCard {
  const meter = card.presentation?.meter;
  const cardTone = tone(card.tone);

  return {
    id: card.id,
    slug: slug ?? "",
    image: card.imageUrl ?? "",
    imageAlt: card.imageAlt ?? card.name,
    tag: card.kicker ?? "",
    tagTone: cardTone,
    priceUsd: (card.valueCents ?? 0) / 100,
    name: card.name,
    detail: card.subtitle ?? "",
    stat: { label: meter?.label.split(" ").pop() ?? "", value: meter?.value.split(" ")[0] ?? "", tone: cardTone },
    available: Boolean(listed),
  };
}

/** Quick-link badges are counts of the trader's real escrows, listings and armed alerts. */
function badges(links: QuickLink[], activity: Activity): QuickLink[] {
  const counts: Record<string, QuickLink["badge"]> = {
    dispatches: { text: `${activity.openEscrows} ONGOING`, style: "cyan-pill" },
    listed: { text: `${activity.listed} SKINS`, style: "plain" },
    webhooks: { text: `${activity.armedAlerts} ARMED`, style: "crimson-pill" },
  };
  return links.map((link) => (counts[link.id] ? { ...link, badge: counts[link.id] } : link));
}

export function toProfileMobile(
  chrome: ProfileChrome,
  profile: Profile,
  cards: Card[],
  activity: Activity,
  escrow: Escrow,
): ProfileMobile {
  return {
    tier: reputation(profile.ratingHundredths / 100).tier,
    role: profile.role.toUpperCase(),
    ping: chrome.ping,
    botId: chrome.botId,
    trust: trust(profile, activity),
    escrow: { heldUsd: escrow.escrowCents / 100, pending: plural(escrow.escrowHolds, "pending sign-off") },
    security: { ...chrome.security, tradeUrl: profile.tradeUrl ?? chrome.security.tradeUrl },
    showcase: { total: profile.inventoryCount, items: cards.map(toShowcaseCard) },
    links: badges(chrome.links, activity),
    savedAccounts: chrome.savedAccounts,
    node: chrome.node,
  };
}
