import type { CopilotMessage } from "../types";

export const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: "init-welcome",
    role: "assistant",
    content:
      "Hello! I'm Ali, your Sentinel AI Copilot and trade guardian.\n\nI monitor Valve Steam 7-day trade holds, explain Dota 2 Collector's Cache 31-day gift rules, audit Steam Web API key hijacking threats, and safeguard your escrow trades. Ask me anything or click a quick prompt below!",
    timestamp: "NOW",
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
  },
];
