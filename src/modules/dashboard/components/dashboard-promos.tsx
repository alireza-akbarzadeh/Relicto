"use client";

import * as React from "react";
import { Percent, Plus, Power, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardPromoCode } from "../types";
import { PromoCreateDialog } from "./promo-create-dialog";
import { togglePromoCodeAction } from "../actions/admin-promos";

export function DashboardPromos({ promos: initialPromos }: { promos: DashboardPromoCode[] }) {
  const [promos, setPromos] = React.useState(initialPromos);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [togglingId, setTogglingId] = React.useState<string | null>(null);

  const handleToggle = async (promo: DashboardPromoCode) => {
    setTogglingId(promo.id);
    try {
      const res = await togglePromoCodeAction(promo.id, !promo.active);
      if (res.success) {
        toast.success(`Promo code ${promo.code} is now ${!promo.active ? "active" : "disabled"}.`);
        setPromos((prev) => prev.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p)));
      } else {
        toast.error(res.error);
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
            <Percent className="size-4 text-primary" />
            Promotional Vouchers & Fee Reduction Campaigns
          </CardTitle>
          <CardDescription className="text-xs text-text-muted mt-0.5">
            Manage escrow take-rate discount codes, seasonal campaign codes, and redemption ceilings
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="gap-1.5 font-semibold text-xs shadow-sm self-start sm:self-auto">
          <Plus className="size-3.5" />
          Issue Promo Voucher
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <tr>
                <th className="pb-3 font-semibold">Voucher Code</th>
                <th className="pb-3 font-semibold">Fee Discount</th>
                <th className="pb-3 font-semibold">Game Scope</th>
                <th className="pb-3 font-semibold">Redemptions</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="py-3">
                    <span className="font-mono font-bold text-text-primary text-xs tracking-wider">
                      {p.code}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-cyan-400 font-semibold">
                    -{(p.discountBps / 100).toFixed(2)}% off fee
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-container border border-border-subtle">
                      {p.gameId}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-text-secondary">
                    {p.usedCount} / {p.maxUses} uses
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded flex items-center gap-1 w-fit ${
                        p.active
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-surface-container text-text-muted border border-border-subtle"
                      }`}
                    >
                      {p.active ? <CheckCircle className="size-2.5" /> : <XCircle className="size-2.5" />}
                      {p.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      size="xs"
                      variant="ghost"
                      disabled={togglingId === p.id}
                      onClick={() => handleToggle(p)}
                      className="gap-1 font-mono text-xs"
                    >
                      <Power className="size-3" />
                      {p.active ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <PromoCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={(promo) => setPromos((prev) => [promo, ...prev])}
      />
    </Card>
  );
}
