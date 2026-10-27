"use client";

import * as React from "react";
import { Coins, DollarSign, Sparkles, Zap, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ChestDefinition, CurrencyConversion, PaymentMethodOption } from "../types";

export function UnboxingControls({
  chest,
  conversion,
  userCoins,
  userWalletCents,
  isSpinning,
  isFastSpin,
  onToggleFastSpin,
  onOpenTreasure,
}: {
  chest: ChestDefinition;
  conversion: CurrencyConversion;
  userCoins: number;
  userWalletCents: number;
  isSpinning: boolean;
  isFastSpin: boolean;
  onToggleFastSpin: (fast: boolean) => void;
  onOpenTreasure: (options: {
    paymentMethod: PaymentMethodOption;
    splitCoinAmount?: number;
  }) => void;
}) {
  const [method, setMethod] = React.useState<PaymentMethodOption>("coins");
  const [splitCoins, setSplitCoins] = React.useState<number>(Math.min(userCoins, chest.priceCoins));

  const tomanPrice = Math.round(chest.priceUsd * conversion.tomanRatePerUsd);
  const userWalletUsd = userWalletCents / 100;

  // Split calculation
  const maxCoinsToUse = Math.min(userCoins, chest.priceCoins);
  const coinsDiscountUsd = splitCoins / conversion.coinRatePerUsd;
  const remainingUsd = Math.max(0, chest.priceUsd - coinsDiscountUsd);
  const remainingToman = Math.round(remainingUsd * conversion.tomanRatePerUsd);

  const canAffordCoins = userCoins >= chest.priceCoins;
  const canAffordCash = userWalletUsd >= chest.priceUsd;
  const canAffordSplit = userWalletUsd >= remainingUsd;

  const handleOpen = () => {
    onOpenTreasure({
      paymentMethod: method,
      splitCoinAmount: method === "combination" ? splitCoins : undefined,
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border-subtle bg-surface-card/90 p-4 sm:p-5 backdrop-blur-md">
      {/* Payment Method Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-text-secondary">
            Payment Method:
          </span>
          <span className="text-[11px] font-mono text-tertiary">
            Your Balance: {userCoins.toLocaleString()} RC (${(userCoins / conversion.coinRatePerUsd).toFixed(2)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Method 1: Coins */}
          <Button
            type="button"
            variant={method === "coins" ? "default" : "outline"}
            onClick={() => setMethod("coins")}
            className="h-auto py-2.5 flex flex-col items-start gap-1"
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
              <Coins className="size-3.5 text-tertiary" />
              {chest.priceCoins.toLocaleString()} Coins
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              {canAffordCoins ? "Full Coin Balance" : "Short on Coins"}
            </span>
          </Button>

          {/* Method 2: Cash USD / Toman */}
          <Button
            type="button"
            variant={method === "cash_usd" ? "default" : "outline"}
            onClick={() => setMethod("cash_usd")}
            className="h-auto py-2.5 flex flex-col items-start gap-1"
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
              <DollarSign className="size-3.5 text-emerald-400" />
              ${chest.priceUsd.toFixed(2)} USD
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              {tomanPrice.toLocaleString()} تومان
            </span>
          </Button>

          {/* Method 3: Combination Payment */}
          <Button
            type="button"
            variant={method === "combination" ? "default" : "outline"}
            onClick={() => setMethod("combination")}
            className="h-auto py-2.5 flex flex-col items-start gap-1"
          >
            <div className="flex items-center gap-1.5 font-bold font-mono text-xs">
              <Sparkles className="size-3.5 text-primary" />
              Split: Coins + Cash
            </div>
            <span className="text-[10px] font-mono text-text-muted">
              Apply available coins
            </span>
          </Button>
        </div>
      </div>

      {/* Split Slider when Combination Mode is Active */}
      {method === "combination" && (
        <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-text-secondary">Coins to apply:</span>
            <span className="font-bold text-tertiary">
              {splitCoins.toLocaleString()} RC (-${coinsDiscountUsd.toFixed(2)})
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxCoinsToUse}
            step="10"
            value={splitCoins}
            onChange={(e) => setSplitCoins(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>Remaining Cash Due:</span>
            <span className="font-bold text-text-primary">
              ${remainingUsd.toFixed(2)} USD ({remainingToman.toLocaleString()} تومان)
            </span>
          </div>
        </div>
      )}

      {/* Footer: Fast Spin switch & Big Unlock Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <Switch checked={isFastSpin} onCheckedChange={onToggleFastSpin} id="fast-spin" />
          <label htmlFor="fast-spin" className="text-xs font-mono text-text-secondary cursor-pointer flex items-center gap-1">
            <Zap className="size-3.5 text-amber-400" />
            Fast Unbox Mode (1.2s)
          </label>
        </div>

        <Button
          size="lg"
          onClick={handleOpen}
          disabled={
            isSpinning ||
            (method === "coins" && !canAffordCoins) ||
            (method === "cash_usd" && !canAffordCash) ||
            (method === "combination" && !canAffordSplit)
          }
          className="gap-2 font-heading font-black text-sm uppercase tracking-wider bg-primary text-on-primary hover:bg-primary/90 shadow-lg shadow-primary/25 min-w-[200px]"
        >
          {isSpinning ? (
            <>
              <Sparkles className="size-4 animate-spin" />
              Spinning Treasure...
            </>
          ) : (
            <>
              <Lock className="size-4" />
              Unlock Treasure
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
