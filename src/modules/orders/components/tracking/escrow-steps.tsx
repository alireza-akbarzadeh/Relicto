import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { EscrowStep } from "../../types";

const CARD: Record<EscrowStep["state"], string> = {
  done: "bg-surface-container-lowest/80",
  active: "bg-surface-container shadow-[0_0_24px_rgba(244,63,94,0.18)]",
  queued: "bg-surface-container-lowest/40 opacity-60",
};

const MARKER: Record<EscrowStep["state"], string> = {
  done: "bg-status-upcoming/20 text-status-upcoming",
  active: "animate-pulse bg-primary-container text-on-primary-container",
  queued: "bg-surface-variant text-text-muted",
};

const LABEL: Record<EscrowStep["state"], string> = {
  done: "text-status-upcoming",
  active: "font-bold tracking-wider text-primary",
  queued: "text-text-muted",
};

const FOOT: Record<EscrowStep["state"], string> = {
  done: "text-status-upcoming",
  active: "text-tertiary-fixed-dim",
  queued: "text-text-muted",
};

function StepCard({ step, index }: { step: EscrowStep; index: number }) {
  const { state } = step;
  return (
    <div className={cn("relative flex flex-1 flex-col rounded-lg p-space-md", CARD[state])}>
      {state === "active" && (
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-br/srgb from-primary-container/10 via-transparent to-transparent" />
      )}
      <div className="relative z-10 mb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-full font-data-mono-md text-[13px] font-bold", MARKER[state])}>
            {state === "done" ? <Icon name="done" className="text-[16px]" /> : index + 1}
          </div>
          <span className={cn("font-label-caps text-label-caps uppercase", LABEL[state])}>{step.label}</span>
        </div>
        {state === "active" ? (
          <span className="h-2.5 w-2.5 animate-ping rounded-full bg-status-live" />
        ) : (
          <span className="font-data-mono-md text-[11px] text-text-muted">{step.stamp}</span>
        )}
      </div>
      <div
        className={cn(
          "relative z-10 mb-1 font-headline-sm text-[15px] font-bold uppercase",
          state === "queued" ? "text-text-secondary" : "text-text-primary",
        )}
      >
        {step.title}
      </div>
      <p className={cn("relative z-10 font-body-sm text-body-sm leading-snug", state === "queued" ? "text-text-muted" : "text-text-secondary")}>
        {step.body}
      </p>
      <div className={cn("relative z-10 mt-space-md flex items-center gap-space-xs pt-space-xs font-data-mono-md text-[11px]", FOOT[state])}>
        <Icon name={step.foot.icon} className="text-[14px]" />
        <span className={state === "active" ? "font-semibold" : undefined}>{step.foot.label}</span>
      </div>
    </div>
  );
}

/** Four-stage escrow pipeline: funding, audit, dispatch and settlement. */
export function EscrowSteps({ steps }: { steps: EscrowStep[] }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-lg">
      <div className="relative flex flex-col items-stretch justify-between gap-space-md md:flex-row">
        {steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index} />
        ))}
      </div>
    </div>
  );
}
