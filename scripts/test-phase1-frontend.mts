import assert from "node:assert/strict";
import { safeCallback } from "../src/lib/steam/openid";
import { safeNext } from "../src/modules/relicto/lib/sign-in-href";
import { isValidTradeUrl, parseTradeUrl } from "../src/lib/steam/trade-url";
import { setLocaleAction } from "../src/modules/i18n/actions";

async function runPhase1Tests() {
  console.log("⚡ Running Phase 1 Frontend & Browser Security Tests...\n");

  // Test 1: Open Redirect Defense in safeCallback (Steam OpenID)
  console.log("▶ [1/4] Testing safeCallback against Open Redirect vectors...");
  const maliciousCallbacks = [
    "/\\evil.com",
    "/\\\\evil.com",
    "//evil.com",
    "//evil.com/path",
    "https://evil.com",
    "http://evil.com",
    "javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "\\evil.com",
    "",
    undefined,
  ];

  for (const malicious of maliciousCallbacks) {
    const result = safeCallback(malicious as string);
    assert.equal(
      result,
      "/marketplace",
      `Expected malicious callback "${malicious}" to fallback to /marketplace, got "${result}"`
    );
  }

  // Legitimate paths must be preserved
  assert.equal(safeCallback("/dashboard"), "/dashboard");
  assert.equal(safeCallback("/wallet?deposit=crypto"), "/wallet?deposit=crypto");
  assert.equal(safeCallback("/items/butterfly-doppler#offers"), "/items/butterfly-doppler#offers");
  console.log("  ✓ safeCallback successfully neutralized all Open Redirect vectors while preserving valid relative routes.");

  // Test 2: Open Redirect Defense in safeNext (Auth Flow)
  console.log("\n▶ [2/4] Testing safeNext against Open Redirect vectors...");
  for (const malicious of maliciousCallbacks) {
    const result = safeNext(malicious as string);
    assert.equal(
      result,
      "/marketplace",
      `Expected malicious next param "${malicious}" to fallback to /marketplace, got "${result}"`
    );
  }
  assert.equal(safeNext("/sell"), "/sell");
  assert.equal(safeNext("/checkout?promo=true"), "/checkout?promo=true");
  console.log("  ✓ safeNext successfully neutralized all Open Redirect vectors.");

  // Test 3: HTTPS Enforcement in Steam Trade URLs
  console.log("\n▶ [3/4] Testing Steam Trade URL HTTPS requirement...");
  const validHttpsUrl = "https://steamcommunity.com/tradeoffer/new/?partner=12345678&token=ABCdef12";
  const insecureHttpUrl = "http://steamcommunity.com/tradeoffer/new/?partner=12345678&token=ABCdef12";
  const malformedUrl = "https://evilcommunity.com/tradeoffer/new/?partner=12345678&token=ABCdef12";

  assert.equal(isValidTradeUrl(validHttpsUrl), true, "HTTPS Trade URL should be valid");
  assert.equal(isValidTradeUrl(insecureHttpUrl), false, "Plaintext HTTP Trade URL must be rejected");
  assert.equal(isValidTradeUrl(malformedUrl), false, "Spoofed domain Trade URL must be rejected");

  const parsedValid = parseTradeUrl(validHttpsUrl);
  assert.equal(parsedValid.valid, true);
  assert.equal(parsedValid.partnerId, "12345678");
  assert.equal(parsedValid.token, "ABCdef12");

  const parsedInsecure = parseTradeUrl(insecureHttpUrl);
  assert.equal(parsedInsecure.valid, false);
  console.log("  ✓ Steam Trade URLs now strictly require HTTPS and reject plaintext HTTP or spoofed origins.");

  // Test 4: Server Action Runtime Locale Validation
  console.log("\n▶ [4/4] Testing setLocaleAction runtime boundary...");
  // @ts-expect-error Testing invalid runtime string
  const invalidResult = await setLocaleAction("invalid-payload");
  assert.equal(invalidResult.ok, false, "Invalid locale must be rejected");
  console.log("  ✓ setLocaleAction rejected illegal runtime values at the server action boundary.");

  console.log("\n🎉 All Phase 1 Frontend Security verification tests passed with 100% success!");
}

runPhase1Tests().catch((err) => {
  console.error("❌ Phase 1 test failed:", err);
  process.exit(1);
});

