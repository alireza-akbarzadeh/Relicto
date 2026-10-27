"use client";

import * as React from "react";
import { ChestsLiveTicker } from "./chests-live-ticker";
import { ChestsHero } from "./chests-hero";
import { ChestCard } from "./chest-card";
import { CurrencyConverterCard } from "./currency-converter-card";
import { BuyCoinsDialog } from "./buy-coins-dialog";
import { DailyBonusDialog } from "./daily-bonus-dialog";
import { COIN_PACKAGES, type ChestDefinition, type CurrencyConversion, type LiveDropItem } from "../types";

export function ChestsHub({
  initialChests,
  conversion,
  liveDrops,
  initialUserCoins,
}: {
  initialChests: ChestDefinition[];
  conversion: CurrencyConversion;
  liveDrops: LiveDropItem[];
  initialUserCoins: number;
}) {
  const [selectedTier, setSelectedTier] = React.useState<string>("all");
  const [userCoins, setUserCoins] = React.useState<number>(initialUserCoins);
  const [buyCoinsOpen, setBuyCoinsOpen] = React.useState(false);
  const [dailyBonusOpen, setDailyBonusOpen] = React.useState(false);
  const [showConverter, setShowConverter] = React.useState(false);

  const filteredChests = React.useMemo(() => {
    if (selectedTier === "all") return initialChests;
    return initialChests.filter((c) => c.tier === selectedTier);
  }, [initialChests, selectedTier]);

  return (
    <div className="space-y-6">
      {/* Live Drops Stream Ticker across top */}
      <ChestsLiveTicker initialDrops={liveDrops} />

      {/* Hero Banner with Balance & Quick Actions */}
      <ChestsHero
        userCoins={userCoins}
        conversion={conversion}
        selectedTier={selectedTier}
        onSelectTier={setSelectedTier}
        onOpenDailyBonus={() => setDailyBonusOpen(true)}
        onOpenBuyCoins={() => setBuyCoinsOpen(true)}
        onOpenConverter={() => setShowConverter((prev) => !prev)}
      />

      {/* Currency Converter Panel (expandable or visible) */}
      {showConverter && (
        <CurrencyConverterCard
          conversion={conversion}
          onOpenBuyModal={() => setBuyCoinsOpen(true)}
        />
      )}

      {/* Chests Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredChests.map((chest) => (
          <ChestCard key={chest.id} chest={chest} conversion={conversion} />
        ))}
      </div>

      {/* Coin Store Dialog */}
      <BuyCoinsDialog
        open={buyCoinsOpen}
        onOpenChange={setBuyCoinsOpen}
        packages={COIN_PACKAGES}
        conversion={conversion}
        onSuccess={(newBalance) => setUserCoins(newBalance)}
      />

      {/* Daily Bonus Dialog */}
      <DailyBonusDialog
        open={dailyBonusOpen}
        onOpenChange={setDailyBonusOpen}
        onClaimSuccess={(newBalance) => setUserCoins(newBalance)}
      />
    </div>
  );
}
