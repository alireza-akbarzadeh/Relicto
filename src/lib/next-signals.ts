/**
 * Detects internal Next.js control flow signals (redirect, notFound, dynamic server usage)
 * which must never be swallowed by try/catch blocks.
 */
export function isNextInternalSignal(err: unknown): boolean {
  if (err && typeof err === "object" && "digest" in err) {
    const digest = String((err as { digest?: unknown }).digest);
    return digest.startsWith("NEXT_") || digest === "DYNAMIC_SERVER_USAGE";
  }
  return false;
}

/**
 * Rethrows internal Next.js control flow signals if detected.
 */
export function rethrowNextSignals(err: unknown): void {
  if (isNextInternalSignal(err)) {
    throw err;
  }
}
