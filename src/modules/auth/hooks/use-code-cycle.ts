"use client";

import { useEffect, useState } from "react";

/** Seconds left in a repeating code window (Steam Guard codes rotate every `period`s). */
export function useCodeCycle(period: number, start: number) {
  const [left, setLeft] = useState(start);

  useEffect(() => {
    const id = window.setInterval(() => setLeft((s) => (s <= 1 ? period : s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [period]);

  return { left, progress: left / period };
}
