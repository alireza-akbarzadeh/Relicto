import type { IconName } from "@/components/ui/icon";

/** Data contracts of the mobile order tracker (Stitch: "Lootora Mobile — Live Order Tracker & Escrow Protocol"). */

export type MobileEscrowStep = {
  id: string;
  state: "done" | "active" | "pending";
  title: string;
  stamp: string;
  body?: string;
  /** Active step only: bot token and trade id rows. */
  details?: { label: string; value: string; tone: "cyan" | "plain" }[];
};

export type TrackingMobile = {
  protocol: string;
  code: string;
  cipher: string;
  /** Seconds left in the Steam trade-offer window. */
  offerWindowSeconds: number;
  item: {
    image: string;
    imageAlt: string;
    rarity: string;
    wear: string;
    float: string;
    name: string;
    finish: string;
    priceUsd: number;
    lock: string;
  };
  seller: { initials: string; name: string; since: string; trust: string };
  steps: MobileEscrowStep[];
  tradeOfferUrl: string;
  shield: {
    intro: string;
    facts: { label: string; value: string; truncate?: boolean }[];
    passphrase: string;
  };
  telemetry: { icon?: IconName; tone: "cyan" | "amber" | "indigo"; label: string }[];
};
