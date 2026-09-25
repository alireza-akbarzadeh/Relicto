import { Icon } from "@/components/ui/icon";

/** Escrow promises the basket makes. Authored copy — nothing measures these yet. */
const ASSURANCES = [
  { icon: "verified", tone: "text-status-success", title: "0-day hold verified", note: "Instant peer escrow", live: false },
  { icon: "bolt", tone: "text-tertiary", title: "~12s bot dispatch", note: "Auto accepted", live: true },
] as const;

export function CartAssurances() {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-border-subtle bg-surface-container-lowest p-3">
      {ASSURANCES.map((row) => (
        <div
          key={row.title}
          className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-container-low px-2.5 py-1.5"
        >
          <Icon name={row.icon} className={`text-[18px] ${row.tone}`} />
          <div className="min-w-0">
            <div className="truncate font-headline-sm text-[11px] leading-tight font-bold text-text-primary">{row.title}</div>
            <div className="flex items-center gap-1 font-data-mono-md text-[10px] text-text-muted">
              {row.live && <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-status-success" />}
              <span className="truncate">{row.note}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
