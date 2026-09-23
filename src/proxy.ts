import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Everything under the `(lootora)` app shell. The shell always renders a
 * signed-in header (wallet, avatar, notifications) — there's no guest mode
 * yet — so every page here needs a session, not just the account-only ones.
 */
const PRIVATE_PREFIXES = [
  "/alerts",
  "/checkout",
  "/community",
  "/items",
  "/marketplace",
  "/orders",
  "/profile",
  "/sell",
  "/tracker",
  "/wallet",
  "/wiki",
];

/** Entry points a signed-in trader shouldn't land back on. */
const AUTH_ENTRY_PATHS = ["/sign-in", "/sign-up"];

/**
 * Optimistic cookie check only — this can't verify the session is still
 * valid server-side. `requireSession()` in the `(lootora)` layout is the
 * authoritative check; this just avoids a render round-trip for the common
 * case.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (!hasSessionCookie && PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const onAuthEntry = AUTH_ENTRY_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  // The app found this cookie's session dead (expired, revoked, user deleted).
  // Drop it and show sign-in, rather than sending the trader back in to loop.
  if (onAuthEntry && request.nextUrl.searchParams.has("expired")) {
    const response = NextResponse.next();
    for (const cookie of request.cookies.getAll()) {
      if (!cookie.name.includes("better-auth.session")) continue;
      // A `__Secure-` cookie can only be overwritten by another Secure one.
      response.cookies.set(cookie.name, "", { path: "/", maxAge: 0, secure: cookie.name.startsWith("__Secure-") });
    }
    return response;
  }

  if (hasSessionCookie && onAuthEntry) {
    return NextResponse.redirect(new URL("/marketplace", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
