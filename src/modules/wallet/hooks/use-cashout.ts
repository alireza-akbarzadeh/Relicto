"use client";

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
  const [pending, startTransition] = useTransition();

  const request = (rail: string, amountUsd: number) => {
    if (!RAILS.includes(rail as Rail)) return toast.error("Pick a cashout rail");
    if (!(amountUsd > 0)) return toast.error("Enter an amount to withdraw");

    startTransition(async () => {
      try {
        const { status } = await requestCashout({ rail: rail as Rail, amountUsd });
        if (status === "requested") {
          toast.success("Cashout requested", {
            description: `${formatMoney(amountUsd)} is held for payout and shows as processing in your ledger.`,
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
