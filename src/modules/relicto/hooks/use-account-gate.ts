"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { signInHref } from "../lib/sign-in-href";
import { useViewer } from "../state/session-provider";

/**
 * Guests can browse the whole catalog, but buying, bidding and watching need
 * an account. `requireAccount("buy this item")` answers true for a signed-in
 * trader; for a guest it explains why and opens sign-in, returning them here after.
 */
export function useAccountGate() {
  const viewer = useViewer();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(
    (intent: string) => {
      if (viewer) return true;
      toast(`Sign in to ${intent}`, { description: "Relicto trades run through your Steam account and escrow vault." });
      router.push(signInHref(pathname));
      return false;
    },
    [viewer, router, pathname],
  );
}
