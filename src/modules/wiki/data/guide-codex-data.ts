export interface GuideCodexEntry {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  lastUpdated: string;
  executiveSummary: string;
  sections: Array<{
    heading: string;
    body: string;
    bulletPoints?: string[];
    table?: {
      headers: string[];
      rows: string[][];
    };
    formula?: string;
  }>;
  traderAdvice: string[];
}

export const GUIDE_CODEX_DATA: Record<string, GuideCodexEntry> = {
  doppler: {
    id: "doppler",
    title: "★ Doppler & Gamma Doppler Phase Science",
    subtitle: "Source 2 Physical Optics, Spectral Index Variance & Valuation Tiers",
    author: "@Anomalous_Quant",
    authorRole: "Senior Optics Researcher & Relicto Archivist",
    lastUpdated: "Source 2 Engine Spec v4.8",
    executiveSummary: "In Source 2, Valve overhauled the Anodized Multicolored shader pipeline. Doppler finishes no longer render with flat specular highlights; instead, PBR specular reflection and subsurface Fresnel diffusion give Ruby, Sapphire, and Phase 2 distinctly higher light reflection indexes.",
    sections: [
      {
        heading: "1. The 7 Canonical Doppler Subclasses",
        body: "Every Doppler skin generated belongs to one of four numbered phases or three legendary gem anomalies. The probability distribution is heavily skewed toward Phases 1 and 3.",
        table: {
          headers: ["Phase / Subclass", "Color Spectrum", "Drop Chance", "Market Premium"],
          rows: [
            ["Phase 1", "Dark Blue / Smoke / Purple", "33.2%", "Baseline / Floor"],
            ["Phase 2", "Vibrant Magenta / Pink Galaxy", "16.8%", "+35% to +60% Overpay"],
            ["Phase 3", "Cyan / Brown / Green tint", "33.2%", "Baseline / Floor"],
            ["Phase 4", "Deep Cobalt / Bright Cyan", "16.8%", "+20% to +45% Overpay"],
            ["Ruby", "100% Solid Blood Crimson", "0.008%", "+500% to +900% Premium"],
            ["Sapphire", "100% Solid Deep Cerulean", "0.008%", "+700% to +1200% Premium"],
            ["Black Pearl", "Onyx / Purple / Amber Pearlescent", "0.004%", "Rarest Gem Tier"],
          ],
        },
      },
      {
        heading: "2. Gamma Doppler Variants",
        body: "Gamma Doppler variants replace the purple/pink palette with emerald hues. Phase 2 (Max Green) commands the highest regular overpay, rivaled only by the legendary Emerald Gem.",
        bulletPoints: [
          "Phase 2 Max Green: Look for full lime coverage extending into the tip ring.",
          "Emerald Gem: Solid neon green with zero black or cyan patches.",
        ],
      },
    ],
    traderAdvice: [
      "Always inspect Phase 2 and Phase 4 knives under Source 2 outdoor lighting (e.g. Dust II A-Site).",
      "Sapphire prices fluctuate heavily around major Valve operations — watch liquidity depth before acquiring.",
    ],
  },
  "blue-gem": {
    id: "blue-gem",
    title: "Case Hardened Blue Gem Comprehensive Index",
    subtitle: "UV Texture Map Polygon Coordinates & Historical Tier-1 Valuations",
    author: "@ZipeI_Audit",
    authorRole: "CS2 High-Tier Asset Valuator",
    lastUpdated: "Seed Polygon Database v2.4",
    executiveSummary: "Case Hardened skins apply a 360-degree color pattern from a fixed 1024x1024 texture sheet. A deterministic integer seed (1-1000) picks the UV offset. When the offset lands on pure cyan chemical stains, a 'Blue Gem' is born.",
    sections: [
      {
        heading: "1. The Legendary AK-47 Pattern Tiers",
        body: "Tier-1 AK-47s must feature at least 88% continuous sky-blue across the top receiver plate. Gaps or purple blotches immediately downgrade the pattern to Tier 2.",
        table: {
          headers: ["Pattern Seed", "Community Alias", "Blue %", "Historical High Sale"],
          rows: [
            ["#661", "The Scar Pattern", "98.4%", "$1,000,000+ (StatTrak FN)"],
            ["#387", "Reverse Scar #1", "94.2%", "$180,000 (FN)"],
            ["#321", "Blue Top True", "93.6%", "$140,000 (FN)"],
            ["#670", "Reverse Scar #2", "92.8%", "$95,000 (MW)"],
            ["#151", "Solid Blue Butt", "89.2%", "$65,000 (MW)"],
          ],
        },
      },
      {
        heading: "2. Karambit & Butterfly Corner Quality",
        body: "For knives, the playside blade is the critical price driver. Karambit #387 is widely recognized as the single most iconic knife seed in Counter-Strike history.",
      },
    ],
    traderAdvice: [
      "Never trade for high-tier Blue Gems based on screenshots alone; inspect in-game via inspect link or Relicto 3D viewer.",
      "Check the back-end receiver ('butt') of the AK-47 — buyers heavily penalize rust spots on the stock transition.",
    ],
  },
  prismatic: {
    id: "prismatic",
    title: "Dota 2 Prismatic Gem & Unusual Particle Codex",
    subtitle: "Color Extraction, Artificer's Hammer Mechanics & Courier Valuations",
    author: "@IceFrogScholar",
    authorRole: "Dota 2 Heritage Archivist",
    lastUpdated: "Source 2 Panorama Update",
    executiveSummary: "Prismatic gems provide custom hex-coded particle lighting for Dota 2 Unusual Couriers, Terrorblade Fractal Horns of Inner Abysm, and Witch Doctor Prowling Shadow Arcanas. Destroying an Unusual Courier to extract a gem is permanent.",
    sections: [
      {
        heading: "1. High-Value Prismatic Colors",
        body: "Color gems fall into Legacy (generated between 2012-2013 with unconstrained RGB values) and Standard canonical drop colors.",
        table: {
          headers: ["Gem Name", "Hex Code", "Spectrum Category", "Relative Value"],
          rows: [
            ["Creator's Light", "#FFFFFF", "Pure Radiant White", "Highest Demand"],
            ["Midas Gold", "#FFD700", "Molten Gold Glow", "Very High"],
            ["Ember Flame", "#FFA500", "Deep Solar Orange", "High"],
            ["Sea Green", "#2E8B57", "Bioluminescent Teal", "Moderate"],
            ["Dungeon Doom", "#7B1FA2", "Abyssal Violet", "Standard"],
          ],
        },
      },
    ],
    traderAdvice: [
      "Terrorblade Arcanas retain ~75% of the inserted Prismatic Gem's standalone value upon resale.",
      "Legacy Gems with non-standard RGB combinations must have their provenance verified against the 2013 Steam schema log.",
    ],
  },
  float: {
    id: "float",
    title: "Trade-Up Contract Float Decimal Engineering",
    subtitle: "IEEE 754 32-bit Floating Point Determinism & Float Manipulation",
    author: "@MatrixSolver",
    authorRole: "Algorithmic Arbitrage Specialist",
    lastUpdated: "Contract Audit Build 9.1",
    executiveSummary: "The CS2 Trade-Up Contract is not random in its wear outcome. Valve computes the output float using an exact linear interpolation between the collection's Min and Max float bounds based on the arithmetic mean of all 10 input skins.",
    sections: [
      {
        heading: "1. The Fundamental Float Formula",
        body: "The output skin float is governed by this deterministic mathematical equation:",
        formula: "Outcome_Float = (Max_Float - Min_Float) × Average(Input_Floats) + Min_Float",
      },
      {
        heading: "2. The 0.00000000 Collector Boundary",
        body: "To craft a skin with a float below 0.0001, low-float filler skins (such as Acid Fade or Tuxedo with floats under 0.005) are mixed with target collection skins to depress the input average.",
      },
    ],
    traderAdvice: [
      "Always verify if the target collection skin has capped wear bounds (e.g. 0.06 to 0.80 for Fire Serpent).",
      "StatTrak trade-ups require all 10 inputs to be StatTrak — never mix standard and StatTrak items.",
    ],
  },
};
