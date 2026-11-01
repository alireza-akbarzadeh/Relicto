import { NextResponse } from "next/server";
import { securityLog } from "@/server/modules/security/security-logger";

export function getTrustedOrigins(): string[] {
  const vercelOrigin = process.env.VERCEL_URL
    ? (process.env.VERCEL_URL.startsWith("http") ? process.env.VERCEL_URL : `https://${process.env.VERCEL_URL}`).replace(/\/$/, "")
    : null;

  const base = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  return [
    base.replace(/\/$/, ""),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(vercelOrigin ? [vercelOrigin] : []),
  ];
}

/**
 * Validates request Origin and Sec-Fetch-Site to protect mutating API endpoints against CSRF.
 */
export function verifyCsrf(req: Request): { valid: true } | { valid: false; response: NextResponse } {
  // 1. Fetch Metadata check (Sec-Fetch-Site)
  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    securityLog.warn("CSRF_VIOLATION", "Cross-site mutating request rejected via Sec-Fetch-Site");
    return {
      valid: false,
      response: NextResponse.json(
        { error: "Forbidden: Cross-site request rejected" },
        { status: 403 }
      ),
    };
  }

  // 2. Origin Header check
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const trusted = getTrustedOrigins();

  if (origin) {
    try {
      const originUrl = new URL(origin);
      const isTrusted =
        trusted.includes(originUrl.origin) ||
        (host && originUrl.host.toLowerCase() === host.toLowerCase());

      if (!isTrusted) {
        securityLog.warn("CSRF_VIOLATION", `Origin verification failed: untrusted origin ${origin}`);
        return {
          valid: false,
          response: NextResponse.json(
            { error: "Forbidden: Origin verification failed" },
            { status: 403 }
          ),
        };
      }
    } catch {
      return {
        valid: false,
        response: NextResponse.json(
          { error: "Forbidden: Malformed origin header" },
          { status: 403 }
        ),
      };
    }
  } else if (!secFetchSite) {
    // 3. Fallback: Referer check if Origin is missing on mutating requests
    const referer = req.headers.get("referer");
    if (referer) {
      try {
        const refUrl = new URL(referer);
        const isTrusted =
          trusted.includes(refUrl.origin) ||
          (host && refUrl.host.toLowerCase() === host.toLowerCase());

        if (!isTrusted) {
          return {
            valid: false,
            response: NextResponse.json(
              { error: "Forbidden: Referer verification failed" },
              { status: 403 }
            ),
          };
        }
      } catch {
        return {
          valid: false,
          response: NextResponse.json(
            { error: "Forbidden: Malformed referer header" },
            { status: 403 }
          ),
        };
      }
    }
  }

  return { valid: true };
}

