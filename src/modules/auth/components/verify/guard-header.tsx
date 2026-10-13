import { Icon } from "@/components/ui/icon";

export function GuardHeader() {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative my-1 flex items-center justify-center">
        <svg className="h-24 w-24 animate-spin text-amber-400/70 [animation-duration:25s]" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" fill="none" opacity="0.3" r="44" stroke="currentColor" strokeDasharray="6 8" strokeWidth="1.8" />
          <circle cx="50" cy="50" fill="none" opacity="0.6" r="37" stroke="currentColor" strokeDasharray="14 10" strokeWidth="1.2" />
        </svg>
        <div className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-canvas-base shadow-[0_0_18px_rgba(245,158,11,0.25)]">
          <Icon name="security" className="text-[28px] text-amber-400" />
        </div>
      </div>
      <div className="mt-1 flex flex-col items-center gap-1.5">
        <span className="rounded border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-amber-400 uppercase">
          STEAM GUARD™ 2-FACTOR AUTHENTICATION REQUIRED
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white">Relicto Vault Verification</h1>
        <p className="max-w-sm text-xs leading-relaxed text-text-secondary">
          Confirm identity with your Steam Mobile Authenticator to unlock high-tier inventory trading escrow.
        </p>
      </div>
    </div>
  );
}
