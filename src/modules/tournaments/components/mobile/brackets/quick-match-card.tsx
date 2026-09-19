import { Dot } from "@/components/ui/dot";
import { Icon } from "@/components/ui/icon";
import type { QuickMatchData } from "../../../mobile.types";

/** Compact instant-matchmaking card without artwork. */
export function QuickMatchCard({ match }: { match: QuickMatchData }) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-surface-card p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-highest">
            <Icon name={match.icon} className="text-[24px] text-primary" />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-headline-sm text-headline-sm font-semibold text-text-primary">
                {match.title}
              </h3>
              <Dot className="h-1.5 w-1.5 bg-status-live" animation="ping" />
            </div>
            <span className="font-body-sm text-body-sm text-text-secondary">{match.subtitle}</span>
          </div>
        </div>
        <span className="shrink-0 font-data-mono-md text-data-mono-md font-bold text-tertiary">{match.points}</span>
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-2">
        <div className="flex items-center gap-1 font-label-badge text-label-badge text-text-secondary uppercase">
          <Icon name="speed" className="text-[15px] text-status-upcoming" />
          <span>{match.wait}</span>
        </div>
        <button
          type="button"
          className="flex h-7 items-center gap-1 rounded bg-primary-container/20 px-3 font-label-caps text-label-caps text-primary uppercase transition-transform active:scale-95"
        >
          <span>{match.action.label}</span>
          <Icon name={match.action.icon} className="text-[14px]" />
        </button>
      </div>
    </article>
  );
}
