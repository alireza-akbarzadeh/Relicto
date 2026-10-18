"use client";

import * as React from "react";
import { Scale, CheckCircle2, ShieldAlert, FileText, User, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { DashboardDispute } from "../types";

interface DisputeDetailSheetProps {
  dispute: DashboardDispute | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (disputeId: string, decision: "refund_buyer" | "release_seller") => Promise<void>;
  resolving: boolean;
}

export function DisputeDetailSheet({
  dispute,
  open,
  onOpenChange,
  onResolve,
  resolving,
}: DisputeDetailSheetProps) {
  if (!dispute) return null;

  const isPending = dispute.status === "open" || dispute.status === "under_review";
  const formatUsd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-surface-card border-border-subtle p-5 overflow-y-auto">
        <SheetHeader className="pb-3 border-b border-border-subtle/50">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Scale className="size-4" />
            <span>ARBITRATION CASE #{dispute.id.slice(0, 8)}</span>
          </div>
          <SheetTitle className="text-base font-heading font-bold text-text-primary">
            {dispute.itemName}
          </SheetTitle>
          <SheetDescription className="text-xs text-text-muted font-mono flex items-center gap-2">
            <span>Order {dispute.orderCode}</span>
            <span>•</span>
            <strong className="text-emerald-400 font-bold">{formatUsd(dispute.amountCents)} in Escrow</strong>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 pt-4 text-xs font-mono">
          {/* Dispute Status Card */}
          <div className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Case Status</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                dispute.status === "open" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                dispute.status === "under_review" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {dispute.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-[11px] text-text-muted">
              Opened on {new Date(dispute.openedAt).toLocaleString()}
            </p>
          </div>

          {/* Involved Parties */}
          <div className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-2.5">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block">
              Involved Counterparties
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-surface-card border border-border-subtle/60 space-y-1">
                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                  <User className="size-3" /> BUYER
                </span>
                <span className="font-bold text-text-primary block">@{dispute.buyerName}</span>
                <span className="text-[10px] text-text-muted">Claiming non-delivery / mismatched trade offer</span>
              </div>
              <div className="p-2 rounded bg-surface-card border border-border-subtle/60 space-y-1">
                <span className="text-[10px] text-amber-400 flex items-center gap-1">
                  <User className="size-3" /> SELLER
                </span>
                <span className="font-bold text-text-primary block">@{dispute.sellerName}</span>
                <span className="text-[10px] text-text-muted">Claiming trade was dispatched via Steam bot</span>
              </div>
            </div>
          </div>

          {/* Claim & Evidence */}
          <div className="p-3 rounded-lg bg-surface-container border border-border-subtle space-y-2">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block">
              Claim & Verification Note
            </span>
            <p className="text-xs text-text-secondary leading-relaxed bg-surface-card p-2.5 rounded border border-border-subtle">
              {dispute.reason}
            </p>
            <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
              <span className="flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" />
                {dispute.evidenceCount} verified attachments uploaded
              </span>
              <span className="text-primary hover:underline cursor-pointer flex items-center gap-1">
                Inspect Steam logs <ExternalLink className="size-3" />
              </span>
            </div>
          </div>

          {/* Arbitration Ruling Chamber */}
          <div className="p-3.5 rounded-lg bg-surface-container border border-border-subtle space-y-3">
            <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block">
              Administrator Final Ruling
            </span>
            {isPending ? (
              <div className="space-y-2">
                <p className="text-[11px] text-text-muted">
                  Ruling will immediately execute atomic escrow release or reverse vault payment.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={resolving}
                    onClick={() => onResolve(dispute.id, "refund_buyer")}
                    className="w-full text-xs font-mono font-semibold h-9"
                  >
                    <ShieldAlert className="size-3.5 mr-1" />
                    Refund Buyer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={resolving}
                    onClick={() => onResolve(dispute.id, "release_seller")}
                    className="w-full text-xs font-mono font-semibold h-9 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10"
                  >
                    <CheckCircle2 className="size-3.5 mr-1" />
                    Release Seller
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded bg-surface-card border border-border-subtle text-center text-xs text-text-secondary">
                This dispute was arbitrated as:{" "}
                <strong className="text-text-primary capitalize">{dispute.status.replace("_", " ")}</strong>.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
