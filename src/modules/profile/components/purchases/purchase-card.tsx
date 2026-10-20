"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import type { BoughtItem } from "../../types";

export function PurchaseCard({ item }: { item: BoughtItem }) {
  const isCompleted = item.state === "completed";
  const isEscrow = item.state === "escrow";

  return (
    <article className="group relative flex flex-col justify-between gap-space-md rounded-xl border border-white/6 bg-surface-card p-space-md shadow-md transition-all hover:border-white/15 hover:bg-surface-container-high">
      <div className="flex flex-col gap-space-sm sm:flex-row sm:items-center sm:gap-space-md">
        {/* Thumbnail crop */}
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest p-2 shadow-inner sm:h-28 sm:w-28">
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            sizes="112px"
            className="object-contain p-1 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 font-label-badge text-[9px] font-bold text-text-muted backdrop-blur-xs uppercase">
            {item.game}
          </span>
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded bg-surface-container-highest px-2 py-0.5 font-data-mono-md text-[10px] text-text-secondary">
              {item.attributes?.wear ?? item.game}
            </span>
            {item.attributes?.float !== undefined && (
              <span className="font-data-mono-md text-[10px] text-text-muted">
                Float {item.attributes.float}
              </span>
            )}
            <span className="ml-auto font-data-mono-md text-[11px] text-text-muted">
              {item.placedAt}
            </span>
          </div>

          <h3 className="truncate font-headline-sm text-base font-bold text-text-primary transition-colors group-hover:text-primary">
            {item.name}
          </h3>

          <p className="truncate font-body-sm text-xs text-text-secondary">
            {item.detail}
          </p>

          <div className="mt-1 flex items-center gap-2 font-data-mono-md text-xs text-text-muted">
            <span>Vendor:</span>
            <span className="font-semibold text-text-primary">@{item.sellerHandle}</span>
            <span>•</span>
            <span className="text-[11px] text-text-muted">Order #{item.orderCode}</span>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-white/6 pt-space-sm">
        <div className="flex items-baseline gap-1.5">
          <span className="font-data-mono-md text-xs text-text-muted uppercase">Paid:</span>
          <span className="font-data-mono-lg text-lg font-bold text-primary">
            {formatMoney(item.priceUsd)}
          </span>
          <span className="font-data-mono-md text-[10px] text-text-muted">USD</span>
        </div>

        <div className="flex items-center gap-space-sm">
          {/* Status chip */}
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-label-badge text-[11px] font-semibold ${
              isCompleted
                ? "bg-emerald-500/15 text-emerald-400"
                : isEscrow
                  ? "bg-amber-400/15 text-amber-400"
                  : "bg-surface-container-highest text-text-muted"
            }`}
          >
            <Icon
              name={isCompleted ? "check_circle" : isEscrow ? "lock_clock" : "info"}
              className="text-[14px]"
            />
            <span>{item.stateLabel}</span>
          </span>

          {/* Action button */}
          <Link
            href={item.trackingUrl}
            className="flex items-center gap-1 rounded-lg bg-surface-container-high px-3 py-1.5 font-headline-sm text-xs font-semibold text-text-primary uppercase transition-colors hover:bg-surface-bright hover:text-white"
          >
            <Icon name="receipt_long" className="text-[14px]" />
            <span>Escrow Receipt</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
