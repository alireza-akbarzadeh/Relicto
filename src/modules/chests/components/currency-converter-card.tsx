"use client";

import * as React from "react";
import { Coins, ArrowRightLeft, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CurrencyConversion } from "../types";

export function CurrencyConverterCard({
  conversion,
  onOpenBuyModal,
}: {
  conversion: CurrencyConversion;
  onOpenBuyModal?: () => void;
}) {
  const [coins, setCoins] = React.useState<number>(1000);
  const [usd, setUsd] = React.useState<number>(10);
  const [toman, setToman] = React.useState<number>(950000);

  const handleCoinsChange = (val: number) => {
    setCoins(val);
    const calculatedUsd = val / conversion.coinRatePerUsd;
    setUsd(Number(calculatedUsd.toFixed(2)));
    setToman(Math.round(calculatedUsd * conversion.tomanRatePerUsd));
  };

  const handleUsdChange = (val: number) => {
    setUsd(val);
    const calculatedCoins = Math.round(val * conversion.coinRatePerUsd);
    setCoins(calculatedCoins);
    setToman(Math.round(val * conversion.tomanRatePerUsd));
  };

  const handleTomanChange = (val: number) => {
    setToman(val);
    const calculatedUsd = val / conversion.tomanRatePerUsd;
    setUsd(Number(calculatedUsd.toFixed(2)));
    setCoins(Math.round(calculatedUsd * conversion.coinRatePerUsd));
  };

  return (
    <Card className="border-border-subtle bg-surface-card/90 backdrop-blur-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Coins className="size-4 text-tertiary" />
            Live Currency Exchange & Valuation
          </CardTitle>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container border border-border-subtle text-text-secondary">
            1 USD = {conversion.coinRatePerUsd} RC = {conversion.tomanRatePerUsd.toLocaleString()} Toman
          </span>
        </div>
        <CardDescription className="text-xs text-text-muted mt-0.5">
          Convert seamlessly between Relicto Coins (RC), US Dollars ($), and Iranian Toman (تومان)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-container p-2.5">
            <label className="text-[11px] font-mono font-medium text-text-secondary flex items-center gap-1.5">
              <Coins className="size-3.5 text-tertiary" />
              Relicto Coins (RC)
            </label>
            <Input
              type="number"
              min="1"
              value={coins || ""}
              onChange={(e) => handleCoinsChange(Number(e.target.value) || 0)}
              className="h-8 font-mono text-sm font-bold bg-surface-container-high border-border-subtle"
            />
          </div>

          <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-container p-2.5">
            <label className="text-[11px] font-mono font-medium text-text-secondary flex items-center gap-1.5">
              <DollarSign className="size-3.5 text-emerald-400" />
              US Dollars ($ USD)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0.1"
              value={usd || ""}
              onChange={(e) => handleUsdChange(Number(e.target.value) || 0)}
              className="h-8 font-mono text-sm font-bold bg-surface-container-high border-border-subtle"
            />
          </div>

          <div className="space-y-1.5 rounded-lg border border-border-subtle bg-surface-container p-2.5">
            <label className="text-[11px] font-mono font-medium text-text-secondary flex items-center gap-1.5">
              <Wallet className="size-3.5 text-cyan-400" />
              Toman (تومان)
            </label>
            <Input
              type="number"
              step="1000"
              min="1000"
              value={toman || ""}
              onChange={(e) => handleTomanChange(Number(e.target.value) || 0)}
              className="h-8 font-mono text-sm font-bold bg-surface-container-high border-border-subtle"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-muted font-mono">Quick Preset:</span>
            {[5, 10, 25, 50].map((presetUsd) => (
              <Button
                key={presetUsd}
                size="xs"
                variant="outline"
                onClick={() => handleUsdChange(presetUsd)}
                className="font-mono text-[10px] h-6 px-2"
              >
                ${presetUsd}
              </Button>
            ))}
          </div>

          {onOpenBuyModal && (
            <Button
              size="xs"
              variant="default"
              onClick={onOpenBuyModal}
              className="gap-1.5 font-bold text-xs shadow-sm bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary"
            >
              <Coins className="size-3.5" />
              Purchase Coins
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
