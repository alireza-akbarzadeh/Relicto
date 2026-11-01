import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";
import { twoFactor } from "better-auth/plugins";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { steamAuth } from "@/lib/steam/steam-auth-plugin";
import { bootstrapTrader } from "@/server/modules/profile/profile.bootstrap";

/**
 * Where this instance actually runs. Vercel injects `VERCEL_URL` per
 * deployment (including previews), so only local dev falls through to
 * localhost. A mismatch here rejects sign-in with `INVALID_ORIGIN`.
 */
const vercelOrigin = process.env.VERCEL_URL
  ? (process.env.VERCEL_URL.startsWith("http") ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`).replace(/\/$/, "")
  : null;

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (vercelOrigin ?? "http://localhost:3000");

export const auth = betterAuth({
  baseURL,
  /** Previews get a fresh `VERCEL_URL` per deploy, so accept the current one plus local dev. */
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    ...(vercelOrigin ? [vercelOrigin] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days session lifetime
    updateAge: 60 * 60 * 24, // Refresh active session token once every 24 hours
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[auth] Dev password reset URL generated for ${user.email}: ${url}`);
      } else {
        console.log(`[auth] Password reset requested for user ${user.id}`);
      }
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[auth] Dev verification email URL generated for ${user.email}: ${url}`);
      } else {
        console.log(`[auth] Verification email requested for user ${user.id}`);
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        /**
         * Runs after the sign-up transaction commits. A failure must not fail the
         * sign-up that already succeeded; the profile page opens it lazily instead.
         */
        after: async (created) => {
          await bootstrapTrader(db, created.id).catch((error) => {
            console.error(`[auth] trader bootstrap failed for ${created.id}`, error);
          });
        },
      },
    },
  },
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
    twoFactor({
      issuer: "Relicto",
    }),
    steamAuth(),
    nextCookies(),
  ],
});
