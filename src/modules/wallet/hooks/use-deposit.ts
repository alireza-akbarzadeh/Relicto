"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { depositFunds } from "../actions/treasury";

const MONEY_RAILS = ["crypto", "cards", "bank"] as const;
type MoneyRail = (typeof MONEY_RAILS)[number];

export const isMoneyRail = (rail: string): rail is MoneyRail => (MONEY_RAILS as readonly string[]).includes(rail);

/** The deposit panel's write: credit the vault (simulated until a provider exists) and say what happened. */
export function useDeposit() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const deposit = (rail: string, amountUsd: number) => {
    if (!isMoneyRail(rail)) {
      return toast("Skins are liquidated in the Sell Studio", {
        description: "Instant cashout turns inventory into vault balance, with the +2% booster.",
        action: { label: "Open Sell Studio", onClick: () => router.push("/sell") },
      });
    }
    if (!(amountUsd >= 10)) return toast.error("Minimum deposit is $10.00");
    if (amountUsd > 10_000) return toast.error("Maximum deposit is $10,000.00 per transfer");

    startTransition(async () => {
      try {
        const result = await depositFunds({ rail, amountUsd });
        if (result.status === "credited") {
          toast.success(`${formatMoney(amountUsd)} added to your vault`, {
            description: `Test deposit — nothing was charged. Vault balance ${formatMoney(result.balanceCents / 100)}.`,
          });
        } else if (result.status === "vault-frozen") {
          toast.error("Your vault is frozen", { description: "Unfreeze it before depositing." });
        } else {
          toast.error("Deposits aren't live yet", { description: "No payment provider is connected in this environment." });
        }
      } catch {
        toast.error("Couldn't reach the wallet", { description: "Check your connection and try again." });
      }
    });
  };

  return { pending, deposit };
}
