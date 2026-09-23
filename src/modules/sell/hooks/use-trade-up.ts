"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { igniteContract, saveContractSlots } from "../actions/trade-ups";
import { expectedReturn, floatAverage, initialSlots, inputValue, rarityLock } from "../lib/trade-up";
import type { ContractItem, Outcome, TradeUpContract } from "../mobile.types";

type Slots = (ContractItem | null)[];

const REFUSED = {
  stale: ["Your chamber changed", "A skin was listed or the chamber was edited elsewhere. This is the latest."],
  ineligible: ["That skin can't be traded up", "Knives, gloves and souvenirs don't enter contracts."],
  "mixed-rarity": ["Contracts take one grade", "Every skin in the chamber must share its rarity."],
  incomplete: ["The chamber isn't full", "Commit all ten skins, then ignite."],
  unavailable: ["The forge is offline", "No outcome pool is loaded. Try again shortly."],
} as const;

const refuse = (status: keyof typeof REFUSED) => toast.error(REFUSED[status][0], { description: REFUSED[status][1] });
const failed = () => toast.error("Couldn't reach the forge", { description: "Check your connection and try again." });
const ids = (slots: Slots) => slots.map((item) => item?.id ?? null);
/** The reveal holds the "calculating" beat even when the server answers first. */
const beat = () => new Promise((resolve) => setTimeout(resolve, 750));

/**
 * Contract chamber state. Slot changes apply at once and are saved behind the
 * scenes; the server's answer (the chamber as it now holds it) replaces local
 * state, and only the newest answer counts. Ignite draws on the server.
 */
export function useTradeUp(initial: TradeUpContract) {
  const [contract, setContract] = useState(initial);
  const [slots, setSlots] = useState(() => initialSlots(initial.committed, initial.slots));
  const [released, setReleased] = useState<ContractItem[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<{ outcome: Outcome; input: number } | null>(null);
  const latest = useRef(0);

  const adopt = (next: TradeUpContract) => {
    setContract(next);
    setSlots(initialSlots(next.committed, next.slots));
    setReleased([]);
  };

  const lock = rarityLock(slots);
  const used = new Set(slots.flatMap((item) => (item ? [item.id] : [])));
  const pool = [...released, ...contract.suggestions].filter(
    (item, index, all) =>
      !used.has(item.id) && (!lock || item.rarity === lock) && all.findIndex((other) => other.id === item.id) === index,
  );
  const input = inputValue(slots);
  const filled = used.size;

  const persist = (next: Slots, releasedNow: ContractItem[]) => {
    setSlots(next);
    setReleased(releasedNow);
    const request = ++latest.current;
    saveContractSlots({ slots: ids(next) })
      .then(({ status, contract: server }) => {
        if (request !== latest.current) return;
        if (status !== "saved") refuse(status);
        if (server) adopt(server);
      })
      .catch(failed);
  };

  const toggleSlot = (index: number) => {
    if (calculating) return;
    const current = slots[index];
    if (current) return persist(slots.map((item, i) => (i === index ? null : item)), [current, ...released]);
    const next = pool[0];
    if (!next) {
      toast("No eligible skins left", { description: "Add same-rarity skins from your Steam vault first." });
      return;
    }
    persist(slots.map((item, i) => (i === index ? next : item)), released.filter((item) => item.id !== next.id));
  };

  const smartFill = () => {
    if (calculating) return;
    const grade = lock ?? pool[0]?.rarity;
    const queue = pool.filter((item) => item.rarity === grade);
    const taken = new Set<string>();
    const next = slots.map((item) => {
      const pick = item || !queue.length ? null : queue.shift()!;
      if (pick) taken.add(pick.id);
      return item ?? pick;
    });
    persist(next, released.filter((item) => !taken.has(item.id)));
  };

  const ignite = () => {
    if (filled < contract.slots) {
      toast.error(`Commit all ${contract.slots} skins first`, { description: `${contract.slots - filled} slots are still empty.` });
      return;
    }
    latest.current++;
    setCalculating(true);
    Promise.all([igniteContract({ slots: ids(slots) }), beat()])
      .then(([answer]) => {
        if (answer.contract) adopt(answer.contract);
        if (answer.status === "settled") setResult({ outcome: answer.outcome, input: answer.inputUsd });
        else refuse(answer.status);
      })
      .catch(failed)
      .finally(() => setCalculating(false));
  };

  return {
    contract,
    slots,
    filled,
    input,
    roi: expectedReturn(contract.evUsd, input),
    floatAvg: floatAverage(slots),
    fillable: Math.min(pool.filter((item) => item.rarity === (lock ?? pool[0]?.rarity)).length, contract.slots - filled),
    calculating,
    result,
    toggleSlot,
    smartFill,
    ignite,
    collect: () => setResult(null),
  };
}
