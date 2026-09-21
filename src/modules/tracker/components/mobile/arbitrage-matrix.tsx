import Image from "next/image";
import type { ReactNode } from "react";
import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import { legSpread } from "../../lib/mobile-market";
import type { ArbCard } from "../../mobile.types";

const NAME = "font-body-md text-body-md font-bold text-text-primary";

function Row({ thumb, title, detail, spread, net, compact }: { thumb: ReactNode; title: ReactNode; detail: string; spread: string; net: string; compact?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {thumb}
        <div>
          {title}
          <span className={compact ? "font-label-badge text-label-badge text-text-muted" : "font-label-badge text-label-badge text-text-secondary"}>{detail}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-data-mono-md text-data-mono-md font-bold text-tertiary">{spread}</div>
        <div className={compact ? "font-label-badge text-label-badge text-text-secondary" : "font-label-badge text-label-badge font-semibold text-tertiary"}>{net}</div>
      </div>
    </div>
  );
}

function Thumb({ card }: { card: Extract<ArbCard, { image: string }> }) {
  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
      <Image src={card.image} alt={card.imageAlt} width={80} height={80} sizes="40px" className="h-full w-full object-cover" />
    </div>
  );
}

function Card({ card }: { card: ArbCard }) {
  if (card.kind === "compact") {
    const thumb = (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-highest">
        <Icon name={card.icon} className="text-[20px] text-tertiary" />
      </div>
    );
    return (
      <div className="flex flex-col gap-2 rounded-xl bg-surface-container p-3.5 shadow-md">
        <Row compact thumb={thumb} title={<div className={NAME}>{card.name}</div>} detail={card.detail} spread={card.spread} net={card.net} />
      </div>
    );
  }

  const spread = legSpread(card.buy, card.sell);
  if (card.kind === "route") {
    return (
      <div className="flex flex-col gap-3 rounded-xl bg-surface-container p-3.5 shadow-md">
        <Row thumb={<Thumb card={card} />} title={<div className={NAME}>{card.name}</div>} detail={card.detail} spread={spread} net={card.net} />
        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-2 text-text-secondary">
          <span className="font-body-sm text-body-sm">
            {card.buy.venue}: <strong className="font-data-mono-md text-text-primary">{formatMoney(card.buy.priceUsd)}</strong>
          </span>
          <Icon name="arrow_forward" className="text-[16px] text-text-muted" />
          <span className="font-body-sm text-body-sm">
            {card.sell.venue}: <strong className="font-data-mono-md text-tertiary">{formatMoney(card.sell.priceUsd)}</strong>
          </span>
        </div>
      </div>
    );
  }

  const title = (
    <div className="flex items-center gap-1.5">
      <span className={NAME}>{card.name}</span>
      <span className="rounded bg-primary-container px-1 py-0.5 font-label-badge text-label-badge font-bold text-on-primary-container uppercase">
        {card.badge}
      </span>
    </div>
  );
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface-container p-3.5 shadow-md">
      <Row thumb={<Thumb card={card} />} title={title} detail={card.detail} spread={spread} net={card.net} />
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-surface-container-low p-2 text-center">
        {[
          { label: `Buy ${card.buy.venue}`, quote: card.buy, tone: "text-text-primary" },
          { label: `Sell ${card.sell.venue}`, quote: card.sell, tone: "text-tertiary" },
        ].map((leg) => (
          <div key={leg.label} className="flex flex-col">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{leg.label}</span>
            <span className={`font-data-mono-md text-data-mono-md font-semibold ${leg.tone}`}>{formatMoney(leg.quote.priceUsd)}</span>
          </div>
        ))}
      </div>
      <NoticeButton
        notice={{ title: "Arb bot armed", description: `Buying on ${card.buy.venue} and listing on ${card.sell.venue} (${spread} spread).` }}
        className="h-auto min-h-[44px] w-full gap-1.5 rounded-lg border-0 bg-surface-container-high px-3 py-2.5 font-label-caps text-label-caps font-bold text-primary uppercase transition-all hover:bg-primary hover:text-on-primary active:scale-[0.98]"
      >
        <Icon name="smart_toy" className="text-[18px]" />
        <span>Execute Instant Arb Bot</span>
      </NoticeButton>
    </div>
  );
}

/** Cross-market spreads worth flipping right now. */
export function ArbitrageMatrix({ title, cards }: { title: string; cards: ArbCard[] }) {
  return (
    <div className="flex flex-col gap-3 px-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="query_stats" className="text-[20px] text-primary" />
          <h3 className="font-headline-sm text-headline-sm text-text-primary">{title}</h3>
        </div>
        <span className="font-label-badge text-label-badge text-tertiary uppercase">{cards.length} Active Spreads</span>
      </div>
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}
