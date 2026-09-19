import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/format";
import { ACCENT, SIGNAL_CHIP, TONE_TEXT } from "../../lib/tones";
import type { MetaCard } from "../../types";

const GLASS_CHIP = "rounded bg-black/70 backdrop-blur-sm";

function CardMedia({ card }: { card: MetaCard }) {
  return (
    <div className="relative h-48 w-full overflow-hidden bg-surface-container-lowest">
      <Image
        src={card.image}
        alt={card.imageAlt}
        fill
        sizes="(min-width: 1280px) 296px, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t/srgb from-surface-card via-transparent to-black/30" />
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        <span className={cn("rounded px-2 py-0.5 font-mono text-[9px] font-bold shadow-sm", ACCENT[card.accent].tier)}>{card.tier}</span>
        <span className={cn(GLASS_CHIP, "border border-white/10 px-2 py-0.5 font-mono text-[9px] text-text-secondary")}>{card.game}</span>
      </div>
      <div className={cn(GLASS_CHIP, "absolute top-3 right-3 border px-2 py-0.5 font-mono text-[10px] font-bold", SIGNAL_CHIP[card.signal.tone])}>
        {card.signal.label}
      </div>
    </div>
  );
}

/** One meta-relevant cosmetic: hero/weapon, pro user and floor valuation. */
export function MetaCardView({ card }: { card: MetaCard }) {
  const accent = ACCENT[card.accent];
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-dark bg-surface-card shadow-lg transition-all",
        accent.card,
      )}
    >
      <CardMedia card={card} />
      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div>
          <div className="flex items-baseline justify-between">
            <h4 className="text-base font-bold text-white">{card.name}</h4>
            <span className={cn("font-mono text-xs font-bold", TONE_TEXT[card.stat.tone])}>{card.stat.label}</span>
          </div>
          <p className="mt-0.5 text-xs text-text-muted">{card.detail}</p>
          <div className="mt-2.5 flex items-center gap-1.5 rounded border border-border-dark bg-surface p-2">
            <CircleCheck className={cn("size-3.5", TONE_TEXT[card.pro.tone])} />
            <span className="text-xs text-text-secondary">
              Pro User: <strong className="text-white">{card.pro.name}</strong>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-t border-border-dark pt-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-text-muted uppercase">Floor Valuation</span>
            <span className={cn("font-mono text-base font-bold", TONE_TEXT[card.floorTone])}>{formatMoney(card.floorUsd)}</span>
          </div>
          <LinkButton
            href={card.cta.href}
            className={cn(
              "w-full rounded border-0 bg-surface-container-high py-2 text-center text-xs font-bold tracking-wider text-white uppercase",
              accent.cta,
            )}
          >
            {card.cta.label}
          </LinkButton>
        </div>
      </div>
    </article>
  );
}
