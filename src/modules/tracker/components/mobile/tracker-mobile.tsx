import { Icon } from "@/components/ui/icon";
import { MarketMobileHeader } from "@/modules/relicto/components/mobile/mobile-headers";
import { MobileTabBar } from "@/modules/relicto/components/mobile/mobile-tab-bar";
import type { TrackerMobileData } from "../../mobile.types";
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

/** Mobile arbitrage terminal (Stitch: "Lootora Mobile — Real-Time Price Tracker & Arbitrage Terminal"). */
export function TrackerMobile({ data }: { data: TrackerMobileData }) {
  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-canvas-base font-body-md text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <MarketMobileHeader />
      <main className="flex min-h-[max(884px,100dvh)] w-full flex-1 flex-col bg-canvas-base pt-16 pb-24">
        <div className="flex w-full flex-col gap-4 pb-6">
          <TickerTape feed={data.feed} telemetry={data.telemetry} />
          <TrackedAssetCard data={data} />
          <SpotChart data={data} />
          <DopplerMatrix data={data} />
          <DepthBook bids={data.depth.bids} asks={data.depth.asks} />
          <CommandBar data={data} />
          <ArbitrageMatrix title={data.arbitrage.title} cards={data.arbitrage.cards} />
          <RelayStrip relay={data.relay} />
        </div>
      </main>
      <MobileTabBar family="market" active="tracker" />
    </div>
  );
}
