import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import { capacityWidth, formatCapacity, formatUsd } from "../../../lib/format";
import { TEXT_TONE } from "../../../lib/tones";
import type { BracketCardData } from "../../../mobile.types";
import { BracketMedia } from "./bracket-media";

const PROGRESS = {
  dota2: "from-primary to-primary-container",
  cs2: "from-tertiary to-tertiary-container",
} as const;

const ACTION = {
  primary: "bg-primary text-on-primary shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-transform",
  secondary: "bg-surface-container-high text-text-primary transition-all hover:bg-surface-bright",
} as const;

type BracketCardProps = { card: BracketCardData; highPriorityImage?: boolean };

export function BracketCard({ card, highPriorityImage }: BracketCardProps) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-surface-card p-4 shadow-lg transition-transform active:scale-[0.99]">
      <BracketMedia card={card} highPriority={highPriorityImage} />

      <div className="flex items-center justify-between py-1">
        <div className="flex flex-col">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">{card.reward.label}</span>
          <span className="font-data-mono-md text-data-mono-md font-bold tracking-tight text-tertiary">
            {formatUsd(card.reward.usd)} USD{" "}
            <span className="text-xs font-normal text-text-muted">/ {card.reward.points}</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-label-badge text-label-badge text-text-muted uppercase">{card.slots.label}</span>
          <span className="font-data-mono-md text-data-mono-md font-medium text-text-primary">
            {formatCapacity(card.slots.capacity)}
          </span>
        </div>
      </div>

      <ProgressBar
        width={capacityWidth(card.slots.capacity)}
        className="mt-1 mb-3 h-1.5"
        fillClassName={PROGRESS[card.game]}
        label={card.slots.label}
      />

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center -space-x-2">
          {card.crest.map((crest) => (
            <div
              key={crest.icon}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-highest shadow-md"
            >
              <Icon name={crest.icon} className={cn("text-[14px]", TEXT_TONE[crest.tone])} />
            </div>
          ))}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-bright font-label-badge text-[10px] font-bold text-text-primary shadow-md">
            +{card.extraTeams}
          </div>
        </div>
        <button
          type="button"
          className={cn(
            "flex h-8 items-center gap-1.5 rounded-md px-3.5 font-label-caps text-label-caps uppercase active:scale-95",
            ACTION[card.action.emphasis],
          )}
        >
          <span>{card.action.label}</span>
          <Icon name={card.action.icon} className="text-[15px]" />
        </button>
      </div>
    </article>
  );
}
