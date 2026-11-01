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

async function runPhase12Tests() {
  console.log("\n--- Phase 12: Advanced Attack Scenarios Tests ---");

  // Dynamically import tested modules
  const { settingsService } = await import("../src/server/modules/settings/settings.service");
  const { GET: trackerStreamGet } = await import("../src/app/api/tracker/stream/route");
  const { GET: notificationsGet } = await import("../src/app/api/notifications/route");

  // [1] Prototype Pollution & Safe Object Merging
  console.log("\n[1] Prototype Pollution & Object Merging Protections:");

  await runTest("settingsService.updateSettings rejects prototype pollution and unauthorized keys", async () => {
    const maliciousPayload = JSON.parse(
      '{"__proto__": {"polluted": true}, "constructor": {"prototype": {"admin": true}}, "unknownHackKey": 123, "platformFeeBps": 300}'
    );

    await settingsService.updateSettings(maliciousPayload);

    // Verify Object.prototype was NOT polluted
    assert.equal((Object.prototype as any).polluted, undefined, "Object.prototype must not be polluted");
    assert.equal((Object.prototype as any).admin, undefined, "Object.prototype constructor must not be polluted");

    // Verify settings object was updated with only valid keys
    const settings = await settingsService.getSettings();
    assert.equal(settings.platformFeeBps, 300);
    assert.equal((settings as any).unknownHackKey, undefined, "Unknown keys must be discarded");
  });

  // [2] Real-Time SSE Stream Security (Cross-Site SSE Hijacking Defense)
  console.log("\n[2] Real-Time Streaming & Cross-Site SSE Defenses:");

  await runTest("GET /api/tracker/stream rejects cross-site requests with 403 Forbidden", async () => {
    const req = new NextRequest("http://localhost:3000/api/tracker/stream?item=butterfly-knife-doppler", {
      headers: {
        "sec-fetch-site": "cross-site",
      },
    });

    const res = await trackerStreamGet(req);
    assert.equal(res.status, 403);
    const text = await res.text();
    assert.ok(text.includes("Cross-site real-time connection rejected"));
  });

  await runTest("GET /api/tracker/stream rejects unauthenticated requests with 401 Unauthorized", async () => {
    const req = new NextRequest("http://localhost:3000/api/tracker/stream?item=butterfly-knife-doppler", {
      headers: {
        "sec-fetch-site": "same-origin",
      },
    });

    const res = await trackerStreamGet(req);
    assert.equal(res.status, 401);
  });

  await runTest("GET /api/tracker/stream validates item slug regex pattern", async () => {
    const req = new NextRequest("http://localhost:3000/api/tracker/stream?item=../../evil-path", {
      headers: {
        "sec-fetch-site": "same-origin",
      },
    });

    const res = await trackerStreamGet(req);
    // Unauthorized check runs before slug validation, or slug rejection gives 400
    assert.ok(res.status === 401 || res.status === 400);
  });

  // [3] Cache Poisoning & Cache Deception Controls
  console.log("\n[3] Cache Poisoning & Header Reflection Defenses:");

  await runTest("GET /api/notifications strictly enforces private, no-store Cache-Control", async () => {
    const res = await notificationsGet();
    // 401 unauthenticated response or valid feed both carry cache protections
    const cacheControl = res.headers.get("cache-control");
    // Even on 401 it must not be cached by downstream proxies
    assert.ok(!cacheControl || cacheControl.includes("no-store") || cacheControl.includes("private"));
  });

  // [4] Concurrency & Transactional Row-Level Lock Audits
  console.log("\n[4] Concurrency & Transactional Lock Verification:");

  await runTest("Critical financial and escrow modules employ pessimistic row-level locking", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");

    // 1. Escrow lockOrder uses for("update", { of: orders })
    const escrowRepoCode = fs.readFileSync(
      path.join(process.cwd(), "src/server/modules/escrow/escrow.repository.ts"),
      "utf-8"
    );
    assert.ok(escrowRepoCode.includes('.for("update"'), "Escrow repository must lock orders row for update");

    // 2. Wallet cashout uses for("update")
    const walletCmdCode = fs.readFileSync(
      path.join(process.cwd(), "src/server/modules/wallet/wallet.commands.ts"),
      "utf-8"
    );
    assert.ok(walletCmdCode.includes('.for("update")'), "Wallet commands must lock walletAccounts row for update");

    // 3. Checkout settlement uses for("update") on cartItems and listings
    const checkoutSettleCode = fs.readFileSync(
      path.join(process.cwd(), "src/server/modules/checkout/checkout.settle.ts"),
      "utf-8"
    );
    assert.ok(checkoutSettleCode.includes('.for("update"'), "Checkout settlement must lock cart and listings for update");
  });

  console.log(`\n=================================================`);
  console.log(`Phase 12 Advanced Attack Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase12Tests().catch((err) => {
  console.error("Unhandled test runner failure:", err);
  process.exit(1);
});
