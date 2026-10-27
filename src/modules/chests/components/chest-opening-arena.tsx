"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { UnboxingReel } from "./unboxing-reel";
import { UnboxingControls } from "./unboxing-controls";
import { EscalatingOddsTable } from "./escalating-odds-table";
import { ChestItemsGrid } from "./chest-items-grid";
import { WinCelebrationDialog } from "./win-celebration-dialog";
import type {
  ChestDefinition,
  CurrencyConversion,
  EscalatingOddsState,
  PaymentMethodOption,
  UnboxResult,
} from "../types";

export function ChestOpeningArena({
  chest,
  conversion,
  initialStreak,
  escalatingOdds: initialEscalatingOdds,
  initialUserCoins,
  userWalletCents,
}: {
  chest: ChestDefinition;
  conversion: CurrencyConversion;
  initialStreak: number;
  escalatingOdds: EscalatingOddsState[];
  initialUserCoins: number;
  userWalletCents: number;
}) {
  const [userCoins, setUserCoins] = React.useState(initialUserCoins);
  const [streak, setStreak] = React.useState(initialStreak);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [isFastSpin, setIsFastSpin] = React.useState(false);
  const [activeReel, setActiveReel] = React.useState(chest.items);
  const [winningIndex, setWinningIndex] = React.useState(0);
  const [unboxResult, setUnboxResult] = React.useState<UnboxResult | null>(null);
  const [winModalOpen, setWinModalOpen] = React.useState(false);

  const handleOpenTreasure = async (options: {
    paymentMethod: PaymentMethodOption;
    splitCoinAmount?: number;
  }) => {
    setIsSpinning(true);
    setWinModalOpen(false);

    try {
      const res = await fetch(`/api/chests/${chest.slug}/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(options),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to open chest");
        setIsSpinning(false);
        return;
      }

      setUnboxResult(data.result);
      setActiveReel(data.result.reelItems);
      setWinningIndex(data.result.winningIndex);
      if (typeof data.newCoinBalance === "number") {
        setUserCoins(data.newCoinBalance);
      }
      setStreak(data.result.escalatingStreak);
    } catch {
      toast.error("Network error during chest opening");
      setIsSpinning(false);
    }
  };

  const handleSpinFinished = () => {
    setIsSpinning(false);
    setWinModalOpen(true);
  };

  const handleRecycleItem = async (coinsValue: number) => {
    try {
      const res = await fetch("/api/chests/recycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coinsValue }),
      });
      const data = await res.json();
      if (res.ok && typeof data.newBalance === "number") {
        setUserCoins(data.newBalance);
        toast.success(`Recycled for +${coinsValue} RC!`);
      }
    } catch {
      toast.error("Failed to recycle item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Back and Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link href="/chests">
          <Button variant="ghost" size="sm" className="gap-2 text-text-muted hover:text-text-primary">
            <ArrowLeft className="size-4" />
            Back to Chests
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
          <ShieldCheck className="size-3.5 text-emerald-400" />
          <span>Provably Fair RNG</span>
        </div>
      </div>

      {/* Main Unboxing Wheel Section */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-text-primary uppercase tracking-wide">
            {chest.name}
          </h1>
          <p className="text-xs text-text-muted max-w-lg mx-auto">{chest.description}</p>
        </div>

        {/* The Animated Decelerating Horizontal Roulette */}
        <UnboxingReel
          reelItems={activeReel}
          winningIndex={winningIndex}
          isSpinning={isSpinning}
          isFastSpin={isFastSpin}
          onSpinFinished={handleSpinFinished}
        />

        {/* Controls: Payment options, split coins slider, fast unbox switch, and Open button */}
        <UnboxingControls
          chest={chest}
          conversion={conversion}
          userCoins={userCoins}
          userWalletCents={userWalletCents}
          isSpinning={isSpinning}
          isFastSpin={isFastSpin}
          onToggleFastSpin={setIsFastSpin}
          onOpenTreasure={handleOpenTreasure}
        />
      </div>

      {/* Escalating Odds Panel */}
      {chest.hasEscalatingOdds && (
        <EscalatingOddsTable streak={streak} escalatingOdds={initialEscalatingOdds} />
      )}

      {/* Chest Items Catalog Breakdown */}
      <ChestItemsGrid items={chest.items} />

      {/* Win Celebration Modal */}
      <WinCelebrationDialog
        open={winModalOpen}
        onOpenChange={setWinModalOpen}
        result={unboxResult}
        conversion={conversion}
        onRecycleItem={handleRecycleItem}
        onOpenAgain={() => setWinModalOpen(false)}
      />
    </div>
  );
}
