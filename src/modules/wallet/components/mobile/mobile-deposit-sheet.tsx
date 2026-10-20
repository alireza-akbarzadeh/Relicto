"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon, type IconName } from "@/components/ui/icon";
import { PriceInput } from "@/components/ui/price-input";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { CryptoModal } from "@/modules/checkout/components/crypto-modal";
import { isMoneyRail, useDeposit } from "../../hooks/use-deposit";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rail: string;
  onRailChange: (rail: string) => void;
};

const RAILS: { id: string; label: string; icon: IconName; desc: string }[] = [
  { id: "crypto", label: "Web3 Crypto", icon: "currency_bitcoin", desc: "USDT, BTC, ETH, SOL · Instant" },
  { id: "cards", label: "Card / Stripe", icon: "credit_card", desc: "Visa, Mastercard, Apple Pay" },
  { id: "bank", label: "Bank Wire", icon: "account_balance", desc: "SEPA Instant / ACH" },
  { id: "skins", label: "Skins Liquidation", icon: "sports_esports", desc: "Sell Studio · +2% Promo Bonus" },
];

export function MobileDepositSheet({ open, onOpenChange, rail, onRailChange }: Props) {
  const router = useRouter();
  const [amount, setAmount] = useState("100.00");
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const { pending, deposit } = useDeposit();

  const numericAmount = Number(amount) || 0;
  const skins = !isMoneyRail(rail);

  const handleSubmit = () => {
    if (skins) {
      onOpenChange(false);
      router.push("/sell");
      return;
    }
    if (rail === "crypto") {
      setCryptoOpen(true);
      return;
    }
    deposit(rail, numericAmount);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[calc(100%-2rem)] border-border-subtle bg-surface-card p-space-md text-text-primary sm:max-w-md">
          <DialogHeader className="gap-1 p-0 text-left">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container/20 text-primary-container">
                <Icon name="account_balance" className="text-[20px]" />
              </div>
              <DialogTitle className="font-headline-sm text-headline-sm text-text-primary">
                Top Up Vault Liquidity
              </DialogTitle>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary">
              Zero ingress fees on Web3 crypto &amp; steam liquidation.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-space-sm pt-2">
            <div className="grid grid-cols-2 gap-2">
              {RAILS.map((item) => {
                const active = rail === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={null}
                    size={null}
                    onClick={() => onRailChange(item.id)}
                    className={cn(
                      "flex h-auto flex-col items-start rounded-xl border p-2.5 text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 text-text-primary shadow-xs"
                        : "border-border-subtle/40 bg-surface-container-lowest text-text-secondary hover:border-border-subtle",
                    )}
                  >
                    <div className="flex w-full items-center justify-between">
                      <Icon name={item.icon} className={cn("text-[20px]", active ? "text-primary" : "text-text-muted")} />
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </div>
                    <span className="mt-1 font-headline-sm text-[13px] font-bold text-text-primary">{item.label}</span>
                    <span className="truncate text-[10px] text-text-muted">{item.desc}</span>
                  </Button>
                );
              })}
            </div>

            {!skins && (
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="font-label-caps text-label-caps text-text-secondary uppercase">
                  Deposit Amount (USD)
                </span>
                <PriceInput
                  value={Number(amount) || 0}
                  onChange={(val) => setAmount(val.toString())}
                  placeholder="0.00"
                  className="h-12 bg-surface-container-lowest px-3"
                />

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[50, 100, 250, 500].map((val) => (
                    <Button
                      key={val}
                      variant={null}
                      size={null}
                      onClick={() => setAmount(val.toFixed(2))}
                      className="h-auto rounded bg-surface-container-high px-2 py-1 font-data-mono-md text-[11px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary"
                    >
                      +${val}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant={null}
              size={null}
              disabled={pending || (!skins && numericAmount < 10)}
              onClick={handleSubmit}
              className="mt-2 h-auto w-full gap-2 rounded-lg border-0 bg-primary py-3 font-headline-sm text-[13px] font-bold text-on-primary uppercase shadow-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Icon name="verified" className="text-[18px]" />
              <span>
                {pending
                  ? "Crediting vault…"
                  : skins
                    ? "Open Sell Studio (+2% Bonus)"
                    : rail === "cards"
                      ? `Pay ${formatMoney(numericAmount)} via Stripe`
                      : rail === "crypto"
                        ? `Continue with Crypto (${formatMoney(numericAmount)})`
                        : `Deposit ${formatMoney(numericAmount)}`}
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CryptoModal
        open={cryptoOpen}
        onOpenChange={setCryptoOpen}
        totalUsd={numericAmount}
        isPending={pending}
        onConfirm={({ network, txHash }) => {
          setCryptoOpen(false);
          onOpenChange(false);
          deposit("crypto", numericAmount, `${network.symbol}:${txHash}`);
        }}
      />
    </>
  );
}
