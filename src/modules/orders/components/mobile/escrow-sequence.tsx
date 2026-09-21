import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { MobileEscrowStep } from "../../mobile.types";

/** The export also sets text-[12px], but v3 lets text-body-sm win; only leading-relaxed applies. */
const NOTE = "font-body-sm text-body-sm leading-relaxed text-text-muted";

function Dot({ state }: { state: MobileEscrowStep["state"] }) {
  if (state === "done") {
    return (
      <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-low shadow-sm">
        <Icon name="check_circle" className="text-[16px] text-tertiary" />
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="z-10 flex h-6 w-6 shrink-0 animate-pulse items-center justify-center rounded-full bg-primary-container text-white shadow-lg shadow-glow-crimson">
        <Icon name="arrow_forward" className="text-[14px]" />
      </div>
    );
  }
  return (
    <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-container-highest text-text-muted">
      <Icon name="lock_clock" className="text-[14px]" />
    </div>
  );
}

function ActiveStep({ step, offerUrl }: { step: MobileEscrowStep; offerUrl: string }) {
  return (
    <div className="flex flex-1 flex-col rounded-lg bg-surface-container-low p-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-body-sm text-body-sm font-bold text-text-primary">{step.title}</span>
        <span className="rounded bg-primary-container/20 px-1.5 py-0.5 font-data-mono-md text-label-badge font-semibold text-primary">{step.stamp}</span>
      </div>
      <div className="mt-2 flex flex-col gap-1 font-data-mono-md text-[11px] text-text-secondary">
        {step.details?.map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="text-text-muted">{row.label}</span>
            <span className={row.tone === "cyan" ? "font-bold text-status-upcoming" : "text-text-primary"}>{row.value}</span>
          </div>
        ))}
      </div>
      <a
        href={offerUrl}
        className="mt-3 flex w-full items-center justify-center gap-1 rounded bg-surface-container-high px-2 py-1.5 text-center font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-container-highest"
      >
        <Icon name="open_in_new" className="text-[14px] text-primary-container" />
        <span>Launch Steam Offer</span>
      </a>
    </div>
  );
}

/** Vertical escrow stepper: done, active (with trade details) and pending steps. */
export function EscrowSequence({ steps, stage, offerUrl }: { steps: MobileEscrowStep[]; stage: string; offerUrl: string }) {
  return (
    <div className="flex flex-col gap-space-md rounded-xl bg-surface-card p-space-md shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm tracking-tight text-text-primary uppercase">Escrow Sequence</h3>
        <span className="font-data-mono-md text-label-badge text-status-upcoming">{stage}</span>
      </div>
      {/* pt-6: in the export, space-y-6 also pushes the first step below the absolute conduit line. */}
      <div className="relative flex flex-col gap-6 pt-6 pl-2">
        <div className="absolute top-3 bottom-3 left-5 w-0.5 bg-surface-container-highest" />
        {steps.map((step) => (
          <div key={step.id} className={cn("relative flex items-start gap-3", step.state === "pending" && "opacity-50")}>
            <Dot state={step.state} />
            {step.state === "active" ? (
              <ActiveStep step={step} offerUrl={offerUrl} />
            ) : (
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between">
                  <span className={cn("font-body-sm text-body-sm", step.state === "done" ? "font-semibold text-text-primary" : "text-text-muted")}>
                    {step.title}
                  </span>
                  <span className="font-data-mono-md text-label-badge text-text-muted">{step.stamp}</span>
                </div>
                <p className={NOTE}>{step.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
