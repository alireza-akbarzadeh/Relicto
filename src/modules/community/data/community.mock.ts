import type { CommunityData } from "../types";

export const community: CommunityData = {
  guilds: [
    { name: "Whale Vault", detail: "1.2k Syndicate • $25M Cap", symbol: "♛", tone: "amber" },
    { name: "CS2 Low-Float Hunters", detail: "8.4k Members • 0.00x Seekers", symbol: "◈", tone: "cyan" },
    { name: "Legacy Gem Syndicate", detail: "3.1k Dota 2 Curators", symbol: "◆", tone: "indigo" },
    { name: "Zero-Loss Arbitrage", detail: "14.2k High Freq Ops", symbol: "⚡", tone: "primary" },
  ],
  posts: [
    { id: "p1", initials: "KV", handle: "@Kuro_Vault", role: "Verified Tier 1 Trader", roleTone: "amber", age: "14m ago", tag: "TRADE-UP JACKPOT", tagTone: "primary", title: "🔥 HIT THE 10% CHANCE! M4A1-S Printstream 0.0019 FN after 8 brutal failures!", body: "Total input cost was $420 using custom low-float filler Negev Dropouts & Fracture Mil-Specs. Algorithm pegged my odds at exactly 9.87%. First try on today’s server seed rotation! ROI calculation and telemetry below.", image: "/images/lootora/sell-items-06.jpg", metric: { label: "Net Verified Yield", value: "+340.4%", delta: "($1,430)" }, likes: 84, comments: 32 },
    { id: "p2", initials: "SD", handle: "@StatsDonk", role: "Quant Analyst", roleTone: "cyan", age: "2h ago", tag: "SIGNAL: STRONG ACCUMULATION", tagTone: "cyan", title: "Dota 2 Patch 7.38c Analysis: Why Morphling & PA items are primed for +25% surge before Riyadh Masters", body: "Ability hero agility scaling adjustments coupled with the recent RBF duration reduction make Ethereal Blade and Manifold Paradox arcana builds mandatory in tier-1 drafts. Exchange order book depth shows swell runs.", metric: { label: "7D Asset Velocity", value: "$248.90", delta: "+18.4% this week" }, likes: 142, comments: 49 },
    { id: "p3", initials: "ES", handle: "@EchoSeller", role: "Escrow Affiliate", roleTone: "primary", age: "4h ago", tag: "MULTI-SIG VALIDATED", tagTone: "cyan", title: "Massive vouch for @s1mple_cs: Dispatched $5,200 Souvenir AWP Dragon Lore in 28 seconds via Lootora Multi-Sig Bot #09. Flawless escrow.", body: "Direct counterparty peer trade executed. Both deposit hashes locked in smart custody and Steam API session tokens expired asynchronously after key delivery. Zero friction.", likes: 208, comments: 18 },
  ],
};
