"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { maskIdentifier } from "../../lib/mask";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { DispatchedNotice, EmailRecovery, SteamRecovery } from "./recovery-panels";

type Channel = "email" | "steam";

const CHANNELS = [
  {
    value: "email" as const,
    content: (
      <span className="flex w-full flex-col gap-0.5 text-left">
        <span className="flex items-center gap-1.5">
          <Icon name="mail" className="text-[16px] text-brand-crimson" />
          <span className="font-display text-xs font-bold tracking-wider uppercase">Email Dispatch</span>
        </span>
        <span className="font-mono text-[10px] font-normal text-text-muted">Default Channel</span>
      </span>
    ),
  },
  {
    value: "steam" as const,
    content: (
      <span className="flex w-full flex-col gap-0.5 text-left">
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Icon name="hub" className="text-[16px] text-status-cyan" />
            <span className="font-display text-xs font-bold tracking-wider uppercase">Steam OpenID</span>
          </span>
          <span className="rounded border border-status-cyan/30 bg-status-cyan/15 px-1 font-mono text-[9px] text-status-cyan">TRADER</span>
        </span>
        <span className="font-mono text-[10px] font-normal text-text-muted">Zero-Password Sync</span>
      </span>
    ),
  },
];

/** Recovery channel tabs, the active channel's form, the dispatch notice and the advisory. */
export function RecoveryCard() {
  const [channel, setChannel] = useState<Channel>("email");
  const [target, setTarget] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-surface-card/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-6">
      <SegmentedTabs
        label="Recovery channel"
        tabs={CHANNELS}
        value={channel}
        onChange={setChannel}
        listClassName="grid grid-cols-2 gap-1.5 rounded-xl border border-white/5 bg-surface-container-lowest p-1"
        tabClassName="justify-start rounded-lg border-transparent px-3 py-2.5 text-text-secondary hover:bg-white/5 hover:text-white data-active:border-white/10 data-active:bg-[#1e2538] data-active:text-white data-active:shadow-xs"
      />
      {channel === "email" ? (
        <EmailRecovery onDispatch={(value) => setTarget(maskIdentifier(value))} />
      ) : (
        <SteamRecovery onDispatch={() => setTarget("SteamID64 (76561198********)")} />
      )}
      {target && <DispatchedNotice target={target} onResend={() => toast("Recovery token re-sent")} />}
      <div className="flex items-start gap-3.5 rounded-xl border border-status-amber/25 bg-surface-container-lowest/90 p-3.5 sm:p-4">
        <div className="mt-0.5 shrink-0 rounded-lg border border-status-amber/30 bg-status-amber/15 p-2 text-status-amber">
          <Icon name="warning" className="text-[18px]" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-display text-xs font-semibold tracking-wider text-status-amber uppercase">Security Advisory Notice</span>
          <p className="text-xs leading-relaxed text-text-secondary">
            For your protection, resetting your Relicto password will temporarily pause instant bot trades for 4 hours to prevent social engineering attacks.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
              <Icon name="timer" className="text-[12px] text-status-amber" /> 4h Escrow Freeze
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-text-muted">
              <Icon name="shield" className="text-[12px] text-status-amber" /> Tier-1 Valve Cooldown
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
