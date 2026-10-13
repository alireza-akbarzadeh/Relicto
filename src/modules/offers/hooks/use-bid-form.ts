"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { bidDiscount, checkBid, minBidCents, toCents } from "../lib/bid-rules";

/**
 * The offer form's state and the same checks the server applies, so the
 * submit button only lights up for a bid the server will take.
 */
export function useBidForm(
  askUsd: number,
  current?: number,
  allowOffers = true,
  minOfferCents?: number | null,
) {
  const askCents = toCents(askUsd);
  const minCents = minBidCents(askCents, minOfferCents);
  const openingVal = Math.max(minCents, Math.floor(askCents * 0.95)) / 100;
  const [amount, setAmount] = useState(() => String(current ?? openingVal));
  const [note, setNote] = useState("");

  const value = Number(amount);
  const bidCents = Number.isFinite(value) && value > 0 ? toCents(value) : 0;
  const check = bidCents > 0 ? checkBid(bidCents, askCents, allowOffers, minOfferCents) : "too-low";

  const hint = {
    ok: `${bidDiscount(bidCents, askCents)} under the ask`,
    "too-low": `Bids start at ${formatMoney(minCents / 100)}`,
    "below-min-offer": `Seller counter-offer minimum is ${formatMoney(minCents / 100)}`,
    "offers-disabled": "Seller has disabled counter-offers on this listing",
    "at-price": "That's the full ask — use Buy Now instead",
  }[check];

  return {
    amount,
    setAmount,
    note,
    setNote,
    amountUsd: bidCents / 100,
    valid: check === "ok",
    hint,
    minUsd: minCents / 100,
  };
}
