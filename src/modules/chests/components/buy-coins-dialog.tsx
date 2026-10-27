"use client";

import * as React from "react";
import { Coins, Sparkles, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { soundEffects } from "@/lib/sound-effects";
import type { CoinPackage, CurrencyConversion } from "../types";

export function BuyCoinsDialog({
  open,
  onOpenChange,
  packages,
  conversion,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packages: CoinPackage[];
  conversion: CurrencyConversion;
  onSuccess?: (newBalance: number) => void;
}) {
  const [selectedPkgId, setSelectedPkgId] = React.useState<string>(packages[1]?.id ?? packages[0]?.id ?? "");
  const [currency, setCurrency] = React.useState<"usd" | "toman">("usd");
  const [loading, setLoading] = React.useState(false);

  const selectedPkg = packages.find((p) => p.id === selectedPkgId) ?? packages[0];

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chests/buy-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: selectedPkg.id, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to purchase coins");
        return;
      }

      soundEffects.playCoin();
      toast.success(
        `Added ${selectedPkg.coins + selectedPkg.bonusCoins} Relicto Coins to your treasury!`
      );
      onSuccess?.(data.newBalance);
      onOpenChange(false);
    } catch {
      toast.error("Network error processing coin transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Relicto Coin Treasury Store"
      description="Refill your coin reserve to unlock chests, buy skins, or use split-payment checkout"
      className="sm:max-w-[560px]"
    >
      <div className="space-y-4 pt-2">
        {/* Currency Switcher */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <span className="text-xs font-mono text-text-secondary">Denomination Display:</span>
          <div className="flex items-center gap-1 rounded-lg border border-border-subtle bg-surface-container p-0.5">
            <Button
              size="xs"
              variant={currency === "usd" ? "default" : "ghost"}
              onClick={() => setCurrency("usd")}
              className="text-[11px] font-mono h-6 px-2.5"
            >
              USD ($)
            </Button>
            <Button
              size="xs"
              variant={currency === "toman" ? "default" : "ghost"}
              onClick={() => setCurrency("toman")}
              className="text-[11px] font-mono h-6 px-2.5"
            >
              Toman (تومان)
            </Button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packages.map((pkg) => {
            const isSelected = pkg.id === selectedPkgId;
            const priceLabel =
              currency === "usd"
                ? `$${pkg.priceUsd.toFixed(2)}`
                : `${(pkg.priceUsd * conversion.tomanRatePerUsd).toLocaleString()} Toman`;

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`group relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                  isSelected
                    ? "border-tertiary bg-tertiary/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "border-border-subtle bg-surface-container hover:border-tertiary/40"
                }`}
              >
                {pkg.badge && (
                  <span className="absolute -top-2.5 right-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container border border-tertiary/40 shadow-sm">
                    {pkg.badge}
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <div className="size-8 rounded-lg bg-tertiary/20 flex items-center justify-center text-tertiary">
                    <Coins className="size-4" />
                  </div>
                  <div>
                    <div className="text-base font-bold font-mono text-text-primary">
                      {pkg.coins.toLocaleString()} RC
                    </div>
                    {pkg.bonusCoins > 0 && (
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <Sparkles className="size-2.5" />
                        +{pkg.bonusCoins} Bonus
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border-subtle pt-2 mt-2">
                  <span className="text-xs font-semibold text-text-primary font-mono">{priceLabel}</span>
                  <span
                    className={`size-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-tertiary bg-tertiary text-black" : "border-border-subtle"
                    }`}
                  >
                    {isSelected && <span className="size-1.5 rounded-full bg-black" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security and Settlement note */}
        <div className="flex items-center gap-2 rounded-lg bg-surface-container-high/60 p-2.5 text-[11px] text-text-muted">
          <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
          <span>
            Instant ledger settlement. Relicto Coins can be redeemed for any Dota 2 or CS2 skin.
          </span>
        </div>

        {/* Action Button */}
        <Button
          size="default"
          onClick={handlePurchase}
          disabled={loading || !selectedPkg}
          className="w-full gap-2 font-bold bg-tertiary-container text-on-tertiary-container hover:bg-tertiary hover:text-on-tertiary shadow-md"
        >
          <CreditCard className="size-4" />
          {loading ? "Authorizing Payment..." : `Deposit & Acquire ${selectedPkg ? selectedPkg.coins + selectedPkg.bonusCoins : 0} RC`}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
