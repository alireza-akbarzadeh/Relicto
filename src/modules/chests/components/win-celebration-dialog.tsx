"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sparkles,
  Trophy,
  Coins,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { soundEffects } from "@/lib/sound-effects";
import type { CurrencyConversion, UnboxResult } from "../types";

export function WinCelebrationDialog({
  open,
  onOpenChange,
  result,
  conversion,
  onRecycleItem,
  onOpenAgain,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: UnboxResult | null;
  conversion: CurrencyConversion;
  onRecycleItem: (coinsValue: number) => void;
  onOpenAgain: () => void;
}) {
  const [recycled, setRecycled] = React.useState(false);

  React.useEffect(() => {
    if (open && result) {
      setRecycled(false);
      if (
        result.wonItem.rarity === "arcana" ||
        result.wonItem.rarity === "cosmic" ||
        result.bonusItem
      ) {
        soundEffects.playWinArcana();
      } else if (
        result.wonItem.rarity === "immortal" ||
        result.wonItem.rarity === "legendary"
      ) {
        soundEffects.playWinLegendary();
      } else {
        soundEffects.playWinCommon();
      }
    }
  }, [open, result]);

  if (!result) return null;

  const item = result.wonItem;
  const tomanValue = Math.round(item.valueUsd * conversion.tomanRatePerUsd);
  const coinsValue = result.recycleCoinsValue;

  const handleRecycle = () => {
    soundEffects.playCoin();
    setRecycled(true);
    onRecycleItem(coinsValue);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Treasure Unlocked!"
      description="You have drawn a certified Steam marketplace asset"
      contentClassName="sm:max-w-[600px]! p-2"
    >
      <div className="flex flex-col items-center space-y-4 pt-1 text-center w-[600px]!">
        {/* Celebration Aura & Item Display */}
        <div className="relative size-44 overflow-hidden rounded-2xl border-2 border-primary bg-surface-container shadow-[0_0_35px_rgba(255,178,183,0.3)]">
          <Image
            src={item.imageUrl || "/images/lootora/hub-01.jpg"}
            alt={item.name}
            fill
            className="object-cover"
            sizes="176px"
          />
          <div className="absolute top-2 right-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-mono font-bold text-primary uppercase border border-primary/40">
            {item.rarity}
          </div>
        </div>

        {/* Item Metadata */}
        <div className="space-y-1">
          {item.hero && (
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              {item.hero} • {item.slot || "Slot"}
            </span>
          )}
          <h2 className="text-xl font-heading font-black text-text-primary tracking-tight">
            {item.name}
          </h2>
          <div className="flex items-center justify-center gap-2 font-mono text-sm pt-1">
            <span className="font-bold text-emerald-400">
              ${item.valueUsd.toFixed(2)} USD
            </span>
            <span className="text-text-muted">•</span>
            <span className="font-semibold text-tertiary">
              {coinsValue.toLocaleString()} RC
            </span>
            <span className="text-text-muted">•</span>
            <span className="text-xs text-text-secondary">
              {tomanValue.toLocaleString()} تومان
            </span>
          </div>
        </div>

        {/* Bonus item notification if hit */}
        {result.bonusItem && (
          <div className="w-full rounded-xl border border-amber-500/50 bg-amber-500/10 p-2.5 text-xs text-amber-300 font-mono flex items-center justify-center gap-2 shadow-sm">
            <Sparkles className="size-4 animate-spin text-amber-400" />
            <span>Escalating Bonus Unlocked: {result.bonusItem.name}!</span>
          </div>
        )}

        {/* Provably fair hash info */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted bg-surface-container px-2.5 py-1 rounded border border-border-subtle">
          <ShieldCheck className="size-3 text-emerald-400" />
          <span>Roll Hash: {result.rollHash.substring(0, 16)}...</span>
        </div>

        {/* Action Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2 border-t border-border-subtle">
          <Button
            size="default"
            variant={recycled ? "ghost" : "default"}
            disabled={recycled}
            onClick={handleRecycle}
            className="gap-2 font-bold bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary"
          >
            <Coins className="size-4" />
            {recycled ? "Recycled for Coins" : `Recycle for ${coinsValue} RC`}
          </Button>

          <Button
            size="default"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="gap-2 font-semibold"
          >
            <CheckCircle2 className="size-4 text-emerald-400" />
            Keep in Vault
          </Button>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onOpenAgain}
          className="gap-1.5 font-mono text-xs text-text-muted hover:text-text-primary"
        >
          <RotateCcw className="size-3.5" />
          Open Again
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
