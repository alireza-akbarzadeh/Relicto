import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time check of an `Authorization: Bearer <secret>` header.
 * Hashes both the received token and secret with SHA-256 before comparing,
 * preventing any timing attacks or secret length leakage.
 */
export function bearerMatches(header: string | null, secret: string | undefined): boolean {
  if (!header || !secret) return false;
  const given = header.replace(/^Bearer\s+/i, "").trim();
  if (!given) return false;

  const hashGiven = createHash("sha256").update(given).digest();
  const hashSecret = createHash("sha256").update(secret).digest();

  return timingSafeEqual(hashGiven, hashSecret);
}
