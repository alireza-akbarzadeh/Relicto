"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { VerifyMobile as VerifyMobileData } from "../../data/verify-mobile.mock";
import { useCodeCells } from "../../hooks/use-code-cells";
import { GuardChallenge } from "./guard-challenge";
import { ShieldHero } from "./shield-hero";
import { VerifyMobileHeader } from "./verify-mobile-header";
import { ApprovalPanels, RecoveryPanels } from "./verify-panels";

type Phase = "idle" | "verifying" | "unlocked";

/** Mobile Steam Guard 2FA (Stitch: "Lootora Mobile — Steam Guard 2FA Verification"). */
export function VerifyMobile({ data }: { data: VerifyMobileData }) {
  const router = useRouter();
  const code = useCodeCells(data.code);
  const [phase, setPhase] = useState<Phase>("idle");

  const confirm = () => {
    if (code.code.length < code.cells.length) {
      toast.error("Enter the full 5-character code");
      return;
    }
    setPhase("verifying");
    setTimeout(() => {
      setPhase("unlocked");
      toast.success("Escrow vault unlocked", { action: { label: "Open vault", onClick: () => router.push("/wallet") } });
    }, 1200);
  };

  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface">
      <VerifyMobileHeader />
      <main className="relative flex min-h-screen w-full flex-col bg-surface pt-14">
        <div className="flex w-full flex-col pb-10 text-on-surface">
          <ShieldHero data={data} />
          <GuardChallenge data={data} code={code} />
          <ApprovalPanels data={data} />
          <div className="mt-space-lg px-space-md">
            <Button
              variant={null}
              size={null}
              onClick={confirm}
              disabled={phase === "verifying"}
              className={cn(
                "h-auto w-full gap-space-sm rounded-lg border-0 py-3.5 text-text-primary shadow-[0_0_24px_rgba(255,81,106,0.3)] transition-all active:scale-[0.98] disabled:opacity-100",
                phase === "unlocked" ? "bg-tertiary-container" : "bg-primary-container hover:bg-status-live",
              )}
            >
              <Icon
                name={phase === "verifying" ? "refresh" : phase === "unlocked" ? "check_circle" : "lock_open"}
                className={cn("text-[20px]", phase === "verifying" && "animate-spin")}
              />
              <span className="font-headline-sm text-headline-sm font-bold tracking-wider uppercase">
                {phase === "verifying" ? "VERIFYING WITH STEAM API..." : phase === "unlocked" ? "ESCROW VAULT UNLOCKED" : "CONFIRM & UNLOCK ESCROW VAULT"}
              </span>
            </Button>
          </div>
          <RecoveryPanels domain={data.domain} />
        </div>
      </main>
    </div>
  );
}
