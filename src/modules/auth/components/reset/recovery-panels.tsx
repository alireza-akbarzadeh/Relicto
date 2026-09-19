"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { AuthField } from "../ui/auth-field";

const CTA =
  "group h-auto w-full gap-2 rounded-xl border border-brand-rose/30 bg-linear-to-r/srgb from-brand-crimson to-[#e02447] px-4 py-3.5 font-display text-xs font-bold tracking-widest text-white uppercase shadow-[0_0_24px_rgba(255,59,92,0.4)] hover:shadow-[0_0_32px_rgba(255,59,92,0.6)] hover:brightness-110 active:scale-[0.99]";

/** Email channel: identifier + Turnstile badge + send. */
export function EmailRecovery({ onDispatch }: { onDispatch: (target: string) => void }) {
  const [value, setValue] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onDispatch(value);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <AuthField
        id="recovery-credential"
        label="Account Recovery Identifier"
        aside={<span className="text-[10px] text-text-muted normal-case">Steam / Intel ID</span>}
        labelClassName="font-mono text-[11px] font-normal tracking-wider text-text-secondary uppercase"
        icon="alternate_email"
        placeholder="trader@example.com"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputClassName="rounded-xl border-white/10 bg-surface-container-lowest py-3 pr-4 pl-10 text-sm text-white placeholder:text-text-muted focus-visible:border-brand-crimson/80 focus-visible:ring-1 focus-visible:ring-brand-crimson/80"
      />
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-surface-container-lowest px-3.5 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-status-cyan/30 bg-status-cyan/15 text-status-cyan">
            <Icon name="verified_user" className="text-[15px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[11px] font-semibold tracking-wide text-white">Cloudflare Turnstile Verified</span>
            <span className="font-mono text-[10px] text-text-muted">Ray ID: 89f42b8e3a2b0c11 • Lvl 3</span>
          </div>
        </div>
        <span className="rounded border border-status-cyan/25 bg-status-cyan/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-status-cyan uppercase">PASSED</span>
      </div>
      <Button type="submit" className={CTA}>
        <span>Send Password Reset Link</span>
        <Icon name="send" className="text-[18px] transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
}

/** Steam channel: sign the reset through Valve OpenID. */
export function SteamRecovery({ onDispatch }: { onDispatch: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-surface-container-lowest p-4">
        <div className="flex items-center gap-2 text-status-cyan">
          <Icon name="sports_esports" className="text-[18px]" />
          <span className="font-display text-xs font-semibold tracking-wider uppercase">Valve OpenID Identity Escrow</span>
        </div>
        <p className="text-xs leading-relaxed text-text-secondary">
          Connect directly with Valve servers to cryptographic-sign your reset. No account credentials pass through external relays.
        </p>
      </div>
      <Button
        type="button"
        onClick={onDispatch}
        className="h-auto w-full gap-2.5 rounded-xl border border-status-cyan/40 bg-surface-container px-4 py-3.5 font-display text-xs font-bold tracking-wider text-white uppercase shadow-[0_0_18px_rgba(6,182,212,0.2)] hover:bg-[#20283d]"
      >
        <Icon name="vpn_key" className="text-[18px] text-status-cyan" />
        <span>Authenticate via Steam Community</span>
      </Button>
    </div>
  );
}

/** Confirmation shown after a reset token is dispatched. */
export function DispatchedNotice({ target, onResend }: { target: string; onResend: () => void }) {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-brand-crimson/40 bg-[#0e1626] p-3.5" role="status">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="mark_email_read" className="text-[18px] text-brand-crimson" />
          <span className="font-mono text-[11px] font-bold tracking-wider text-brand-rose uppercase">Dispatched • Token Active</span>
        </div>
        <span className="rounded border border-white/10 bg-black/50 px-1.5 py-0.5 font-mono text-[10px] text-text-muted">14:59 REMAINING</span>
      </div>
      <p className="text-xs leading-relaxed text-text-primary">
        Check your inbox: A 15-minute one-time recovery token has been dispatched to{" "}
        <span className="font-mono text-brand-rose">{target}</span> with 2-factor confirmation.
      </p>
      <div className="flex items-center justify-between border-t border-white/5 pt-1">
        <Button type="button" variant="link" onClick={onResend} className="h-auto p-0 font-mono text-[10px] font-normal text-text-muted underline hover:text-white">
          Resend token
        </Button>
        <span className="font-mono text-[10px] text-text-muted">Hash: 8b03e...f41</span>
      </div>
    </div>
  );
}
