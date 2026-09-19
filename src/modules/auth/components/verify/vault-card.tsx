"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { BackupPanel, CodePanel, PushPanel } from "./method-panels";
import { useConfirmState } from "../../hooks/use-confirm-state";

type Method = "code" | "prompt" | "backup";

const METHODS = [
  { value: "code" as const, content: <><Icon name="pin" className="text-[18px] text-rose-400" /><span className="font-display text-[11px] font-semibold">Mobile Code</span></> },
  { value: "prompt" as const, content: <><Icon name="touch_app" className="text-[18px]" /><span className="font-display text-[11px] font-semibold">Push Approval</span></> },
  { value: "backup" as const, content: <><Icon name="sms" className="text-[18px]" /><span className="font-display text-[11px] font-semibold">Backup SMS</span></> },
];

const PANELS: Record<Method, () => React.JSX.Element> = { code: CodePanel, prompt: PushPanel, backup: BackupPanel };

function GuardHeader() {
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

function AccountChip() {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-surface-container-lowest p-3 shadow-inner">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <Image src="/images/lootora/steam-guard-01.jpg" alt="V0RT3X_PRO avatar" width={44} height={44} className="h-11 w-11 rounded-lg object-cover ring-1 ring-white/10" />
          <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-upcoming ring-2 ring-surface-container-lowest">
            <Icon name="bolt" className="text-[11px] font-bold text-black" />
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-sm font-bold text-white">V0RT3X_PRO</span>
            <span className="rounded border border-rose-500/30 bg-rose-500/20 px-1.5 font-mono text-[9px] font-bold text-rose-300 uppercase">PRO VENDOR</span>
          </div>
          <span className="truncate font-mono text-[11px] text-text-muted">Steam ID: 7656119808234</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className="block font-mono text-[11px] font-semibold text-amber-400">STAGE 2 / 2</span>
        <span className="block font-mono text-[9px] tracking-wider text-text-muted uppercase">Awaiting Code</span>
      </div>
    </div>
  );
}

/** Steam Guard verification card: method tabs, method panel, confirm. */
export function VaultCard() {
  const [method, setMethod] = useState<Method>("code");
  const Panel = PANELS[method];
  const { state, confirm } = useConfirmState("/marketplace");

  return (
    <div className="relative flex w-full flex-col gap-5 rounded-2xl border border-white/[0.1] bg-auth-vault p-6 shadow-2xl backdrop-blur-xl sm:p-7">
      <GuardHeader />
      <AccountChip />
      <SegmentedTabs
        label="Verification method"
        tabs={METHODS}
        value={method}
        onChange={setMethod}
        listClassName="grid grid-cols-3 gap-1.5 rounded-xl border border-white/[0.07] bg-surface-container-lowest p-1"
        tabClassName="flex-col gap-1 rounded-lg border-transparent px-2 py-2.5 text-text-muted hover:bg-white/5 hover:text-text-secondary data-active:border-white/10 data-active:bg-auth-tab-active data-active:text-white data-active:shadow-xs"
      />
      <Panel />
      <div className="flex w-full items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] p-3.5">
        <Icon name="verified_user" className="mt-0.5 shrink-0 text-[20px] text-amber-400" />
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-[11px] font-bold tracking-wide text-amber-400 uppercase">BOT ESCROW SANITIZED // ANTI-HIJACK PROTOCOL</span>
          <p className="text-[11px] leading-relaxed text-zinc-300">
            Verifying this session ensures your bot trading escrow is protected against unauthorized Steam API key hijacking and unauthorized trade redirection.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-1">
        <Button
          type="button"
          onClick={confirm}
          disabled={state !== "idle"}
          className="custom-glow-red h-auto w-full gap-2 rounded-xl border border-white/20 bg-linear-to-r/srgb from-rose-600 via-primary-container to-rose-600 px-4 py-3.5 font-display text-sm font-bold tracking-wider text-white uppercase hover:from-rose-500 hover:to-rose-500 active:scale-[0.99] disabled:opacity-100"
        >
          <Icon name={state === "done" ? "check_circle" : state === "busy" ? "sync" : "vpn_key"} className={state === "busy" ? "animate-spin text-[20px]" : "text-[20px]"} />
          <span>{state === "done" ? "Authenticated! Redirecting..." : state === "busy" ? "Verifying Token..." : "Confirm & Authenticate Session"}</span>
        </Button>
        <div className="flex items-center justify-between gap-2 px-1">
          {[{ icon: "key" as const, label: "Use Recovery Key", to: "backup" as Method }, { icon: "refresh" as const, label: "Resend Prompt", to: "prompt" as Method }].map((a) => (
            <Button key={a.label} type="button" variant="ghost" onClick={() => setMethod(a.to)} className="h-auto gap-1 px-2 py-1 font-mono text-[11px] font-normal text-text-muted uppercase hover:bg-transparent hover:text-white">
              <Icon name={a.icon} className="text-[15px]" />
              <span>{a.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-2 text-center">
        <p className="text-xs text-text-muted">
          Lost access to Steam Guard Mobile Authenticator? <span className="font-medium text-amber-400">Contact Steam Support</span> or enter your R-Code.
        </p>
        <Link href="/sign-in" className="inline-flex items-center justify-center gap-1 font-mono text-[11px] text-zinc-500 uppercase transition-colors hover:text-rose-400">
          <Icon name="arrow_back" className="text-[14px]" />
          <span>Cancel and return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}
