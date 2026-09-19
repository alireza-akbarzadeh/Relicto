import { Icon } from "@/components/ui/icon";
import type { Broadcast } from "../../../types";

/** Bottom bar of the stream: casters, gold lead, chat and fullscreen. */
export function BroadcastControls({ broadcast }: { broadcast: Broadcast }) {
  return (
    <div className="absolute right-space-md bottom-space-md left-space-md flex flex-wrap items-center justify-between gap-space-sm rounded-lg bg-overlay-base/90 p-space-sm backdrop-blur-md">
      <div className="flex items-center gap-space-md">
        <div className="flex flex-col">
          <span className="font-label-caps text-[10px] text-text-muted uppercase">CASTERS</span>
          <span className="font-label-caps text-label-caps text-text-primary">{broadcast.casters}</span>
        </div>
        <div className="hidden flex-col sm:flex">
          <span className="font-label-caps text-[10px] text-text-muted uppercase">GOLD ADVANTAGE</span>
          <span className="font-data-mono-md text-data-mono-md text-tertiary">{broadcast.goldAdvantage}</span>
        </div>
      </div>
      <div className="flex items-center gap-space-xs">
        <button
          type="button"
          className="flex items-center gap-1 rounded bg-surface-container-high px-space-md py-1 font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-bright"
        >
          <Icon name="forum" className="text-[16px]" />
          Live Chat
        </button>
        <button
          type="button"
          aria-label="Fullscreen"
          className="rounded bg-surface-container-high p-1.5 text-text-primary transition-colors hover:bg-surface-bright"
        >
          <Icon name="fullscreen" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}
