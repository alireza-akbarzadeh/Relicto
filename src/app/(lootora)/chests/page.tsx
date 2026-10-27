import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketHeader } from "@/modules/relicto/components/shell/market-header";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { ChestsHub } from "@/modules/chests/components/chests-hub";
import { chestsService } from "@/server/modules/chests/chests.service";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";

export const metadata: Metadata = {
  title: "Gaming Chests & Case Unboxing | Relicto",
  description: "Unbox certified Dota 2 and CS2 skins with authentic escalating odds, daily coin drops, and live currency converter.",
};

export default async function ChestsPage() {
  const [chests, conversion, liveDrops, session, userId] = await Promise.all([
    chestsService.listChests(false),
    chestsService.getCurrencyConversion(),
    chestsService.getLiveDrops(12),
    getSession(),
    getUserId(),
  ]);

  const userCoins = userId ? chestsService.getUserCoins(userId) : 1500;

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      <MarketHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-16 px-4 md:px-6">
        <Suspense
          fallback={
            <div className="flex h-96 w-full items-center justify-center font-mono text-xs text-text-muted">
              Loading Gaming Reliquary & Live Odds...
            </div>
          }
        >
          <ChestsHub
            initialChests={chests}
            conversion={conversion}
            liveDrops={liveDrops}
            initialUserCoins={userCoins}
          />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
