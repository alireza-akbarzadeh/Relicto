const STEAM_ID_BASE = BigInt("76561197960265728");

export function parseSteamInput(input: string): { steamId: string | null; tradeUrl: string | null; error?: string } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { steamId: null, tradeUrl: null, error: "Please enter a SteamID64 or Steam Trade URL" };
  }

  // 1. Direct 17-digit SteamID64
  if (/^\d{17}$/.test(trimmed)) {
    return { steamId: trimmed, tradeUrl: null };
  }

  // 2. Profile URL: steamcommunity.com/profiles/<steamId64>
  const profileMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (profileMatch) {
    return { steamId: profileMatch[1], tradeUrl: null };
  }

  // 3. Trade URL: steamcommunity.com/tradeoffer/new/?partner=<partnerId>&token=<token>
  const tradeMatch = trimmed.match(/partner=(\d+)/);
  if (tradeMatch) {
    const partnerId = BigInt(tradeMatch[1]);
    const steamId = (STEAM_ID_BASE + partnerId).toString();
    return { steamId, tradeUrl: trimmed };
  }

  return { steamId: null, tradeUrl: null, error: "Invalid format. Provide a 17-digit SteamID64 or full Steam Trade URL." };
}
