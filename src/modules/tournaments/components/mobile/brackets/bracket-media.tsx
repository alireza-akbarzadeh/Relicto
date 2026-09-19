import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TEXT_TONE } from "../../../lib/tones";
import type { BracketCardData, BracketSchedule } from "../../../mobile.types";
import { CountdownText } from "../../shared/countdown-text";

const TAG_DOT = { dota2: "bg-status-live", cs2: "bg-tertiary" } as const;
const CHIP = "absolute top-2.5 flex items-center rounded bg-surface-deep/90 px-2 py-0.5 backdrop-blur-md";

function ScheduleChip({ schedule }: { schedule: BracketSchedule }) {
  if (schedule.kind === "countdown") {
    return (
      <div className={cn(CHIP, "right-2.5 gap-1 text-tertiary")}>
        <Icon name="timer" className="text-[14px]" />
        <CountdownText seconds={schedule.seconds} format="verbose" className="font-data-mono-md text-xs font-semibold" />
      </div>
    );
  }
  return (
    <div className={cn(CHIP, "right-2.5 gap-1 text-text-secondary")}>
      <Icon name="event" className="text-[14px]" />
      <span className="font-data-mono-md text-xs font-medium">{schedule.label}</span>
    </div>
  );
}

type BracketMediaProps = { card: BracketCardData; highPriority?: boolean };

/** Card artwork with game tag, schedule chip and title overlaid. */
export function BracketMedia({ card, highPriority }: BracketMediaProps) {
  return (
    <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
      <Image
        src={card.image}
        alt={card.imageAlt}
        fill
        sizes="100vw"
        fetchPriority={highPriority ? "high" : undefined}
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t/srgb from-surface-card via-surface-card/40 to-transparent" />

      <div className={cn(CHIP, "left-2.5 gap-1.5")}>
        <span aria-hidden className={cn("h-2 w-2 rounded-full", TAG_DOT[card.game])} />
        <span className="font-label-badge text-label-badge font-semibold tracking-wider text-text-primary uppercase">
          {card.tag}
        </span>
      </div>
      <ScheduleChip schedule={card.schedule} />

      <div className="absolute bottom-2 left-2.5 flex items-baseline gap-1.5">
        <h3 className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary">{card.title}</h3>
        <span className={cn("font-label-badge text-label-badge uppercase", TEXT_TONE[card.subtitle.tone])}>
          {card.subtitle.label}
        </span>
      </div>
    </div>
  );
}
