"use client";

import * as React from "react";
import { Percent, Save, Sparkles, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { toast } from "sonner";
import { createPromoCodeAction } from "../actions/admin-promos";
import type { DashboardPromoCode } from "../types";

interface PromoCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (promo: DashboardPromoCode) => void;
}

export function PromoCreateDialog({ open, onOpenChange, onCreated }: PromoCreateDialogProps) {
  const [code, setCode] = React.useState("");
  const [discountBps, setDiscountBps] = React.useState(100);
  const [gameId, setGameId] = React.useState("all");
  const [maxUses, setMaxUses] = React.useState(500);
  const [saving, setSaving] = React.useState(false);

  const discountPercent = (discountBps / 100).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Voucher code is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await createPromoCodeAction({
        code,
        discountBps,
        gameId,
        maxUses,
      });

      if (res.success && res.promo) {
        toast.success(`Promo code ${res.promo.code} activated.`);
        onCreated(res.promo);
        onOpenChange(false);
      } else {
        toast.error(res.error ?? "Failed to create promo code.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-surface-card border-border-subtle shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Percent className="size-4 text-primary" />
            Issue Promotional Fee Voucher
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Configure discount campaign codes, take rate fee reductions, and usage limits.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Promo Code Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-text-secondary flex items-center justify-between">
              <span>Promo Voucher Code</span>
              <span className="text-[10px] text-text-muted">Auto-capitalized</span>
            </label>
            <div className="relative">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER_2026"
                className="h-9 text-xs font-mono font-bold uppercase tracking-wider bg-surface-container border-border-subtle"
              />
            </div>
          </div>

          {/* Discount & Game Scope Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-text-secondary flex items-center justify-between">
                <span>Fee Discount</span>
                <span className="text-cyan-400 font-bold text-[10px]">-{discountPercent}%</span>
              </label>
              <PriceInput
                value={discountBps}
                onChange={setDiscountBps}
                currencyPrefix=""
                currencySuffix="BPS"
                allowDecimals={false}
                min={10}
                max={250}
                placeholder="100"
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-text-secondary">Ecosystem Scope</label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full h-9 px-2 text-xs font-mono rounded-lg bg-surface-container border border-border-subtle text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Ecosystems</option>
                <option value="cs2">CS2 Only</option>
                <option value="dota2">Dota 2 Only</option>
                <option value="tf2">TF2 Only</option>
              </select>
            </div>
          </div>

          {/* Max Uses */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-text-secondary flex items-center gap-1.5">
              <Hash className="size-3 text-text-muted" />
              Maximum Redemptions Ceiling
            </label>
            <PriceInput
              value={maxUses}
              onChange={setMaxUses}
              currencyPrefix=""
              currencySuffix="USES"
              allowDecimals={false}
              min={1}
              max={100000}
              placeholder="500"
              className="h-9"
            />
          </div>

          {/* Visual Incentive Preview Pill */}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-2.5 text-xs text-text-primary">
            <Sparkles className="size-4 text-primary shrink-0" />
            <div className="flex flex-col text-[11px] font-mono leading-tight">
              <span>Traders entering <strong>{code || "YOUR_CODE"}</strong> will receive:</span>
              <span className="text-cyan-400 font-semibold mt-0.5">
                -{discountPercent}% escrow discount ({discountBps} bps) up to {maxUses.toLocaleString()} redemptions.
              </span>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={saving} className="gap-1.5 text-xs font-semibold shadow-sm">
              <Save className="size-3.5" />
              {saving ? "Activating..." : "Activate Promo Code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
