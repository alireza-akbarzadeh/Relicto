import { Icon } from "@/components/ui/icon";
import { TEXT_TONE } from "../../../lib/tones";
import type { Infrastructure } from "../../../types";

/** "Steam bot cluster" status card with key/value diagnostics. */
export function DiagnosticsCard({ diagnostics }: { diagnostics: Infrastructure["diagnostics"] }) {
  return (
    <div className="flex w-full shrink-0 flex-col gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-lg lg:w-96">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <Icon name="smart_toy" className="text-[20px] text-primary-container" />
          <span className="font-label-caps text-label-caps text-text-primary uppercase">{diagnostics.title}</span>
        </div>
        <span className="rounded bg-status-upcoming/20 px-2 py-0.5 font-label-badge text-[10px] text-status-upcoming">
          {diagnostics.status}
        </span>
      </div>
      <dl className="space-y-2 font-data-mono-md text-[11px]">
        {diagnostics.rows.map((row) => (
          <div key={row.label} className="flex justify-between text-text-muted">
            <dt>{row.label}</dt>
            <dd className={TEXT_TONE[row.tone]}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-1 rounded bg-surface-container-high py-2 font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-bright"
      >
        <Icon name={diagnostics.action.icon} className="text-[16px]" />
        {diagnostics.action.label}
      </button>
    </div>
  );
}
