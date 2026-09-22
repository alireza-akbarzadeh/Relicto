import { Icon } from "@/components/ui/icon";
import { AuthShell } from "../shell/auth-shell";
import { VaultCard } from "./vault-card";

/** Stitch: "Relicto — Steam Guard 2FA Verification". */
export function VerifyView() {
  return (
    <AuthShell page="verify" scope="theme-auth-2fa" mainClassName="flex flex-col items-center justify-center overflow-hidden bg-surface-dim pt-20 pb-12">
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-rose-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 -bottom-10 -z-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="flex w-full max-w-lg flex-col gap-3">
        <div className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-surface-card/90 px-3.5 py-2 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
            <span className="-ml-4 h-2 w-2 rounded-full bg-status-live" />
            <span className="font-mono text-[11px] font-bold tracking-wider text-red-400 uppercase">GUARD VAULT ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-muted">
            <Icon name="shield_locked" className="text-[14px] text-amber-400" />
            <span className="font-mono text-[11px] text-zinc-400">SESSION PROTOCOL // S2A-9492</span>
          </div>
        </div>
        <VaultCard />
        <div className="flex w-full items-center justify-center gap-6 pt-1 font-mono text-[11px] text-text-muted">
          <div className="flex items-center gap-1.5">
            <Icon name="lock" className="text-[14px] text-cyan-400" />
            <span className="tracking-wide text-zinc-400">VALVE OPENID 2.0 PROTOCOL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="policy" className="text-[14px] text-amber-400" />
            <span className="tracking-wide text-zinc-400">ZERO CREDENTIAL RETENTION</span>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
