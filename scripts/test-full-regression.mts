import { execSync } from "node:child_process";

interface PhaseResult {
  phase: string;
  script: string;
  status: "PASSED" | "FAILED";
  durationMs: number;
  output?: string;
}

const PHASES = [
  { phase: "Phase 1: Frontend & Input Sanitization", script: "scripts/test-phase1-frontend.mts" },
  { phase: "Phase 2: HTTP Security Headers & Transport", script: "scripts/test-phase2-headers.mts" },
  { phase: "Phase 3: Authentication & Password Security", script: "scripts/test-phase3-auth.mts" },
  { phase: "Phase 4: Authorization & Access Control (RBAC/IDOR)", script: "scripts/test-phase4-authorization.mts" },
  { phase: "Phase 5: Input Validation & Provenance", script: "scripts/test-phase5-validation.mts" },
  { phase: "Phase 6: Injection Defense (SQL, Path, SSRF)", script: "scripts/test-phase6-injection.mts" },
  { phase: "Phase 7: Session Management & CSRF Defense", script: "scripts/test-phase7-session-csrf.mts" },
  { phase: "Phase 8: Cryptography, RNG & Secret Management", script: "scripts/test-phase8-crypto-secrets.mts" },
  { phase: "Phase 9: Rate Limiting & DoS Protection", script: "scripts/test-phase9-rate-limiting.mts" },
  { phase: "Phase 10: Integrations & Webhook Signatures", script: "scripts/test-phase10-integrations.mts" },
  { phase: "Phase 11: Business Logic & Transaction Safety", script: "scripts/test-phase11-business-logic.mts" },
  { phase: "Phase 12: Advanced Attacks & State Isolation", script: "scripts/test-phase12-advanced-attacks.mts" },
  { phase: "Phase 13: Secrets, Dependencies & Supply Chain", script: "scripts/test-phase13-supply-chain.mts" },
  { phase: "Phase 14: Security Logging & Error Sanitization", script: "scripts/test-phase14-logging.mts" },
];

async function runFullRegression() {
  console.log("===============================================================================");
  console.log("      RELICTO SECURITY SUITE — FULL COMPREHENSIVE REGRESSION (PHASES 1 - 14)   ");
  console.log("===============================================================================\n");

  const results: PhaseResult[] = [];
  let allPassed = true;

  for (const item of PHASES) {
    const start = Date.now();
    process.stdout.write(`Executing ${item.phase}... `);
    try {
      execSync(`npx tsx --env-file=.env.local --conditions=react-server ${item.script}`, {
        stdio: "pipe",
        encoding: "utf-8",
      });
      const durationMs = Date.now() - start;
      console.log(`[PASS] (${durationMs}ms)`);
      results.push({ phase: item.phase, script: item.script, status: "PASSED", durationMs });
    } catch (err: any) {
      const durationMs = Date.now() - start;
      console.log(`[FAIL] (${durationMs}ms)`);
      results.push({
        phase: item.phase,
        script: item.script,
        status: "FAILED",
        durationMs,
        output: err.stdout || err.stderr || err.message,
      });
      allPassed = false;
    }
  }

  console.log("\n===============================================================================");
  console.log("                               REGRESSION SUMMARY                              ");
  console.log("===============================================================================");
  console.table(
    results.map((r) => ({
      Phase: r.phase,
      Status: r.status,
      "Duration (ms)": r.durationMs,
    }))
  );

  const passedCount = results.filter((r) => r.status === "PASSED").length;
  console.log(`\nResults: ${passedCount} / ${results.length} Phase Suites Passed (${Math.round((passedCount / results.length) * 100)}%).`);

  if (!allPassed) {
    console.error("\nFAILURES DETECTED IN THE FOLLOWING PHASES:");
    for (const r of results) {
      if (r.status === "FAILED") {
        console.error(`\n--- ${r.phase} ---`);
        console.error(r.output);
      }
    }
    process.exit(1);
  }

  console.log("\nALL 14 SECURITY PHASES PASSED REGRESSION TESTING 100% CLEAN!\n");
}

runFullRegression().catch((err) => {
  console.error("Full regression harness failure:", err);
  process.exit(1);
});

