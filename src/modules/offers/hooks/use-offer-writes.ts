"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/format";
import { acceptOffer, declineOffer, makeOffer, withdrawOffer } from "../actions/offers";

type Refusal = readonly [title: string, description: string];

const MAKE_REFUSED: Record<string, Refusal> = {
  "not-listed": ["That copy just left the market", "It sold or was delisted. Pick another seller."],
  "own-listing": ["That's your own listing", "Manage it from the seller studio instead."],
  "too-low": ["Offer is too low", "Bids start at half the ask."],
  "at-price": ["That's the full ask", "Buy it now instead — no need to wait for the seller."],
  "insufficient-funds": ["Your vault can't cover that bid", "Top up the vault first; it's debited only if the seller accepts."],
  "vault-frozen": ["Your vault is frozen", "Unfreeze it from the wallet before bidding."],
};

const ACCEPT_REFUSED: Record<string, Refusal> = {
  "not-found": ["That offer is gone", "The buyer withdrew it or it was already answered."],
  expired: ["That offer lapsed", "Bids expire after three days without an answer."],
  "listing-gone": ["The copy isn't for sale any more", "It sold or was delisted, so the offer can't be taken."],
  "buyer-short": ["The buyer can't cover it now", "Their vault fell below the bid, so the offer lapsed. Nothing moved."],
};

const failed = () => toast.error("Couldn't reach the market", { description: "Check your connection and try again." });

/** Both sides of a bid: the buyer places, revises and withdraws; the seller accepts or declines. */
export function useOfferWrites() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = (work: () => Promise<void>) =>
    startTransition(async () => {
      try {
        await work();
      } catch {
        failed();
      }
    });

  const make = (input: { listingId: string; amountUsd: number; note: string }, name: string, onDone?: () => void) =>
    run(async () => {
      const { status } = await makeOffer(input);
      if (status === "placed" || status === "revised") {
        toast.success(status === "placed" ? `Offer sent on ${name}` : `Offer revised on ${name}`, {
          description: `${formatMoney(input.amountUsd)} bid. Nothing leaves your vault unless the seller accepts.`,
        });
        onDone?.();
      } else {
        const [title, description] = MAKE_REFUSED[status];
        toast.error(title, { description });
      }
    });

  const withdraw = (offerId: string, name: string, onDone?: () => void) =>
    run(async () => {
      const { ok } = await withdrawOffer({ offerId });
      if (ok) toast(`Offer on ${name} withdrawn`);
      else toast.error("That offer is already closed", { description: "The seller answered it first." });
      onDone?.();
    });

  const accept = (offerId: string, name: string) =>
    run(async () => {
      const result = await acceptOffer({ offerId });
      if (result.status === "accepted") {
        const code = result.code;
        toast.success(`Offer accepted — ${name} is in escrow`, {
          description: `Order ${code} is funded. A Sentinel bot will request the item from your Steam inventory.`,
          action: { label: "Track", onClick: () => router.push(`/orders/${code}`) },
        });
      } else {
        const [title, description] = ACCEPT_REFUSED[result.status];
        toast.error(title, { description });
      }
    });

  const decline = (offerId: string, name: string) =>
    run(async () => {
      const { status } = await declineOffer({ offerId });
      if (status === "declined") toast(`Offer on ${name} declined`, { description: "The buyer has been told." });
      else toast.error(ACCEPT_REFUSED["not-found"][0], { description: ACCEPT_REFUSED["not-found"][1] });
    });

  return { pending, make, withdraw, accept, decline };
}
