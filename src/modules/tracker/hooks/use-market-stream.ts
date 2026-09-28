"use client";

import { useEffect, useRef, useState } from "react";
import type { MarketSnapshot, TrackerMarket } from "../market.types";
import type { StreamState } from "./use-live-book";

export type MarketHealth = {
  state: StreamState;
  /** Postgres LISTEN is delivering changes (else the server polls). */
  push: boolean | null;
  simulated: boolean;
  /** Frames received since the page opened. */
  frames: number;
  /** Market changes (NOTIFY) the server has seen on this stream. */
  changes: number;
  /** When the last frame arrived (epoch ms). */
  lastFrameAt: number | null;
  /** Server stamp to browser receipt of the last frame. */
  latencyMs: number | null;
  reconnects: number;
};

type Frame = { reason: "open" | "change" | "tick"; changes: number; snapshot: MarketSnapshot };

const INITIAL: MarketHealth = { state: "connecting", push: null, simulated: false, frames: 0, changes: 0, lastFrameAt: null, latencyMs: null, reconnects: 0 };

/**
 * The tracker's market panels, kept current by `/api/tracker/market`
 * (Server-Sent Events). Starts from the server-rendered frame; each `market`
 * event replaces it. Switching market opens a new stream. The transport stays
 * inside this hook, so a managed WebSocket could replace it without touching
 * the panels.
 */
export function useMarketStream(initial: MarketSnapshot, market: TrackerMarket, focus: string | undefined) {
  const [snapshot, setSnapshot] = useState(initial);
  const [health, setHealth] = useState<MarketHealth>(INITIAL);
  /** Slugs whose Relicto floor moved in the last frame, for a brief flash. */
  const [moved, setMoved] = useState<Set<string>>(new Set());
  const last = useRef(initial);

  useEffect(() => {
    const query = new URLSearchParams({ market, ...(focus ? { focus } : {}) });
    const source = new EventSource(`/api/tracker/market?${query}`);
    let opened = false;

    source.addEventListener("market", (event) => {
      const frame = JSON.parse((event as MessageEvent<string>).data) as Frame;
      const receivedAt = Date.now();
      if (frame.reason === "change") {
        const before = new Map(last.current.ticker.map((quote) => [quote.slug, quote.floorUsd]));
        setMoved(new Set(frame.snapshot.ticker.filter((quote) => before.get(quote.slug) !== quote.floorUsd).map((quote) => quote.slug)));
      }
      last.current = frame.snapshot;
      setSnapshot(frame.snapshot);
      setHealth((current) => ({
        ...current,
        frames: current.frames + 1,
        changes: frame.changes,
        lastFrameAt: receivedAt,
        latencyMs: Math.max(0, receivedAt - Date.parse(frame.snapshot.at)),
      }));
    });
    source.addEventListener("status", (event) => {
      const { push, simulated } = JSON.parse((event as MessageEvent<string>).data) as { push: boolean; simulated: boolean };
      // Read before the update: React runs the updater later, after `opened` has flipped.
      const reconnected = opened;
      opened = true;
      setHealth((current) => ({ ...current, state: push ? "live" : "polling", push, simulated, reconnects: current.reconnects + (reconnected ? 1 : 0) }));
    });
    source.onerror = () => setHealth((current) => ({ ...current, state: source.readyState === EventSource.CLOSED ? "offline" : "connecting" }));

    return () => {
      source.close();
      setHealth(INITIAL);
    };
  }, [market, focus]);

  return { snapshot, health, moved };
}

/** A clock for "updated 3s ago" labels. */
export function useNow(intervalMs = 1_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs]);
  return now;
}
