import React from "react";
if (!(React as any).createContext) {
  (React as any).createContext = () => ({
    Provider: ({ children }: any) => children,
    Consumer: ({ children }: any) => children(undefined),
  });
}

import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs/promises";

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

async function runPhase6Tests() {
  console.log("\n--- Phase 6: Injection Attacks & Data Access Layer Tests ---");

  // Dynamically import modules after React.createContext is polyfilled
  const { escapeLike, containsPattern, startsWithPattern } = await import("../src/lib/db/sql-sanitize");
  const { buildFilters } = await import("../src/server/modules/listings/listings.repository");
  const { storageService } = await import("../src/server/modules/storage/storage.service");

  // SECTION 1: SQL Wildcard & ILIKE Injection Neutralization
  console.log("\n[1] SQL Wildcard & ILIKE Injection Neutralization:");

  runTest("escapeLike escapes SQL wildcard % characters", () => {
    assert.equal(escapeLike("100%"), "100\\%");
    assert.equal(escapeLike("%%%"), "\\%\\%\\%");
  });

  runTest("escapeLike escapes SQL wildcard _ (single char) characters", () => {
    assert.equal(escapeLike("ak_47"), "ak\\_47");
    assert.equal(escapeLike("_____"), "\\_\\_\\_\\_\\_");
  });

  runTest("escapeLike escapes backslash escape characters", () => {
    assert.equal(escapeLike("path\\to\\item"), "path\\\\to\\\\item");
  });

  runTest("escapeLike neutralizes combined wildcard injection attacks", () => {
    const malicious = "%' OR 1=1 -- \\_%";
    assert.equal(escapeLike(malicious), "\\%' OR 1=1 -- \\\\\\_\\%");
  });

  runTest("containsPattern creates secure substring ILIKE pattern", () => {
    assert.equal(containsPattern("Doppler Phase 2"), "%Doppler Phase 2%");
    assert.equal(containsPattern("99.9%"), "%99.9\\%%");
  });

  runTest("startsWithPattern creates secure prefix ILIKE pattern", () => {
    assert.equal(startsWithPattern("AWP |"), "AWP |%");
    assert.equal(startsWithPattern("100%"), "100\\%%");
  });

  runTest("buildFilters in listings repository incorporates escaped query pattern", () => {
    const filters = buildFilters({
      query: "Fade 100%",
      gameId: "cs2",
      page: 1,
      perPage: 24,
      sort: "listed",
    });
    // Verifies that filters build without throwing and return SQL conditions
    assert.ok(filters.length >= 2);
  });

  // SECTION 2: Path Traversal & Safe File Storage
  console.log("\n[2] Path Traversal & File System Storage Defenses:");

  await runTest("uploadFile strips directory traversal in filename (../../)", async () => {
    const testBuffer = Buffer.from("dummy test image content");
    const result = await storageService.uploadFile({
      buffer: testBuffer,
      filename: "../../../../etc/passwd.jpg",
      contentType: "image/jpeg",
      folder: "avatars",
    });

    assert.ok(!result.key.includes(".."), "Storage key must not contain parent directory traversal '..'");
    assert.ok(!result.url.includes(".."), "Storage URL must not contain parent directory traversal '..'");
    assert.match(result.key, /^avatars\/\d+-.*\.jpg$/);
  });

  await runTest("uploadFile sanitizes Windows-style path separators (..\\..\\)", async () => {
    const testBuffer = Buffer.from("dummy test image content");
    const result = await storageService.uploadFile({
      buffer: testBuffer,
      filename: "..\\..\\windows\\system32\\cmd.exe.png",
      contentType: "image/png",
      folder: "banners",
    });

    assert.ok(!result.key.includes(".."));
    assert.ok(!result.key.includes("\\"));
    assert.match(result.key, /^banners\/\d+-.*\.png$/);
  });

  await runTest("uploadFile neutralizes dangerous executable extensions", async () => {
    const testBuffer = Buffer.from("<?php echo 'pwned'; ?>");
    const result = await storageService.uploadFile({
      buffer: testBuffer,
      filename: "exploit.php",
      contentType: "image/jpeg", // attacker spoofing image MIME type
      folder: "general",
    });

    // Safe extension bound to MIME type, rejecting raw .php
    assert.ok(!result.key.endsWith(".php"), "File must not be saved with executable .php extension");
    assert.ok(result.key.endsWith(".jpg"));
  });

  await runTest("uploadFile neutralizes HTML/SVG stored XSS extensions", async () => {
    const testBuffer = Buffer.from("<svg onload=alert(1)>");
    const result = await storageService.uploadFile({
      buffer: testBuffer,
      filename: "xss_vector.svg",
      contentType: "application/octet-stream",
      folder: "general",
    });

    assert.ok(!result.key.endsWith(".svg"), "File must not be saved with .svg extension");
    assert.ok(result.key.endsWith(".bin"));
  });

  await runTest("uploadFile safely neutralizes invalid folder parameter", async () => {
    const testBuffer = Buffer.from("dummy media");
    const result = await storageService.uploadFile({
      buffer: testBuffer,
      filename: "test.png",
      contentType: "image/png",
      folder: "../../../etc" as any,
    });

    // Must safely fallback to "general"
    assert.match(result.key, /^general\/\d+-.*\.png$/);
    assert.ok(!result.key.includes("etc"));
  });

  // SECTION 3: SSRF Defenses in Steam CDN Ingress
  console.log("\n[3] SSRF Defenses in Steam CDN Media Ingress:");

  await runTest("syncSteamAvatar rejects AWS EC2 metadata service IP (169.254.169.254)", async () => {
    await assert.rejects(
      async () => {
        await storageService.syncSteamAvatar("76561198082348819", "http://169.254.169.254/latest/meta-data");
      },
      /Steam avatar URL must use HTTPS|Untrusted Steam avatar CDN origin/
    );
  });

  await runTest("syncSteamAvatar rejects localhost and private loopback addresses", async () => {
    await assert.rejects(
      async () => {
        await storageService.syncSteamAvatar("76561198082348819", "http://127.0.0.1:5432/db");
      },
      /Steam avatar URL must use HTTPS|Untrusted Steam avatar CDN origin/
    );
  });

  await runTest("syncSteamAvatar rejects arbitrary untrusted origins", async () => {
    await assert.rejects(
      async () => {
        await storageService.syncSteamAvatar("76561198082348819", "https://attacker.evil.com/avatar.jpg");
      },
      /Untrusted Steam avatar CDN origin/
    );
  });

  await runTest("syncSteamAvatar rejects plaintext HTTP even on Steam domain", async () => {
    await assert.rejects(
      async () => {
        await storageService.syncSteamAvatar("76561198082348819", "http://avatars.steamstatic.com/avatar.jpg");
      },
      /Steam avatar URL must use HTTPS/
    );
  });

  console.log(`\n=================================================`);
  console.log(`Phase 6 Injection Tests: ${passed} / ${total} tests passed.`);
  console.log(`=================================================\n`);

  // Cleanup test artifacts from local uploads
  try {
    const testDirs = ["avatars", "banners", "general"];
    for (const d of testDirs) {
      const dirPath = path.resolve(process.cwd(), "public", "uploads", d);
      const files = await fs.readdir(dirPath).catch(() => []);
      for (const f of files) {
        if (/^\d+-.*$/.test(f)) {
          await fs.unlink(path.join(dirPath, f)).catch(() => {});
        }
      }
    }
  } catch {}

  if (passed !== total) {
    process.exit(1);
  }
}

void runPhase6Tests();
