import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(undefined),
  });
}

import assert from "node:assert/strict";
import { NextRequest } from "next/server";

let passed = 0;
let total = 0;

async function runTest(name: string, fn: () => void | Promise<void>) {
  total++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function runPhase10Tests() {
  console.log("\n--- Phase 10: SSRF, External Integrations & Webhooks Tests ---");

  // Dynamically import tested modules
  const { fetchSteamInventory } = await import("../src/lib/steam/inventory");
  const { fetchSteamPersona } = await import("../src/lib/steam/openid");
  const { fetchSkinportQuotes } = await import("../src/lib/prices/skinport");
  const { storageService } = await import("../src/server/modules/storage/storage.service");
  const { cryptoWebhookInputSchema } = await import("../src/server/modules/crypto/crypto.schema");
  const { POST: stripeWebhookPost } = await import("../src/app/api/webhooks/stripe/route");
  const { POST: checkoutStripeWebhookPost } = await import("../src/app/api/checkout/stripe/webhook/route");
  const { POST: cryptoWebhookPost } = await import("../src/app/api/webhooks/crypto/route");

  // [1] SSRF & Outbound Path Protections
  console.log("\n[1] SSRF & Outbound Path Protections:");

  await runTest("fetchSteamInventory rejects path traversal and non-17-digit SteamIDs", async () => {
    const r1 = await fetchSteamInventory("../admin", 730);
    assert.equal(r1.status, "unavailable");

    const r2 = await fetchSteamInventory("7656119808234881", 730); // 16 digits
    assert.equal(r2.status, "unavailable");

    const r3 = await fetchSteamInventory("765611980823488190", 730); // 18 digits
    assert.equal(r3.status, "unavailable");

    const r4 = await fetchSteamInventory("76561198082348819/test", 730);
    assert.equal(r4.status, "unavailable");
  });

  await runTest("fetchSteamInventory rejects non-integer or negative appIds", async () => {
    const r1 = await fetchSteamInventory("76561198082348819", -1);
    assert.equal(r1.status, "unavailable");

    const r2 = await fetchSteamInventory("76561198082348819", 730.5);
    assert.equal(r2.status, "unavailable");
  });

  await runTest("fetchSteamPersona validates steamId format before any network dispatch", async () => {
    const r1 = await fetchSteamPersona("../../evil");
    assert.equal(r1.avatar, null);
    assert.equal(r1.name, "Steam trader");

    const r2 = await fetchSteamPersona("not-a-number");
    assert.equal(r2.avatar, null);
    assert.equal(r2.name, "Steam trader");
  });

  await runTest("fetchSkinportQuotes rejects invalid non-integer or negative appIds", async () => {
    const r1 = await fetchSkinportQuotes(-730);
    assert.equal(r1, null);

    const r2 = await fetchSkinportQuotes(730.9);
    assert.equal(r2, null);
  });

  await runTest("storageService.syncSteamAvatar enforces HTTPS and Steam CDN host whitelist (SSRF Defense)", async () => {
    // 1. Plaintext HTTP
    await assert.rejects(
      () => storageService.syncSteamAvatar("76561198082348819", "http://avatars.steamstatic.com/avatar.jpg"),
      /must use HTTPS/
    );

    // 2. Cloud metadata IP (AWS/GCP SSRF)
    await assert.rejects(
      () => storageService.syncSteamAvatar("76561198082348819", "https://169.254.169.254/latest/meta-data"),
      /Untrusted Steam avatar CDN origin/
    );

    // 3. Localhost loopback SSRF
    await assert.rejects(
      () => storageService.syncSteamAvatar("76561198082348819", "https://127.0.0.1:8080/internal"),
      /Untrusted Steam avatar CDN origin/
    );

    // 4. Arbitrary untrusted origin
    await assert.rejects(
      () => storageService.syncSteamAvatar("76561198082348819", "https://evil-attacker.com/avatar.jpg"),
      /Untrusted Steam avatar CDN origin/
    );
  });

  // [2] Inbound Webhook Authentication & Fail-Closed Protections
  console.log("\n[2] Inbound Webhook Authentication & Fail-Closed Protections:");

  await runTest("Stripe webhooks reject requests missing stripe-signature header with 400", async () => {
    const req1 = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });
    const res1 = await stripeWebhookPost(req1);
    assert.equal(res1.status, 400);

    const req2 = new NextRequest("http://localhost:3000/api/checkout/stripe/webhook", {
      method: "POST",
      body: JSON.stringify({ type: "checkout.session.completed" }),
    });
    const res2 = await checkoutStripeWebhookPost(req2);
    assert.equal(res2.status, 400);
  });

  await runTest("Crypto webhook rejects missing or invalid bearer token with 401", async () => {
    const prevSecret = process.env.CRYPTO_WEBHOOK_SECRET;
    process.env.CRYPTO_WEBHOOK_SECRET = "super_secure_webhook_secret_key_123456789";

    try {
      // 1. Missing header
      const req1 = new NextRequest("http://localhost:3000/api/webhooks/crypto", {
        method: "POST",
        body: JSON.stringify({ userId: "u1", networkId: "usdt-trc20", txHash: "0x123456789012345678901234567890", amountUsd: 50 }),
      });
      const res1 = await cryptoWebhookPost(req1);
      assert.equal(res1.status, 401);

      // 2. Invalid bearer token
      const req2 = new NextRequest("http://localhost:3000/api/webhooks/crypto", {
        method: "POST",
        headers: { authorization: "Bearer wrong_secret_token" },
        body: JSON.stringify({ userId: "u1", networkId: "usdt-trc20", txHash: "0x123456789012345678901234567890", amountUsd: 50 }),
      });
      const res2 = await cryptoWebhookPost(req2);
      assert.equal(res2.status, 401);
    } finally {
      process.env.CRYPTO_WEBHOOK_SECRET = prevSecret;
    }
  });

  // [3] Webhook Schema Validation & Replay Defense
  console.log("\n[3] Webhook Schema Validation & Replay Defense:");

  await runTest("cryptoWebhookInputSchema strictly neutralizes NaN, negative, infinite, and malformed inputs", () => {
    // 1. NaN amount
    const rNan = cryptoWebhookInputSchema.safeParse({
      userId: "user-1",
      networkId: "usdt-trc20",
      txHash: "0x123456789012345678901234567890",
      amountUsd: NaN,
    });
    assert.equal(rNan.success, false);

    // 2. Negative amount
    const rNeg = cryptoWebhookInputSchema.safeParse({
      userId: "user-1",
      networkId: "usdt-trc20",
      txHash: "0x123456789012345678901234567890",
      amountUsd: -500,
    });
    assert.equal(rNeg.success, false);

    // 3. Infinity amount
    const rInf = cryptoWebhookInputSchema.safeParse({
      userId: "user-1",
      networkId: "usdt-trc20",
      txHash: "0x123456789012345678901234567890",
      amountUsd: Infinity,
    });
    assert.equal(rInf.success, false);

    // 4. Invalid networkId
    const rNet = cryptoWebhookInputSchema.safeParse({
      userId: "user-1",
      networkId: "doge-unsupported",
      txHash: "0x123456789012345678901234567890",
      amountUsd: 50,
    });
    assert.equal(rNet.success, false);

    // 5. Valid payload
    const rValid = cryptoWebhookInputSchema.safeParse({
      userId: "user-1",
      networkId: "usdt-trc20",
      txHash: "0x123456789012345678901234567890",
      amountUsd: 150,
    });
    assert.equal(rValid.success, true);
  });

  await runTest("Crypto webhook endpoint returns 400 when payload violates schema", async () => {
    const prevSecret = process.env.CRYPTO_WEBHOOK_SECRET;
    const testSecret = "test_webhook_secret_key_abcdef123456789";
    process.env.CRYPTO_WEBHOOK_SECRET = testSecret;

    try {
      const req = new NextRequest("http://localhost:3000/api/webhooks/crypto", {
        method: "POST",
        headers: { authorization: `Bearer ${testSecret}` },
        body: JSON.stringify({
          userId: "user-1",
          networkId: "usdt-trc20",
          txHash: "0x123456789012345678901234567890",
          amountUsd: -100, // Negative amount exploit
        }),
      });
      const res = await cryptoWebhookPost(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.error, "invalid_payload");
    } finally {
      process.env.CRYPTO_WEBHOOK_SECRET = prevSecret;
    }
  });

  console.log(`\n=================================================`);
  console.log(`Phase 10 Integrations Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase10Tests().catch((err) => {
  console.error("Unhandled test runner failure:", err);
  process.exit(1);
});

