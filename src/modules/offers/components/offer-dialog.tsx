"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { useBidForm } from "../hooks/use-bid-form";
import { useOfferWrites } from "../hooks/use-offer-writes";
import { OFFER_TTL_HOURS } from "../lib/bid-rules";
import type { MyBid } from "../types";

const FIELD = "h-11 rounded-lg border-0 bg-surface-container-lowest px-3 shadow-inner placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-border-focus dark:bg-surface-container-lowest";

type OfferDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  itemName: string;
  sellerName: string;
  askUsd: number;
  myBid?: MyBid;
};

/** Bid below the ask on one copy — or revise or withdraw the bid already on it. */
export function OfferDialog({ open, onOpenChange, listingId, itemName, sellerName, askUsd, myBid }: OfferDialogProps) {
  const form = useBidForm(askUsd, myBid?.priceUsd);
  const { pending, make, withdraw } = useOfferWrites();
  const close = () => onOpenChange(false);

  const submit = () => make({ listingId, amountUsd: form.amountUsd, note: form.note }, itemName, close);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-w-md flex-col gap-4 rounded-xl border border-border-subtle bg-surface-card p-5 shadow-2xl sm:max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary">
            <Icon name="sell" className="text-[22px]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-label-badge text-[10px] tracking-wider text-text-muted uppercase">{myBid ? "Revise your offer" : "Make an offer"}</span>
            <DialogTitle className="font-headline-sm text-base font-bold text-text-primary">{itemName}</DialogTitle>
            <DialogDescription className="font-body-sm text-xs text-text-secondary">
              {sellerName} is asking <span className="font-data-mono-md font-semibold text-text-primary">{formatMoney(askUsd)}</span>
            </DialogDescription>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="offer-amount" className="font-label-badge text-[10px] tracking-wider text-text-secondary uppercase">Your bid (USD)</Label>
          <Input
            id="offer-amount"
            type="number"
            inputMode="decimal"
            min={form.minUsd}
            step="0.01"
            value={form.amount}
            onChange={(event) => form.setAmount(event.target.value)}
            aria-invalid={!form.valid}
            className={cn(FIELD, "font-data-mono-lg text-lg font-bold text-text-primary")}
          />
          <span className={cn("font-data-mono-md text-[11px]", form.valid ? "text-emerald-400" : "text-error")}>{form.hint}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="offer-note" className="font-label-badge text-[10px] tracking-wider text-text-secondary uppercase">Note to seller (optional)</Label>
          <Textarea
            id="offer-note"
            maxLength={200}
            value={form.note}
            onChange={(event) => form.setNote(event.target.value)}
            placeholder="Quick trade, Steam Guard active for 1+ year."
            className="min-h-16 rounded-lg border-0 bg-surface-container-lowest px-3 py-2 font-body-sm text-sm text-text-primary shadow-inner placeholder:text-text-muted dark:bg-surface-container-lowest"
          />
        </div>

        <ul className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-surface-container-lowest p-3 font-body-sm text-xs text-text-secondary">
          <li className="flex items-center gap-2"><Icon name="lock" className="text-[14px] text-status-upcoming" />Nothing leaves your vault until the seller accepts.</li>
          <li className="flex items-center gap-2"><Icon name="bolt" className="text-[14px] text-tertiary" />Accepted bids open escrow at your price instantly.</li>
          <li className="flex items-center gap-2"><Icon name="schedule" className="text-[14px] text-text-muted" />
            {myBid ? `Your ${formatMoney(myBid.priceUsd)} bid has ${myBid.expires}; revising restarts the ${OFFER_TTL_HOURS}h window.` : `Expires after ${OFFER_TTL_HOURS}h without an answer.`}
          </li>
        </ul>

        <div className="flex gap-2">
          {myBid && (
            <Button
              variant={null}
              size={null}
              disabled={pending}
              onClick={() => withdraw(myBid.id, itemName, close)}
              className="h-auto rounded-lg border border-border-subtle bg-surface-container px-4 py-3 font-label-caps text-xs font-bold text-text-secondary uppercase transition-colors hover:bg-surface-container-high hover:text-error"
            >
              Withdraw
            </Button>
          )}
          <Button
            variant={null}
            size={null}
            disabled={pending || !form.valid}
            onClick={submit}
            className="h-auto flex-1 gap-2 rounded-lg border-0 bg-tertiary px-4 py-3 font-label-caps text-xs font-bold tracking-wider text-on-tertiary-container uppercase shadow-sm transition-all hover:bg-tertiary-fixed disabled:opacity-50"
          >
            <Icon name="send" className="text-[16px]" />
            {myBid ? "Revise offer" : `Send ${formatMoney(form.amountUsd)} offer`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
