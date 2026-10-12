"use client";

import { useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import { MarketMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import { useLiveBook } from "../../hooks/use-live-book";
import { useMarketStream } from "../../hooks/use-market-stream";
import type { MarketSnapshot } from "../../market.types";
import type { TrackerMobileData } from "../../mobile.types";
import type { LiveBook } from "../../types";
import { ArbitrageMatrix } from "./arbitrage-matrix";
import { CommandBar } from "./command-bar";
import { DepthBook } from "./depth-book";
import { DopplerMatrix } from "./doppler-matrix";
import { SpotChart } from "./spot-chart";
import { TickerTape } from "./ticker-tape";
import { TrackedAssetCard } from "./tracked-asset-card";

function RelayStrip({ relay }: { relay: TrackerMobileData["relay"] }) {
  return (
    <div className="px-4 pt-1">
      <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 text-text-muted shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container">
            <Icon name="sensors" className="text-[16px] text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-text-primary uppercase">{relay.title}</span>
            <span className="font-label-badge text-label-badge">{relay.latency}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded bg-surface-container px-2 py-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-status-live" />
          <span className="font-label-badge text-label-badge font-bold text-text-primary">{relay.status}</span>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_MARKET: MarketSnapshot = {
  market: "ALL",
  at: new Date(0).toISOString(),
  telemetry: {
    items: 0,
    listings: 0,
    bids: 0,
    listedUsd: 0,
    sales24h: 0,
    sales24hUsd: 0,
    feedAt: null,
    feedMismatches: 0,
    simulated: false,
  },
  ticker: [],
  focus: null,
  spreads: [],
  alerts: [],
};

/** Mobile arbitrage terminal (Stitch: "Lootora Mobile — Real-Time Price Tracker & Arbitrage Terminal"). */
export function TrackerMobile({
  data,
  market: initialMarket,
  liveBook: initialLiveBook,
}: {
  data: TrackerMobileData;
  market?: MarketSnapshot;
  liveBook?: LiveBook;
}) {
  const { snapshot, health } = useMarketStream(
    initialMarket ?? DEFAULT_MARKET,
    "ALL",
    data.asset?.slug,
  );

  const { book } = useLiveBook(
    initialLiveBook ?? {
      slug: data.asset?.slug ?? "butterfly-doppler",
      asks: [],
      bids: [],
      bestAsk: null,
      bestBid: null,
      spreadUsd: null,
      spreadPct: null,
      depthUsd: 0,
      at: new Date().toISOString(),
    },
  );

  const liveFeed = useMemo((): TrackerMobileData["feed"] => {
    if (!snapshot?.ticker?.length) return data.feed;
    return snapshot.ticker.slice(0, 10).map((t) => ({
      id: t.slug,
      label: t.name,
      tone: (t.spreadPct ?? 0) >= 0 ? ("primary" as const) : ("muted" as const),
      priceUsd: t.floorUsd,
      changePct: t.spreadPct ?? 0,
    }));
  }, [snapshot.ticker, data.feed]);

  const liveTelemetry = useMemo(() => {
    if (!snapshot?.telemetry) return data.telemetry;
    return {
      latency: health.latencyMs != null ? `${health.latencyMs}ms` : data.telemetry.latency,
      escrow: `${snapshot.telemetry.listings} ASKS`,
      bots: `${snapshot.telemetry.bids} BIDS`,
    };
  }, [snapshot, health.latencyMs, data.telemetry]);

  const liveDepth = useMemo(() => {
    if (!book?.asks?.length && !book?.bids?.length) return data.depth;
    return {
      bids: book.bids.slice(0, 3).map((b, i) => ({
        venue: i === 0 ? "Relicto Bid" : `Relicto L${i + 1}`,
        priceUsd: b.priceUsd,
      })),
      asks: book.asks.slice(0, 3).map((a, i) => ({
        venue: i === 0 ? "Relicto Ask" : `Relicto L${i + 1}`,
        priceUsd: a.priceUsd,
      })),
    };
  }, [book, data.depth]);

  const liveRelay = useMemo(() => {
    if (health.state === "offline") {
      return { ...data.relay, status: "OFFLINE", latency: "DISCONNECTED" };
    }
    return {
      ...data.relay,
      status: health.state === "live" ? "REALTIME SYNC" : health.state === "polling" ? "POLLING 5S" : "CONNECTING",
      latency: health.latencyMs != null ? `${health.latencyMs}ms LATENCY` : data.relay.latency,
    };
  }, [health, data.relay]);

  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-canvas-base font-body-md text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <MarketMobileHeader />
      <main className="flex min-h-[max(884px,100dvh)] w-full flex-1 flex-col bg-canvas-base pt-16 pb-24">
        <div className="flex w-full flex-col gap-4 pb-6">
          <TickerTape feed={liveFeed} telemetry={liveTelemetry} />
          <TrackedAssetCard data={data} />
          <SpotChart data={data} />
          <DopplerMatrix data={data} />
          <DepthBook bids={liveDepth.bids} asks={liveDepth.asks} />
          <CommandBar data={data} />
          <ArbitrageMatrix title={data.arbitrage.title} cards={data.arbitrage.cards} />
          <RelayStrip relay={liveRelay} />
        </div>
      </main>
      <MobileTabBar family="market" active="tracker" />
    </div>
  );
}

