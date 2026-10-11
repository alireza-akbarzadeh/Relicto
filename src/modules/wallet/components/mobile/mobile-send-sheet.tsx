"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableUsd: number;
};

export function MobileSendSheet({ open, onOpenChange, availableUsd }: Props) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("50.00");
  const [pending, setPending] = useState(false);

  const numericAmount = Number(amount) || 0;

  const handleSend = () => {
    if (!recipient.trim()) {
      toast.error("Enter a recipient handle or SteamID64");
      return;
    }
    if (numericAmount <= 0) {
      toast.error("Enter a transfer amount");
      return;
    }
    if (numericAmount > availableUsd) {
      toast.error("Amount exceeds available balance");
      return;
    }

    setPending(true);
    setTimeout(() => {
      setPending(false);
      onOpenChange(false);
      toast.success("P2P Transfer Dispatched", {
        description: `${formatMoney(numericAmount)} transferred to ${recipient.trim()}.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] border-border-subtle bg-surface-card p-space-md text-text-primary sm:max-w-md">
        <DialogHeader className="gap-1 p-0 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
              <Icon name="swap_horizontal_circle" className="text-[20px]" />
            </div>
            <DialogTitle className="font-headline-sm text-headline-sm text-text-primary">
              P2P Vault Transfer
            </DialogTitle>
          </div>
          <div className="flex items-center justify-between text-body-sm text-text-secondary">
            <span>Spendable Balance:</span>
            <span className="font-data-mono-md font-bold text-text-primary">{formatMoney(availableUsd)}</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-space-sm pt-2">
          <label className="flex flex-col gap-1.5 font-label-caps text-label-caps text-text-secondary uppercase">
            Recipient Trader / Steam ID
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. KuroSkins or 76561198..."
              className="h-12 rounded-lg border-border-subtle/50 bg-surface-container-lowest font-body-md text-text-primary focus-visible:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1.5 font-label-caps text-label-caps text-text-secondary uppercase">
            Transfer Amount (USD)
            <div className="flex h-12 items-center rounded-lg border border-border-subtle/50 bg-surface-container-lowest px-3">
              <span className="font-data-mono-md text-text-muted">$</span>
              <Input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-full border-0 bg-transparent p-0 px-2 font-data-mono-lg text-text-primary focus-visible:ring-0"
                placeholder="0.00"
              />
              <span className="font-data-mono-md text-[12px] text-text-secondary">USD</span>
            </div>
          </label>

          <Button
            variant={null}
            size={null}
            disabled={pending || availableUsd <= 0 || numericAmount <= 0}
            onClick={handleSend}
            className="mt-2 h-auto w-full gap-2 rounded-lg border-0 bg-primary py-3 font-headline-sm text-[13px] font-bold text-on-primary uppercase shadow-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Icon name="send" className="text-[18px]" />
            <span>
              {pending
                ? "Authorizing transfer…"
                : `Transfer ${formatMoney(numericAmount)}`}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
