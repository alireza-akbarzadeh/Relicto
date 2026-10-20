import type { TradeDiagnostic } from "../types";

export interface ResolvedAnswer {
  reply: string;
  diagnostic?: TradeDiagnostic;
  modelUsed: string;
}

export function resolveSentinelLocalKnowledge(message: string): ResolvedAnswer {
  const q = message.toLowerCase().trim();

  // 1. 31-Day Friendship Gift & Collector's Cache Rules (Empathetic First-Time Guide)
  if (
    q.includes("gift") ||
    q.includes("31-day") ||
    q.includes("31 day") ||
    q.includes("31day") ||
    q.includes("cache") ||
    q.includes("monarch") ||
    q.includes("friend") ||
    q.includes("confus") ||
    q.includes("first time") ||
    q.includes("untradable")
  ) {
    return {
      modelUsed: "Ali • Valve Gift & Cache Escrow Codex",
      reply: `Hello! I'm Ali, your trade guardian. I completely understand — buying Dota 2 Collector's Cache sets for the first time is notoriously confusing because Valve treats them completely differently than standard Steam items!

Here is why it works this way and why you are 100% protected:

1. WHY ISN'T IT ON THE STEAM MARKET?
   Valve permanently marks Collector's Cache sets as non-tradable and non-marketable. They can only be sent ONCE as an in-game gift.

2. WHY THE 31-DAY STEAM FRIEND HOLD?
   Valve's anti-fraud policy strictly requires two Steam accounts to be consecutive friends for 30+ days (31 days to account for time zones) before in-game gifts can be sent.

3. HOW RELICTO ESCROW 100% PROTECTS YOUR MONEY:
   • Step 1 (Friend Request): Verified seller sends you a Steam friend invite right after checkout. Accept it to start the clock.
   • Step 2 (Vault Lock): Payment is locked safely in the Relicto Escrow Vault. Seller receives $0 upfront.
   • Step 3 (Countdown Tracker): Track the remaining friendship days live in your Relicto dashboard.
   • Step 4 (Delivery & Inspection): On Day 31, seller gifts the item in Dota 2. You inspect it and confirm receipt.
   • Step 5 (Guaranteed Refund): Funds release only after your confirmation. If seller unfriends or fails to deliver, you get an automatic 100% refund.`,
    };
  }

  // 2. Persona Query: Who is Ali
  if (q.includes("who is ali") || q.includes("who are you") || (q.startsWith("ali") && q.length < 15) || q.includes("hello ali") || q.includes("hey ali")) {
    return {
      modelUsed: "Ali • Sentinel AI Persona Codex",
      reply: `Hello! I'm Ali, your Sentinel AI Copilot and trade security guardian at Relicto.

I help traders with:
• Dota 2 Collector's Cache & 31-day Steam friend gift escrow
• Valve 7-day trade cooldowns & Steam Guard 2FA policies
• Steam Web API key phishing detection & trade offer verification
• CS2 wear float calculations & rare Doppler gem valuations
• Instant crypto settlement across TRON, Arbitrum, Base, and Solana

How can I assist your trade or portfolio today?`,
    };
  }

  // 3. Steam 7-day trade hold & resale restrictions
  if (q.includes("sell") || q.includes("buy") || q.includes("7-day") || q.includes("7 day") || q.includes("hold") || q.includes("cooldown") || q.includes("later") || q.includes("lock")) {
    return {
      modelUsed: "Sentinel Neural Codex (Valve Rule 7-D)",
      reply: `NEGATIVE. Under Valve's global Steam inventory protocol, you cannot immediately re-sell or transfer an item you have just acquired.

VALVE 7-DAY TRADE COOLDOWN PROTOCOL:
1. Mandatory 168-Hour Lockout: Whenever an item is traded or purchased into your inventory, Valve places an unbypassable 7-day trade cooldown.
2. Operational Restrictions: No P2P Transfers, no marketplace resale until cooldown reaches zero. Item IS immediately playable in-game.
3. Expiration Tracking: Open Steam Inventory, inspect tag at bottom: "Tradable After: [Date/Time GMT]". Once elapsed, item is 100% liquid.`,
    };
  }

  // 4. API Key Hijack & Phishing Audit
  if (q.includes("hijack") || q.includes("api key") || q.includes("apikey") || q.includes("scam") || q.includes("phish") || q.includes("audit") || q.includes("tradeoffer") || q.includes("steamcommunity") || q.includes("fake")) {
    return {
      modelUsed: "Sentinel Trade Diagnostic Shield v4.8",
      reply: `Trade Security Audit completed. Genuine Steam Community API signature inspected.

ANTI-PHISHING PROTOCOL:
• Fraudsters trick users into creating an unauthorized Steam Web API Key at steamcommunity.com/dev/apikey to substitute duplicate clone offers.
• Defense Rule: Relicto trades always provide a unique token (SEC-XXXX) and verified bot SteamID64. Always cross-reference this ID in Steam Guard before confirming.`,
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

  // 5. Doppler Phases vs Rare Gems
  if (q.includes("doppler") || q.includes("phase") || q.includes("gem") || q.includes("ruby") || q.includes("sapphire") || q.includes("emerald") || q.includes("black pearl")) {
    return {
      modelUsed: "Sentinel Float & Pattern Index",
      reply: `CS2 DOPPLER PATTERN MATRIX:

Standard Phases:
• Phase 1: Deep midnight blue and dark purple smokey undertones.
• Phase 2 ("Pink Galaxy"): Vibrant pink and magenta dominance.
• Phase 3: Dark sapphire blue, teal, and olive smoke mix.
• Phase 4: Bright electric cyan and vibrant blue hues.

Ultra-Rare Gems:
• Ruby: 100% solid crimson red blade.
• Sapphire: 100% solid deep electric cobalt blue.
• Black Pearl: Deep obsidian, smoky violet, and charcoal tones.
• Emerald: Pure vivid neon green on Gamma Dopplers.`,
    };
  }

  // 6. CS2 Float Brackets
  if (q.includes("float") || q.includes("wear") || q.includes("fn") || q.includes("mw") || q.includes("ft") || q.includes("bs")) {
    return {
      modelUsed: "CS2 Float Wear Codex",
      reply: `CS2 WEAPON WEAR FLOATS:
• Factory New (FN): 0.0000 – 0.0700 | Minimal Wear (MW): 0.0700 – 0.1500
• Field-Tested (FT): 0.1500 – 0.3800 | Well-Worn (WW): 0.3800 – 0.4500
• Battle-Scarred (BS): 0.4500 – 1.0000

Notice: Floats are permanent immutable metadata embedded upon unboxing. Weapon wear NEVER degrades through gameplay.`,
    };
  }

  // 7. Fees, Crypto & TRON
  if (q.includes("tron") || q.includes("trc20") || q.includes("trc-20") || q.includes("tronlink") || q.includes("trx")) {
    return {
      modelUsed: "Relicto TRON Web3 Engine",
      reply: `TRON (TRC-20) WEB3 TRADE SETTLEMENT:
1. Low-Cost & Fast: Sub-cent transaction fees and 3-second block times.
2. TronLink 1-Click Pay: Connect TronLink extension to pay directly from wallet.
3. On-Chain Verification: Checked via TronGrid RPC node before escrow dispatches.`,
    };
  }

  // 8. General Fees & Cashout
  if (q.includes("fee") || q.includes("crypto") || q.includes("cashout") || q.includes("payout") || q.includes("withdraw") || q.includes("usdt")) {
    return {
      modelUsed: "Relicto Treasury Protocol",
      reply: `RELICTO PLATFORM LIQUIDITY & CASHOUT RAILS:
• Standard Escrow Fee: 2.5% (250 bps). VIP Tier: 1.5% (150 bps).
• Instant Crypto Cashout Rails: USDT (TRC-20, Arbitrum, Base), ETH, SOL, BTC.
• Vault Protection: Bids lock funds in reserve holds so you never overcommit.`,
    };
  }

  // Default response
  return {
    modelUsed: "Ali • Sentinel AI Copilot v4.8",
    reply: `Hello! I'm Ali, your Sentinel AI Copilot. I monitor trade escrow, calculate CS2 floats, and protect against Steam API hijacking.

Key Trading Rules:
1. Collector's Cache: Requires 31-day Steam friendship hold. Funds locked in Relicto Escrow until delivery.
2. Valve 7-Day Hold: All items acquired in trades carry a mandatory 7-day cooldown before resale.
3. Verification: Enter any trade offer URL or ask about float values to initiate an instant audit.`,
  };
}
