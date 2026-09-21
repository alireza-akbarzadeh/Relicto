import type { TrackingMobile } from "../mobile.types";

const TRADE_OFFER = "steam://openurl/https://steamcommunity.com/tradeoffer/6849102384";

/** Mobile escrow tracker payload, as drawn in the Stitch mobile order tracker. */
export const trackingMobile: TrackingMobile = {
  protocol: "ESCROW PROTOCOL // V2.44",
  code: "#LTR-89412-ESCR",
  cipher: "TLS 1.3",
  offerWindowSeconds: 102,
  item: {
    image: "/images/lootora/orders-mobile-01.jpg",
    imageAlt: "Butterfly Knife Doppler Phase 4",
    rarity: "COVERT ★",
    wear: "FACTORY NEW",
    float: "0.01124190",
    name: "★ Butterfly Knife",
    finish: "Doppler Phase 4 (Sapphire Accent)",
    priceUsd: 3150,
    lock: "VAULT LOCKED",
  },
  seller: { initials: "KV", name: "Kuro_Vault", since: "Steam Member Since 2015", trust: "99.8% TRUST" },
  steps: [
    { id: "locked", state: "done", title: "Multi-Sig Escrow Locked", stamp: "14:02 UTC", body: "Deposit of $3,150.00 isolated in smart vault #9802." },
    { id: "dispatch", state: "done", title: "Bot #14 Steam Dispatch", stamp: "14:03 UTC", body: "Cryptographic handshake generated via Steam Web API." },
    {
      id: "offer",
      state: "active",
      title: "Trade Offer Dispatched",
      stamp: "ACTIVE",
      details: [
        { label: "Bot Security Token:", value: "#9482", tone: "cyan" },
        { label: "Trade ID:", value: "6849102384", tone: "plain" },
      ],
    },
    { id: "release", state: "pending", title: "Escrow Release & Transfer", stamp: "PENDING", body: "Funds credit automatically upon Steam Guard item confirmation." },
  ],
  tradeOfferUrl: TRADE_OFFER,
  shield: {
    intro: "Verify these exact bot attributes in your Steam Guard trade window before approving:",
    facts: [
      { label: "OFFICIAL BOT NAME", value: "Relicto_Escrow_14", truncate: true },
      { label: "STEAM LEVEL / AGE", value: "Lvl 50 (Est. 2017)" },
    ],
    passphrase: "NEO-TITAN-CYAN-88",
  },
  telemetry: [
    { tone: "cyan", label: "WS: 9ms" },
    { icon: "pulse_alert", tone: "amber", label: "VALVE API: 99.99%" },
    { icon: "phonelink_lock", tone: "indigo", label: "2FA SYNCED" },
  ],
};
