"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { useVaultFreeze } from "../../hooks/use-vault-freeze";
import { TONE_TEXT } from "../../lib/mobile";
import type { QuickAction } from "../../mobile.types";

const NOTICE: Record<Exclude<QuickAction["id"], "freeze">, { title: string; description: string }> = {
  deposit: { title: "Deposit", description: "Pick a liquidity rail below to top up your vault." },
  cashout: { title: "Instant cashout", description: "Choose crypto, card or wire; Steam liquidation pays out in ~3s." },
  send: { title: "P2P send", description: "Enter a Relicto handle or Steam ID to transfer vault balance." },
};

/** Deposit / Cashout / P2P Send / Freeze. Freeze locks the vault and raises the banner. */
export function QuickActions({ actions }: { actions: QuickAction[] }) {
  const { freeze } = useVaultFreeze();

  const run = (action: QuickAction) => {
    if (action.id === "freeze") freeze();
    else toast(NOTICE[action.id].title, { description: NOTICE[action.id].description });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => {
        const primary = action.id === "deposit";
        return (
          <Button
            key={action.id}
            variant={null}
            size={null}
            onClick={() => run(action)}
            className={cn(
              "h-auto flex-col rounded-xl border-0 p-2.5 transition-transform active:scale-95",
              primary ? "bg-primary text-on-primary shadow-lg" : "bg-surface-card text-text-primary shadow-xs hover:bg-surface-container-high",
            )}
          >
            <Icon name={action.icon} className={cn("text-[22px]", !primary && TONE_TEXT[action.tone])} />
            <span className="mt-1 text-center font-label-caps text-label-caps leading-tight font-bold">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

/** Banner shown while the vault is locked; its ✕ lifts the lock. */
export function VaultAlert() {
  const { frozen, dismiss } = useVaultFreeze();
  if (!frozen) return null;
  return (
    <div role="status" className="flex items-center justify-between rounded-xl bg-secondary-container p-space-sm text-on-secondary-container transition-all">
      <div className="flex items-center gap-2">
        <Icon name="shield_with_heart" className="text-[20px]" />
        <span className="font-body-sm text-body-sm">Vault Emergency Lock: spending and cashouts are paused.</span>
      </div>
      <Button variant={null} size={null} aria-label="Lift the emergency lock" onClick={dismiss} className="h-auto border-0 font-headline-sm text-headline-sm text-on-secondary-container">
        ✕
      </Button>
    </div>
  );
}
