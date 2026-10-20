export type SteamMarketTarget = {
  name: string;
  gameId?: string;
  appId?: string | number;
  wear?: string | null;
  stattrak?: boolean;
};

const CS2_WEAR_MAP: Record<string, string> = {
  fn: "Factory New",
  mw: "Minimal Wear",
  ft: "Field-Tested",
  ww: "Well-Worn",
  bs: "Battle-Scarred",
};

const CS2_MELEE_KEYWORDS = [
  "knife",
  "bayonet",
  "karambit",
  "daggers",
  "gloves",
  "hand wraps",
];

/**
 * Builds the direct Steam Community Market listings URL for any game asset
 * (e.g. https://steamcommunity.com/market/listings/570/Monarch%20of%20the%20Sapphire%20Glen).
 */
export function getSteamMarketUrl(target: SteamMarketTarget): string {
  const normGame = (target.gameId ?? "").toLowerCase().replace(/[\s\-_]+/g, "");
  const appId =
    target.appId ??
    (normGame.includes("cs")
      ? "730"
      : normGame.includes("tf")
        ? "440"
        : "570");

  let marketName = target.name.trim();

  // If CS2 knife or glove lacks canonical Steam '★ ' prefix
  if (appId === "730" && !marketName.startsWith("★")) {
    const isMeleeOrGlove = CS2_MELEE_KEYWORDS.some((kw) =>
      marketName.toLowerCase().includes(kw),
    );
    if (isMeleeOrGlove) {
      marketName = `★ ${marketName}`;
    }
  }

  // If CS2 StatTrak is present and not already in the name
  if (target.stattrak && !marketName.includes("StatTrak™")) {
    marketName = marketName.startsWith("★ ")
      ? `★ StatTrak™ ${marketName.slice(2)}`
      : `StatTrak™ ${marketName}`;
  }

  // If CS2 wear grade is present and not already in the name
  if (target.wear) {
    const wearLower = target.wear.toLowerCase();
    const wearFull = CS2_WEAR_MAP[wearLower] ?? target.wear;
    if (!marketName.includes(`(${wearFull})`)) {
      marketName = `${marketName} (${wearFull})`;
    }
  }

  return `https://steamcommunity.com/market/listings/${appId}/${encodeURIComponent(marketName)}`;
}
