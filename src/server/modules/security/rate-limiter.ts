import { NextResponse } from "next/server";
import { securityLog } from "./security-logger";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  minIntervalMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
  reason?: string;
}

interface ClientRecord {
  timestamps: number[];
  lastRequestTime: number;
}

export class RateLimiter {
  private records = new Map<string, ClientRecord>();
  private lastCleanup = Date.now();

  constructor(
    public readonly name: string,
    public readonly config: RateLimitConfig
  ) {}

  private cleanup(now: number) {
    if (now - this.lastCleanup < 60_000) return;
    this.lastCleanup = now;

    const maxAge = Math.max(this.config.windowMs * 2, 60_000);
    for (const [key, record] of this.records.entries()) {
      if (now - record.lastRequestTime > maxAge) {
        this.records.delete(key);
      }
    }
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    this.cleanup(now);

    const key = identifier || "127.0.0.1";
    let record = this.records.get(key);
    if (!record) {
      record = { timestamps: [], lastRequestTime: 0 };
      this.records.set(key, record);
    }

    // 1. Min interval cooldown check (burst defense)
    if (this.config.minIntervalMs && record.lastRequestTime > 0) {
      const elapsed = now - record.lastRequestTime;
      if (elapsed < this.config.minIntervalMs) {
        const retryAfterSeconds = Math.max(1, Math.ceil((this.config.minIntervalMs - elapsed) / 1000));
        return {
          allowed: false,
          limit: this.config.maxRequests,
          remaining: 0,
          resetSeconds: retryAfterSeconds,
          retryAfterSeconds,
          reason: `Too many rapid requests. Please wait ${retryAfterSeconds}s before retrying.`,
        };
      }
    }

    // 2. Sliding window check
    record.timestamps = record.timestamps.filter((ts) => now - ts < this.config.windowMs);

    if (record.timestamps.length >= this.config.maxRequests) {
      const oldest = record.timestamps[0] || now;
      const timeUntilExpire = Math.max(0, this.config.windowMs - (now - oldest));
      const retryAfterSeconds = Math.max(1, Math.ceil(timeUntilExpire / 1000));
      return {
        allowed: false,
        limit: this.config.maxRequests,
        remaining: 0,
        resetSeconds: retryAfterSeconds,
        retryAfterSeconds,
        reason: `Rate limit exceeded (${this.config.maxRequests} requests per ${Math.round(this.config.windowMs / 1000)}s).`,
      };
    }

    // Record this request
    record.timestamps.push(now);
    record.lastRequestTime = now;

    const remaining = Math.max(0, this.config.maxRequests - record.timestamps.length);
    const resetSeconds = Math.ceil(this.config.windowMs / 1000);

    return {
      allowed: true,
      limit: this.config.maxRequests,
      remaining,
      resetSeconds,
      retryAfterSeconds: 0,
    };
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  return "127.0.0.1";
}

// Pre-configured rate limiting tiers
export const searchRateLimiter = new RateLimiter("public-search", {
  windowMs: 60 * 1000,
  maxRequests: 60,
  minIntervalMs: 100,
});

export const chestOpenRateLimiter = new RateLimiter("chest-open", {
  windowMs: 60 * 1000,
  maxRequests: 30,
  minIntervalMs: 500,
});

export const simulationRateLimiter = new RateLimiter("chest-simulation", {
  windowMs: 60 * 1000,
  maxRequests: 10,
  minIntervalMs: 1000,
});

export const financialRateLimiter = new RateLimiter("financial-operations", {
  windowMs: 60 * 1000,
  maxRequests: 20,
  minIntervalMs: 1000,
});

export const economyRateLimiter = new RateLimiter("chest-economy", {
  windowMs: 60 * 1000,
  maxRequests: 30,
  minIntervalMs: 500,
});

export function applyRateLimit(
  req: Request,
  limiter: RateLimiter,
  customKey?: string
): { allowed: true; headers: Record<string, string> } | { allowed: false; response: NextResponse } {
  const key = customKey || getClientIp(req);
  const result = limiter.check(key);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetSeconds),
  };

  if (!result.allowed) {
    securityLog.warn("RATE_LIMIT_EXCEEDED", `Rate limit triggered on '${limiter.name}'`, {
      clientIp: getClientIp(req),
      metadata: { limiter: limiter.name, retryAfter: result.retryAfterSeconds },
    });
    headers["Retry-After"] = String(result.retryAfterSeconds);
    return {
      allowed: false,
      response: NextResponse.json(
        { error: "Too Many Requests", reason: result.reason, retryAfter: result.retryAfterSeconds },
        { status: 429, headers }
      ),
    };
  }

  return { allowed: true, headers };
}
