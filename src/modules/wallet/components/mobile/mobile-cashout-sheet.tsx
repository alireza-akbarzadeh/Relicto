"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import {
  CRYPTO_NETWORK_CONFIGS,
  type CryptoNetwork,
  calculateKeysFromUsd,
} from "@/server/modules/wallet/wallet.schema";
import { useCashout } from "../../hooks/use-cashout";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsd: number;
};

const CASHOUT_RAILS = [
  { id: "usdt", label: "USDT Multi-Chain", fee: "from $0.05", eta: "< 60s" },
  { id: "sepa", label: "SEPA Instant", fee: "Free", eta: "Instant" },
  { id: "keys", label: "Steam Keys", fee: "Free", eta: "~12s" },
  { id: "visa", label: "Visa Direct", fee: "Free", eta: "Instant" },
];

const MOBILE_NETWORKS: CryptoNetwork[] = ["trc20", "arbitrum", "base", "solana"];
const QUICK_PCTS = [0.25, 0.5, 0.75, 1] as const;

export function MobileCashoutSheet({ open, onOpenChange, availableUsd }: Props) {
  const { pending, request } = useCashout();
  const [rail, setRail] = useState("usdt");
  const [network, setNetwork] = useState<CryptoNetwork>("trc20");
  const [amount, setAmount] = useState(() => (availableUsd > 0 ? Math.min(100, availableUsd).toFixed(2) : "0.00"));
  const [token, setToken] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);

  const numericAmount = Number(amount) || 0;
  const keysCount = calculateKeysFromUsd(numericAmount);
  const netFee = rail === "usdt" ? CRYPTO_NETWORK_CONFIGS[network].feeUsd : 0;

  const handleCashout = () => {
    const destination = isCustomAddress ? customAddress.trim() : "TQ7sWk8X19B4gZ9xKLmP2xRa8v4e...99La";
    request(rail, numericAmount, availableUsd, token, destination, rail === "usdt" ? network : undefined);
    if (numericAmount > 0 && token.trim().length >= 5) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] border-border-subtle bg-surface-card p-space-md text-text-primary sm:max-w-md">
        <DialogHeader className="gap-1 p-0 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-tertiary/20 text-tertiary">
              <Icon name="bolt" className="text-[20px]" />
            </div>
            <DialogTitle className="font-headline-sm text-headline-sm text-text-primary">Instant Egress &amp; Cashout</DialogTitle>
          </div>
          <div className="flex items-center justify-between text-body-sm text-text-secondary">
            <span>Available Liquid:</span>
            <span className="font-data-mono-md font-bold text-text-primary">{formatMoney(availableUsd)}</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-space-sm pt-2">
          <div className="grid grid-cols-2 gap-2">
            {CASHOUT_RAILS.map((item) => (
              <Button key={item.id} variant={null} size={null} onClick={() => setRail(item.id)} className={cn("flex h-auto flex-col items-start rounded-xl border p-2 text-left transition-all", rail === item.id ? "border-primary bg-primary/10 text-text-primary shadow-xs" : "border-border-subtle/40 bg-surface-container-lowest text-text-secondary hover:border-border-subtle")}>
                <div className="flex w-full items-center justify-between">
                  <span className="font-headline-sm text-[12px] font-bold text-text-primary">{item.label}</span>
                  <span className="font-data-mono-md text-[10px] text-tertiary">{item.eta}</span>
                </div>
                <span className="text-[10px] text-text-muted">Fee: {item.fee}</span>
              </Button>
            ))}
          </div>

          {rail === "usdt" && (
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-surface-container-lowest p-1.5">
              {MOBILE_NETWORKS.map((id) => (
                <Button
                  key={id}
                  type="button"
                  variant={null}
                  size={null}
                  onClick={() => setNetwork(id)}
                  className={cn(
                    "h-auto rounded-lg py-1 text-center font-headline-sm text-[10px]",
                    network === id ? "bg-primary text-on-primary font-bold" : "text-text-muted hover:text-text-primary"
                  )}
                >
                  {CRYPTO_NETWORK_CONFIGS[id].chain}
                </Button>
              ))}
            </div>
          )}

          {rail === "keys" && (
            <div className="flex items-center justify-between rounded-xl bg-surface-container-lowest px-2.5 py-1.5 text-[11px]">
              <span className="text-text-muted">TF2 Key Settlement:</span>
              <span className="font-data-mono-md font-bold text-primary">~{keysCount} Keys (@ $2.05)</span>
            </div>
          )}

          <div className="flex flex-col gap-1 rounded-xl bg-surface-container-lowest p-2">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-[10px] text-text-secondary uppercase">{rail === "keys" ? "Steam Trade URL" : "Destination Address"}</span>
              <Button variant={null} size={null} onClick={() => setIsCustomAddress(!isCustomAddress)} className="h-auto p-0 font-label-badge text-[10px] text-primary hover:underline">{isCustomAddress ? "Use Whitelist" : "+ Custom"}</Button>
            </div>
            {isCustomAddress ? (
              <Input value={customAddress} onChange={(e) => setCustomAddress(e.target.value)} placeholder={rail === "keys" ? "https://steamcommunity.com/..." : "Address or IBAN..."} className="h-8 rounded border-0 bg-surface-card px-2 font-data-mono-md text-[11px] text-text-primary" />
            ) : (
              <div className="flex items-center justify-between text-[11px]">
                <span className="truncate font-data-mono-md text-text-muted">TQ7sWk...99La</span>
                <span className="shrink-0 rounded bg-surface-container-high px-1.5 py-0.5 font-label-badge text-[9px] text-status-upcoming uppercase">Whitelist #1</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <span className="font-label-caps text-label-caps text-text-secondary uppercase">Withdrawal Amount (USD)</span>
            <PriceInput value={Number(amount) || 0} onChange={(val) => setAmount(val.toString())} max={availableUsd} placeholder="0.00" className="h-12 bg-surface-container-lowest px-3" />
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {QUICK_PCTS.map((pct) => (
                <Button key={pct} variant={null} size={null} onClick={() => setAmount((availableUsd * pct).toFixed(2))} className="h-auto rounded bg-surface-container-high py-1 font-data-mono-md text-[11px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary">
                  {pct === 1 ? "100%" : `${pct * 100}%`}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl bg-surface-container-lowest p-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 font-label-caps text-text-primary uppercase"><Icon name="security" className="text-[14px] text-primary" /> Steam Guard 2FA Token</span>
              <span className="font-data-mono-md text-status-upcoming">5 Characters</span>
            </div>
            <Input maxLength={5} value={token} onChange={(e) => setToken(e.target.value.toUpperCase())} placeholder="R7X9K" className="h-10 rounded-lg border-0 bg-surface-card text-center font-data-mono-lg tracking-widest text-primary uppercase" />
          </div>

          <Button variant={null} size={null} disabled={pending || availableUsd <= 0 || numericAmount <= 0} onClick={handleCashout} className="mt-1 h-auto w-full gap-2 rounded-lg border-0 bg-primary py-3 font-headline-sm text-[13px] font-bold text-on-primary uppercase shadow-md hover:bg-primary/90 disabled:opacity-50">
            <Icon name="lock_reset" className="text-[18px]" />
            <span>{pending ? "Dispatching payout…" : availableUsd <= 0 ? "Deposit to enable cashout" : `Authorize Cashout (${formatMoney(Math.max(0, numericAmount - netFee))})`}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
