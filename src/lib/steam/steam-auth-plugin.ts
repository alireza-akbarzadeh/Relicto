import "server-only";

import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { handleOAuthUserInfo } from "better-auth/oauth2";
import { z } from "zod";
import { fetchSteamPersona, safeCallback, steamLoginUrl, verifySteamAssertion } from "./openid";

/**
 * "Sign in through Steam" for Better Auth. Steam has no email, so a new trader
 * gets `<steamid>@steam.invalid` — unique, unroutable, and never mailed. The
 * Steam account is linked by SteamID64, so the same Steam login always lands on
 * the same Relicto user.
 *
 *   GET /api/auth/steam/sign-in?callbackURL=/marketplace
 *   GET /api/auth/steam/callback   (Steam returns here)
 */
export const steamAuth = () =>
  ({
    id: "steam",
    endpoints: {
      steamSignIn: createAuthEndpoint(
        "/steam/sign-in",
        { method: "GET", query: z.object({ callbackURL: z.string().optional() }) },
        async (ctx) => {
          const callback = safeCallback(ctx.query.callbackURL);
          const returnTo = `${ctx.context.baseURL}/steam/callback?callbackURL=${encodeURIComponent(callback)}`;
          throw ctx.redirect(steamLoginUrl(returnTo, new URL(ctx.context.baseURL).origin));
        },
      ),

      steamCallback: createAuthEndpoint(
        "/steam/callback",
        { method: "GET", query: z.record(z.string(), z.string()) },
        async (ctx) => {
          const callback = safeCallback(ctx.query.callbackURL);
          const failed = (reason: string) => ctx.redirect(`/sign-in?error=${reason}&next=${encodeURIComponent(callback)}`);

          const steamId = await verifySteamAssertion(ctx.query, `${ctx.context.baseURL}/steam/callback`).catch(() => null);
          if (!steamId) throw failed("steam_unverified");

          const persona = await fetchSteamPersona(steamId);
          const result = await handleOAuthUserInfo(ctx, {
            userInfo: {
              id: steamId,
              email: `${steamId}@steam.invalid`,
              emailVerified: false,
              name: persona.name,
              image: persona.avatar,
            },
            account: { providerId: "steam", accountId: steamId },
            callbackURL: callback,
          });
          if (result.error || !result.data) throw failed("steam_signin_failed");

          await setSessionCookie(ctx, result.data);
          throw ctx.redirect(callback);
        },
      ),
    },
  }) satisfies BetterAuthPlugin;
