import "server-only";

import { Client } from "pg";

/**
 * One `LISTEN market` connection per server instance, fanned out to every
 * stream watching an item. Postgres triggers (migration 0021) notify with the
 * item id whenever its listings, offers or price points change.
 *
 * LISTEN needs a session connection, so this uses the direct (unpooled) URL —
 * Neon's pooler runs in transaction mode. The connection closes a minute
 * after the last watcher leaves, so an idle app lets the database sleep.
 */

type Watcher = () => void;

const watchers = new Map<string, Set<Watcher>>();
let client: Client | null = null;
let connecting: Promise<boolean> | null = null;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

const IDLE_CLOSE_MS = 60_000;

function drop() {
  const old = client;
  client = null;
  old?.end().catch(() => {});
}

async function connect(): Promise<boolean> {
  if (client) return true;
  if (connecting) return connecting;

  connecting = (async () => {
    const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
    if (!url) return false;
    const next = new Client({ connectionString: url });
    try {
      await next.connect();
      await next.query("LISTEN market");
      next.on("notification", (message) => {
        if (message.channel === "market" && message.payload) watchers.get(message.payload)?.forEach((notify) => notify());
      });
      // A dropped connection is replaced on the next subscribe; streams keep a slow poll meanwhile.
      next.on("error", drop);
      next.on("end", () => {
        if (client === next) client = null;
      });
      client = next;
      return true;
    } catch {
      await next.end().catch(() => {});
      return false;
    } finally {
      connecting = null;
    }
  })();
  return connecting;
}

/**
 * Calls `notify` whenever the item's market changes. `live` says whether push
 * is working; when it isn't, the caller should poll.
 */
export async function watchItem(itemId: string, notify: Watcher): Promise<{ live: boolean; stop: () => void }> {
  if (idleTimer) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
  const set = watchers.get(itemId) ?? new Set<Watcher>();
  set.add(notify);
  watchers.set(itemId, set);

  const live = await connect();

  const stop = () => {
    set.delete(notify);
    if (set.size === 0) watchers.delete(itemId);
    if (watchers.size === 0 && !idleTimer) {
      idleTimer = setTimeout(() => {
        idleTimer = null;
        if (watchers.size === 0) drop();
      }, IDLE_CLOSE_MS);
    }
  };
  return { live, stop };
}
