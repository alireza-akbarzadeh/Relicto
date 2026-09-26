import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { watchItem } from "@/server/realtime/market-listener";
import { liveBook } from "@/server/modules/tracker/tracker.book";

/** A stream lives until the platform's limit; `EventSource` reconnects on its own. */
export const maxDuration = 300;

const HEARTBEAT_MS = 20_000;
/** Safety net under push: catches anything a dropped LISTEN connection missed. */
const SAFETY_POLL_MS = 15_000;
/** When push isn't available at all. */
const FALLBACK_POLL_MS = 5_000;
/** A checkout touching several rows notifies several times; send one snapshot. */
const DEBOUNCE_MS = 250;

/**
 * `GET /api/tracker/stream?item=<slug>` — Server-Sent Events carrying the
 * item's live order book. One `book` event on connect, then one whenever its
 * listings or offers change (Postgres NOTIFY), with a comment heartbeat.
 * SSE rather than WebSockets: Vercel Functions can't host a WebSocket server,
 * and the book only ever flows server → browser.
 */
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const slug = request.nextUrl.searchParams.get("item") ?? "";
  if (!/^[a-z0-9-]{1,120}$/.test(slug)) return new Response("Bad item", { status: 400 });
  const first = await liveBook(slug);
  if (!first) return new Response("Unknown item", { status: 404 });

  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let last = "";
      let pending: ReturnType<typeof setTimeout> | null = null;

      const write = (chunk: string) => {
        if (!closed) controller.enqueue(encoder.encode(chunk));
      };
      const push = async () => {
        const next = await liveBook(slug).catch(() => null);
        if (!next || closed) return;
        // Compare without the timestamp: only a changed book is worth sending.
        const key = JSON.stringify({ ...next.book, at: null });
        if (key === last) return;
        last = key;
        write(`event: book\ndata: ${JSON.stringify(next.book)}\n\n`);
      };
      const schedule = () => {
        if (pending) return;
        pending = setTimeout(() => {
          pending = null;
          void push();
        }, DEBOUNCE_MS);
      };

      await push();
      const watch = await watchItem(first.itemId, schedule);
      write(`event: status\ndata: ${JSON.stringify({ push: watch.live })}\n\n`);
      const heartbeat = setInterval(() => write(": ping\n\n"), HEARTBEAT_MS);
      const poll = setInterval(schedule, watch.live ? SAFETY_POLL_MS : FALLBACK_POLL_MS);

      cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        clearInterval(poll);
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
