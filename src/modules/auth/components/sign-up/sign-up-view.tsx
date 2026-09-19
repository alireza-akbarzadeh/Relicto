import { Icon } from "@/components/ui/icon";
import { AuthShell } from "../shell/auth-shell";
import { RegistrationCard } from "./registration-card";
import { SignUpPerks } from "./sign-up-perks";

/** Stitch: "Relicto — Create Account & Inventory Bind". */
export function SignUpView() {
  return (
    <AuthShell nav="gate" scope="theme-auth-signup" mainClassName="overflow-hidden bg-surface-container-lowest px-0 pt-20 pb-16 sm:px-0">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-112 w-116 rounded-full bg-primary-container/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-128 w-lg rounded-full bg-secondary-container/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-96 w-[24rem] rounded-full bg-status-upcoming/10 blur-[120px]" />
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface-card/90 px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-live opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-live" />
            </span>
            <span className="font-label-badge text-xs font-semibold tracking-wider text-primary-fixed uppercase">Valve OpenID 2.0 Realtime Gateway</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-1 font-data-mono-md">
              <Icon name="verified_user" className="text-[14px] text-tertiary" />
              <span className="font-medium text-text-secondary">SLA: 99.98%</span>
            </div>
            <span className="rounded border border-primary/20 bg-primary/10 px-2 py-0.5 font-data-mono-md text-[11px] font-medium text-primary">TX LATENCY {"<"} 42MS</span>
          </div>
        </div>
        <div className="mt-2 flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card px-3 py-1 shadow-inner">
            <Icon name="military_tech" className="text-[15px] text-primary" />
            <span className="font-label-caps text-[11px] font-bold tracking-widest text-primary uppercase">Protocol Node 0x48-AEGIS</span>
          </div>
          <h1 className="max-w-xl font-headline-xl text-3xl leading-tight font-extrabold tracking-tight text-text-primary uppercase sm:text-4xl sm:leading-[2.5rem]">
            Join The Valvetech Intel Exchange
          </h1>
          <p className="max-w-lg font-body-md text-sm leading-relaxed text-text-secondary sm:text-base sm:leading-[1.5rem]">
            Create your verified trader profile to unlock automated bot escrow, zero maker listing fees for 30 days, and sub-second price delta alerts.
          </p>
        </div>
        <RegistrationCard />
        <SignUpPerks />
      </div>
    </AuthShell>
  );
}
