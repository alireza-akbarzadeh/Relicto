"use client";

import { useCallback, useMemo, useState } from "react";

/** A set of toggled string keys, e.g. active quick-filter chips. */
export function useToggleSet(initial: string[] = []) {
  const [keys, setKeys] = useState(() => new Set(initial));

  const toggle = useCallback((key: string) => {
    setKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  return useMemo(() => ({ has: (key: string) => keys.has(key), toggle }), [keys, toggle]);
}
