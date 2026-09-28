"use client";

import { useMemo } from "react";
import { useQueryStates } from "nuqs";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { useMarketStream, useNow } from "../hooks/use-market-stream";
import { trackerSearchParams } from "../lib/search-params";
import type { MarketSnapshot, TrackerMarket } from "../market.types";
import type { TrackerData } from "../types";
import { LiveOrderBook } from "./live/live-order-book";
import { LiveTerminal } from "./live/live-terminal";
import { AlertsPanel } from "./market/alerts-panel";
import { MarketSpreads } from "./market/market-spreads";
import { MarketTelemetry } from "./market/market-telemetry";
import { MarketTicker } from "./market/market-ticker";
import { StreamHealth } from "./market/stream-health";
import { SampleOrderBook } from "./sample/sample-order-book";
import { SampleTerminal } from "./sample/sample-terminal";

/**
 * The arbitrage terminal. Two live streams drive it: the market stream
 * (telemetry, ticker, spreads, alerts, stream vitals) and the focused item's
 * book stream (chart, order book).
 */
export function TrackerView({ data, market: initial }: { data: TrackerData; market: MarketSnapshot }) {
  /* Market, range and search live in the URL so a terminal view can be shared. */
  const [{ market, range, q: query, span, asset: focused }, setParams] = useQueryStates(trackerSearchParams, { history: "replace", clearOnDefault: true });
  const setMarket = (value: TrackerMarket) => void setParams({ market: value });
  const setRange = (value: string) => void setParams({ range: value as (typeof trackerSearchParams.range)["defaultValue"] });
  const setQuery = (value: string) => void setParams({ q: value });
  const setSpan = (value: string) => void setParams({ span: value as (typeof trackerSearchParams.span)["defaultValue"] });
  /* Focusing a ticker item re-renders on the server with its book, chart and stream. */
  const focus = (slug: string) => void setParams({ asset: slug });

  const current = focused || data.live?.focus.slug;
  const { snapshot, health, moved } = useMarketStream(initial, market, current);
  const now = useNow();
  /* The focused item's current venue quote, stamped with its frame's server time: the chart's moving end. */
  const livePoint = snapshot.focus?.secondary.usd ? { at: Date.parse(snapshot.at), price: snapshot.focus.secondary.usd } : undefined;
  const assets = useMemo(() => data.assets.filter((asset) => `${asset.name} ${asset.detail}`.toLowerCase().includes(query.toLowerCase())), [data.assets, query]);

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <MarketTelemetry telemetry={snapshot.telemetry} health={health} now={now} market={market} setMarket={setMarket} />
        <MarketTicker quotes={snapshot.ticker} moved={moved} current={current} onFocus={focus} />
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-space-lg px-gutter-desktop py-space-lg">
          <div className="grid grid-cols-1 items-start gap-space-lg xl:grid-cols-12">
            <div className="flex flex-col gap-space-lg xl:col-span-8">
              {data.live ? (
                <LiveTerminal live={data.live} now={livePoint} span={span} setSpan={setSpan} />
              ) : (
                <SampleTerminal assets={assets} range={range} setRange={setRange} query={query} setQuery={setQuery} chart={data.chart} />
              )}
              <MarketSpreads rows={snapshot.spreads} simulated={snapshot.telemetry.simulated} />
            </div>
            <div className="flex flex-col gap-space-lg xl:col-span-4">
              {data.live ? <LiveOrderBook initial={data.live.book} /> : <SampleOrderBook rows={data.orderBook} />}
              <AlertsPanel alerts={snapshot.alerts} />
              <StreamHealth health={health} now={now} feedMismatches={snapshot.telemetry.feedMismatches} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
