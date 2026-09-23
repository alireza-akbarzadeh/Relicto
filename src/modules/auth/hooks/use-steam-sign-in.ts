"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const FAILED: Record<string, string> = {
  steam_unverified: "Steam couldn't confirm the sign-in. Try again from the Steam button.",
  steam_signin_failed: "Your Steam account couldn't be linked. Try again, or use email.",
};

/**
 * "Sign in through Steam": a full-page trip to Steam's OpenID login and back
 * (it can't be a client-side route change). Carries `?next=` through, and
 * reports a failed round trip when Steam sends the trader back here.
 */
export function useSteamSignIn() {
  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error && FAILED[error]) toast.error("Steam sign-in didn't complete", { description: FAILED[error] });
  }, []);

  return () => {
    const next = new URLSearchParams(window.location.search).get("next") ?? "/marketplace";
    // An API route that redirects off-site to Steam, so this must be a full page load, not a router push.
    const url = new URL(`/api/auth/steam/sign-in?callbackURL=${encodeURIComponent(next)}`, window.location.origin);
    window.location.assign(url.href);
  };
}
