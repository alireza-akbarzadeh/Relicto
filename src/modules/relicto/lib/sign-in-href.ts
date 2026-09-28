const HOME = "/marketplace";

/**
 * Where to go after signing in. Only same-site paths: `//evil.com` and
 * absolute URLs would turn `?next=` into an open redirect.
 */
export function safeNext(next: string | null | undefined) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return HOME;
  return next;
}

/**
 * Sign-in (or sign-up) URL that returns the trader to `next` afterwards. Guest
 * links always carry `next`: that's how the proxy tells a stale session cookie
 * (render sign-in) from a live one (send the trader back into the app).
 */
export function signInHref(next?: string | null, entry: "/sign-in" | "/sign-up" = "/sign-in") {
  if (!next || next.startsWith("/sign-")) return entry;
  return `${entry}?next=${encodeURIComponent(next)}`;
}
