"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { requestCashout } from "../actions/treasury";

const RAILS = ["usdt", "sepa", "keys", "visa"] as const;
type Rail = (typeof RAILS)[number];

const REFUSED = {
  "no-wallet": ["No vault on this account yet", "Deposit first, then cash out."],
  "vault-frozen": ["Your vault is locked", "Lift the emergency lock before cashing out."],
  "insufficient-funds": ["That's more than you can withdraw", "Pick an amount up to your available balance."],
} as const;

/** Files a cashout request: the amount leaves the vault now and pays out once the rail settles. */
export function useCashout() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const request = (rail: string, amountUsd: number, maxUsd: number, steamToken: string) => {
    if (!RAILS.includes(rail as Rail)) return toast.error("Pick a cashout rail");
    if (!(amountUsd > 0)) return toast.error("Enter an amount to withdraw");
    if (amountUsd > maxUsd) {
      return toast.error("Amount exceeds available balance", {
        description: `You can withdraw up to ${formatMoney(maxUsd)} right now.`,
      });
    }
    if (steamToken.trim().length < 5) {
      return toast.error("Steam Guard token required", { description: "Enter the 5-character code from your Steam Mobile app." });
    }

    startTransition(async () => {
      try {
        const { status } = await requestCashout({ rail: rail as Rail, amountUsd });
        if (status === "requested") {
          router.refresh();
          toast.success("Cashout requested", {
            description: `${formatMoney(amountUsd)} is held for payout and shows as PROCESSING in your ledger.`,
          });
        } else {
          toast.error(REFUSED[status][0], { description: REFUSED[status][1] });
        }
      } catch {
        toast.error("Couldn't reach the treasury", { description: "Check your connection and try again." });
      }
    });
  };

  return { pending, request };
}
