import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/cn";
import { capacityWidth, formatCapacity, formatUsd } from "../../../lib/format";
import { GAME_THEME } from "../../../lib/game-theme";
import type { HeroEvent } from "../../../types";
import { TeamStack } from "../../shared/team-stack";

const ACTION_BASE =
  "flex items-center gap-space-xs rounded py-space-sm font-headline-sm text-body-md tracking-wider uppercase transition-all";

/** Prize pool, capacity, registered teams and the two CTAs. */
export function HeroBannerFooter({ event }: { event: HeroEvent }) {
  const theme = GAME_THEME[event.game];

  return (
    <div className="relative z-10 flex flex-wrap items-end justify-between gap-space-lg rounded-lg bg-surface-container-lowest/60 p-space-md backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-space-xl">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">PRIZE POOL</span>
          <div className="flex items-baseline gap-1">
            <span className="font-headline-xl text-headline-xl leading-none text-tertiary">
              {formatUsd(event.prizeUsd)}
            </span>
            <span className="font-data-mono-md text-data-mono-md text-tertiary">USD</span>
          </div>
        </div>

        <div className="flex min-w-[200px] flex-col">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-text-muted uppercase">CAPACITY SLOTS</span>
            <span className="font-data-mono-md text-data-mono-md text-text-primary">
              {formatCapacity(event.capacity)}
            </span>
          </div>
          <ProgressBar
            width={capacityWidth(event.capacity)}
            className="h-2.5"
            fillClassName={theme.progress}
            label="Capacity slots filled"
          />
        </div>

        <div className="hidden flex-col xl:flex">
          <span className="mb-1 font-label-caps text-label-caps text-text-muted uppercase">REGISTERED TEAMS</span>
          <TeamStack roster={event.teams} />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-space-sm">
        <button type="button" className={cn(ACTION_BASE, "px-space-lg active:scale-[0.98]", theme.primaryAction)}>
          <Icon name={event.primaryAction.icon} className="text-[20px]" />
          {event.primaryAction.label}
        </button>
        <button
          type="button"
          className={cn(ACTION_BASE, "bg-surface-container-high px-space-md text-text-primary hover:bg-surface-bright")}
        >
          <Icon name={event.secondaryAction.icon} className="text-[20px]" />
          {event.secondaryAction.label}
        </button>
      </div>
    </div>
  );
}
