"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ConfirmState = "idle" | "busy" | "done";

/** Mock async confirmation: idle → busy → done → redirect. Swap the timers for the real API call. */
export function useConfirmState(redirectTo: string) {
  const [state, setState] = useState<ConfirmState>("idle");
  const router = useRouter();

  const confirm = () => {
    setState("busy");
    window.setTimeout(() => {
      setState("done");
      window.setTimeout(() => router.push(redirectTo), 900);
    }, 1200);
  };

  return { state, confirm };
}
