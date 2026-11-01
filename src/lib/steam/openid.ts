import "server-only";

/**
 * Steam sign-in speaks OpenID 2.0, not OAuth: Steam redirects back with a
 * signed assertion, and we ask Steam itself whether that assertion is genuine.
 * No secret is exchanged, so every check below matters.
 */

const OP_ENDPOINT = "https://steamcommunity.com/openid/login";
const NS = "http://specs.openid.net/auth/2.0";
const IDENTIFIER_SELECT = "http://specs.openid.net/auth/2.0/identifier_select";
const CLAIMED_ID = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/;

/** Where to send the trader to sign in; Steam returns them to `returnTo`. */
export function steamLoginUrl(returnTo: string, realm: string) {
  const params = new URLSearchParams({
    "openid.ns": NS,
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": IDENTIFIER_SELECT,
    "openid.claimed_id": IDENTIFIER_SELECT,
  });
  return `${OP_ENDPOINT}?${params.toString()}`;
}

/**
 * The SteamID64 Steam vouches for, or null. The response must come from
 * Steam's endpoint, be addressed to our callback, name a Steam identity, and
 * pass Steam's own `check_authentication` (which also burns the nonce, so a
 * replayed response fails).
 */
export async function verifySteamAssertion(query: Record<string, string>, expectedReturnTo: string) {
  if (query["openid.mode"] !== "id_res") return null;
  if (query["openid.op_endpoint"] !== OP_ENDPOINT) return null;

  try {
    const returnToUrl = new URL(query["openid.return_to"] || "");
    const expectedUrl = new URL(expectedReturnTo);
    if (returnToUrl.origin !== expectedUrl.origin || returnToUrl.pathname !== expectedUrl.pathname) {
      return null;
    }
  } catch {
    return null;
  }

  const claimed = query["openid.claimed_id"]?.match(CLAIMED_ID);
  if (!claimed || query["openid.identity"] !== query["openid.claimed_id"]) return null;

  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) if (key.startsWith("openid.")) body.set(key, value);
  body.set("openid.mode", "check_authentication");

  const response = await fetch(OP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  const text = await response.text();
  return response.ok && /(^|\n)is_valid\s*:\s*true(\n|$)/.test(text) ? claimed[1] : null;
}

export type SteamPersona = { name: string; avatar: string | null };

/** Public persona name and avatar; falls back to a neutral name if the Web API key or call fails. */
export async function fetchSteamPersona(steamId: string): Promise<SteamPersona> {
  const fallback = { name: `Steam trader ${steamId.slice(-4)}`, avatar: null };
  if (!/^\d{17}$/.test(steamId)) {
    return { name: "Steam trader", avatar: null };
  }
  const key = process.env.STEAM_API_KEY;
  if (!key) return fallback;

  try {
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamId}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    const player = (await response.json())?.response?.players?.[0];
    return player?.personaname ? { name: player.personaname, avatar: player.avatarfull ?? null } : fallback;
  } catch {
    return fallback;
  }
}

/** Only same-site paths survive the round trip through Steam — no open redirects. */
export function safeCallback(value: string | undefined, fallback = "/marketplace"): string {
  if (!value || typeof value !== "string") return fallback;

  // Reject paths with backslashes, protocol-relative prefixes, or non-slash prefixes
  if (value.includes("\\") || value.startsWith("//") || !value.startsWith("/")) {
    return fallback;
  }

  try {
    const dummyOrigin = "http://localhost";
    const parsed = new URL(value, dummyOrigin);

    if (parsed.origin !== dummyOrigin || !parsed.pathname.startsWith("/") || parsed.pathname.includes("\\")) {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
