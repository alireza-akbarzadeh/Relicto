import type { IconName } from "@/components/ui/icon";

export type CheckoutItem = {
  id: string;
  image: string;
  imageAlt: string;
  badge: string;
  badgeTone: string;
  game: string;
  gameTone: string;
  name: string;
  subname?: string;
  category?: string;
  detail: string;
  intel: string[];
  bot: string;
  price: number;
  marketPrice?: number;
  discountPercentage?: number;
  wear?: string;
  floatValue?: number;
  paintSeed?: number;
  marker: string;
  markerTone: string;
  icon?: IconName;
};

export type PaymentRail = {
  id: string;
  title: string;
  detail: string;
  note: string;
  icon: IconName;
  badge?: string;
  tone: "primary" | "amber" | "cyan" | "muted";
};

export type CheckoutData = {
  session: string;
  items: CheckoutItem[];
  paymentRails: PaymentRail[];
  subtotal: number;
  comboDiscount: number;
  promoDiscount: number;
  walletAfter: string;
};

export const checkout: CheckoutData = {
  session: "#CHK-89410-ES",
  subtotal: 3688.5,
  comboDiscount: 25,
  promoDiscount: 15,
  walletAfter: "$1,243.90 USD Remaining",
  items: [
    {
      id: "butterfly",
      image: "/images/lootora/sell-items-01.jpg",
      imageAlt: "Butterfly Knife Doppler Phase 4",
      name: "Butterfly Knife",
      subname: "Doppler Phase 4",
      category: "★ Covert Knife",
      badge: "Covert ★",
      badgeTone: "bg-status-live text-text-primary",
      game: "CS2 Elite",
      gameTone: "text-tertiary",
      detail: "Factory New • Float: 0.0112 (Rank #18 Scratchless)",
      wear: "FN",
      floatValue: 0.0112,
      paintSeed: 412,
      price: 3150.0,
      marketPrice: 3430.0,
      discountPercentage: 8,
      intel: ["Vendor: ValkyrieTrading (100% Score)", "Nametag: 'Sapphire Drift'"],
      bot: "Sentinel Bot #09",
      marker: "FN 0.0112",
      markerTone: "text-status-upcoming",
    },
    {
      id: "manifold",
      image: "/images/lootora/item-detail-01.jpg",
      imageAlt: "Phantom Assassin Manifold Paradox arcana blades",
      name: "Manifold Paradox",
      subname: "Phantom Assassin • Style 3",
      category: "★ Exalted Arcana",
      badge: "Arcana",
      badgeTone: "bg-primary-container text-on-primary-container",
      game: "Dota 2",
      gameTone: "text-secondary",
      detail: "Phantom Assassin Weapon Artifact • Style 3 Unlocked",
      wear: "ARC",
      price: 118.5,
      marketPrice: 132.0,
      discountPercentage: 10,
      intel: ["1,420 Recorded Kills Gem", "Vendor: KuroSkins (99.8% Trust)"],
      bot: "Sentinel Bot #42",
      marker: "Style 3",
      markerTone: "text-text-primary",
    },
    {
      id: "case-hardened",
      image: "/images/lootora/sell-items-04.jpg",
      imageAlt: "AK-47 Case Hardened blue gem",
      name: "AK-47 | Case Hardened",
      subname: "Pattern Template #571",
      category: "★ Classified Rifle",
      badge: "Classified",
      badgeTone: "bg-primary-container text-on-primary-container",
      game: "CS2 Rifle",
      gameTone: "text-tertiary",
      detail: "Well-Worn • Pattern Template #571 (72% Clean Sky Blue Top)",
      wear: "WW",
      floatValue: 0.418,
      paintSeed: 571,
      price: 420.0,
      marketPrice: 460.0,
      discountPercentage: 9,
      intel: ["Vendor: S1mple_CS Direct", "Sticker: Cloud9 (Holo) | Boston 2018"],
      bot: "Sentinel Bot #14",
      marker: "WW 0.418",
      markerTone: "text-tertiary",
    },
  ],
  paymentRails: [
    {
      id: "relicto",
      title: "Lootora Vault Balance",
      detail: "Avail: $4,289.50 USD",
      note: "Instant 0% fee execution",
      icon: "account_balance_wallet",
      badge: "Fastest",
      tone: "cyan",
    },
    {
      id: "crypto",
      title: "Web3 Crypto / Steam Pay",
      detail: "USDT • BTC • SOL • ETH",
      note: "Immediate on-chain settlement",
      icon: "currency_bitcoin",
      badge: "0% Gas",
      tone: "amber",
    },
    {
      id: "steam",
      title: "Steam Balance Split",
      detail: "$142.50 Steam + Balance Card",
      note: "Split Rail",
      icon: "account_balance",
      tone: "muted",
    },
    {
      id: "card",
      title: "Credit / Debit Card",
      detail: "Visa, Mastercard, Apple Pay",
      note: "3D Secure",
      icon: "credit_card",
      tone: "muted",
    },
  ],
};