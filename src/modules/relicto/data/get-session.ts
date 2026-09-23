import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { notificationService } from "@/server/modules/notifications/notifications.service";
import { walletService } from "@/server/modules/wallet/wallet.service";
import type { AppNotification, SessionUser } from "../session-types";

/**
 * Where a request with a cookie but no live session goes. The flag tells the
 * proxy the cookie is stale, so it clears it instead of bouncing the trader back
 * into the app — which would loop.
 */
const EXPIRED = "/sign-in?expired=1";

/**
 * Trader level and role belong to the profile, which isn't read here yet —
 * every signed-in trader gets these defaults until it is. The wallet balance
 * is filled in by `getSession`.
 */
function toSessionUser(user: { name: string; image?: string | null; emailVerified: boolean }): SessionUser {
  return {
    handle: user.name,
    avatar: user.image ?? "/images/lootora/avatar.jpg",
    avatarAlt: `${user.name} profile portrait`,
    level: 1,
    role: "Trader",
    verified: user.emailVerified,
    steamSynced: false,
    walletUsd: 0,
  };
}

/** The signed-in trader, or null when there's no session. */
export async function getSession(): Promise<{ user: SessionUser; notifications: AppNotification[] } | null> {
  const result = await auth.api.getSession({ headers: await headers() });
  if (!result) return null;
  const [notifications, walletCents] = await Promise.all([
    notificationService.feed(result.user.id),
    walletService.liquidCents(result.user.id),
  ]);
  return { user: { ...toSessionUser(result.user), walletUsd: walletCents / 100 }, notifications };
}

/**
 * The account id domain queries key on. `SessionUser` is a view-model and
 * deliberately doesn't carry it, so data loaders ask for it separately.
 */
export async function getUserId(): Promise<string | null> {
  const result = await auth.api.getSession({ headers: await headers() });
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
