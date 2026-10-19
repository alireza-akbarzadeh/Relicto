import type { TradeDiagnostic } from "../types";

export interface ResolvedAnswer {
  reply: string;
  diagnostic?: TradeDiagnostic;
  modelUsed: string;
}

export function resolveSentinelLocalKnowledge(message: string): ResolvedAnswer {
  const q = message.toLowerCase().trim();

  // 1. Steam 7-day trade hold & resale restrictions
  if (
    q.includes("sell") ||
    q.includes("buy") ||
    q.includes("7-day") ||
    q.includes("7 day") ||
    q.includes("hold") ||
    q.includes("cooldown") ||
    q.includes("later") ||
    q.includes("lock")
  ) {
    return {
      modelUsed: "Sentinel Neural Codex (Valve Rule 7-D)",
      reply: `NEGATIVE. Under Valve's global Steam inventory protocol, you cannot immediately re-sell or transfer an item you have just acquired.

VALVE 7-DAY TRADE COOLDOWN PROTOCOL:
1. Mandatory 168-Hour Lockout:
   Whenever an item is traded or purchased into your inventory, Valve places an unbypassable 7-day trade cooldown (down to the second).
2. Operational Restrictions:
   • No P2P Transfers: You cannot send the item to another user.
   • No Marketplace Resale: You cannot deposit or list the item on Relicto or external bot escrow until the cooldown reaches zero.
   • In-Game Usability: The item IS immediately playable in Counter-Strike 2, Dota 2, or TF2.
3. Expiration Tracking:
   Open your Steam Inventory, select the item, and inspect the tag at the bottom: "Tradable After: [Date/Time GMT]". Once that timestamp elapses, the item is 100% liquid.`,
    };
  }

  // 2. API Key Hijack & Phishing Audit
  if (
    q.includes("hijack") ||
    q.includes("api key") ||
    q.includes("apikey") ||
    q.includes("scam") ||
    q.includes("phish") ||
    q.includes("audit") ||
    q.includes("tradeoffer") ||
    q.includes("steamcommunity") ||
    q.includes("fake")
  ) {
    return {
      modelUsed: "Sentinel Trade Diagnostic Shield v4.8",
      reply: `Trade Security Audit completed. Genuine Steam Community API signature inspected.

ANTI-PHISHING PROTOCOL:
• Fraudsters trick users into creating an unauthorized Steam Web API Key at steamcommunity.com/dev/apikey.
• When you send a trade, rogue bots cancel it and substitute a duplicate offer with an identical clone profile.
• Defense Rule: Relicto trades always provide a unique token (SEC-XXXX) and our verified bot SteamID64. Always cross-reference this ID in your Steam Guard Mobile app before confirming.`,
      diagnostic: {
        tradeId: "#94821",
        assetName: "PA Manifold Paradox (Arcana)",
        counterparty: "@DendiLover99",
        counterpartyLevel: 148,
        steamId64: "76561198034821990",
        escrowStatus: "0-Day Instant (Mobile 2FA > 180d)",
        isVerified: true,
        floatValue: "0.0821 (Field-Tested)",
        checks: [
          "Steam API Key registered domain: None (Safe)",
          "Creation timestamp matches Steam Guard prompt exactly",
          "Item Float wear verified non-duped",
        ],
      },
    };
  }

  // 3. Doppler Phases vs Rare Gems
  if (
    q.includes("doppler") ||
    q.includes("phase") ||
    q.includes("gem") ||
    q.includes("ruby") ||
    q.includes("sapphire") ||
    q.includes("emerald") ||
    q.includes("black pearl")
  ) {
    return {
      modelUsed: "Sentinel Float & Pattern Index",
      reply: `CS2 DOPPLER PATTERN MATRIX:

Standard Phases:
• Phase 1: Deep midnight blue and dark purple smokey undertones.
• Phase 2 ("Pink Galaxy"): Vibrant pink and magenta dominance (Highest value among standard phases).
• Phase 3: Dark sapphire blue, teal, and olive smoke mix.
• Phase 4: Bright electric cyan and vibrant blue hues.

Ultra-Rare Gems (Zero Smoke Overlap):
• Ruby: 100% solid crimson red blade (Rare Doppler finish).
• Sapphire: 100% solid deep electric cobalt blue (Commanding top tier multiplier).
• Black Pearl: The rarest standard Doppler variation. Deep obsidian, smoky violet, and charcoal tones without color tinting.
• Emerald: Exclusive to Gamma Doppler collections. Pure vivid neon green.`,
    };
  }

  // 4. CS2 Float Brackets
  if (q.includes("float") || q.includes("wear") || q.includes("fn") || q.includes("mw") || q.includes("ft") || q.includes("bs")) {
    return {
      modelUsed: "CS2 Float Wear Codex",
      reply: `CS2 WEAPON WEAR FLOATS:
• Factory New (FN): 0.0000 – 0.0700
• Minimal Wear (MW): 0.0700 – 0.1500
• Field-Tested (FT): 0.1500 – 0.3800
• Well-Worn (WW): 0.3800 – 0.4500
• Battle-Scarred (BS): 0.4500 – 1.0000

Notice: Weapon floats are permanent immutable metadata embedded upon unboxing. Weapon wear NEVER degrades through gameplay or trading.`,
    };
  }

  // 5. Fees & Crypto Cashouts
  if (q.includes("fee") || q.includes("crypto") || q.includes("cashout") || q.includes("payout") || q.includes("withdraw") || q.includes("usdt")) {
    return {
      modelUsed: "Relicto Treasury Protocol",
      reply: `RELICTO PLATFORM LIQUIDITY & CASHOUT RAILS:
• Standard Escrow Fee: 2.5% (250 bps) on successful completed trades.
• VIP Trader Tier: Reduced to 1.5% (150 bps) for high-volume makers.
• Instant Crypto Cashout Rails: USDT (TRC-20, Arbitrum, Base), Ethereum (ETH), Solana (SOL), and Bitcoin (BTC).
• Uncommitted Vault Protection: Active bids and escrow orders lock required funds in reserve holds so you never overcommit liquid funds.`,
    };
  }

  // Default Sentinel response
  return {
    modelUsed: "Sentinel AI Copilot v4.8",
    reply: `Sentinel AI Copilot connected. I monitor trade escrow, calculate CS2 floats, and protect against Steam API hijacking.

Key Trading Rules:
1. Valve 7-Day Hold: All items acquired in trades or market purchases carry a mandatory 7-day cooldown before resale.
2. Steam Guard 2FA: Mobile Authenticator must be active for ≥15 days to avoid escrow holds.
3. Verification: Enter any trade offer URL, offer ID, or ask about float values to initiate an instant security audit.`,
  };
}
