import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { steamAuth } from "@/lib/steam/steam-auth-plugin";

/**
 * Where this instance actually runs. Vercel injects `VERCEL_URL` per
 * deployment (including previews), so only local dev falls through to
 * localhost. A mismatch here rejects sign-in with `INVALID_ORIGIN`.
 */
const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const auth = betterAuth({
  baseURL,
  /** Previews get a fresh `VERCEL_URL` per deploy, so accept the current one plus local dev. */
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
    steamAuth(),
    nextCookies(),
  ],
});
