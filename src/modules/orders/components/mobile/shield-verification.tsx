import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { TrackingMobile } from "../../mobile.types";

/** Anti-phishing check: bot identity and the passphrase the Steam prompt must show. */
export function ShieldVerification({ shield }: { shield: TrackingMobile["shield"] }) {
  return (
    <div className="relative flex flex-col gap-space-sm overflow-hidden rounded-xl bg-surface-card p-space-md shadow-lg">
      <div className="flex items-center gap-2 text-tertiary">
        <Icon name="shield_person" className="text-[20px]" />
        <span className="font-headline-sm text-headline-sm tracking-wide uppercase">Shield Verification</span>
      </div>
      <p className="font-body-sm text-body-sm leading-snug text-text-secondary">{shield.intro}</p>

      <div className="grid grid-cols-2 gap-2">
        {shield.facts.map((fact) => (
          <div key={fact.label} className="flex flex-col rounded bg-surface-container-low p-2">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{fact.label}</span>
            <span className={cn("font-data-mono-md text-data-mono-md font-bold text-text-primary", fact.truncate && "truncate")}>{fact.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 rounded-lg bg-surface-container-lowest p-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-label-badge text-label-badge tracking-wider text-tertiary uppercase">SECRET PASSCODE PHRASE</span>
          <Icon name="key" className="text-[14px] text-tertiary" />
        </div>
        <div className="flex items-center justify-between">
          <span className="font-data-mono-lg text-data-mono-lg font-bold tracking-wider text-status-upcoming select-all">{shield.passphrase}</span>
          <span className="rounded bg-surface-container px-1.5 py-0.5 font-label-badge text-label-badge text-text-muted">MATCH CONFIRM</span>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-1 text-on-error-container/90">
        <Icon name="warning" className="mt-0.5 shrink-0 text-[16px] text-primary-container" />
        <span className="font-body-sm text-body-sm leading-tight text-text-secondary">
          If the trade prompt does not display <strong className="text-text-primary">{shield.passphrase}</strong>, decline instantly and trigger report.
        </span>
      </div>
    </div>
  );
}
