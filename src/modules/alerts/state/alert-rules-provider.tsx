"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { AlertRule } from "../mobile.types";

type AlertRules = {
  rules: AlertRule[];
  armedCount: number;
  toggle: (id: string) => boolean;
  add: (rule: AlertRule) => void;
};

const AlertRulesContext = createContext<AlertRules | null>(null);

/** Local rule book: arming toggles and newly deployed rules, shared by the deck, list and sheet. */
export function AlertRulesProvider({ initial, children }: { initial: AlertRule[]; children: ReactNode }) {
  const [rules, setRules] = useState(initial);

  const toggle = (id: string) => {
    const next = !rules.find((rule) => rule.id === id)?.armed;
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, armed: next } : rule)));
    return next;
  };

  return (
    <AlertRulesContext.Provider
      value={{ rules, armedCount: rules.filter((rule) => rule.armed).length, toggle, add: (rule) => setRules((current) => [rule, ...current]) }}
    >
      {children}
    </AlertRulesContext.Provider>
  );
}

export function useAlertRules() {
  const state = useContext(AlertRulesContext);
  if (!state) throw new Error("useAlertRules must be used inside <AlertRulesProvider>.");
  return state;
}
