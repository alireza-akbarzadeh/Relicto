import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatCapacity } from "../../../lib/format";
import { ACCENT_CARD, TEXT_TONE } from "../../../lib/tones";
import type { ArenaCard as ArenaCardData } from "../../../types";
import { TeamStack } from "../../shared/team-stack";
import { ArenaCardMedia } from "./arena-card-media";

const ACTION_EMPHASIS = {
  primary: "bg-primary-container text-on-primary shadow-md hover:bg-primary-container/90",
  secondary: "bg-surface-container-high text-text-primary hover:bg-surface-bright",
} as const;

export function ArenaCard({ card }: { card: ArenaCardData }) {
  const accent = ACCENT_CARD[card.accent];

  return (
    <article
      className={cn(
        "group flex flex-col justify-between overflow-hidden rounded-xl bg-surface-card transition-all duration-300 hover:-translate-y-1",
        accent.hoverGlow,
      )}
    >
      <ArenaCardMedia card={card} />

      <div className="flex flex-1 flex-col gap-space-sm p-space-md">
        <div className="flex items-center justify-between">
          <span className={cn("font-label-caps text-label-caps tracking-wider uppercase", accent.label)}>
            {card.format}
          </span>
          <span className="font-data-mono-md text-data-mono-md text-text-muted">
            {formatCapacity(card.capacity, "/")}
          </span>
        </div>
        <h3
          className={cn(
            "font-headline-sm text-headline-sm leading-tight text-text-primary transition-colors",
            accent.hoverTitle,
          )}
        >
          {card.title}
        </h3>
        <p className="line-clamp-2 font-body-sm text-body-sm text-text-muted">{card.description}</p>
        <div className="mt-space-xs flex items-center justify-between pt-space-xs">
          <TeamStack roster={card.teams} size="sm" />
          <div className={cn("flex items-center gap-1 font-label-badge text-label-badge", TEXT_TONE[card.perk.tone])}>
            <Icon name={card.perk.icon} className="text-[14px]" />
            <span>{card.perk.label}</span>
          </div>
        </div>
      </div>

      <div className="p-space-md pt-0">
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-center gap-1 rounded py-2.5 font-headline-sm text-body-sm tracking-wider uppercase transition-all",
            ACTION_EMPHASIS[card.action.emphasis],
          )}
        >
          <span>{card.action.label}</span>
          <Icon name={card.action.icon} className="text-[16px]" />
        </button>
      </div>
    </article>
  );
}
