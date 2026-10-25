"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { PriceInput } from "@/components/ui/price-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatMoney } from "@/lib/format";
import { useOfferWrites } from "../hooks/use-offer-writes";
import type { IncomingOffer } from "../types";

const RELICTO_FEE_RATE = 0.025; // 2.5% standard platform take

type CounterOfferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: IncomingOffer;
};

export function CounterOfferDialog({ open, onOpenChange, offer }: CounterOfferDialogProps) {
  const midpoint = Math.round(((offer.askUsd + offer.bidUsd) / 2) * 100) / 100;
  const [amount, setAmount] = useState<number>(midpoint);
  const [note, setNote] = useState("");
  const { pending, counter } = useOfferWrites();

  const close = () => onOpenChange(false);
  const feeUsd = Math.round(amount * RELICTO_FEE_RATE * 100) / 100;
  const netProceeds = Math.max(0, Math.round((amount - feeUsd) * 100) / 100);
  const gainVsBid = Math.round((amount - offer.bidUsd) * 100) / 100;

  const presets = [
    { label: "-3% Ask", val: Math.round(offer.askUsd * 0.97 * 100) / 100 },
    { label: "-5% Ask", val: Math.round(offer.askUsd * 0.95 * 100) / 100 },
    { label: "50/50 Split", val: midpoint },
    { label: "-10% Ask", val: Math.round(offer.askUsd * 0.90 * 100) / 100 },
  ];

  const submit = () => {
    if (amount <= 0) return;
    counter({ offerId: offer.id, counterUsd: amount, note }, offer.item.name, close);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-md flex-col gap-4 rounded-xl border border-border-subtle bg-surface-card p-5 shadow-2xl sm:max-w-md">
        <div className="flex items-start gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest">
            {offer.item.image && (
              <Image src={offer.item.image} alt={offer.item.imageAlt} fill sizes="48px" className="object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="font-label-badge text-[10px] tracking-wider text-tertiary uppercase">Propose Counter-Offer</span>
            <DialogTitle className="truncate font-headline-sm text-base font-bold text-text-primary">{offer.item.name}</DialogTitle>
            <DialogDescription className="font-body-sm text-xs text-text-secondary">
              Asking <span className="font-data-mono-md font-semibold text-text-primary">{formatMoney(offer.askUsd)}</span> • {offer.bidder.name} offered <span className="font-data-mono-md font-semibold text-tertiary">{formatMoney(offer.bidUsd)}</span>
            </DialogDescription>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex flex-col gap-1.5">
          <span className="font-label-badge text-[10px] tracking-wider text-text-secondary uppercase">Quick Counter Targets</span>
          <div className="grid grid-cols-4 gap-1.5">
            {presets.map((p) => (
              <Button
                key={p.label}
                type="button"
                variant={null}
                size={null}
                onClick={() => setAmount(p.val)}
                className={`h-auto flex-col rounded border px-2 py-1.5 text-center font-data-mono-md text-[11px] font-semibold transition-all ${
                  amount === p.val
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-border-subtle bg-surface-container-lowest text-text-secondary hover:border-border-subtle hover:text-text-primary"
                }`}
              >
                <div>{p.label}</div>
                <div className="text-[10px] text-text-muted">{formatMoney(p.val, { whole: p.val >= 1000 })}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Price Input */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="counter-amount" className="font-label-badge text-[10px] tracking-wider text-text-secondary uppercase">
            Your Counter Price (USD)
          </Label>
          <PriceInput
            id="counter-amount"
            min={1}
            value={amount}
            onChange={(val) => setAmount(val)}
            className="h-11 rounded-lg border-0 bg-surface-container-lowest px-3 font-data-mono-lg text-lg font-bold text-text-primary shadow-inner"
          />
        </div>

        {/* Financial Breakdown */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-surface-container-lowest p-3 font-data-mono-md text-xs">
          <div className="flex justify-between text-text-secondary">
            <span>Relicto Fee (2.5%)</span>
            <span className="text-text-muted">-{formatMoney(feeUsd)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>vs. Buyer Bid</span>
            <span className={gainVsBid >= 0 ? "text-emerald-400 font-semibold" : "text-error"}>
              {gainVsBid >= 0 ? `+${formatMoney(gainVsBid)}` : formatMoney(gainVsBid)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border-subtle/60 pt-1.5 font-bold text-text-primary">
            <span>Net Vault Proceeds</span>
            <span className="text-tertiary">{formatMoney(netProceeds)}</span>
          </div>
        </div>

        {/* Note */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="counter-note" className="font-label-badge text-[10px] tracking-wider text-text-secondary uppercase">
            Note to Buyer (optional)
          </Label>
          <Textarea
            id="counter-note"
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Can meet in the middle if accepted today. Will send trade offer promptly."
            className="min-h-14 rounded-lg border-0 bg-surface-container-lowest px-3 py-2 font-body-sm text-xs text-text-primary shadow-inner placeholder:text-text-muted"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant={null}
            size={null}
            disabled={pending}
            onClick={close}
            className="h-auto rounded-lg border border-border-subtle bg-surface-container px-4 py-2.5 font-label-caps text-xs font-bold text-text-secondary uppercase hover:bg-surface-container-high"
          >
            Cancel
          </Button>
          <Button
            variant={null}
            size={null}
            disabled={pending || amount <= 0}
            onClick={submit}
            className="h-auto flex-1 gap-1.5 rounded-lg border-0 bg-tertiary px-4 py-2.5 font-label-caps text-xs font-bold tracking-wider text-on-tertiary-container uppercase shadow-sm transition-all hover:bg-tertiary-fixed disabled:opacity-50"
          >
            <Icon name="swap_horiz" className="text-[16px]" />
            Send {formatMoney(amount)} Counter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
