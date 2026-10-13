import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { notificationService } from "@/server/modules/notifications/notifications.service";
import { findOrOpenProfile } from "@/server/modules/profile/profile.repository";
import { walletService } from "@/server/modules/wallet/wallet.service";
import { rethrowNextSignals } from "@/lib/next-signals";
import type { AppNotification, SessionUser } from "../session-types";

/**
 * Where a request with a cookie but no live session goes. The flag tells the
 * proxy the cookie is stale, so it clears it instead of bouncing the trader back
 * into the app — which would loop.
 */
const EXPIRED = "/sign-in?expired=1";

/** One Better Auth lookup per request, however many loaders ask who is signed in. */
const readSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getSession] Failed to read session:", err);
    return null;
  }
});

/** The signed-in trader, or null when there's no session. */
export async function getSession(): Promise<{ user: SessionUser; notifications: AppNotification[] } | null> {
  const result = await readSession();
  if (!result) return null;
  try {
    const [notifications, walletCents, profile] = await Promise.all([
      notificationService.feed(result.user.id),
      walletService.liquidCents(result.user.id),
      findOrOpenProfile(result.user.id),
    ]);

    const user: SessionUser = {
      handle: profile?.handle ?? result.user.name,
      avatar: profile?.avatar || result.user.image || "/images/lootora/avatar.jpg",
      avatarAlt: profile?.avatarAlt ?? `${result.user.name} profile portrait`,
      level: profile?.level ?? 1,
      role: profile?.role ?? "Trader",
      verified: result.user.emailVerified,
      steamSynced: !!profile?.steamId,
      walletUsd: walletCents / 100,
    };

    return { user, notifications };
  } catch (err) {
    rethrowNextSignals(err);
    console.error("[getSession] Error loading auxiliary session data:", err);
    return {
      user: {
        handle: result.user.name,
        avatar: result.user.image || "/images/lootora/avatar.jpg",
        avatarAlt: `${result.user.name} profile portrait`,
        level: 1,
        role: "Trader",
        verified: result.user.emailVerified,
        steamSynced: false,
        walletUsd: 0,
      },
      notifications: [],
    };
  }
}

/**
 * The account id domain queries key on. `SessionUser` is a view-model and
 * deliberately doesn't carry it, so data loaders ask for it separately.
 */
export async function getUserId(): Promise<string | null> {
  const result = await readSession();
  return result?.user.id ?? null;
}

/** As `getUserId`, for pages the proxy already guarantees are signed in. */
export async function requireUserId(): Promise<string> {
  const id = await getUserId();
  if (!id) redirect(EXPIRED);
  return id;
}

/** Same as `getSession`, but redirects to sign-in instead of returning null. Use in layouts/pages behind the private routes proxy protects. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect(EXPIRED);
  return session;
}
