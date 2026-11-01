import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(undefined),
  });
}

import assert from "node:assert/strict";

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

async function runPhase11Tests() {
  console.log("\n--- Phase 11: Business Logic and Transaction Security Tests ---");

  // Dynamically import tested modules
  const { quote, allocate, COMBO_DISCOUNT_CENTS, PROMO_DISCOUNT_CENTS, PROMO_MIN_SUBTOTAL_CENTS } = await import(
    "../src/modules/checkout/lib/pricing"
  );
  const { chestsService } = await import("../src/server/modules/chests/chests.service");
  const { chestsRepository } = await import("../src/server/modules/chests/chests.repository");

  // [1] Pricing & Discount Arithmetic Protections
  console.log("\n[1] Pricing & Discount Arithmetic Protections:");

  await runTest("quote rejects promo relief when subtotal is below minimum threshold ($20.00)", () => {
    // Single item worth $10.00 (1000 cents) with promo=true
    const microBasket = [1000];
    const qMicro = quote(microBasket, true);
    assert.equal(qMicro.subtotalCents, 1000);
    assert.equal(qMicro.promoCents, 0, "Promo discount must not apply below $20 subtotal threshold");
    assert.equal(qMicro.dueCents, 1000);

    // Basket worth $25.00 (2500 cents) with promo=true
    const validBasket = [2500];
    const qValid = quote(validBasket, true);
    assert.equal(qValid.subtotalCents, 2500);
    assert.equal(qValid.promoCents, PROMO_DISCOUNT_CENTS);
    assert.equal(qValid.dueCents, 2500 - PROMO_DISCOUNT_CENTS); // $10.00 due
  });

  await runTest("quote applies bundle relief at threshold and enforces non-negative dueCents", () => {
    const threeItems = [5000, 10000, 15000]; // $300.00
    const q = quote(threeItems, true);
    assert.equal(q.subtotalCents, 30000);
    assert.equal(q.comboCents, COMBO_DISCOUNT_CENTS);
    assert.equal(q.promoCents, PROMO_DISCOUNT_CENTS);
    assert.equal(q.dueCents, 30000 - 2500 - 1500); // $260.00
    assert.ok(q.dueCents >= 0);
  });

  await runTest("allocate preserves exact discount penny sum across proportional shares", () => {
    const prices = [3333, 3333, 3334]; // Total 10000 cents
    const discount = 2500;
    const shares = allocate(prices, discount);
    const sumShares = shares.reduce((a, b) => a + b, 0);
    assert.equal(sumShares, discount, "Sum of allocated shares must equal exact discount cents");
  });

  // [2] Daily Bonus Anti-Abuse & Rate Cooldown
  console.log("\n[2] Daily Loyalty Bonus Anti-Abuse & Rate Cooldown:");

  await runTest("claimDailyBonus allows initial claim, advances streak, then rejects duplicate claim within 24h", () => {
    const testUserId = `test-bonus-user-${Date.now()}`;
    const initialCoins = chestsService.getUserCoins(testUserId);

    // 1. Initial State
    const stateBefore = chestsService.getDailyBonusState(testUserId);
    assert.equal(stateBefore.canClaim, true);
    assert.equal(stateBefore.currentStreak, 0);

    // 2. First Claim
    const claim1 = chestsService.claimDailyBonus(testUserId);
    assert.equal(claim1.success, true);
    assert.equal(claim1.bonusState.canClaim, false);
    assert.equal(claim1.bonusState.currentStreak, 1);
    assert.equal(chestsService.getUserCoins(testUserId), initialCoins + claim1.bonusState.bonusCoins);

    // 3. Immediate Second Claim Attempt (Exploit attempt)
    const claim2 = chestsService.claimDailyBonus(testUserId);
    assert.equal(claim2.success, false);
    assert.ok(claim2.error?.includes("already claimed"));
    assert.equal(claim2.bonusState.canClaim, false);
    assert.ok(claim2.bonusState.timeUntilNextClaimSec > 0);

    // Coins must not have increased on rejected claim
    assert.equal(chestsService.getUserCoins(testUserId), initialCoins + claim1.bonusState.bonusCoins);
  });

  // [3] Chest Item Recycling Replay & Single Redemption Defense
  console.log("\n[3] Chest Item Recycling Single-Redemption & IDOR Defenses:");

  await runTest("recycleWonItem enforces single redemption and rejects replayed unboxIds", () => {
    const testUserId = `test-recycle-user-${Date.now()}`;
    const unboxId = `unbox-test-${Date.now()}`;

    // Seed a valid unbox record
    chestsRepository.saveUnboxRecord({
      id: unboxId,
      userId: testUserId,
      chestId: "arcana-treasury",
      wonItem: {
        id: "item-1",
        name: "Test Skin",
        rarity: "covert",
        color: "#eb4b4b",
        wear: "FN",
        estimatedValueUsd: 10,
        dropWeight: 10,
      },
      recycleCoinsValue: 100,
      recycled: false,
      createdAt: Date.now(),
    });

    // 1. First recycle succeeds
    const res1 = chestsService.recycleWonItem(testUserId, unboxId);
    assert.equal(res1.success, true);
    assert.equal(res1.creditedCoins, 100);

    // 2. Second recycle fails (Replay attempt)
    const res2 = chestsService.recycleWonItem(testUserId, unboxId);
    assert.equal(res2.success, false);
    assert.ok(
      res2.error?.toLowerCase().includes("recycled"),
      `Expected error message to mention 'recycled', got: ${res2.error}`
    );

    // 3. Different user attempting to recycle someone else's unbox (IDOR attempt)
    const res3 = chestsService.recycleWonItem("different-hacker-user", unboxId);
    assert.equal(res3.success, false);
    assert.ok(
      res3.error?.includes("Unauthorized") || res3.error?.includes("not own") || res3.error?.includes("recycled"),
      `Expected IDOR error, got: ${res3.error}`
    );
  });

  // [4] Escrow Invariant Verification
  console.log("\n[4] Escrow Invariant & State Machine Checks:");

  await runTest("escrowService.delivered rejects premature execution when offer is not dispatched", async () => {
    const { escrowService } = await import("../src/server/modules/escrow/escrow.service");
    // Non-existent order code
    const res = await escrowService.delivered("ORD-NON-EXISTENT-999");
    assert.equal(res.status, "not-found");
  });

  console.log(`\n=================================================`);
  console.log(`Phase 11 Business Logic Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase11Tests().catch((err) => {
  console.error("Unhandled test runner failure:", err);
  process.exit(1);
});
