import "server-only";

import { fetchSteamInventory, type SteamItem } from "@/lib/steam/inventory";
import type { SteamSync } from "@/modules/sell/types";
import { ago } from "../shared/ago";
import {
  catalogNames,
  STEAM_GAMES,
  toInventoryRow,
} from "./inventory-sync.mapper";
import * as repo from "./inventory-sync.repository";

const MINUTE = 60 * 1000;
/** A trader pressing Sync can pull at most once a minute… */
const MANUAL_GAP = MINUTE;
/** …and opening the studio re-pulls once the last pull is this old. */
const STALE_AFTER = 15 * MINUTE;
/** Steam rate-limits its inventory endpoint per IP; back-to-back game pulls trip it. */
const GAME_GAP_MS = 1500;
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type SyncResult =
  | { status: "ok"; itemCount: number; removed: number; cancelled: number }
  | {
      status:
        "private" | "rate-limited" | "unavailable" | "no-steam" | "throttled";
    };

/** Matches a game's items to the catalog in one query. */
async function rowsFor(gameId: string, items: SteamItem[]) {
  const marketable = items.filter((item) => item.description.marketable === 1);
  const names = [
    ...new Set(
      marketable.flatMap((item) => catalogNames(item.description.name)),
    ),
  ];
  const catalog = await repo.matchCatalog(gameId, names);
  return marketable.map((item) => {
    const match = catalogNames(item.description.name)
      .map((name) => catalog.get(name))
      .find(Boolean);
    return toInventoryRow(item, match);
  });
}

export const inventorySyncService = {
  /**
   * Pulls the trader's CS2, Dota 2 and TF2 inventories and mirrors them into
   * the studio. Steam privacy is account-wide, so one private answer ends the
   * pull; a game that errors is skipped rather than wiped.
   */
  async sync(userId: string, { force = false } = {}): Promise<SyncResult> {
    const steamId = await repo.findSteamId(userId);
    if (!steamId) return { status: "no-steam" };

    const last = await repo.findSync(userId);
    const gap = force ? MANUAL_GAP : STALE_AFTER;
    if (last && Date.now() - last.syncedAt.getTime() < gap)
      return { status: "throttled" };

    const rows: Awaited<ReturnType<typeof rowsFor>> = [];
    const answered: string[] = [];
    let failure: "rate-limited" | "unavailable" | null = null;

    for (const [index, game] of STEAM_GAMES.entries()) {
      if (index > 0) await pause(GAME_GAP_MS);
      const result = await fetchSteamInventory(steamId, game.appId);
      if (result.status === "private") {
        await repo.recordAttempt(userId, steamId, "private");
        return { status: "private" };
      }
      if (result.status !== "ok") {
        failure ??= result.status;
        continue;
      }
      answered.push(game.gameId);
      rows.push(...(await rowsFor(game.gameId, result.items)));
    }

    if (answered.length === 0) {
      await repo.recordAttempt(userId, steamId, failure ?? "unavailable");
      return { status: failure ?? "unavailable" };
    }

    const applied = await repo.applySync(
      userId,
      steamId,
      answered,
      rows,
      failure ?? "ok",
    );
    return { status: "ok", itemCount: rows.length, ...applied };
  },

  /** Re-pulls in the background of a studio visit when the mirror has gone stale. */
  refreshIfStale(userId: string) {
    return inventorySyncService
      .sync(userId)
      .catch(() => ({ status: "unavailable" }) as const);
  },

  /** The studio's "Steam Sync" line. */
  async status(userId: string, now = new Date()): Promise<SteamSync> {
    const [steamId, last] = await Promise.all([
      repo.findSteamId(userId),
      repo.findSync(userId),
    ]);
    if (!steamId)
      return { linked: false, status: null, synced: null, itemCount: 0 };
    return {
      linked: true,
      status: last?.status ?? null,
      synced: last ? ago(last.syncedAt, now) : null,
      itemCount: last?.itemCount ?? 0,
    };
  },
};
