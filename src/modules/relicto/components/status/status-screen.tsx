import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";

export type StatusTone = "crimson" | "amber" | "cyan";

const TONE: Record<StatusTone, { text: string; ring: string; glow: string; chip: string }> = {
  crimson: {
    text: "text-primary",
    ring: "border-primary/40 bg-primary-container/10",
    glow: "bg-primary-container/15",
    chip: "border-primary/30 text-primary",
  },
  amber: {
    text: "text-tertiary",
    ring: "border-border-tactical bg-tertiary/10",
    glow: "bg-tertiary/15",
    chip: "border-tertiary/30 text-tertiary",
  },
  cyan: {
    text: "text-status-upcoming",
    ring: "border-status-upcoming/40 bg-status-upcoming/10",
    glow: "bg-status-upcoming/15",
    chip: "border-status-upcoming/30 text-status-upcoming",
  },
};

export type StatusLink = { href: string; label: string; icon?: IconName };

type StatusScreenProps = {
  /** HTTP status shown as the telemetry code. */
  code: string;
  tone: StatusTone;
  icon: IconName;
  eyebrow: string;
  title: string;
  body: string;
  /** Node id / trace line under the copy. */
  trace: string;
  links: StatusLink[];
  /** Extra control (e.g. a retry button on the error boundary). */
  action?: ReactNode;
};

/** Shared full-screen state for 401 / 403 / 404 / 500, in the Relicto shell language. */
export function StatusScreen({ code, tone, icon, eyebrow, title, body, trace, links, action }: StatusScreenProps) {
  const palette = TONE[tone];

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas-base px-4 py-16 font-body-md text-body-md text-on-surface antialiased">
      <div className={cn("pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full blur-3xl", palette.glow)} />
      <div className="pointer-events-none absolute right-1/4 -bottom-32 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl" />
      <div className="custom-radial-grid pointer-events-none absolute inset-0 opacity-20" />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center gap-space-md rounded-2xl border border-border-subtle bg-surface-card/90 p-space-xl text-center shadow-2xl backdrop-blur-xl">
        <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl border", palette.ring)}>
          <Icon name={icon} className={cn("text-[32px]", palette.text)} />
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("rounded border px-2 py-0.5 font-data-mono-md text-[11px] font-bold", palette.chip)}>ERR {code}</span>
          <span className="font-label-badge text-label-badge tracking-widest text-text-muted uppercase">{eyebrow}</span>
        </div>

        <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-text-primary uppercase">{title}</h1>
        <p className="max-w-md font-body-md text-body-md leading-relaxed text-text-secondary">{body}</p>

        <div className="flex w-full items-center justify-between rounded-lg bg-surface-container-lowest px-space-md py-space-sm font-data-mono-md text-[11px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live" />
            NODE: ORD-901-PRO
          </span>
          <span>{trace}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-space-sm pt-1">
          {action}
          {links.map((link, index) => (
            <LinkButton
              key={link.href}
              href={link.href}
              className={cn(
                "h-auto gap-space-xs rounded-lg px-space-lg py-space-sm font-headline-sm text-[13px] font-bold tracking-wider uppercase transition-all",
                index === 0 && !action
                  ? "border-0 bg-primary-container text-on-primary-container shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:brightness-110"
                  : "border-border-subtle bg-surface-container text-text-primary hover:bg-surface-container-high",
              )}
            >
              {link.icon && <Icon name={link.icon} className="text-[18px]" />}
              <span>{link.label}</span>
            </LinkButton>
          ))}
        </div>

        <Link href="/support" className="font-label-badge text-label-badge text-text-muted uppercase transition-colors hover:text-text-primary">
          Escrow support · 24/7 concierge
        </Link>
      </section>
    </main>
  );
}
