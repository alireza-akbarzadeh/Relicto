import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { TONE_DROP_SHADOW, TONE_GLOW, TONE_HOVER_TEXT, TONE_TEXT } from "../../lib/tones";
import type { ShowcaseItem } from "../../types";
import { Meter } from "../shared/meter";

/** Renders are exported from Stitch at 512×279. */
const RENDER = { width: 512, height: 279 };

/** One prized collectible: appraisal, render, float or style meter. */
export function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <article className="group relative overflow-hidden rounded-xl bg-surface-card p-space-md transition-all duration-300 hover:bg-surface-container-high">
      <div className={cn("absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125", TONE_GLOW[item.tone])} />
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className={cn("font-label-badge text-[10px] font-bold tracking-wider uppercase", TONE_TEXT[item.tone])}>{item.kicker}</span>
          <h3 className={cn("font-headline-sm text-headline-sm font-bold text-text-primary transition-colors", TONE_HOVER_TEXT[item.tone])}>
            {item.name}
          </h3>
          <span className="font-body-sm text-body-sm text-text-secondary">{item.subtitle}</span>
        </div>
        <div className="text-right">
          <span className={cn("font-data-mono-lg text-data-mono-lg font-bold", TONE_TEXT[item.tone])}>{formatMoney(item.priceUsd)}</span>
          <span className="block font-label-badge text-label-badge text-text-muted uppercase">MARKET APPRAISAL</span>
        </div>
      </div>
      <div className="relative my-space-md flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest/80 p-space-sm">
        <Image
          src={item.image}
          alt={item.imageAlt}
          {...RENDER}
          sizes="(min-width: 1024px) 420px, 100vw"
          className={cn("h-auto w-auto max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105", TONE_DROP_SHADOW[item.tone])}
        />
        <div className={cn("absolute bottom-2 left-2 flex items-center gap-1 rounded bg-surface-overlay px-2 py-0.5 font-label-badge text-label-badge backdrop-blur-md", TONE_TEXT[item.tone])}>
          <Icon name={item.badge.icon} className="text-[13px]" />
          {item.badge.label}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between font-label-badge text-label-badge text-text-muted">
          <span>{item.meter.label}</span>
          <span className="font-data-mono-md font-bold text-text-primary">{item.meter.value}</span>
        </div>
        <Meter pct={item.meter.pct} tone={item.tone} gradient={item.meter.gradient} />
        <div className="flex items-center justify-between pt-1 font-label-badge text-[11px] text-text-muted">
          <span>{item.foot.left}</span>
          <span className="text-status-upcoming">{item.foot.right}</span>
        </div>
      </div>
    </article>
  );
}
