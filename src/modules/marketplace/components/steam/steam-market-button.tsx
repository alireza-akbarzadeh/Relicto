"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { SteamIcon } from "@/components/ui/steam-icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { getSteamMarketUrl, type SteamMarketTarget } from "@/lib/steam/market-url";

export function SteamMarketButton({
  target,
  steamPriceUsd,
  relictoPriceUsd,
  variant = "button",
  className,
}: {
  target: SteamMarketTarget;
  steamPriceUsd?: number;
  relictoPriceUsd?: number;
  variant?: "button" | "compact" | "icon" | "banner";
  className?: string;
}) {
  const url = getSteamMarketUrl(target);
  const estimatedSteamPrice =
    steamPriceUsd ?? (relictoPriceUsd ? Math.round(relictoPriceUsd * 1.15 * 100) / 100 : undefined);
  const savingsPercent =
    relictoPriceUsd && estimatedSteamPrice && estimatedSteamPrice > relictoPriceUsd
      ? Math.round(((estimatedSteamPrice - relictoPriceUsd) / estimatedSteamPrice) * 100)
      : null;

  if (variant === "icon") {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        title={`View ${target.name} on Steam Community Market`}
        aria-label="Open in Steam Community Market"
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md border border-white/5 bg-surface-container-high/60 text-text-muted transition-colors hover:border-[#171a21] hover:bg-[#171a21] hover:text-[#66c0f4]",
          className
        )}
      >
        <SteamIcon className="size-3.5" />
      </Link>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#171a21]/80 p-3.5 backdrop-blur-md",
          className
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-highest text-[#66c0f4]">
            <SteamIcon className="size-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-xs font-bold text-white">
                Steam Community Market
              </span>
              <span className="rounded bg-white/10 px-1.5 py-0.2 font-data-mono-md text-[9px] text-slate-300">
                15% Valve Fee
              </span>
            </div>
            <span className="font-body-sm text-[11px] text-slate-400">
              {estimatedSteamPrice
                ? `Current Steam benchmark: ~${formatMoney(estimatedSteamPrice)} USD`
                : "Browse active Steam Community Market listings"}
              {savingsPercent ? ` (Save ${savingsPercent}% on Relicto)` : ""}
            </span>
          </div>
        </div>

        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-label-caps text-xs font-bold text-slate-200 transition-all hover:bg-white/10 hover:text-white"
        >
          <span>Open on Steam</span>
          <Icon name="open_in_new" className="text-[14px]" />
        </Link>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#171a21]/60 px-3 py-2 font-label-caps text-xs font-semibold text-slate-300 transition-all hover:bg-[#171a21] hover:text-[#66c0f4]",
          className
        )}
      >
        <SteamIcon className="size-4" />
        <span>Buy on Steam</span>
        <Icon name="open_in_new" className="text-[13px] text-slate-400" />
      </Link>
    );
  }

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#171a21]/90 px-4 py-3 text-slate-200 transition-all hover:border-[#66c0f4]/40 hover:bg-[#171a21] hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-[#66c0f4] transition-colors group-hover:bg-[#66c0f4]/20">
          <SteamIcon className="size-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-headline-sm text-xs font-bold text-white group-hover:text-[#66c0f4] transition-colors">
            Or Buy on Steam Market
          </span>
          <span className="font-data-mono-md text-[10px] text-slate-400">
            {estimatedSteamPrice ? `${formatMoney(estimatedSteamPrice)} USD` : "Official Steam Community Listing"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 font-label-caps text-[11px] font-semibold text-slate-400 group-hover:text-white">
        <span>Steam Shop</span>
        <Icon name="open_in_new" className="text-[14px]" />
      </div>
    </Link>
  );
}
