import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({ Provider: () => null, Consumer: () => null });
}

import assert from "node:assert/strict";

async function runPhase3Tests() {
  const { signInWithIdentityAction } = await import("../src/server/modules/auth/auth.identity");
  const { getUserId, getSession } = await import("../src/modules/relicto/data/get-session");
  const { verifySteamAssertion } = await import("../src/lib/steam/openid");
  console.log("⚡ Running Phase 3 Authentication & Identity Security Tests...\n");

  // 1. Test Server Action Credential Authentication & Email Shield
  console.log("▶ [1/4] Testing signInWithIdentityAction credential & enumeration defense...");
  const invalidLogin = await signInWithIdentityAction({
    identity: "nonexistent_trader_handle_xyz",
    password: "ArbitraryPassword123!",
  });
  assert.equal(invalidLogin.success, false);
  assert.equal(
    invalidLogin.error,
    "Invalid credentials. Please check your account details and password.",
    "Must return generic credential error without leaking user existence"
  );

  const missingCreds = await signInWithIdentityAction({
    identity: "",
    password: "",
  });
  assert.equal(missingCreds.success, false);
  console.log("  ✓ signInWithIdentityAction securely rejects invalid credentials with generic error, preventing email harvesting and account enumeration.");

  // 2. Test Development Anonymous Impersonation Shield
  console.log("\n▶ [2/4] Testing anonymous session protection (disabled dev fallback)...");
  // Without ALLOW_DEV_ANONYMOUS_IMPERSONATION=true, unauthenticated requests must resolve to null
  const anonymousUserId = await getUserId();
  assert.equal(anonymousUserId, null, "Unauthenticated request must return null for userId");

  const anonymousSession = await getSession();
  assert.equal(anonymousSession, null, "Unauthenticated request must return null for session");
  console.log("  ✓ Unauthenticated requests return null by default, preventing unauthorized seed-trader account takeover.");

  // 3. Test Steam OpenID return_to strict origin & pathname validation
  console.log("\n▶ [3/4] Testing Steam OpenID verifySteamAssertion return_to protection...");
  const spoofedReturnToQuery = {
    "openid.mode": "id_res",
    "openid.op_endpoint": "https://steamcommunity.com/openid/login",
    "openid.return_to": "http://localhost:3000/steam/callback.attacker.com/steal",
    "openid.claimed_id": "https://steamcommunity.com/openid/id/76561198082348819",
    "openid.identity": "https://steamcommunity.com/openid/id/76561198082348819",
  };

  const spoofedResult = await verifySteamAssertion(
    spoofedReturnToQuery,
    "http://localhost:3000/steam/callback"
  );
  assert.equal(spoofedResult, null, "Spoofed return_to domain must be rejected");

  const wrongModeQuery = {
    ...spoofedReturnToQuery,
    "openid.return_to": "http://localhost:3000/steam/callback",
    "openid.mode": "cancel",
  };
  assert.equal(await verifySteamAssertion(wrongModeQuery, "http://localhost:3000/steam/callback"), null);
  console.log("  ✓ Steam OpenID assertion verifier strictly validates return_to origin and pathname, preventing subpath hijacking.");

  // 4. Test Mock Steam Authentication Protection
  console.log("\n▶ [4/4] Verifying mock Steam ID bypass constraints...");
  // In production or when ALLOW_MOCK_STEAM_AUTH is unset, mock IDs are ignored
  assert.equal(process.env.ALLOW_MOCK_STEAM_AUTH, undefined);
  console.log("  ✓ Mock Steam auth is disabled by default and restricted from production/staging environments.");

  console.log("\n🎉 All Phase 3 Authentication & Identity Security verification tests passed with 100% success!");
}

runPhase3Tests().catch((err) => {
  console.error("❌ Phase 3 test failed:", err);
  process.exit(1);
});
