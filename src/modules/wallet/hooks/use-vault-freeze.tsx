"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type VaultFreeze = { frozen: boolean; freeze: () => void; dismiss: () => void };

const VaultFreezeContext = createContext<VaultFreeze | null>(null);

/** Shares the emergency-lock state between the Freeze action and its banner further down the page. */
export function VaultFreezeProvider({ children }: { children: ReactNode }) {
  const [frozen, setFrozen] = useState(false);
  return (
    <VaultFreezeContext.Provider value={{ frozen, freeze: () => setFrozen(true), dismiss: () => setFrozen(false) }}>
      {children}
    </VaultFreezeContext.Provider>
  );
}

export function useVaultFreeze() {
  const state = useContext(VaultFreezeContext);
  if (!state) throw new Error("useVaultFreeze must be used inside <VaultFreezeProvider>.");
  return state;
}
