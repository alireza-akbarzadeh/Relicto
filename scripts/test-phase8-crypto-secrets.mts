import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(undefined),
  });
}

import assert from "node:assert/strict";
import * as crypto from "node:crypto";
import { NextRequest } from "next/server";

let passed = 0;
let total = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  total++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✓ ${name}`);
          passed++;
        })
        .catch((err) => {
          console.error(`  ✗ ${name}`);
          console.error(`    ${err instanceof Error ? err.message : String(err)}`);
        });
    }
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function runPhase8Tests() {
  console.log("\n--- Phase 8: Cryptographic Practices & Secrets Management Tests ---");

  // Dynamically import modules after React.createContext is polyfilled
  const { bearerMatches } = await import("../src/server/modules/shared/bearer");
  const {
    calculateProvablyFairFraction,
    executeChestRoll,
  } = await import("../src/server/modules/chests/chests.algorithm");
  const { deriveUserDepositAddress } = await import("../src/server/modules/crypto/crypto-gateway.service");
  const { POST: stripeWebhookPost } = await import("../src/app/api/webhooks/stripe/route");
  const { POST: checkoutStripeWebhookPost } = await import("../src/app/api/checkout/stripe/webhook/route");

  // SECTION 1: Constant-Time Token & Bearer Authentication Checks
  console.log("\n[1] Constant-Time Secret Matching (Timing Attack Defense):");

  runTest("bearerMatches accepts exact matching bearer token", () => {
    const secret = "relicto_super_secret_webhook_key_12345";
    assert.equal(bearerMatches(`Bearer ${secret}`, secret), true);
  });

  runTest("bearerMatches rejects incorrect secret of identical length", () => {
    const secret = "relicto_super_secret_webhook_key_12345";
    const attack = "relicto_super_secret_webhook_key_12346";
    assert.equal(bearerMatches(`Bearer ${attack}`, secret), false);
  });

  runTest("bearerMatches compares hashed tokens in constant time without length leakage", () => {
    const secret = "relicto_secret_token";
    const short = "short";
    const long = "this_is_an_extremely_long_injected_string_designed_to_profile_string_lengths";
    assert.equal(bearerMatches(`Bearer ${short}`, secret), false);
    assert.equal(bearerMatches(`Bearer ${long}`, secret), false);
    assert.equal(bearerMatches(null, secret), false);
    assert.equal(bearerMatches("", secret), false);
  });

  // SECTION 2: Provably Fair Cryptographic RNG Verification
  console.log("\n[2] Provably Fair Cryptographic RNG (HMAC-SHA256):");

  runTest("calculateProvablyFairFraction returns deterministic float in [0, 1)", () => {
    const sSeed = "a6c8e3f4b2d1847592c019485720184758291039485720194857201948572019";
    const cSeed = "trader_lucky_seed_777";
    const frac1 = calculateProvablyFairFraction(sSeed, cSeed, "base");
    const frac2 = calculateProvablyFairFraction(sSeed, cSeed, "base");

    assert.ok(frac1 >= 0 && frac1 < 1.0, "Fraction must be bounded in [0, 1)");
    assert.equal(frac1, frac2, "HMAC-SHA256 roll fraction must be strictly deterministic");
  });

  runTest("executeChestRoll produces verified HMAC-SHA256 rollHash and reproducible drop", () => {
    const mockItems = [
      { id: "item-1", name: "Common Blade", rarity: "common" as const, baseOddsPct: 80, valueUsd: 1 },
      { id: "item-2", name: "Rare Rapier", rarity: "rare" as const, baseOddsPct: 20, valueUsd: 10 },
      { id: "item-3", name: "Ultra Arcana", rarity: "arcana" as const, baseOddsPct: 1, valueUsd: 100, isEscalatingBonus: true },
    ];

    const roll = executeChestRoll("test-chest", mockItems, 0, "verified-client-seed-99");
    assert.ok(roll.wonItem, "Must draw guaranteed item");
    assert.ok(roll.serverSeed, "Must expose server seed for post-reveal verification");
    assert.equal(roll.rollSeed, "verified-client-seed-99");

    // Cryptographic audit: verify rollHash matches HMAC-SHA256(serverSeed, rollSeed)
    const expectedHash = crypto.createHmac("sha256", roll.serverSeed).update(roll.rollSeed).digest("hex");
    assert.equal(roll.rollHash, expectedHash, "rollHash must match HMAC-SHA256 signature");

    // Verify determinism: re-calculating fraction yields the exact same wonItem
    const totalWeight = 80 + 20;
    const recomputedFraction = calculateProvablyFairFraction(roll.serverSeed, roll.rollSeed, "base");
    const recomputedVal = recomputedFraction * totalWeight;
    const expectedItem = recomputedVal <= 80 ? mockItems[0] : mockItems[1];
    assert.equal(roll.wonItem.id, expectedItem.id, "Provably fair item outcome must be 100% reproducible");
  });

  // SECTION 3: Cryptographic Master Seed & Address Derivation
  console.log("\n[3] Master Vault Seed & Address Derivation Security:");

  runTest("deriveUserDepositAddress generates deterministic addresses without collisions", () => {
    const tronNetwork = {
      id: "usdt-trc20",
      name: "TRON",
      asset: "usdt" as const,
      symbol: "USDT",
      usdRate: 1,
      decimals: 6,
      depositAddress: "T...",
      type: "tron" as const,
      badge: "TRON",
    };

    const addrAlice = deriveUserDepositAddress("trader-alice", tronNetwork);
    const addrAliceRepeat = deriveUserDepositAddress("trader-alice", tronNetwork);
    const addrBob = deriveUserDepositAddress("trader-bob", tronNetwork);

    assert.equal(addrAlice, addrAliceRepeat, "Same user on same network must yield identical deterministic address");
    assert.notEqual(addrAlice, addrBob, "Distinct users must yield distinct addresses without cross-talk");
    assert.ok(addrAlice.startsWith("T"), "TRON address must start with T prefix");
  });

  // SECTION 4: Stripe Webhook Fail-Closed Configuration
  console.log("\n[4] Stripe Webhook Secret Fail-Closed Protections:");

  await runTest("POST /api/webhooks/stripe returns 503 when STRIPE_WEBHOOK_SECRET is unconfigured", async () => {
    const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        headers: { "stripe-signature": "t=123,v1=abcdef" },
      });

      const res = await stripeWebhookPost(req);
      assert.equal(res.status, 503, "Must fail closed with 503 when secret is unconfigured");
    } finally {
      if (originalSecret) process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
    }
  });

  await runTest("POST /api/checkout/stripe/webhook returns 503 when STRIPE_WEBHOOK_SECRET is unconfigured", async () => {
    const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const req = new NextRequest("http://localhost:3000/api/checkout/stripe/webhook", {
        method: "POST",
        headers: { "stripe-signature": "t=123,v1=abcdef" },
      });

      const res = await checkoutStripeWebhookPost(req);
      assert.equal(res.status, 503, "Must fail closed with 503 when secret is unconfigured");
    } finally {
      if (originalSecret) process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
    }
  });

  console.log(`\n=================================================`);
  console.log(`Phase 8 Cryptography & Secrets Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

void runPhase8Tests();

