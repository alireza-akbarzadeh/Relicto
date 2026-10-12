"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";
import { createAlertRule } from "@/modules/alerts/actions/rules";
import type { ItemDetail } from "../../types";

export interface PriceAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ItemDetail;
}

export function PriceAlertModal({ open, onOpenChange, item }: PriceAlertModalProps) {
  const router = useRouter();
  const currentPrice = item.price.lowestUsd;
  const [targetUsd, setTargetUsd] = useState<string>(() =>
    currentPrice > 0 ? (currentPrice * 0.9).toFixed(2) : "100.00",
  );
  const [maxFloat, setMaxFloat] = useState<string>("");
  const [autoBuy, setAutoBuy] = useState(false);
  const [pending, startTransition] = useTransition();

  const applyDiscountPreset = (percent: number) => {
    if (currentPrice > 0) {
      const calculated = currentPrice * (1 - percent / 100);
      setTargetUsd(calculated.toFixed(2));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericTarget = parseFloat(targetUsd);
    if (!numericTarget || numericTarget <= 0) {
      toast.error("Invalid target price", { description: "Please enter a positive dollar amount." });
      return;
    }

    const parsedFloat = maxFloat.trim() ? parseFloat(maxFloat.trim()) : null;
    if (parsedFloat !== null && (isNaN(parsedFloat) || parsedFloat < 0 || parsedFloat > 1)) {
      toast.error("Invalid float condition", { description: "Wear float must be between 0.00 and 1.00." });
      return;
    }

    startTransition(async () => {
      try {
        await createAlertRule({
          name: item.name,
          targetUsd: numericTarget,
          maxFloat: parsedFloat,
          autoBuy,
        });

        toast.success("Snipe alert deployed", {
          description: `Armed to trigger when ${item.name} drops below ${formatMoney(numericTarget)} USD.`,
          action: {
            label: "Open Rulebook",
            onClick: () => router.push("/alerts"),
          },
        });
        onOpenChange(false);
      } catch {
        toast.error("Could not deploy alert", {
          description: "Check your connection and ensure you are signed in.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-white/10 bg-surface-card p-6 shadow-2xl">
        <DialogHeader className="gap-1 pb-2">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="notifications_active" className="text-[20px]" />
            <DialogTitle className="font-headline-sm text-lg font-bold text-text-primary uppercase tracking-wider">
              Deploy Price Snipe Alert
            </DialogTitle>
          </div>
          <DialogDescription className="font-body-sm text-xs text-text-secondary">
            Continuous escrow bot scanner monitors marketplace listings and notifies your channel when trigger conditions are met.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-1">
          {/* Item baseline info */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface-container-lowest p-3">
            <div className="flex flex-col">
              <span className="font-headline-sm text-xs font-semibold text-text-primary">{item.name}</span>
              <span className="font-label-badge text-[10px] text-text-muted">Market Floor Baseline</span>
            </div>
            <div className="flex items-baseline gap-1 font-data-mono-md">
              <span className="text-base font-bold text-text-primary">{formatMoney(currentPrice)}</span>
              <span className="text-[10px] text-text-muted">USD</span>
            </div>
          </div>

          {/* Target Price */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
              Trigger Price Target (USD)
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 font-data-mono-md text-xs text-text-muted">$</span>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={targetUsd}
                onChange={(e) => setTargetUsd(e.target.value)}
                placeholder="0.00"
                className="h-10 border-white/10 bg-surface-container-lowest pl-7 font-data-mono-md text-sm text-text-primary focus-visible:ring-primary"
              />
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              {[5, 10, 15, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyDiscountPreset(pct)}
                  className="rounded bg-surface-container-high px-2 py-1 font-data-mono-md text-[11px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary"
                >
                  -{pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Wear Float Cap */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
                Max Wear Float (Optional)
              </label>
              <span className="font-label-badge text-[10px] text-text-muted">0.000 - 1.000</span>
            </div>
            <Input
              type="number"
              step="0.001"
              min="0"
              max="1"
              value={maxFloat}
              onChange={(e) => setMaxFloat(e.target.value)}
              placeholder="e.g. 0.035 (Factory New / Low Float)"
              className="h-9 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary"
            />
          </div>

          {/* Auto Buy toggle */}
          <div className="flex items-start justify-between rounded-xl border border-white/10 bg-surface-container-lowest p-3">
            <div className="flex flex-col pr-3">
              <span className="font-headline-sm text-xs font-semibold text-text-primary">Instant Auto-Execution</span>
              <span className="font-body-sm text-[11px] text-text-muted">
                Automatically lock escrow and purchase from vault liquid balance when listing appears.
              </span>
            </div>
            <input
              type="checkbox"
              id="auto-buy-check"
              checked={autoBuy}
              onChange={(e) => setAutoBuy(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-surface-card text-primary focus:ring-primary"
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2.5 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              className="h-9 border-white/15 bg-transparent font-headline-sm text-xs text-text-secondary hover:bg-white/5 uppercase"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="h-9 gap-1.5 border-0 bg-primary px-4 font-headline-sm text-xs font-bold text-on-primary shadow-lg shadow-primary/20 hover:bg-primary/90 uppercase"
            >
              <Icon name={pending ? "progress_activity" : "radar"} className={`text-[16px] ${pending ? "animate-spin" : ""}`} />
              <span>{pending ? "Arming Sniper..." : "Arm Snipe Alert"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
