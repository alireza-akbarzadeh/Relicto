"use server";

import { db } from "@/lib/db";
import { profiles, user } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Resolves a login identifier (handle, username, or email) to the registered email address.
 * If an email is already passed (contains '@'), returns it directly.
 * Otherwise, queries the profile handle or user name to find the corresponding account.
 */
export async function resolveAccountEmail(identifier: string): Promise<string> {
  const clean = identifier.trim();
  if (clean.includes("@")) {
    return clean;
  }

  // Check profile handle (case-insensitive)
  const [profileMatch] = await db
    .select({ email: user.email })
    .from(profiles)
    .innerJoin(user, eq(profiles.userId, user.id))
    .where(sql`lower(${profiles.handle}) = lower(${clean})`)
    .limit(1);

  if (profileMatch?.email) {
    return profileMatch.email;
  }

  // Fallback to user name (case-insensitive)
  const [userMatch] = await db
    .select({ email: user.email })
    .from(user)
    .where(sql`lower(${user.name}) = lower(${clean})`)
    .limit(1);

  return userMatch?.email ?? clean;
}
