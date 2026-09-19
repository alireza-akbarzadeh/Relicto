import Image from "next/image";
import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import { formatCompact } from "../../../lib/format";
import type { Broadcast } from "../../../types";
import { BroadcastControls } from "./broadcast-controls";

/** Featured stream: scoreboard overlay, play button and caster bar. */
export function LiveBroadcast({ broadcast }: { broadcast: Broadcast }) {
  return (
    <div className="flex flex-col gap-space-md lg:col-span-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <Dot className="h-2.5 w-2.5 bg-status-live" animation="ping" />
          <h2 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">
            Featured Live Broadcast
          </h2>
        </div>
        <div className="flex items-center gap-space-sm font-label-badge text-label-badge text-text-muted">
          <span className="rounded bg-surface-container-high px-2 py-0.5 text-on-surface">{broadcast.quality}</span>
          <span className="flex items-center gap-1 rounded bg-surface-container-high px-2 py-0.5 text-text-secondary">
            <Icon name="visibility" className="text-[14px] text-status-live" />
            {formatCompact(broadcast.viewers)}
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl bg-surface-container-lowest shadow-xl">
        <div className="relative aspect-video w-full">
          <Image
            src={broadcast.image}
            alt={broadcast.imageAlt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t/srgb from-overlay-base/85 via-transparent to-overlay-base/40" />

          <div className="pointer-events-auto absolute top-space-md right-space-md left-space-md flex items-center justify-between">
            <div className="flex items-center gap-space-sm rounded-lg bg-overlay-base/90 px-space-md py-1 backdrop-blur-md">
              <span className="font-headline-sm text-headline-sm text-primary-container">{broadcast.home}</span>
              <span className="px-1 font-data-mono-lg text-data-mono-lg text-text-primary">
                {broadcast.score[0]} : {broadcast.score[1]}
              </span>
              <span className="font-headline-sm text-headline-sm text-secondary">{broadcast.away}</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-status-live px-space-sm py-1 font-label-caps text-label-caps font-bold text-text-primary uppercase shadow-xs">
              <Icon name="sensors" className="text-[14px]" />
              {broadcast.badge}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              aria-label="Play broadcast"
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/90 text-on-primary shadow-[0_0_32px_rgba(244,63,94,0.6)] transition-transform hover:scale-110"
            >
              <Icon name="play_arrow" className="ml-1 text-[32px]" />
            </button>
          </div>

          <BroadcastControls broadcast={broadcast} />
        </div>
      </div>
    </div>
  );
}
