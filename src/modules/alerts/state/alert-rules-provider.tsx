"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAlertRulesState } from "../hooks/use-alert-rules-state";
import type { AlertRule } from "../mobile.types";

type AlertRules = ReturnType<typeof useAlertRulesState>;

const AlertRulesContext = createContext<AlertRules | null>(null);

/** The trader's rule book, shared by the deck, the list and the new-rule sheet. */
export function AlertRulesProvider({ initial, children }: { initial: AlertRule[]; children: ReactNode }) {
  return <AlertRulesContext.Provider value={useAlertRulesState(initial)}>{children}</AlertRulesContext.Provider>;
}

export function useAlertRules() {
  const state = useContext(AlertRulesContext);
  if (!state) throw new Error("useAlertRules must be used inside <AlertRulesProvider>.");
  return state;
}
