import type { CheckoutData } from "../types";

export const checkout: CheckoutData = {
  session: "#CHK-89410-ES",
  subtotal: 3688.5,
  comboDiscount: 25,
  promoDiscount: 15,
  walletAfter: "$1,243.90 USD Remaining",
  items: [
    { id: "manifold", image: "/images/lootora/item-detail-01.jpg", imageAlt: "Phantom Assassin Manifold Paradox arcana blades", badge: "Arcana", badgeTone: "bg-primary-container text-on-primary-container", game: "Dota 2", gameTone: "text-secondary", name: "Manifold Paradox (Exalted)", detail: "Phantom Assassin Weapon Artifact • Style 3 Unlocked", intel: ["1,420 Recorded Kills Gem", "Vendor: KuroSkins (99.8% Trust)"], bot: "Sentinel Bot #42", price: 118.5, marker: "Style 3", markerTone: "text-text-primary" },
    { id: "butterfly", image: "/images/lootora/sell-items-01.jpg", imageAlt: "Butterfly Knife Doppler Phase 4", badge: "Covert ★", badgeTone: "bg-status-live text-text-primary", game: "CS2 Elite", gameTone: "text-tertiary", name: "★ Butterfly Knife | Doppler", detail: "Factory New • Float: 0.0112 (Rank #18 Scratchless)", intel: ["Vendor: ValkyrieTrading (100% Score)", "Nametag: 'Sapphire Drift'"], bot: "Sentinel Bot #09", price: 3150, marker: "FN 0.0112", markerTone: "text-status-upcoming" },
    { id: "case-hardened", image: "/images/lootora/sell-items-04.jpg", imageAlt: "AK-47 Case Hardened blue gem", badge: "Classified", badgeTone: "bg-primary-container text-on-primary-container", game: "CS2 Rifle", gameTone: "text-tertiary", name: "AK-47 | Case Hardened", detail: "Well-Worn • Pattern Template #571 (72% Clean Sky Blue Top)", intel: ["Vendor: S1mple_CS Direct", "Sticker: Cloud9 (Holo) | Boston 2018"], bot: "Sentinel Bot #14", price: 420, marker: "WW 0.418", markerTone: "text-tertiary" },
  ],
  paymentRails: [
    { id: "relicto", title: "Relicto Wallet", detail: "Avail: $4,892.40 USD", note: "Instant 0% fee", icon: "account_balance_wallet", badge: "Fastest", tone: "cyan" },
    { id: "steam", title: "Steam Balance Split", detail: "$142.50 Steam + Balance Card", note: "Split Rail", icon: "account_balance", tone: "muted" },
    { id: "crypto", title: "Web3 Polygon Crypto", detail: "USDC / USDT / SOL / ETH", note: "1 Confirmation", icon: "currency_bitcoin", badge: "0% Gas", tone: "amber" },
    { id: "card", title: "Credit / Debit Card", detail: "Visa, Mastercard, Apple Pay", note: "3D Secure", icon: "credit_card", tone: "muted" },
  ],
};
