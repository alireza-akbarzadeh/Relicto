import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import type { ActiveEscrow, LedgerStat } from "../../types";

const ICON_TONE = { muted: "text-text-muted group-hover:text-primary transition-colors", cyan: "text-status-upcoming", amber: "text-tertiary-fixed-dim" };
const SPARK_TONE = { primary: "text-primary opacity-60", amber: "text-tertiary-fixed-dim opacity-70" };

function StatCard({ stat }: { stat: LedgerStat }) {
  return (
    <div className="group relative flex flex-col justify-between gap-space-md overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-md transition-colors hover:bg-surface-container">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-text-secondary uppercase">{stat.label}</span>
        <Icon name={stat.icon} className={cn("text-[20px]", ICON_TONE[stat.iconTone])} />
      </div>
      <div>
        <div className="flex items-baseline gap-space-xs font-data-mono-lg text-data-mono-lg font-bold tracking-tight text-text-primary">
          <span className={stat.id === "net-pl" ? "text-tertiary-fixed-dim" : undefined}>{stat.value}</span>
          {stat.unit && <span className="font-label-badge text-label-badge font-normal text-text-muted">{stat.unit}</span>}
          {stat.badge && (
            <span className="rounded bg-surface-container px-1.5 py-0.5 font-label-badge text-[10px] font-bold text-status-upcoming uppercase">{stat.badge}</span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-space-xs">
          {stat.noteStrong && <span className="font-label-badge text-label-badge font-bold text-tertiary">{stat.noteStrong}</span>}
          {stat.notes.map((note, index) => (
            <span key={note} className="flex items-center gap-space-xs">
              {index > 0 && <span className="h-1 w-1 rounded-full bg-surface-container-highest" />}
              <span className="font-label-badge text-label-badge text-text-muted">{note}</span>
            </span>
          ))}
        </div>
      </div>
      {stat.spark && (
        <div className={cn("h-7 w-full", SPARK_TONE[stat.spark.tone])}>
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 24" aria-hidden>
            <path d={stat.spark.path} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </div>
      )}
      {stat.bar && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <div className="h-1.5 w-full rounded-full bg-status-upcoming" />
        </div>
      )}
    </div>
  );
}

/** Three ledger metrics plus the shortcut into the live escrow. */
export function LedgerStats({ stats, active }: { stats: LedgerStat[]; active: ActiveEscrow }) {
  return (
    <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
      <div className="group relative flex flex-col justify-between gap-space-md overflow-hidden rounded-xl bg-linear-to-br/srgb from-surface-container to-surface-container-high p-space-md shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
            <span className="font-label-caps text-label-caps font-bold text-primary uppercase">{active.count}</span>
          </div>
          <span className="rounded bg-primary-container px-space-xs py-0.5 font-label-badge text-label-badge font-bold text-on-primary-container">{active.step}</span>
        </div>
        <div>
          <div className="font-data-mono-md text-data-mono-md font-bold text-text-primary">{active.code}</div>
          <p className="mt-0.5 truncate font-body-sm text-body-sm text-text-muted">{active.item}</p>
        </div>
        <LinkButton
          href={active.href}
          className="w-full gap-space-xs rounded border-0 bg-primary-container px-space-sm py-1.5 font-label-caps text-label-caps font-bold text-on-primary-container uppercase shadow-xs transition-colors hover:bg-primary"
        >
          <span>Track Live Escrow</span>
          <Icon name="bolt" className="text-[16px]" />
        </LinkButton>
      </div>
    </div>
  );
}
