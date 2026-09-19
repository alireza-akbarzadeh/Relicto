"use client";

import { useEffect, useState } from "react";

/**
 * Seconds remaining, ticking down once per second after mount. The first
 * render uses `initialSeconds`, so server and client markup match.
 */
export function useCountdown(initialSeconds: number) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((seconds) => {
        if (seconds <= 1) window.clearInterval(id);
        return Math.max(0, seconds - 1);
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return remaining;
}
