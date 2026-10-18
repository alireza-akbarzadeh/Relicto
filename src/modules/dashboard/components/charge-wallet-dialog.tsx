"use client";

import * as React from "react";
import { CreditCard, Landmark, Wallet, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { chargeWalletAction } from "../actions/charge-wallet";
import type { DepositRail } from "@/server/modules/wallet/wallet.schema";

const PRESET_AMOUNTS = [25, 50, 100, 250, 500, 1000];

const RAILS: { id: DepositRail; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }[] = [
  { id: "crypto", label: "Web3 Crypto", icon: Wallet, detail: "USDT TRC20 / USDC Instant" },
  { id: "cards", label: "Cards & Pay", icon: CreditCard, detail: "Stripe 3D Secure / Apple Pay" },
  { id: "bank", label: "SEPA / Wire", icon: Landmark, detail: "Instant European Wire Transfer" },
];

export function ChargeWalletDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const [rail, setRail] = React.useState<DepositRail>("crypto");
  const [amount, setAmount] = React.useState<number>(100);
  const [customInput, setCustomInput] = React.useState<string>("100");
  const [pending, setPending] = React.useState(false);
  const [resultMsg, setResultMsg] = React.useState<string | null>(null);

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomInput(String(val));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomInput(text);
    const num = Number.parseFloat(text);
    if (!Number.isNaN(num) && num > 0) setAmount(num);
  };

  const handleSubmit = async () => {
    if (amount <= 0 || amount > 10000) {
      toast.error("Please enter a valid amount between $1 and $10,000 USD");
      return;
    }

    setPending(true);
    setResultMsg(null);
    try {
      const res = await chargeWalletAction({ rail, amountUsd: amount });
      if (res.success) {
        toast.success(res.message);
        setResultMsg(res.message);
        setTimeout(() => {
          setOpen(false);
          setResultMsg(null);
        }, 1200);
      } else {
        toast.error(res.error);
        setResultMsg(res.error);
      }
    } catch {
      toast.error("Network error processing deposit");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}
      <DialogContent className="sm:max-w-md bg-surface-card border-border-subtle p-6 text-foreground">
        <DialogHeader className="gap-1">
          <DialogTitle className="text-lg font-heading font-bold text-text-primary flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            Charge Vault Balance
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Instant settlement to liquid balance for purchases, bot trade escrows, or liquidity pool.
          </DialogDescription>
        </DialogHeader>

        {resultMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-container border border-border-subtle text-xs">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span className="text-text-primary">{resultMsg}</span>
          </div>
        )}

        <div className="space-y-4 py-2">
          {/* Rail selector */}
          <div className="grid grid-cols-3 gap-2">
            {RAILS.map((r) => {
              const Icon = r.icon;
              const active = rail === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRail(r.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border-subtle bg-surface-container/60 hover:bg-surface-container text-text-secondary"
                  }`}
                >
                  <Icon className="size-5 mb-1.5" />
                  <span className="text-xs font-semibold">{r.label}</span>
                  <span className="text-[10px] text-text-muted mt-0.5 line-clamp-1">{r.detail}</span>
                </button>
              );
            })}
          </div>

          {/* Quick presets */}
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-2 block">
              Preset Quick Charge
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant={amount === val ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountSelect(val)}
                  className="font-mono text-xs"
                >
                  ${val}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-text-muted mb-1 block">
              Custom Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">$</span>
              <Input
                type="number"
                min={1}
                max={10000}
                value={customInput}
                onChange={handleCustomChange}
                placeholder="100.00"
                className="pl-7 font-mono text-sm bg-surface-container border-border-subtle"
              />
            </div>
          </div>

          {/* Fee & Yield notice */}
          <div className="flex items-center justify-between text-xs p-2.5 rounded bg-surface-container/80 border border-border-subtle">
            <span className="text-text-muted">Network Settlement Fee:</span>
            <span className="font-mono text-primary font-bold">0.00% (Gold Tier Promo)</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={pending} className="gap-2">
            {pending ? "Processing..." : `Deposit $${amount.toFixed(2)} USD`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
