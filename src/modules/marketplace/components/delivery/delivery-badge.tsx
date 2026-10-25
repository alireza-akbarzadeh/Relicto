"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { DELIVERY_TONE, type DeliverySla } from "../../types/delivery";
import { CacheTradeExplainerModal } from "./cache-trade-explainer-modal";

export function DeliveryBadge({
  sla,
  variant = "badge",
  className,
}: {
  sla: DeliverySla;
  variant?: "badge" | "callout" | "pill";
  className?: string;
}) {
  const [explainerOpen, setExplainerOpen] = useState(false);
  const tone = DELIVERY_TONE[sla.tone];

  if (variant === "pill") {
    return (
      <>
        {sla.friendHoldRequired ? (
          <Button
            type="button"
            variant={null}
            size={null}
            title="Collector's Cache 31-day Steam friend hold. Click to learn how escrow protects you."
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExplainerOpen(true);
            }}
            className={cn(
              "h-auto inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold border transition-colors cursor-pointer hover:brightness-125",
              tone.badge,
              className
            )}
          >
            <Icon name={sla.icon} className="text-[12px]" />
            <span>{sla.shortBadge}</span>
            <Icon name="help" className="text-[11px] opacity-80" />
          </Button>
        ) : (
          <span
            title={sla.description}
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold border transition-colors",
              tone.badge,
              className
            )}
          >
            <Icon name={sla.icon} className="text-[12px]" />
            <span>{sla.shortBadge}</span>
          </span>
        )}

        {sla.friendHoldRequired && (
          <CacheTradeExplainerModal open={explainerOpen} onOpenChange={setExplainerOpen} />
        )}
      </>
    );
  }

  if (variant === "callout") {
    return (
      <>
        <div
          className={cn(
            "flex flex-col gap-2 rounded-xl border p-3.5 transition-all",
            tone.bg,
            tone.border,
            className
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg border",
                  tone.badge
                )}
              >
                <Icon name={sla.icon} className="text-[16px]" />
              </span>
              <div className="flex flex-col">
                <span className="font-label-badge text-[10px] tracking-wider text-text-muted uppercase">
                  Estimated Delivery
                </span>
                <span className={cn("font-headline-sm text-xs font-bold", tone.text)}>
                  {sla.label} • {sla.etaTime}
                </span>
              </div>
            </div>

            <span
              className={cn(
                "rounded-md border px-2 py-0.5 font-data-mono-md text-[10px] font-bold",
                tone.badge
              )}
            >
              {sla.shortBadge}
            </span>
          </div>

          <p className="font-body-sm text-[11px] leading-relaxed text-text-secondary">
            {sla.description}
          </p>

          {sla.warning && (
            <div className="flex items-start gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-[10px] text-amber-300 font-medium leading-normal">
              <Icon name="info" className="text-[14px] shrink-0 text-amber-400 mt-0.5" />
              <span>{sla.warning}</span>
            </div>
          )}

          {sla.friendHoldRequired && (
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={() => setExplainerOpen(true)}
              className="flex h-auto w-full items-center justify-between rounded-lg border border-pink-500/30 bg-pink-950/30 px-2.5 py-1.5 text-left text-[11px] text-pink-200 transition-all hover:bg-pink-900/40 cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Icon name="help" className="text-[14px] text-pink-400" />
                <span>First time buying a Cache set? Read the 31-day guide</span>
              </span>
              <span className="font-mono text-[10px] font-bold text-pink-300 underline uppercase tracking-wider shrink-0">
                How It Works →
              </span>
            </Button>
          )}

          <div className="flex items-center justify-between border-t border-white/5 pt-1.5 font-data-mono-md text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Icon name="verified_user" className="text-[12px] text-emerald-400" />
              <span>Relicto Escrow 100% Protection</span>
            </span>
            <span className="text-text-muted/60">
              {sla.friendHoldRequired ? "Friendship Hold Rule" : "Automated Delivery Node"}
            </span>
          </div>
        </div>

        {sla.friendHoldRequired && (
          <CacheTradeExplainerModal open={explainerOpen} onOpenChange={setExplainerOpen} />
        )}
      </>
    );
  }

  // Default "badge"
  return (
    <>
      <div
        title={sla.description}
        onClick={sla.friendHoldRequired ? () => setExplainerOpen(true) : undefined}
        className={cn(
          "group/sla relative inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-data-mono-md text-[10px] font-semibold transition-all",
          tone.badge,
          sla.friendHoldRequired && "cursor-pointer hover:brightness-125",
          className
        )}
      >
        <Icon name={sla.icon} className="text-[13px]" />
        <span className="font-bold tracking-tight">{sla.shortBadge}</span>
        <span className="text-text-muted/80 font-normal">({sla.etaTime})</span>
        {sla.friendHoldRequired && (
          <Icon name="help" className="text-[11px] opacity-80 ml-0.5" />
        )}
      </div>

      {sla.friendHoldRequired && (
        <CacheTradeExplainerModal open={explainerOpen} onOpenChange={setExplainerOpen} />
      )}
    </>
  );
}
