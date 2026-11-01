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

async function runPhase7Tests() {
  console.log("\n--- Phase 7: Session Management, CSRF & State Security Tests ---");

  // Dynamically import modules after React.createContext is polyfilled
  const { auth } = await import("../src/lib/auth");
  const { verifyCsrf } = await import("../src/server/modules/auth/csrf.guard");
  const { POST: recyclePost } = await import("../src/app/api/chests/recycle/route");
  const { POST: openChestPost } = await import("../src/app/api/chests/[slug]/open/route");
  const { PUT: chestPut, DELETE: chestDelete } = await import("../src/app/api/chests/[slug]/route");

  // SECTION 1: Session Lifetime & Cookie Security Configurations
  console.log("\n[1] Session Lifetime & Cookie Security Configurations:");

  runTest("Better Auth configures explicit 7-day session lifetime (expiresIn)", () => {
    assert.equal(auth.options.session?.expiresIn, 60 * 60 * 24 * 7);
  });

  runTest("Better Auth configures 24-hour session refresh interval (updateAge)", () => {
    assert.equal(auth.options.session?.updateAge, 60 * 60 * 24);
  });

  runTest("Better Auth configures secure cookie attributes (HttpOnly, SameSite=Lax, Path=/)", () => {
    const cookieAttrs = auth.options.advanced?.defaultCookieAttributes;
    assert.ok(cookieAttrs, "defaultCookieAttributes must be defined");
    assert.equal(cookieAttrs.httpOnly, true, "Session cookies must be HttpOnly");
    assert.equal(cookieAttrs.sameSite, "lax", "Session cookies must use SameSite=Lax");
    assert.equal(cookieAttrs.path, "/", "Session cookies must be scoped to /");
  });

  // SECTION 2: CSRF & Origin Verification Guard
  console.log("\n[2] CSRF & Origin Verification Guard:");

  runTest("verifyCsrf rejects Sec-Fetch-Site: cross-site requests with 403 Forbidden", () => {
    const req = new Request("http://localhost:3000/api/chests/recycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sec-fetch-site": "cross-site",
      },
    });

    const check = verifyCsrf(req);
    assert.equal(check.valid, false);
    if (!check.valid) {
      assert.equal(check.response.status, 403);
    }
  });

  runTest("verifyCsrf rejects untrusted/spoofed Origin header with 403 Forbidden", () => {
    const req = new Request("http://localhost:3000/api/chests/recycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://malicious-attacker-website.com",
        host: "localhost:3000",
      },
    });

    const check = verifyCsrf(req);
    assert.equal(check.valid, false);
    if (!check.valid) {
      assert.equal(check.response.status, 403);
    }
  });

  runTest("verifyCsrf rejects malformed Origin header with 403 Forbidden", () => {
    const req = new Request("http://localhost:3000/api/chests/recycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "not-a-valid-url!@#$",
      },
    });

    const check = verifyCsrf(req);
    assert.equal(check.valid, false);
    if (!check.valid) {
      assert.equal(check.response.status, 403);
    }
  });

  runTest("verifyCsrf rejects untrusted Referer header when Origin is absent", () => {
    const req = new Request("http://localhost:3000/api/chests/recycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        referer: "https://evil.org/phishing-page",
        host: "localhost:3000",
      },
    });

    const check = verifyCsrf(req);
    assert.equal(check.valid, false);
    if (!check.valid) {
      assert.equal(check.response.status, 403);
    }
  });

  runTest("verifyCsrf accepts valid same-origin request", () => {
    const req = new Request("http://localhost:3000/api/chests/recycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "http://localhost:3000",
        host: "localhost:3000",
        "sec-fetch-site": "same-origin",
      },
    });

    const check = verifyCsrf(req);
    assert.equal(check.valid, true);
  });

  // SECTION 3: API Route CSRF Protection Enforcement
  console.log("\n[3] API Route CSRF Protection Enforcement:");

  await runTest("POST /api/chests/recycle rejects cross-origin requests", async () => {
    const req = new Request("http://localhost:3000/api/chests/recycle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://cross-site-attacker.com",
      },
      body: JSON.stringify({ unboxId: "unbox-1" }),
    });

    const res = await recyclePost(req);
    assert.equal(res.status, 403);
  });

  await runTest("POST /api/chests/[slug]/open rejects cross-origin requests", async () => {
    const req = new Request("http://localhost:3000/api/chests/arcana-treasury/open", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://cross-site-attacker.com",
      },
      body: JSON.stringify({ paymentMethod: "coins" }),
    });

    const res = await openChestPost(req, { params: Promise.resolve({ slug: "arcana-treasury" }) });
    assert.equal(res.status, 403);
  });

  await runTest("PUT /api/chests/[slug] rejects cross-origin requests", async () => {
    const req = new Request("http://localhost:3000/api/chests/arcana-treasury", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        origin: "https://cross-site-attacker.com",
      },
      body: JSON.stringify({ priceCoins: 100 }),
    });

    const res = await chestPut(req, { params: Promise.resolve({ slug: "arcana-treasury" }) });
    assert.equal(res.status, 403);
  });

  await runTest("DELETE /api/chests/[slug] rejects cross-origin requests", async () => {
    const req = new Request("http://localhost:3000/api/chests/arcana-treasury", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        origin: "https://cross-site-attacker.com",
      },
    });

    const res = await chestDelete(req, { params: Promise.resolve({ slug: "arcana-treasury" }) });
    assert.equal(res.status, 403);
  });

  console.log(`\n=================================================`);
  console.log(`Phase 7 CSRF & Session Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

void runPhase7Tests();

