"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createAlertRule, setAlertArmed } from "../actions/rules";
import type { AlertRule } from "../mobile.types";

export type NewRule = { name: string; targetUsd: number; maxFloat: number | null; autoBuy: boolean };

const failed = (title: string) => toast.error(title, { description: "Check your connection and try again." });

/** The mobile rule book: arming is optimistic, new rules come back from the server fully priced. */
export function useAlertRulesState(initial: AlertRule[]) {
  const [rules, setRules] = useState(initial);

  const setArmedLocal = (id: string, armed: boolean) =>
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, armed } : rule)));

  /** Flips a rule and returns its new state; rolls back if the server refuses. */
  const toggle = (id: string) => {
    const armed = !rules.find((rule) => rule.id === id)?.armed;
    setArmedLocal(id, armed);
    setAlertArmed({ id, armed })
      .then(({ ok }) => {
        if (!ok) setArmedLocal(id, !armed);
      })
      .catch(() => {
        setArmedLocal(id, !armed);
        failed("Couldn't update the rule");
      });
    return armed;
  };

  /** Deploys a rule; resolves true once the server has it. */
  const create = async (rule: NewRule) => {
    try {
      const { matched, rules: next } = await createAlertRule(rule);
      setRules(next);
      if (!matched) toast(`${rule.name} isn't in the catalog`, { description: "The rule is saved, but it can't read a live price until the item is listed." });
      return true;
    } catch {
      failed("Couldn't deploy the rule");
      return false;
    }
  };

  return { rules, armedCount: rules.filter((rule) => rule.armed).length, toggle, create };
}
