import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { TRACKER_MARKETS } from "@/modules/tracker/lib/search-params";
import type { TrackerMarket } from "@/modules/tracker/market.types";
import { frame, loadMarketState, type MarketState } from "@/server/modules/tracker/tracker.feed";
import { SIM_STEP_MS, simulateVenues } from "@/server/modules/tracker/tracker.venues";
import { watchMarket } from "@/server/realtime/market-listener";

/** A stream lives until the platform's limit; `EventSource` reconnects on its own. */
export const maxDuration = 300;

const HEARTBEAT_MS = 20_000;
/** Safety net under push: catches anything a dropped LISTEN connection missed. */
const SAFETY_POLL_MS = 15_000;
/** When push isn't available at all. */
const FALLBACK_POLL_MS = 5_000;
/** A checkout touching many rows notifies many times; re-read once. */
const DEBOUNCE_MS = 400;

const isMarket = (value: string | null): value is TrackerMarket => TRACKER_MARKETS.includes(value as TrackerMarket);

/**
 * `GET /api/tracker/market?market=ALL&focus=<slug>` — Server-Sent Events driving every
 * market panel of the tracker: telemetry, ticker, spreads and the trader's
 * alerts. A `market` frame on connect; a fresh one whenever any listing, bid or
 * price point changes (Postgres NOTIFY, re-read from the database); and in test
 * mode one every simulation step, re-derived in memory so venue quotes move.
 * SSE rather than WebSockets: Vercel Functions can't host a WebSocket server,
 * and this data only flows server → browser.
 */
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const market = request.nextUrl.searchParams.get("market");
  if (!isMarket(market)) return new Response("Bad market", { status: 400 });

  const focusParam = request.nextUrl.searchParams.get("focus");
  const focus = focusParam && /^[a-z0-9-]{1,120}$/.test(focusParam) ? focusParam : null;
  const userId = session.user.id;
  let state: MarketState = await loadMarketState(userId);
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let pending: ReturnType<typeof setTimeout> | null = null;
      let changes = 0;

      const write = (chunk: string) => {
        if (!closed) controller.enqueue(encoder.encode(chunk));
      };
      const send = (reason: "open" | "change" | "tick") =>
        write(`event: market\ndata: ${JSON.stringify({ reason, changes, snapshot: frame(state, market, focus) })}\n\n`);
      const refresh = () => {
        if (pending) return;
        pending = setTimeout(async () => {
          pending = null;
          const next = await loadMarketState(userId).catch(() => null);
          if (!next || closed) return;
          state = next;
          send("change");
        }, DEBOUNCE_MS);
      };

      send("open");
      const watch = await watchMarket(() => {
        changes += 1;
        refresh();
      });
      write(`event: status\ndata: ${JSON.stringify({ push: watch.live, simulated: simulateVenues(), stepMs: SIM_STEP_MS })}\n\n`);

      const heartbeat = setInterval(() => write(": ping\n\n"), HEARTBEAT_MS);
      const poll = setInterval(refresh, watch.live ? SAFETY_POLL_MS : FALLBACK_POLL_MS);
      const tick = simulateVenues() ? setInterval(() => send("tick"), SIM_STEP_MS) : null;

      cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        clearInterval(poll);
        if (tick) clearInterval(tick);
        if (pending) clearTimeout(pending);
        watch.stop();
        try {
          controller.close();
        } catch {
          /* already closed by the client */
        }
      };
      request.signal.addEventListener("abort", cleanup);
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
