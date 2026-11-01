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

async function runPhase14Tests() {
  console.log("\n--- Phase 14: Security Logging, Monitoring & Error Handling Tests ---");

  // Dynamically import tested module
  const {
    redactSensitiveData,
    maskEmail,
    sanitizeErrorForClient,
    securityLog,
  } = await import("../src/server/modules/security/security-logger");

  // [1] PII & Credential Redaction Engine
  console.log("\n[1] PII and Credential Redaction Tests:");

  await runTest("redactSensitiveData redacts passwords, tokens, auth headers, and seeds in nested objects", () => {
    const rawPayload = {
      user: {
        id: "usr_123",
        username: "relicto_trader",
        password: "SuperSecretPassword123!",
        email: "alice_bob@example.com",
      },
      headers: {
        authorization: "Bearer secret_jwt_token_abcdef123456",
        cookie: "better-auth.session_token=session_cookie_value_xyz",
      },
      secrets: {
        vaultSeed: "0x1234567890abcdef1234567890abcdef",
        stripeApiKey: "sk_live_51234567890",
        nested: {
          privateKey: "-----BEGIN RSA PRIVATE KEY-----",
          safeProperty: "visible-metadata",
        },
      },
    };

    const redacted = redactSensitiveData(rawPayload) as any;

    // Sensitive keys replaced with [REDACTED]
    assert.equal(redacted.user.password, "[REDACTED]");
    assert.equal(redacted.headers.authorization, "[REDACTED]");
    assert.equal(redacted.headers.cookie, "[REDACTED]");
    assert.equal(redacted.secrets.vaultSeed, "[REDACTED]");
    assert.equal(redacted.secrets.stripeApiKey, "[REDACTED]");
    assert.equal(redacted.secrets.nested.privateKey, "[REDACTED]");

    // Safe metadata preserved
    assert.equal(redacted.user.id, "usr_123");
    assert.equal(redacted.user.username, "relicto_trader");
    assert.equal(redacted.secrets.nested.safeProperty, "visible-metadata");

    // Email masked
    assert.equal(redacted.user.email, "a***b@example.com");
  });

  await runTest("redactSensitiveData redacts Bearer tokens and credential query strings in raw text", () => {
    const rawText = "Connecting with Authorization: Bearer sk_test_5123456789abcdef to server";
    const sanitized = redactSensitiveData(rawText);
    assert.equal(sanitized, "Connecting with Authorization: Bearer [REDACTED] to server");

    const urlText = "https://api.steam.com/endpoint?key=1234567890&format=json";
    const sanitizedUrl = redactSensitiveData(urlText);
    assert.equal(sanitizedUrl, "https://api.steam.com/endpoint?key=[REDACTED]&format=json");
  });

  await runTest("maskEmail masks local username while preserving domain for privacy", () => {
    assert.equal(maskEmail("alexander@relicto.gg"), "a***r@relicto.gg");
    assert.equal(maskEmail("me@domain.com"), "m***@domain.com");
    assert.equal(maskEmail("invalid-email"), "[INVALID_EMAIL]");
  });

  // [2] Error Response Sanitization
  console.log("\n[2] Error Response Sanitization Tests:");

  await runTest("sanitizeErrorForClient suppresses internal server paths and database traces", () => {
    const devError = new Error("Database query failed at C:\\Users\\akbarzadeh.ali\\Relicto\\src\\lib\\db.ts:25:10");
    const sanitizedDev = sanitizeErrorForClient(devError);
    assert.ok(!sanitizedDev.includes("C:\\Users"), "Must not expose internal Windows file path");
    assert.ok(sanitizedDev.includes("[internal path]"));

    // Production mode behavior
    const prevEnv = process.env.NODE_ENV;
    try {
      (process.env as any).NODE_ENV = "production";
      const sanitizedProd = sanitizeErrorForClient(new Error("FATAL: relation 'users' does not exist in schema 'public'"));
      assert.equal(sanitizedProd, "An internal error occurred", "Must return generic message in production");
    } finally {
      (process.env as any).NODE_ENV = prevEnv;
    }
  });

  // [3] Structured Security Logger
  console.log("\n[3] Structured Security Logger Tests:");

  await runTest("securityLog captures structured events with automatic metadata redaction", () => {
    let capturedLog: any = null;
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      capturedLog = args[1];
    };

    try {
      securityLog.warn("AUTH_FAILURE", "Failed credential check", {
        userId: "test-user-99",
        clientIp: "198.51.100.5",
        metadata: {
          attemptedPassword: "PlainTextPassword123!",
          targetEmail: "victim@example.com",
        },
      });

      assert.ok(capturedLog, "Security log should be emitted");
      assert.equal(capturedLog.event, "AUTH_FAILURE");
      assert.equal(capturedLog.level, "warning");
      assert.equal(capturedLog.userId, "test-user-99");
      assert.equal(capturedLog.clientIp, "198.51.100.5");
      assert.equal(capturedLog.metadata.attemptedPassword, "[REDACTED]");
      assert.equal(capturedLog.metadata.targetEmail, "v***m@example.com");
    } finally {
      console.warn = originalWarn;
    }
  });

  console.log(`\n=================================================`);
  console.log(`Phase 14 Logging & Monitoring Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase14Tests().catch((err) => {
  console.error("Unhandled test runner failure:", err);
  process.exit(1);
});

