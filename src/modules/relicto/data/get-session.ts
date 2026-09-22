import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { AppNotification, SessionUser } from "../session-types";

/**
 * Wallet balance, trader level/role and notifications belong to domain
 * tables that don't exist yet (see docs/backend-plan.md, Phase 2). Every
 * signed-in trader gets these defaults until that data is real.
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
  return { user: toSessionUser(result.user), notifications: [] };
}

/** Same as `getSession`, but redirects to sign-in instead of returning null. Use in layouts/pages behind the private routes proxy protects. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}
