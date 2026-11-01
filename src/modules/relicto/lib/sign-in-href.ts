const HOME = "/marketplace";

/**
 * Where to go after signing in. Only same-site paths: `//evil.com` and
 * absolute URLs would turn `?next=` into an open redirect.
 */
export function safeNext(next: string | null | undefined): string {
  if (!next || typeof next !== "string") return HOME;

  if (next.includes("\\") || next.startsWith("//") || !next.startsWith("/")) {
    return HOME;
  }

  try {
    const dummyOrigin = "http://localhost";
    const parsed = new URL(next, dummyOrigin);

    if (parsed.origin !== dummyOrigin || !parsed.pathname.startsWith("/") || parsed.pathname.includes("\\")) {
      return HOME;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return HOME;
  }
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
