"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles, user } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Internal helper to resolve a login identifier (handle, username, or email) to registered email.
 * Internal only — never expose raw resolved emails to unauthenticated client requests.
 */
async function resolveInternalAccountEmail(identifier: string): Promise<string> {
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

/**
 * Authenticates user credentials server-side without revealing the underlying
 * account email to an unauthenticated client.
 */
export async function signInWithIdentityAction(input: {
  identity: string;
  password: string;
  rememberMe?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanIdentity = input.identity?.trim();
    if (!cleanIdentity || !input.password) {
      return { success: false, error: "Missing identity or password" };
    }

    const email = await resolveInternalAccountEmail(cleanIdentity);

    await auth.api.signInEmail({
      body: {
        email,
        password: input.password,
        rememberMe: input.rememberMe,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch {
    // Return generic error message to prevent account enumeration
    return { success: false, error: "Invalid credentials. Please check your account details and password." };
  }
}

/**
 * @deprecated Use `signInWithIdentityAction` instead to prevent email harvesting.
 */
export async function resolveAccountEmail(identifier: string): Promise<string> {
  return resolveInternalAccountEmail(identifier);
}
