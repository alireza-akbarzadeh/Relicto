"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/format";
import { bidDiscount, checkBid, minBidCents, toCents } from "../lib/bid-rules";

/** A sensible opening bid: 5% under the ask, never under the minimum. */
const opening = (askCents: number) => Math.max(minBidCents(askCents), Math.floor(askCents * 0.95)) / 100;

/**
 * The offer form's state and the same checks the server applies, so the
 * submit button only lights up for a bid the server will take.
 */
export function useBidForm(askUsd: number, current?: number) {
  const askCents = toCents(askUsd);
  const [amount, setAmount] = useState(() => String(current ?? opening(askCents)));
  const [note, setNote] = useState("");

  const value = Number(amount);
  const bidCents = Number.isFinite(value) && value > 0 ? toCents(value) : 0;
  const check = bidCents > 0 ? checkBid(bidCents, askCents) : "too-low";

  const hint = {
    ok: `${bidDiscount(bidCents, askCents)} under the ask`,
    "too-low": `Bids start at ${formatMoney(minBidCents(askCents) / 100)}`,
    "at-price": "That's the full ask — use Buy Now instead",
  }[check];

  return { amount, setAmount, note, setNote, amountUsd: bidCents / 100, valid: check === "ok", hint, minUsd: minBidCents(askCents) / 100 };
}
