import { Icon } from "@/components/ui/icon";
import { formatDelta, formatMoney } from "@/lib/format";
import type { ItemMobile } from "../../mobile.types";

/** 24h trajectory drawn from the price points (viewBox 100×32). */
function Sparkline({ points }: { points: [number, number][] }) {
  const line = points.map(([x, y], index) => `${index ? "L" : "M"}${x},${y}`).join(" ");
  return (
    <svg className="mt-1 h-8 w-24 overflow-visible text-amber-500" fill="none" viewBox="0 0 100 32" aria-hidden>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="item-sparkline" x1="0" x2="0" y1="0" y2="32">
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={line} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      <path d={`${line} L100,32 L0,32 Z`} fill="url(#item-sparkline)" opacity="0.3" />
    </svg>
  );
}

/** Global floor vs Steam, the 24h move and the escrow assurance strip. */
export function FloorPriceCard({ item }: { item: ItemMobile }) {
  const { floorUsd, steamUsd, deltaPct, sparkline } = item.price;
  const savePct = Math.round((1 - floorUsd / steamUsd) * 100);

  return (
    <div className="px-space-md py-space-sm">
      <div className="flex flex-col gap-space-md rounded-xl bg-surface-container-low p-space-md shadow-md">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">Relicto Global Floor</span>
            <div className="mt-0.5 flex items-baseline gap-space-xs">
              <span className="font-display-hero-mobile text-display-hero-mobile font-bold tracking-tight text-text-primary">{formatMoney(floorUsd)}</span>
              <span className="font-label-badge text-label-badge text-text-secondary">USD</span>
            </div>
            <div className="mt-1 flex items-center gap-space-xs">
              <span className="font-body-sm text-body-sm text-text-muted line-through">Steam: {formatMoney(steamUsd)}</span>
              <span className="rounded-lg bg-surface-container-highest px-1.5 py-0.5 font-label-badge text-label-badge font-bold text-tertiary">
                SAVE {savePct}%
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 font-data-mono-md text-data-mono-md font-bold text-tertiary">
              <Icon name="trending_up" className="text-[16px]" />
              {formatDelta(deltaPct)} <span className="font-label-badge text-[10px] font-normal text-text-muted">(24H)</span>
            </div>
            <Sparkline points={sparkline} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm text-body-sm">
          <div className="flex items-center gap-space-xs text-text-secondary">
            <Icon name="verified_user" className="text-[18px] text-secondary" />
            <span className="font-label-badge text-label-badge">{item.protection.label}</span>
          </div>
          <div className="flex items-center gap-1 font-label-badge text-label-badge font-bold text-primary">
            <Icon name="bolt" className="text-[14px]" />
            {item.protection.dispatch}
          </div>
        </div>
      </div>
    </div>
  );
}
