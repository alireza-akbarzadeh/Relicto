"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { setVaultFrozen } from "../actions/treasury";

type VaultFreeze = { frozen: boolean; freeze: () => void; dismiss: () => void };

const VaultFreezeContext = createContext<VaultFreeze | null>(null);

/**
 * The vault's emergency lock, saved on the server: Freeze sets it, the banner's
 * dismiss lifts it. Shared between the action and the banner further down.
 */
export function VaultFreezeProvider({ initial = false, children }: { initial?: boolean; children: ReactNode }) {
  const [frozen, setFrozen] = useState(initial);

  const apply = (next: boolean) => {
    setFrozen(next);
    setVaultFrozen({ frozen: next })
      .then(({ ok }) => {
        if (!ok) setFrozen(!next);
        else if (!next) toast("Emergency lock lifted", { description: "Your vault can pay for orders and cash out again." });
      })
      .catch(() => {
        setFrozen(!next);
        toast.error("Couldn't update the vault lock", { description: "Check your connection and try again." });
      });
  };

  return (
    <VaultFreezeContext.Provider value={{ frozen, freeze: () => apply(true), dismiss: () => apply(false) }}>
      {children}
    </VaultFreezeContext.Provider>
  );
}

export function useVaultFreeze() {
  const state = useContext(VaultFreezeContext);
  if (!state) throw new Error("useVaultFreeze must be used inside <VaultFreezeProvider>.");
  return state;
}
