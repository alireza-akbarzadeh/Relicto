import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({ Provider: () => null, Consumer: () => null });
}

import assert from "node:assert/strict";
import { NextRequest } from "next/server";

async function runPhase4Tests() {
  console.log("⚡ Running Phase 4 Authorization & Permissions Tests...\n");

  const { requireAdminRole } = await import("../src/server/modules/auth/auth.guard");
  const { PUT, DELETE } = await import("../src/app/api/chests/[slug]/route");
  const { POST: cryptoWebhookPOST } = await import("../src/app/api/webhooks/crypto/route");

  // 1. Test Server-side Admin Guard
  console.log("▶ [1/4] Testing requireAdminRole server guard...");
  const unauthCheck = await requireAdminRole();
  assert.equal(unauthCheck.authorized, false);
  assert.equal(unauthCheck.status, 401, "Unauthenticated user must receive 401");
  assert.equal(unauthCheck.error, "Authentication required");
  console.log("  ✓ requireAdminRole correctly rejects unauthenticated callers with 401.");

  // 2. Test BFLA protection on /api/chests/[slug] PUT
  console.log("\n▶ [2/4] Testing /api/chests/[slug] PUT endpoint authorization...");
  const fakePutReq = new Request("http://localhost:3000/api/chests/dota2-ti14-immortal", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceCoins: 0 }),
  });
  const putResponse = await PUT(fakePutReq, { params: Promise.resolve({ slug: "dota2-ti14-immortal" }) });
  assert.equal(putResponse.status, 401, "Unauthenticated PUT must be rejected with 401");
  const putBody = await putResponse.json();
  assert.equal(putBody.error, "Authentication required");
  console.log("  ✓ PUT /api/chests/[slug] successfully blocked from unprivileged mutation.");

  // 3. Test BFLA protection on /api/chests/[slug] DELETE
  console.log("\n▶ [3/4] Testing /api/chests/[slug] DELETE endpoint authorization...");
  const fakeDeleteReq = new Request("http://localhost:3000/api/chests/dota2-ti14-immortal", {
    method: "DELETE",
  });
  const deleteResponse = await DELETE(fakeDeleteReq, { params: Promise.resolve({ slug: "dota2-ti14-immortal" }) });
  assert.equal(deleteResponse.status, 401, "Unauthenticated DELETE must be rejected with 401");
  const deleteBody = await deleteResponse.json();
  assert.equal(deleteBody.error, "Authentication required");
  console.log("  ✓ DELETE /api/chests/[slug] successfully blocked from unprivileged deletion.");

  // 4. Test Crypto Webhook Authorization & Secret Enforcement (SEC-004)
  console.log("\n▶ [4/4] Testing crypto webhook authorization enforcement (SEC-004)...");
  
  // Case A: Missing CRYPTO_WEBHOOK_SECRET in environment
  const originalSecret = process.env.CRYPTO_WEBHOOK_SECRET;
  delete process.env.CRYPTO_WEBHOOK_SECRET;

  const unconfiguredReq = new NextRequest("http://localhost:3000/api/webhooks/crypto", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: "victim", networkId: "tron", txHash: "0x123", amountUsd: 1000 }),
  });
  const unconfiguredRes = await cryptoWebhookPOST(unconfiguredReq);
  assert.equal(
    unconfiguredRes.status,
    503,
    "Unconfigured webhook must fail closed with 503 Service Unavailable"
  );

  // Case B: Secret configured, but request has invalid/missing token
  process.env.CRYPTO_WEBHOOK_SECRET = "super-secret-crypto-webhook-key-2026";
  const unauthorizedReq = new NextRequest("http://localhost:3000/api/webhooks/crypto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer wrong-token",
    },
    body: JSON.stringify({ userId: "victim", networkId: "tron", txHash: "0x123", amountUsd: 1000 }),
  });
  const unauthorizedRes = await cryptoWebhookPOST(unauthorizedReq);
  assert.equal(unauthorizedRes.status, 401, "Invalid bearer token must receive 401");

  // Restore environment
  if (originalSecret) {
    process.env.CRYPTO_WEBHOOK_SECRET = originalSecret;
  } else {
    delete process.env.CRYPTO_WEBHOOK_SECRET;
  }
  console.log("  ✓ Crypto webhook securely fails closed (503) when secret unset, and strictly enforces 401 on invalid token.");

  console.log("\n🎉 All Phase 4 Authorization & Access Control verification tests passed with 100% success!");
}

runPhase4Tests().catch((err) => {
  console.error("❌ Phase 4 test failed:", err);
  process.exit(1);
});

