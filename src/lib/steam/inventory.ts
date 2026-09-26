import "server-only";

/**
 * Steam's public community inventory endpoint. No API key: it serves any
 * inventory the owner has set to public, and 401/403 for a private one.
 * It rate-limits per IP (429), so callers throttle — see inventory-sync.
 */

export type SteamTag = {
  category: string;
  internal_name: string;
  localized_tag_name?: string;
  color?: string;
};

export type SteamDescription = {
  classid: string;
  instanceid: string;
  icon_url: string;
  name: string;
  market_hash_name: string;
  type?: string;
  tradable: number;
  marketable: number;
  name_color?: string;
  tags?: SteamTag[];
};

export type SteamAsset = {
  appid: number;
  contextid: string;
  assetid: string;
  classid: string;
  instanceid: string;
  amount: string;
};

/** One copy with the description Steam files it under. */
export type SteamItem = {
  appId: number;
  assetId: string;
  description: SteamDescription;
};

export type InventoryFetch =
  | { status: "ok"; items: SteamItem[] }
  | { status: "private" | "rate-limited" | "unavailable" };

type Page = {
  assets?: SteamAsset[];
  descriptions?: SteamDescription[];
  more_items?: number;
  last_assetid?: string;
  success?: number;
};

const PAGE_SIZE = 2000;
/** 10,000 items per game is well past any real trader; it bounds a runaway loop. */
const MAX_PAGES = 5;

/** Every item in one game's inventory (context 2 is the tradable one for CS2, Dota 2 and TF2). */
export async function fetchSteamInventory(
  steamId: string,
  appId: number,
): Promise<InventoryFetch> {
  const items: SteamItem[] = [];
  let start: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const url = new URL(
      `https://steamcommunity.com/inventory/${steamId}/${appId}/2`,
    );
    url.searchParams.set("l", "english");
    url.searchParams.set("count", String(PAGE_SIZE));
    if (start) url.searchParams.set("start_assetid", start);

    let response: Response;
    try {
      response = await fetch(url, {
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });
    } catch {
      return { status: "unavailable" };
    }
    // Steam answers a private inventory with 403, or 401 for some profiles.
    if (response.status === 401 || response.status === 403)
      return { status: "private" };
    if (response.status === 429) return { status: "rate-limited" };
    if (!response.ok) return { status: "unavailable" };

    const body = (await response.json().catch(() => null)) as Page | null;
    if (!body || body.success !== 1) return { status: "unavailable" };

    const byClass = new Map(
      (body.descriptions ?? []).map((d) => [`${d.classid}_${d.instanceid}`, d]),
    );
    for (const asset of body.assets ?? []) {
      const description = byClass.get(`${asset.classid}_${asset.instanceid}`);
      if (description)
        items.push({ appId, assetId: asset.assetid, description });
    }

    if (!body.more_items || !body.last_assetid) return { status: "ok", items };
    start = body.last_assetid;
  }
  return { status: "ok", items };
}

/** Steam's CDN path for an item icon, at the size the studio renders. */
export const steamIconUrl = (iconUrl: string) =>
  `https://community.cloudflare.steamstatic.com/economy/image/${iconUrl}/360fx360f`;
