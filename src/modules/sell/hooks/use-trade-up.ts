"use client";

import { useState } from "react";
import { toast } from "sonner";
import { drawOutcome, expectedReturn, initialSlots, inputValue } from "../lib/trade-up";
import type { ContractItem, Outcome, SellMobile } from "../mobile.types";

type Phase = "idle" | "calculating";

/** Contract chamber state: slot toggles, smart fill, derived value / ROI, and the ignite draw. */
export function useTradeUp(contract: SellMobile["contract"]) {
  const [slots, setSlots] = useState(() => initialSlots(contract.committed, contract.slots));
  const [removed, setRemoved] = useState<ContractItem[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Outcome | null>(null);

  const used = new Set(slots.filter(Boolean).map((item) => item!.id));
  const pool = [...removed, ...contract.suggestions].filter(
    (item, index, all) => !used.has(item.id) && all.findIndex((other) => other.id === item.id) === index,
  );
  const input = inputValue(slots);
  const filled = slots.filter(Boolean).length;

  const toggleSlot = (index: number) => {
    const current = slots[index];
    if (current) {
      setSlots((all) => all.map((item, i) => (i === index ? null : item)));
      setRemoved((list) => [current, ...list]);
      return;
    }
    const next = pool[0];
    if (!next) {
      toast("No eligible skins left", { description: "Add same-rarity skins from your Steam vault first." });
      return;
    }
    setSlots((all) => all.map((item, i) => (i === index ? next : item)));
    setRemoved((list) => list.filter((item) => item.id !== next.id));
  };

  const smartFill = () => {
    const queue = [...pool];
    setSlots(slots.map((item) => (item || !queue.length ? item : queue.shift()!)));
    setRemoved(queue);
  };

  const ignite = () => {
    if (filled < contract.slots) {
      toast.error(`Commit all ${contract.slots} skins first`, { description: `${contract.slots - filled} slots are still empty.` });
      return;
    }
    setPhase("calculating");
    setTimeout(() => {
      setResult(drawOutcome(contract.outcomes));
      setPhase("idle");
    }, 750);
  };

  return {
    slots,
    filled,
    input,
    roi: expectedReturn(contract.evUsd, input),
    fillable: Math.min(pool.length, contract.slots - filled),
    phase,
    result,
    toggleSlot,
    smartFill,
    ignite,
    collect: () => setResult(null),
  };
}
