import Image from "next/image";
import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { GAME_THEME } from "../../../lib/game-theme";
import type { HeroEvent } from "../../../types";
import { CountdownText } from "../../shared/countdown-text";
import { HeroBannerFooter } from "./hero-banner-footer";

export function HeroBanner({ event }: { event: HeroEvent }) {
  const theme = GAME_THEME[event.game];

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-surface-card shadow-xl backdrop-blur-xl transition-all duration-500">
      <div className="relative flex min-h-[460px] w-full flex-col justify-between p-space-lg lg:p-space-xl">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          fetchPriority="high"
          sizes="calc(100vw - 80px)"
          className="object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-r/srgb from-canvas-base via-overlay-base/85 to-overlay-base/80" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-space-md py-1 font-label-badge text-label-badge uppercase shadow-xs",
                theme.status.badge,
              )}
            >
              <Dot className={cn("h-2 w-2", theme.status.dot)} animation="pulse" />
              {event.status.label}
            </span>
            <span className="rounded bg-surface-container-high/80 px-space-md py-1 font-label-caps text-label-caps tracking-wider text-text-primary uppercase">
              {event.qualifier}
            </span>
          </div>
          <div className="flex items-center gap-space-sm rounded-lg bg-surface-container-lowest/80 px-space-md py-1.5 backdrop-blur-md">
            <Icon name="timer" className="text-headline-sm text-tertiary" />
            <span className="font-label-caps text-label-caps text-text-muted uppercase">CLOSES IN:</span>
            <CountdownText
              seconds={event.closesInSeconds}
              className="font-data-mono-lg text-data-mono-lg text-tertiary"
            />
          </div>
        </div>

        <div className="relative z-10 my-space-md flex max-w-3xl flex-col gap-space-sm">
          <div className="flex items-center gap-2">
            <Icon name={event.kicker.icon} className={cn("text-headline-sm", theme.kicker)} />
            <span className={cn("font-label-caps text-label-caps tracking-widest uppercase", theme.kicker)}>
              {event.kicker.label}
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl leading-none tracking-tight text-text-primary uppercase drop-shadow-md">
            {event.title}
          </h1>
          <p className="max-w-2xl font-body-lg text-body-lg text-text-secondary">{event.description}</p>
        </div>

        <HeroBannerFooter event={event} />
      </div>
    </div>
  );
}
