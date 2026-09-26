"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { confirmReceived, markTradeSent, simulateSellerDispatch } from "../actions/escrow";

const failed = () => toast.error("Couldn't reach the escrow desk", { description: "Check your connection and try again." });

const REFUSED: Record<string, [string, string]> = {
  "invalid-offer": ["That isn't a Steam trade offer", "Paste the offer's link (steamcommunity.com/tradeoffer/…) or its number."],
  unchanged: ["This order has moved on", "Refresh the page to see where it stands."],
  "not-sent": ["No trade offer yet", "Confirm once the seller's offer has arrived and you've accepted it in Steam."],
  "test-mode-off": ["Test mode is off", "Simulation only runs where payments are simulated."],
  "not-found": ["Order not found", "It isn't yours to act on."],
};

/** The peer-to-peer steps: the seller reports the offer, the buyer confirms receipt (or, in test mode, plays the seller). */
export function useFulfilment(code: string) {
  const [pending, startTransition] = useTransition();
  const [offer, setOffer] = useState("");
  const bare = code.replace(/^#/, "");

  const run = (work: () => Promise<{ status: string }>, done: [string, string]) =>
    startTransition(async () => {
      try {
        const { status } = await work();
        if (status === "applied") return void toast.success(done[0], { description: done[1] });
        const [title, description] = REFUSED[status] ?? REFUSED["not-found"];
        toast.error(title, { description });
      } catch {
        failed();
      }
    });

  return {
    pending,
    offer,
    setOffer,
    markSent: () =>
      run(() => markTradeSent({ code: bare, offer }), ["Trade offer reported", "The buyer has been told to accept it in Steam."]),
    confirm: () =>
      run(() => confirmReceived({ code: bare }), ["Trade complete", "The item is yours and the seller has been paid."]),
    simulate: () =>
      run(() => simulateSellerDispatch({ code: bare }), ["Seller simulated", "A test trade offer was sent. Confirm receipt to finish the order."]),
  };
}
