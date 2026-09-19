import Image from "next/image";
import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/cn";
import { formatUsd } from "../../../lib/format";
import { STATUS_BADGE } from "../../../lib/tones";
import type { ArenaCard } from "../../../types";

const PRIZE_EMPHASIS = {
  solid: "bg-tertiary-container text-on-tertiary-container",
  subtle: "bg-surface-bright text-tertiary",
} as const;

/** Card artwork with status, game and prize badges overlaid. */
export function ArenaCardMedia({ card }: { card: ArenaCard }) {
  const status = STATUS_BADGE[card.status.kind];

  return (
    <div className="relative h-44 w-full overflow-hidden">
      <Image
        src={card.image}
        alt={card.imageAlt}
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t/srgb from-surface-card via-surface-card/40 to-transparent" />

      <div className="absolute top-space-sm left-space-sm flex items-center gap-1.5">
        <span
          className={cn(
            "flex items-center gap-1 rounded px-2 py-0.5 font-label-badge text-label-badge uppercase",
            status.badge,
          )}
        >
          {card.status.indicator && (
            <Dot className={cn("h-1.5 w-1.5", status.dot)} animation={card.status.indicator} />
          )}
          {card.status.label}
        </span>
        <span className="rounded bg-surface-container-lowest/80 px-2 py-0.5 font-label-badge text-label-badge text-text-primary backdrop-blur-md">
          {card.gameLabel}
        </span>
      </div>

      <div className="absolute top-space-sm right-space-sm">
        <span
          className={cn(
            "rounded px-2 py-0.5 font-label-badge text-label-badge font-bold uppercase",
            PRIZE_EMPHASIS[card.prizeEmphasis],
          )}
        >
          {formatUsd(card.prizeUsd)} USD
        </span>
      </div>
    </div>
  );
}
