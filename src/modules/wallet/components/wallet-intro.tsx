import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function WalletIntro() {
  const badges = [
    ["verified_user", "SOLVENCY VAULT", "$1,489,200.00", "text-tertiary"],
    ["phonelink_ring", "STEAM GUARD 2FA", "Armed · 180d+", "text-primary"],
    ["lock", "COLD STORAGE", "94.2% secured", "text-status-upcoming"],
    ["bolt", "DISPATCH SLA", "< 120s auto", "text-primary-container"],
  ] as const;

  return (
    <section className="relative overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-md">
      {/* subtle technical accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="flex flex-col gap-space-lg p-space-lg xl:flex-row xl:items-center xl:justify-between">
        {/* Header */}
        <div className="min-w-0">
          <div className="mb-space-sm flex flex-wrap items-center gap-x-space-xs gap-y-1 font-label-badge text-[10px] tracking-[0.12em] text-text-muted uppercase">
            <span>Portal</span>
            <span className="text-text-muted/40">/</span>
            <span>Financial Operations</span>
            <span className="text-text-muted/40">/</span>
            <span className="text-primary">Escrow Wallet &amp; Treasury</span>
          </div>

          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
            </span>

            <h1 className="font-headline-md text-headline-md tracking-[-0.02em] text-text-primary">
              Treasury Operations
            </h1>

            <span className="hidden text-text-muted/30 sm:inline">—</span>

            <span className="font-body-md text-text-secondary">
              Audited Ledger
            </span>

            <span className="rounded-md border border-outline-variant/30 bg-surface-container-high px-2 py-1 font-data-mono-md text-[10px] tracking-wide text-text-muted">
              NODE #US-EAST-BOT-09
            </span>
          </div>
        </div>

        {/* Operational metrics */}
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-outline-variant/20 bg-surface-container-low p-1.5 md:grid-cols-4 xl:min-w-[620px]">
          {badges.map(([icon, label, value, tone]) => (
            <div
              key={label}
              className="group flex min-w-0 items-center gap-space-xs rounded-md border border-transparent bg-surface-card px-space-sm py-space-sm transition-colors hover:border-outline-variant/30 hover:bg-surface-container-high"
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-container-high",
                  tone,
                )}
              >
                <Icon name={icon} className="text-[17px]" />
              </div>

              <div className="min-w-0">
                <div className="truncate font-label-badge text-[9px] tracking-[0.08em] text-text-muted uppercase">
                  {label}
                </div>

                <div className="truncate font-data-mono-md text-[12px] font-bold leading-tight text-text-primary">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}