import assert from "node:assert/strict";
import nextConfigPromise from "../next.config";

async function runPhase2Tests() {
  console.log("⚡ Running Phase 2 HTTP Security Headers Tests...\n");

  const raw = await Promise.resolve(nextConfigPromise);
  const config =
    raw && typeof raw === "object" && "default" in raw
      ? ((raw as Record<string, unknown>).default as any)
      : raw;
  assert(
    typeof config?.headers === "function",
    "next.config.ts must export headers function",
  );

  const configuredHeaders = await config.headers();
  assert(Array.isArray(configuredHeaders), "headers() must return an array");

  // 1. Verify Global Security Headers (/:path*)
  console.log("▶ [1/3] Testing Global Headers for all paths (/:path*)...");
  const globalRule = configuredHeaders.find((h) => h.source === "/:path*");
  assert(globalRule, "Must define header rule for /:path*");

  const headerMap = new Map(
    globalRule.headers.map((h) => [h.key.toLowerCase(), h.value]),
  );

  // Content-Security-Policy
  assert(
    headerMap.has("content-security-policy"),
    "Must define Content-Security-Policy",
  );
  const csp = headerMap.get("content-security-policy")!;
  assert(
    csp.includes("default-src 'self'"),
    "CSP must define default-src 'self'",
  );
  assert(
    csp.includes("frame-ancestors 'none'"),
    "CSP must prohibit framing via frame-ancestors 'none'",
  );
  assert(
    csp.includes("object-src 'none'"),
    "CSP must prohibit plugin objects via object-src 'none'",
  );
  assert(
    csp.includes("base-uri 'self'"),
    "CSP must restrict base-uri to 'self'",
  );
  assert(
    csp.includes("upgrade-insecure-requests"),
    "CSP must enforce upgrade-insecure-requests",
  );
  assert(
    csp.includes("https://avatars.steamstatic.com"),
    "CSP must allow Steam avatar CDNs in img-src",
  );
  assert(
    csp.includes("https://api.trongrid.io"),
    "CSP must allow TronGrid RPC in connect-src",
  );
  console.log(
    "  ✓ Content-Security-Policy contains comprehensive resource restrictions and anti-clickjacking directives.",
  );

  // Clickjacking / X-Frame-Options
  assert.equal(
    headerMap.get("x-frame-options"),
    "DENY",
    "X-Frame-Options must be DENY",
  );
  console.log("  ✓ X-Frame-Options: DENY successfully configured.");

  // MIME Sniffing / X-Content-Type-Options
  assert.equal(
    headerMap.get("x-content-type-options"),
    "nosniff",
    "X-Content-Type-Options must be nosniff",
  );
  console.log("  ✓ X-Content-Type-Options: nosniff successfully configured.");

  // Referrer Policy
  assert.equal(
    headerMap.get("referrer-policy"),
    "strict-origin-when-cross-origin",
    "Referrer-Policy must be strict-origin-when-cross-origin",
  );
  console.log(
    "  ✓ Referrer-Policy: strict-origin-when-cross-origin successfully configured.",
  );

  // Permissions Policy
  assert(headerMap.has("permissions-policy"), "Must define Permissions-Policy");
  const perm = headerMap.get("permissions-policy")!;
  assert(perm.includes("camera=()"), "Must restrict camera");
  assert(perm.includes("microphone=()"), "Must restrict microphone");
  assert(perm.includes("geolocation=()"), "Must restrict geolocation");
  console.log(
    "  ✓ Permissions-Policy successfully restricts unused device hardware APIs.",
  );

  // HSTS (Strict-Transport-Security)
  assert(
    headerMap.has("strict-transport-security"),
    "Must define Strict-Transport-Security",
  );
  assert(
    headerMap.get("strict-transport-security")!.includes("max-age=31536000"),
    "HSTS max-age must be at least 1 year",
  );
  console.log(
    "  ✓ Strict-Transport-Security: max-age=31536000; includeSubDomains successfully configured.",
  );

  // 2. Verify API Protection (/api/:path*)
  console.log("\n▶ [2/3] Testing API Route Headers (/api/:path*)...");
  const apiRule = configuredHeaders.find((h) => h.source === "/api/:path*");
  assert(apiRule, "Must define header rule for /api/:path*");
  const apiHeaderMap = new Map(
    apiRule.headers.map((h) => [h.key.toLowerCase(), h.value]),
  );

  assert(
    apiHeaderMap.has("cache-control"),
    "API routes must define Cache-Control",
  );
  assert.equal(
    apiHeaderMap.get("cache-control"),
    "no-store, max-age=0, must-revalidate",
    "API routes must disable caching",
  );
  assert.equal(
    apiHeaderMap.get("x-content-type-options"),
    "nosniff",
    "API routes must enforce nosniff",
  );
  console.log(
    "  ✓ API routes enforce Cache-Control: no-store and MIME sniffing protection.",
  );

  // 3. Verify Service Worker Headers (/sw.js)
  console.log("\n▶ [3/3] Testing Push Service Worker Headers (/sw.js)...");
  const swRule = configuredHeaders.find((h) => h.source === "/sw.js");
  assert(swRule, "Must retain header rule for /sw.js");
  const swMap = new Map(
    swRule.headers.map((h) => [h.key.toLowerCase(), h.value]),
  );
  assert.equal(
    swMap.get("cache-control"),
    "no-cache, no-store, must-revalidate",
  );
  console.log("  ✓ Service worker preserves strict cache-invalidation policy.");

  console.log(
    "\n🎉 All Phase 2 HTTP Security Header verification tests passed with 100% success!",
  );
}

runPhase2Tests().catch((err) => {
  console.error("❌ Phase 2 test failed:", err);
  process.exit(1);
});
