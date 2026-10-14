"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  simulateBotOfferSent,
  simulateBuyerAcceptance,
  simulateOrderCancellation,
} from "../../actions/escrow-sandbox";

type EscrowSandboxPanelProps = {
  code: string;
  stage?: string;
  statusText?: string;
};

export function EscrowSandboxPanel({ code, stage, statusText }: EscrowSandboxPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleBotOffer = () => {
    startTransition(async () => {
      try {
        const res = await simulateBotOfferSent(code);
        if (res.status === "applied") {
          toast.success("Sentinel Bot Offer Dispatched", {
            description: "Steam trade offer and token generated. Notifications pushed.",
          });
        } else {
          toast.info(`Offer sent status: ${res.status}`);
        }
      } catch (err) {
        toast.error("Failed to simulate bot offer", {
          description: err instanceof Error ? err.message : "Internal error",
        });
      }
    });
  };

  const handleDeliver = () => {
    startTransition(async () => {
      try {
        const res = await simulateBuyerAcceptance(code);
        if (res.status === "applied") {
          toast.success("Order Completed & Delivered!", {
            description: "Asset released to buyer. Vault payout credited to seller.",
          });
        } else {
          toast.info(`Delivery status: ${res.status}`);
        }
      } catch (err) {
        toast.error("Failed to simulate delivery", {
          description: err instanceof Error ? err.message : "Internal error",
        });
      }
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      try {
        const res = await simulateOrderCancellation(code);
        if (res.status === "applied") {
          toast.success("Order Cancelled & Refunded", {
            description: "Buyer vault refunded in full. Listing returned to market.",
          });
        } else {
          toast.info(`Cancel status: ${res.status}`);
        }
      } catch (err) {
        toast.error("Failed to cancel order", {
          description: err instanceof Error ? err.message : "Internal error",
        });
      }
    });
  };

  const isCompleted = statusText?.toLowerCase().includes("completed") || stage === "completed";
  const isCancelled = statusText?.toLowerCase().includes("cancelled") || stage === "cancelled";
  const isOfferSent = stage === "offer-sent";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-surface-container-lowest/90 p-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon name="dns" className="text-[16px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-xs font-bold text-text-primary uppercase tracking-wider">
              Escrow Lifecycle Sandbox
            </span>
            <span className="text-[10px] text-text-muted">
              Live protocol simulation for order <b className="text-text-secondary">{code}</b>
            </span>
          </div>
        </div>
        <span className="rounded bg-primary/15 px-2 py-0.5 font-data-mono-md text-[10px] font-bold text-primary uppercase">
          Dev / Demo Rail
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {!isCompleted && !isCancelled && !isOfferSent && (
          <Button
            type="button"
            disabled={isPending}
            onClick={handleBotOffer}
            size="sm"
            className="flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold"
          >
            <Icon name="cell_tower" className="text-[14px]" />
            Simulate Bot Dispatch
          </Button>
        )}

        {!isCompleted && !isCancelled && (
          <>
            <Button
              type="button"
              disabled={isPending}
              onClick={handleDeliver}
              size="sm"
              className="flex items-center gap-1.5 bg-status-live text-canvas-base hover:bg-status-live/90 text-xs font-semibold"
            >
              <Icon name="check_circle" className="text-[14px]" />
              Simulate Buyer Accept & Deliver
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={handleCancel}
              size="sm"
              className="flex items-center gap-1.5 border-white/10 text-xs text-text-muted hover:text-text-primary"
            >
              <Icon name="cancel" className="text-[14px]" />
              Simulate Timeout / Cancel
            </Button>
          </>
        )}

        {isCompleted && (
          <div className="flex items-center gap-2 rounded bg-status-live/10 px-3 py-1.5 text-xs font-semibold text-status-live border border-status-live/20">
            <Icon name="check_circle" className="text-[16px]" />
            Order Settled & Delivered — Payout Transferred
          </div>
        )}

        {isCancelled && (
          <div className="flex items-center gap-2 rounded bg-status-danger/10 px-3 py-1.5 text-xs font-semibold text-status-danger border border-status-danger/20">
            <Icon name="cancel" className="text-[16px]" />
            Order Cancelled — Buyer Vault Refunded
          </div>
        )}
      </div>
    </div>
  );
}
