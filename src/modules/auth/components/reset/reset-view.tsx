import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { AuthShell } from "../shell/auth-shell";
import { RecoveryCard } from "./recovery-card";

function LockEmblem() {
  return (
    <div className="relative mb-4 flex items-center justify-center">
      <div className="absolute inset-0 animate-pulse rounded-full bg-brand-crimson/30 blur-2xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-crimson/40 bg-surface-card shadow-[0_0_30px_rgba(255,59,92,0.3)]">
        <svg className="h-8 w-8 text-brand-crimson" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden>
          <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" fill="currentColor" r="1.5" />
          <path d="M12 17.5V19.5" />
        </svg>
      </div>
      <div className="absolute -right-3 -bottom-2 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/80 px-2 py-0.5 backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-brand-crimson" />
        <span className="font-mono text-[9px] tracking-wider text-text-secondary">VAULT-AUTH</span>
      </div>
    </div>
  );
}

/** Stitch: "Relicto — Reset Password & Recovery". */
export function ResetView() {
  return (
    <AuthShell
      page="reset"
      scope="theme-auth-recovery"
      mainClassName="flex items-center justify-center pt-24 pb-16"
      backdrop={
        <>
          <div className="pointer-events-none fixed top-0 left-1/2 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand-crimson/10 blur-[140px]" />
          <div className="pointer-events-none fixed right-1/4 bottom-0 -z-10 h-[350px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
        </>
      }
    >
      <div className="custom-radial-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        <div className="mb-6 flex flex-col items-center text-center">
          <LockEmblem />
          <span className="mb-1.5 font-display text-[11px] font-bold tracking-[0.2em] text-brand-rose uppercase">Security Subsystem</span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white uppercase sm:text-3xl">Reset Your Relicto Password</h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-text-secondary sm:text-sm">
            Enter your registered email address or Steam Trade URL to receive instant security recovery instructions.
          </p>
        </div>
        <RecoveryCard />
        <div className="mt-6 flex items-center justify-center">
          <Link href="/sign-in" className="group inline-flex items-center gap-2 font-display text-xs tracking-widest text-text-secondary uppercase transition-colors hover:text-white">
            <Icon name="arrow_back" className="text-[16px] transition-transform group-hover:-translate-x-1" />
            <span>Remembered your password? Back to Sign In</span>
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
