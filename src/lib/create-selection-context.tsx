"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Selection<T> = { value: T; select: (next: T) => void };

/**
 * Builds a typed Provider + hook pair for a single selected value shared by
 * components that aren't siblings (e.g. header game pills and the hero switcher).
 */
export function createSelectionContext<T>(displayName: string) {
  const Context = createContext<Selection<T> | null>(null);
  Context.displayName = displayName;

  function Provider({ initial, children }: { initial: T; children: ReactNode }) {
    const [value, setValue] = useState<T>(initial);
    const selection = useMemo(() => ({ value, select: setValue }), [value]);
    return <Context.Provider value={selection}>{children}</Context.Provider>;
  }

  function useSelection() {
    const selection = useContext(Context);
    if (!selection) throw new Error(`${displayName} is missing its Provider.`);
    return selection;
  }

  return { Provider, useSelection };
}
