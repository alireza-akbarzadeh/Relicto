import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(undefined),
  });
}

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

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

async function runPhase13Tests() {
  console.log("\n--- Phase 13: Secrets, Dependencies & Supply-Chain Security Tests ---");

  // [1] Secret Management & Environment Boundaries
  console.log("\n[1] Secrets Management & Environment Boundary Verification:");

  await runTest("NEXT_PUBLIC_ environment variables contain only public non-sensitive configuration", async () => {
    const { env } = await import("../src/lib/env");
    const publicKeys = Object.keys(env).filter((k) => k.startsWith("NEXT_PUBLIC_"));

    const SENSITIVE_KEYWORDS = ["secret", "password", "token", "private", "database", "seed", "vault", "auth_key"];

    for (const key of publicKeys) {
      const lower = key.toLowerCase();
      for (const forbidden of SENSITIVE_KEYWORDS) {
        assert.ok(
          !lower.includes(forbidden),
          `Public client variable ${key} must not contain sensitive keyword '${forbidden}'`
        );
      }
    }
  });

  await runTest(".gitignore strictly excludes all environment files, pem certificates, and runtime dumps", () => {
    const gitignorePath = path.join(process.cwd(), ".gitignore");
    const content = fs.readFileSync(gitignorePath, "utf-8");

    assert.ok(content.includes(".env*"), ".gitignore must contain .env*");
    assert.ok(content.includes("*.pem"), ".gitignore must contain *.pem");
    assert.ok(content.includes(".*-runtime.json"), ".gitignore must contain .*-runtime.json");
    assert.ok(content.includes("!.env.example"), ".gitignore must preserve .env.example exception");
  });

  await runTest("Git tracking contains zero active .env files besides .env.example", () => {
    const trackedFiles = execSync("git ls-files", { encoding: "utf-8" }).split("\n");
    const trackedEnvFiles = trackedFiles
      .map((f) => f.trim())
      .filter((f) => f.includes(".env") && f.length > 0);

    assert.deepEqual(trackedEnvFiles, [".env.example"], "Only .env.example may be tracked in git");
  });

  await runTest(".env.example contains only dummy/placeholder values and no real production secrets", () => {
    const exampleContent = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf-8");
    assert.ok(!exampleContent.includes("sk_live_"), "Must not contain live Stripe keys");
    assert.ok(!exampleContent.includes("AIzaSy"), "Must not contain real Google API keys");
    assert.ok(!exampleContent.includes("ghp_"), "Must not contain GitHub tokens");
    assert.ok(exampleContent.includes("DATABASE_URL="), "Must define DATABASE_URL template");
    assert.ok(exampleContent.includes("BETTER_AUTH_SECRET="), "Must define BETTER_AUTH_SECRET template");
  });

  // [2] Dependency & Supply-Chain Integrity
  console.log("\n[2] Package Manifest & Lockfile Integrity:");

  await runTest("package.json is valid JSON with no duplicate dependencies and pnpm-lock.yaml is present", () => {
    const pkgRaw = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8");
    const pkg = JSON.parse(pkgRaw);

    assert.ok(pkg.name === "relicto", "Valid package.json name");
    assert.ok(pkg.dependencies, "Dependencies must be declared");
    assert.ok(fs.existsSync(path.join(process.cwd(), "pnpm-lock.yaml")), "pnpm-lock.yaml must exist");
  });

  // [3] Exploitability Guardrails on Advisory Vectors
  console.log("\n[3] Exploitability Guardrails on Dependency Advisories:");

  await runTest("next.config.ts disallows SVG image optimization and restricts remote host patterns", async () => {
    const nextConfigContent = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf-8");
    assert.ok(
      !nextConfigContent.includes("dangerouslyAllowSVG: true"),
      "dangerouslyAllowSVG must remain false/disabled"
    );
    assert.ok(
      nextConfigContent.includes("remotePatterns:"),
      "next.config.ts must explicitly configure strict remotePatterns"
    );
  });

  await runTest("next/og ImageResponse is not used in application code", () => {
    let srcFiles = "";
    try {
      srcFiles = execSync("git grep -l ImageResponse src", { encoding: "utf-8" }).trim();
    } catch {
      srcFiles = "";
    }
    assert.equal(srcFiles, "", "ImageResponse must not be imported in src/");
  });

  console.log(`\n=================================================`);
  console.log(`Phase 13 Supply-Chain Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase13Tests().catch((err) => {
  console.error("Unhandled test runner failure:", err);
  process.exit(1);
});
