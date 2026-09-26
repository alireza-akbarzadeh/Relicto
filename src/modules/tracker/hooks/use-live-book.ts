"use client";

import { useEffect, useState } from "react";
import type { LiveBook } from "../types";

export type StreamState = "connecting" | "live" | "polling" | "offline";

/**
 * The focused item's order book, kept current by `/api/tracker/stream`
 * (Server-Sent Events). Starts from the server-rendered snapshot; every
 * `book` event replaces it. `EventSource` reconnects on its own after a drop
 * or when the function's time limit ends a stream.
 *
 * The transport stays inside this hook, so a managed WebSocket (Ably, Pusher)
 * could replace it without touching the components.
 */
export function useLiveBook(initial: LiveBook) {
  const [book, setBook] = useState(initial);
  const [state, setState] = useState<StreamState>("connecting");
  const [changedAt, setChangedAt] = useState<number | null>(null);

  // A new focus item is a new stream; the fresh server snapshot comes with it.
  const [slug, setSlug] = useState(initial.slug);
  if (slug !== initial.slug) {
    setSlug(initial.slug);
    setBook(initial);
    setState("connecting");
  }

  useEffect(() => {
    const source = new EventSource(`/api/tracker/stream?item=${encodeURIComponent(slug)}`);
    source.addEventListener("book", (event) => {
      setBook(JSON.parse((event as MessageEvent<string>).data) as LiveBook);
      setChangedAt(Date.now());
    });
    source.addEventListener("status", (event) => {
      const { push } = JSON.parse((event as MessageEvent<string>).data) as { push: boolean };
      setState(push ? "live" : "polling");
    });
    source.onerror = () => setState(source.readyState === EventSource.CLOSED ? "offline" : "connecting");
    return () => source.close();
  }, [slug]);

  return { book, state, changedAt };
}
