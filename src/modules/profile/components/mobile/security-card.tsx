"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/mobile-tones";
import type { ProfileMobile } from "../../mobile.types";

type PingState = "idle" | "pinging" | "ack";

/** Round-trip test against the trade bot; resets itself after showing the ACK. */
function PingButton() {
  const [state, setState] = useState<PingState>("idle");

  const ping = () => {
    setState("pinging");
    setTimeout(() => {
      setState("ack");
      setTimeout(() => setState("idle"), 2200);
    }, 700);
  };

  return (
    <Button
      variant={null}
      size={null}
      onClick={ping}
      disabled={state !== "idle"}
      className="h-auto shrink-0 gap-1 rounded border-0 bg-secondary-container px-2.5 py-1.5 font-label-badge text-label-badge font-semibold text-text-primary active:scale-95 disabled:opacity-100"
    >
      {state === "idle" && <Icon name="cell_tower" className="text-[14px]" />}
      {state === "pinging" && <Icon name="refresh" className="animate-spin text-[14px]" />}
      {state === "ack" && <Icon name="check_circle" className="text-[14px] text-tertiary" />}
      {state === "idle" ? "TEST PING" : state === "pinging" ? "PINGING..." : "12ms ACK"}
    </Button>
  );
}

/** 2FA and API watchdog status, plus the partner trade URL with copy and ping. */
export function SecurityCard({ security }: { security: ProfileMobile["security"] }) {
  return (
    <div className="flex flex-col gap-space-sm rounded-xl bg-surface-card p-space-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="gshield" className="text-[18px] text-status-upcoming" />
          <span className="font-headline-sm text-[15px] tracking-tight text-text-primary uppercase">Security &amp; Steam Guard</span>
        </div>
        <span className="rounded bg-status-upcoming/20 px-2 py-0.5 font-label-badge text-label-badge font-bold text-status-upcoming uppercase">ARMED</span>
      </div>

      <div className="flex flex-col gap-2">
        {security.checks.map((check) => (
          <div key={check.title} className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded bg-surface-container-high", TONE_TEXT[check.tone])}>
                <Icon name={check.icon} className="text-[18px]" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-headline-sm text-[13px] text-text-primary">{check.title}</span>
                <span className="truncate font-body-sm text-[11px] text-text-muted">{check.note}</span>
              </div>
            </div>
            <Icon name={check.status} className="text-[20px] text-status-upcoming" />
          </div>
        ))}

        <div className="flex flex-col gap-1.5 rounded-lg bg-surface-container-lowest p-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-badge text-label-badge text-text-muted uppercase">Steam Partner Trade URL</span>
            <span className="font-label-badge text-label-badge font-semibold text-tertiary">VERIFIED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 truncate rounded bg-surface-container-high px-2 py-1.5 font-data-mono-md text-[11px] text-text-secondary">{security.tradeUrl}</div>
            <CopyButton
              value={security.tradeUrl}
              notice="Trade URL copied"
              aria-label="Copy trade URL"
              className="h-[34px] shrink-0 rounded border-0 bg-surface-container px-1.5 text-text-muted transition-colors hover:bg-surface-bright hover:text-text-primary"
            >
              <Icon name="content_copy" className="text-[16px]" />
            </CopyButton>
            <PingButton />
          </div>
        </div>
      </div>
    </div>
  );
}
