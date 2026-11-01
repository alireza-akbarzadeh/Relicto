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

async function runAllTests() {
  console.log("\n--- Phase 5: Server-Side Validation & Input Security Tests ---");

  // Dynamically import modules after React.createContext is polyfilled
  const {
    openChestInput,
    recycleChestItemInput,
    buyCoinsInput,
    simulateChestInput,
    chestSlugSchema,
  } = await import("../src/server/modules/chests/chests.schema");

  const {
    createCheckoutStripeSessionInput,
  } = await import("../src/server/modules/checkout/checkout.schema");

  const {
    createWalletStripeSessionInput,
    cashoutInput,
    depositInput,
  } = await import("../src/server/modules/wallet/wallet.schema");

  const {
    copilotChatInputSchema,
  } = await import("../src/modules/copilot/copilot.schema");

  const {
    cryptoVerifyInputSchema,
    tronVerifyInputSchema,
  } = await import("../src/server/modules/crypto/crypto.schema");

  const { chestsRepository } = await import("../src/server/modules/chests/chests.repository");
  const { chestsService } = await import("../src/server/modules/chests/chests.service");
  const { chargeWalletAction } = await import("../src/modules/dashboard/actions/charge-wallet");

  // SECTION 1: Item Recycle & Provenance Security (SEC-007 / CWE-602)
  console.log("\n[1] Item Recycle & Provenance Security:");

  runTest("Recycle payload schema rejects legacy client-supplied coinsValue without unboxId", () => {
    const res = recycleChestItemInput.safeParse({ coinsValue: 999999 });
    assert.equal(res.success, false);
  });

  runTest("Recycle payload schema accepts valid unboxId", () => {
    const res = recycleChestItemInput.safeParse({ unboxId: "unbox-1700000000-abc12" });
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.unboxId, "unbox-1700000000-abc12");
    }
  });

  runTest("Recycle payload schema rejects extra unexpected fields (strictness)", () => {
    const res = recycleChestItemInput.safeParse({ unboxId: "unbox-1", coinsValue: 500 });
    assert.equal(res.success, false);
  });

  runTest("chestsService.recycleWonItem rejects non-existent or forged unboxId", () => {
    const result = chestsService.recycleWonItem("trader-test-1", "fake-unbox-id-999");
    assert.equal(result.success, false);
    assert.match(result.error || "", /Unbox record not found/);
  });

  runTest("chestsService.recycleWonItem enforces IDOR defense (cannot recycle another trader's drop)", () => {
    const testUnboxId = `unbox-test-idor-${Date.now()}`;
    chestsRepository.saveUnboxRecord({
      id: testUnboxId,
      userId: "trader-owner-alice",
      chestId: "arcana-treasury",
      wonItem: {
        id: "item-1",
        name: "Dragonclaw Hook",
        rarity: "immortal",
        baseOddsPct: 0.1,
        valueUsd: 150,
      },
      recycleCoinsValue: 12750, // 85% of 15000 RC
      recycled: false,
      createdAt: Date.now(),
    });

    // Bob tries to recycle Alice's drop
    const bobAttempt = chestsService.recycleWonItem("trader-attacker-bob", testUnboxId);
    assert.equal(bobAttempt.success, false);
    assert.match(bobAttempt.error || "", /do not own/);

    // Alice recycles her own drop
    const aliceInitialCoins = chestsRepository.getUserCoins("trader-owner-alice");
    const aliceAttempt = chestsService.recycleWonItem("trader-owner-alice", testUnboxId);
    assert.equal(aliceAttempt.success, true);
    assert.equal(aliceAttempt.creditedCoins, 12750);
    assert.equal(aliceAttempt.newBalance, aliceInitialCoins + 12750);

    // Attempt double-spend / replay on same unbox
    const doubleAttempt = chestsService.recycleWonItem("trader-owner-alice", testUnboxId);
    assert.equal(doubleAttempt.success, false);
    assert.match(doubleAttempt.error || "", /already been recycled/);
  });

  // SECTION 2: Numeric Type-Juggling & NaN Bypass Defenses
  console.log("\n[2] Numeric Type-Juggling & NaN Bypass Defenses:");

  await runTest("chargeWalletAction safely rejects NaN input without evaluation bypass", async () => {
    const res = await chargeWalletAction({ rail: "cards", amountUsd: NaN });
    assert.equal(res.success, false);
  });

  await runTest("chargeWalletAction safely rejects Infinity input", async () => {
    const res = await chargeWalletAction({ rail: "cards", amountUsd: Infinity });
    assert.equal(res.success, false);
  });

  await runTest("chargeWalletAction safely rejects negative or zero amounts", async () => {
    const negRes = await chargeWalletAction({ rail: "cards", amountUsd: -50 });
    assert.equal(negRes.success, false);

    const zeroRes = await chargeWalletAction({ rail: "cards", amountUsd: 0 });
    assert.equal(zeroRes.success, false);
  });

  runTest("createWalletStripeSessionInput rejects NaN, Infinity, negative, and out-of-bound values", () => {
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: NaN }).success, false);
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: Infinity }).success, false);
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: -100 }).success, false);
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: 5 }).success, false); // < $10
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: 15_000 }).success, false); // > $10,000
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: "100" }).success, false); // string type
    assert.equal(createWalletStripeSessionInput.safeParse({ amountUsd: 100 }).success, true);
  });

  runTest("depositInput and cashoutInput enforce finite numbers", () => {
    assert.equal(depositInput.safeParse({ rail: "cards", amountUsd: Infinity }).success, false);
    assert.equal(cashoutInput.safeParse({ rail: "usdt", amountUsd: Infinity }).success, false);
    assert.equal(depositInput.safeParse({ rail: "cards", amountUsd: 100 }).success, true);
  });

  // SECTION 3: Basket, Checkout & Array Overflow Defenses
  console.log("\n[3] Basket, Checkout & Array Overflow Defenses:");

  runTest("createCheckoutStripeSessionInput rejects empty cart array", () => {
    const res = createCheckoutStripeSessionInput.safeParse({ cartIds: [] });
    assert.equal(res.success, false);
  });

  runTest("createCheckoutStripeSessionInput rejects oversized cart array (> 50 items)", () => {
    const oversized = Array.from({ length: 51 }, (_, i) => `item-${i}`);
    const res = createCheckoutStripeSessionInput.safeParse({ cartIds: oversized });
    assert.equal(res.success, false);
  });

  runTest("createCheckoutStripeSessionInput rejects non-string cart items", () => {
    const res = createCheckoutStripeSessionInput.safeParse({ cartIds: [123, null, { id: "a" }] });
    assert.equal(res.success, false);
  });

  runTest("createCheckoutStripeSessionInput rejects unknown injected properties", () => {
    const res = createCheckoutStripeSessionInput.safeParse({
      cartIds: ["item-1"],
      promo: true,
      priceOverride: 0.01, // attempted tampering
    });
    assert.equal(res.success, false);
  });

  // SECTION 4: Copilot AI Input & Model Whitelist Defenses
  console.log("\n[4] Copilot AI Input & Model Whitelist Defenses:");

  runTest("copilotChatInputSchema rejects empty or whitespace-only messages", () => {
    assert.equal(copilotChatInputSchema.safeParse({ message: "" }).success, false);
    assert.equal(copilotChatInputSchema.safeParse({ message: "   \n\t  " }).success, false);
  });

  runTest("copilotChatInputSchema rejects messages exceeding length limits (> 2000 chars)", () => {
    const giant = "A".repeat(2001);
    const res = copilotChatInputSchema.safeParse({ message: giant });
    assert.equal(res.success, false);
  });

  runTest("copilotChatInputSchema rejects unwhitelisted modelOverride injection", () => {
    const res = copilotChatInputSchema.safeParse({
      message: "Explain float value",
      modelOverride: "evil-untrusted-model-ai",
    });
    assert.equal(res.success, false);
  });

  runTest("copilotChatInputSchema accepts legitimate messages and whitelisted models", () => {
    const res = copilotChatInputSchema.safeParse({
      message: "What is the float value of Doppler Phase 2?",
      modelOverride: "gemini-3.8-flash",
    });
    assert.equal(res.success, true);
  });

  // SECTION 5: Chest Operations & Parameter Validation
  console.log("\n[5] Chest Operations & Parameter Validation:");

  runTest("chestSlugSchema rejects path traversal and special characters", () => {
    assert.equal(chestSlugSchema.safeParse("../../etc/passwd").success, false);
    assert.equal(chestSlugSchema.safeParse("<script>alert(1)</script>").success, false);
    assert.equal(chestSlugSchema.safeParse("chest; DROP TABLE chests;").success, false);
    assert.equal(chestSlugSchema.safeParse("arcana-treasury").success, true);
  });

  runTest("openChestInput rejects negative or float splitCoinAmount", () => {
    assert.equal(openChestInput.safeParse({ splitCoinAmount: -100 }).success, false);
    assert.equal(openChestInput.safeParse({ splitCoinAmount: 12.34 }).success, false);
    assert.equal(openChestInput.safeParse({ splitCoinAmount: 500 }).success, true);
  });

  runTest("openChestInput rejects invalid paymentMethod", () => {
    assert.equal(openChestInput.safeParse({ paymentMethod: "free_admin_bypass" }).success, false);
    assert.equal(openChestInput.safeParse({ paymentMethod: "coins" }).success, true);
  });

  runTest("simulateChestInput bounds simulation roll counts between 1 and 10,000", () => {
    assert.equal(simulateChestInput.safeParse({ count: -5 }).success, false);
    assert.equal(simulateChestInput.safeParse({ count: 50_000 }).success, false);
    assert.equal(simulateChestInput.safeParse({ count: 500 }).success, true);
  });

  // SECTION 6: Crypto Gateway Verification Schemas
  console.log("\n[6] Crypto Gateway Verification Schemas:");

  runTest("cryptoVerifyInputSchema validates network, txHash and amounts", () => {
    assert.equal(cryptoVerifyInputSchema.safeParse({ networkId: "invalid", txHash: "123", amountUsd: 10 }).success, false);
    assert.equal(cryptoVerifyInputSchema.safeParse({ networkId: "usdt-trc20", txHash: "short", amountUsd: 10 }).success, false);
    assert.equal(cryptoVerifyInputSchema.safeParse({ networkId: "usdt-trc20", txHash: "a".repeat(64), amountUsd: -10 }).success, false);
    assert.equal(cryptoVerifyInputSchema.safeParse({ networkId: "usdt-trc20", txHash: "a".repeat(64), amountUsd: 100 }).success, true);
  });

  runTest("tronVerifyInputSchema strictly validates hex txid and positive amounts", () => {
    assert.equal(tronVerifyInputSchema.safeParse({ txHash: "not-a-hex!@#$", amountUsd: 50 }).success, false);
    assert.equal(tronVerifyInputSchema.safeParse({ txHash: "e".repeat(64), amountUsd: NaN }).success, false);
    assert.equal(tronVerifyInputSchema.safeParse({ txHash: "e".repeat(64), amountUsd: 50 }).success, true);
  });

  console.log(`\n=================================================`);
  console.log(`Phase 5 Validation Results: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

void runAllTests();
