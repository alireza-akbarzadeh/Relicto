import { Icon } from "@/components/ui/icon";
import type { StatusRow } from "../../types";
import { StatusList } from "./status-list";

type SecurityPanelProps = { rows: StatusRow[]; lastHandshake: string };

/** Steam Guard, API watchdog and trade-hold status. */
export function SecurityPanel({ rows, lastHandshake }: SecurityPanelProps) {
  return (
    <section className="flex flex-col gap-space-md rounded-xl bg-surface-card p-space-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="security" className="text-[20px] text-primary" />
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-text-primary uppercase">Security &amp; Credentials</span>
        </div>
        <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge font-bold text-status-upcoming">100% HEALTH</span>
      </div>
      <StatusList rows={rows} />
      <div className="flex items-center gap-1 pt-space-xs font-label-badge text-label-badge text-text-muted">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
        {lastHandshake}
      </div>
    </section>
  );
}
