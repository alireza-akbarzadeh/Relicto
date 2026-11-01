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

async function runPhase9Tests() {
  console.log("\n--- Phase 9: API Security & Rate Limiting Tests ---");

  const {
    RateLimiter,
    getClientIp,
    applyRateLimit,
    searchRateLimiter,
    chestOpenRateLimiter,
    simulationRateLimiter,
    financialRateLimiter,
    economyRateLimiter,
  } = await import("../src/server/modules/security/rate-limiter");

  const { auth } = await import("../src/lib/auth");
  const { GET: searchGet } = await import("../src/app/api/search/route");

  // Test 1: RateLimiter sliding window enforcement
  await runTest("RateLimiter enforces maxRequests in sliding window and returns retryAfter", () => {
    const limiter = new RateLimiter("test-limiter", {
      windowMs: 1000,
      maxRequests: 3,
    });

    const r1 = limiter.check("client-1");
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = limiter.check("client-1");
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);

    const r3 = limiter.check("client-1");
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);

    const r4 = limiter.check("client-1");
    assert.equal(r4.allowed, false);
    assert.equal(r4.remaining, 0);
    assert.ok(r4.retryAfterSeconds >= 1);
    assert.ok(r4.reason?.includes("Rate limit exceeded"));
  });

  // Test 2: RateLimiter burst cooldown protection
  await runTest("RateLimiter enforces minIntervalMs burst protection", () => {
    const limiter = new RateLimiter("test-burst", {
      windowMs: 60000,
      maxRequests: 10,
      minIntervalMs: 200,
    });

    const r1 = limiter.check("burst-client");
    assert.equal(r1.allowed, true);

    // Immediate second call should be blocked by minIntervalMs
    const r2 = limiter.check("burst-client");
    assert.equal(r2.allowed, false);
    assert.ok(r2.reason?.includes("rapid requests"));
    assert.ok(r2.retryAfterSeconds >= 1);
  });

  // Test 3: Client identifier isolation
  await runTest("RateLimiter isolates quotas per distinct client identifier", () => {
    const limiter = new RateLimiter("test-isolation", {
      windowMs: 10000,
      maxRequests: 1,
    });

    const r1 = limiter.check("trader-alpha");
    assert.equal(r1.allowed, true);

    const r2 = limiter.check("trader-alpha");
    assert.equal(r2.allowed, false);

    // Trader Beta should still have full quota
    const rBeta = limiter.check("trader-beta");
    assert.equal(rBeta.allowed, true);
  });

  // Test 4: getClientIp header extraction
  await runTest("getClientIp extracts IP from x-forwarded-for, x-real-ip, cf-connecting-ip or fallback", () => {
    const req1 = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    assert.equal(getClientIp(req1), "203.0.113.195");

    const req2 = new Request("http://localhost/api/test", {
      headers: { "x-real-ip": "198.51.100.42" },
    });
    assert.equal(getClientIp(req2), "198.51.100.42");

    const req3 = new Request("http://localhost/api/test", {
      headers: { "cf-connecting-ip": "192.0.2.88" },
    });
    assert.equal(getClientIp(req3), "192.0.2.88");

    const reqFallback = new Request("http://localhost/api/test");
    assert.equal(getClientIp(reqFallback), "127.0.0.1");
  });

  // Test 5: applyRateLimit helper structure and headers
  await runTest("applyRateLimit returns standard headers on success and 429 response on limit breach", () => {
    const limiter = new RateLimiter("test-apply", {
      windowMs: 1000,
      maxRequests: 1,
    });

    const req = new Request("http://localhost/api/test");
    const allowed = applyRateLimit(req, limiter, "apply-client");
    assert.equal(allowed.allowed, true);
    if (allowed.allowed) {
      assert.equal(allowed.headers["X-RateLimit-Limit"], "1");
      assert.equal(allowed.headers["X-RateLimit-Remaining"], "0");
      assert.ok(allowed.headers["X-RateLimit-Reset"]);
    }

    const blocked = applyRateLimit(req, limiter, "apply-client");
    assert.equal(blocked.allowed, false);
    if (!blocked.allowed) {
      assert.equal(blocked.response.status, 429);
      assert.ok(blocked.response.headers.get("Retry-After"));
      assert.equal(blocked.response.headers.get("X-RateLimit-Remaining"), "0");
    }
  });

  // Test 6: Better Auth rate limiting configuration
  await runTest("Better Auth has built-in rate limiting enabled with memory storage", () => {
    const rateLimitConfig = (auth.options as any).rateLimit;
    assert.ok(rateLimitConfig, "auth.options.rateLimit should be configured");
    assert.equal(rateLimitConfig.enabled, true);
    assert.equal(rateLimitConfig.window, 60);
    assert.equal(rateLimitConfig.max, 30);
    assert.equal(rateLimitConfig.storage, "memory");
  });

  // Test 7: Pre-configured rate limiting tiers sanity check
  await runTest("Rate limiting tiers are configured with appropriate window and limits", () => {
    assert.equal(searchRateLimiter.config.maxRequests, 60);
    assert.equal(searchRateLimiter.config.windowMs, 60000);

    assert.equal(chestOpenRateLimiter.config.maxRequests, 30);
    assert.equal(chestOpenRateLimiter.config.windowMs, 60000);

    assert.equal(simulationRateLimiter.config.maxRequests, 10);
    assert.equal(simulationRateLimiter.config.windowMs, 60000);

    assert.equal(financialRateLimiter.config.maxRequests, 20);
    assert.equal(financialRateLimiter.config.windowMs, 60000);

    assert.equal(economyRateLimiter.config.maxRequests, 30);
    assert.equal(economyRateLimiter.config.windowMs, 60000);
  });

  // Test 8: Search endpoint rate limiting integration
  await runTest("GET /api/search applies rate limiting and emits X-RateLimit headers", async () => {
    const req = new NextRequest("http://localhost:3000/api/search?q=test&limit=5", {
      headers: { "x-forwarded-for": "198.51.100.99" },
    });

    const res = await searchGet(req);
    assert.ok(res.headers.has("x-ratelimit-limit"), "Response must have x-ratelimit-limit header");
    assert.ok(res.headers.has("x-ratelimit-remaining"), "Response must have x-ratelimit-remaining header");
  });

  console.log(`\nPhase 9 Results: ${passed}/${total} passed`);
  if (passed !== total) {
    process.exit(1);
  }
}

runPhase9Tests().catch((err) => {
  console.error("Unhandled test runner failure:", err);
  process.exit(1);
});

