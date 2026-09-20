import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/tones";
import type { StatusRow } from "../../types";

/** Rows of "feature — state" used by security, linked accounts and safeguards. */
export function StatusList({ rows, className }: { rows: StatusRow[]; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-space-sm", className)}>
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex items-center gap-space-sm">
            <Icon name={row.icon} className={cn("text-[18px]", TONE_TEXT[row.iconTone])} />
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-text-primary uppercase">{row.title}</span>
              <span className="font-body-sm text-body-sm text-text-muted">{row.detail}</span>
            </div>
          </div>
          <span className={cn("font-label-badge text-label-badge font-bold", TONE_TEXT[row.statusTone])}>{row.status}</span>
        </div>
      ))}
    </div>
  );
}
