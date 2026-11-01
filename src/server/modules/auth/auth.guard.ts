import "server-only";

import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserId } from "@/modules/relicto/data/get-session";
import { securityLog } from "@/server/modules/security/security-logger";

export type RoleCheckResult =
  | { authorized: true; userId: string; role: string }
  | { authorized: false; status: 401 | 403; error: string };

/**
 * Authoritative server-side check requiring the caller to hold the 'Admin' role.
 * Queries the verified database profile to prevent client-spoofed or bypassed role checks.
 */
export async function requireAdminRole(): Promise<RoleCheckResult> {
  const userId = await getUserId();
  if (!userId) {
    return { authorized: false, status: 401, error: "Authentication required" };
  }

  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile || profile.role?.toLowerCase() !== "admin") {
    securityLog.warn("AUTHZ_FAILURE", `User ${userId} attempted administrative action without admin role`, {
      userId,
      metadata: { currentRole: profile?.role || "none" },
    });
    return { authorized: false, status: 403, error: "Administrative privileges required" };
  }

  return { authorized: true, userId, role: profile.role };
}

