import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { AuthShell } from "../shell/auth-shell";
import { SignInCard } from "./sign-in-card";

const TRUST: { icon: IconName; label: string; value: string; tone: string }[] = [
  { icon: "verified", label: "Encryption", value: "256-Bit TLS Vault", tone: "border-primary-container/30 bg-primary-container/10 text-primary-container" },
  { icon: "lock", label: "Credential Risk", value: "Zero-Password Gate", tone: "border-status-upcoming/30 bg-status-upcoming/10 text-status-upcoming" },
  { icon: "speed", label: "Valve Synced", value: "12ms Handshake", tone: "border-amber-500/30 bg-amber-500/10 text-tertiary" },
];

/** Stitch: "Relicto — Sign In & Steam Gateway". */
export function SignInView() {
  return (
    <AuthShell nav="gate" scope="theme-auth-signin" mainClassName="custom-gradient-bg flex items-center justify-center pt-24 pb-16">
      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-surface-card px-3 py-1 text-tertiary shadow-[0_0_16px_rgba(255,185,95,0.1)]">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-tertiary" />
            <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">OpenID Gateway 2.0 Synced</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-[11px] text-text-secondary">ESCROW PROTOCOL V4</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl md:text-4xl">
            Access Steam Trading Intel & Escrow
          </h1>
          <p className="max-w-md text-sm text-text-secondary">
            Sign in to access real-time price telemetry, automated trade escrow buffers, and instant skin liquidity pools.
          </p>
        </div>
        <SignInCard />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TRUST.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-card p-3.5 shadow-xs">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.tone}`}>
                <Icon name={item.icon} className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-semibold text-text-secondary uppercase">{item.label}</span>
                <span className="font-mono text-xs font-medium text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-2 px-2 py-1 text-center sm:flex-row">
          <span className="text-xs text-text-secondary">Don&apos;t have an exchange account yet?</span>
          <Link
            href="/sign-up"
            className="flex items-center gap-1 font-display text-xs font-semibold text-primary-container underline underline-offset-4 transition-colors hover:text-brand-rose-hover"
          >
            <span>Sign up with Steam in 10 seconds</span>
            <Icon name="arrow_forward" className="text-[15px]" />
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
