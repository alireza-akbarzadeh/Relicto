"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { DELIVERY_TONE, type DeliverySla } from "../../types/delivery";

export function DeliveryBadge({
  sla,
  variant = "badge",
  className,
}: {
  sla: DeliverySla;
  variant?: "badge" | "callout" | "pill";
  className?: string;
}) {
  const tone = DELIVERY_TONE[sla.tone];

  if (variant === "pill") {
    return (
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
    );
  }

  if (variant === "callout") {
    return (
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
    );
  }

  // Default "badge"
  return (
    <div
      title={sla.description}
      className={cn(
        "group/sla relative inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-data-mono-md text-[10px] font-semibold transition-all",
        tone.badge,
        className
      )}
    >
      <Icon name={sla.icon} className="text-[13px]" />
      <span className="font-bold tracking-tight">{sla.shortBadge}</span>
      <span className="text-text-muted/80 font-normal">({sla.etaTime})</span>
    </div>
  );
}
