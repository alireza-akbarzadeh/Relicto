interface ClientRecord {
  timestamps: number[];
  lastRequestTime: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
  reason?: string;
}

// Configurable thresholds to prevent expensive Gemini API costs
const WINDOW_MS = 60 * 1000; // 1-minute sliding window
const MAX_PER_WINDOW = 6; // Max 6 AI requests per minute per IP
const MIN_INTERVAL_MS = 3000; // Minimum 3s cooldown between calls
const MAX_PER_HOUR = 30; // Max 30 AI requests per hour
const HOUR_MS = 60 * 60 * 1000;

// In-memory rate limiting map
const clientRecords = new Map<string, ClientRecord>();

// Simple TTL Response Cache to reuse answers and eliminate duplicate API calls
interface CachedAnswer {
  reply: string;
  diagnostic?: unknown;
  modelUsed: string;
  expiresAt: number;
}
const responseCache = new Map<string, CachedAnswer>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15-minute response cache

/**
 * Periodically purge stale records to prevent memory growth.
 */
function cleanupStaleRecords(now: number) {
  if (clientRecords.size > 2000) {
    for (const [key, record] of clientRecords.entries()) {
      if (now - record.lastRequestTime > HOUR_MS) {
        clientRecords.delete(key);
      }
    }
  }
  if (responseCache.size > 500) {
    for (const [key, item] of responseCache.entries()) {
      if (now > item.expiresAt) {
        responseCache.delete(key);
      }
    }
  }
}

/**
 * Checks and records an AI call attempt for an identifier (e.g. IP address or User ID).
 */
export function checkAiRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  cleanupStaleRecords(now);

  const key = identifier || "127.0.0.1";
  let record = clientRecords.get(key);

  if (!record) {
    record = { timestamps: [], lastRequestTime: 0 };
    clientRecords.set(key, record);
  }

  // 1. Minimum interval cooldown check (3s burst protection)
  const timeSinceLast = now - record.lastRequestTime;
  if (record.lastRequestTime > 0 && timeSinceLast < MIN_INTERVAL_MS) {
    const retryAfterSeconds = Math.ceil((MIN_INTERVAL_MS - timeSinceLast) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: retryAfterSeconds,
      retryAfterSeconds,
      reason: `Please wait ${retryAfterSeconds}s between AI queries to prevent spam.`,
    };
  }

  // Filter timestamps within the 1-hour window
  record.timestamps = record.timestamps.filter((ts) => now - ts < HOUR_MS);

  // 2. Hourly quota check
  if (record.timestamps.length >= MAX_PER_HOUR) {
    const oldestInHour = record.timestamps[0] || now;
    const retryAfterSeconds = Math.ceil((HOUR_MS - (now - oldestInHour)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: retryAfterSeconds,
      retryAfterSeconds,
      reason: `Hourly AI quota reached (max ${MAX_PER_HOUR}/hr). Retry in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
    };
  }

  // 3. Sliding 1-minute window check
  const recentInWindow = record.timestamps.filter((ts) => now - ts < WINDOW_MS);
  if (recentInWindow.length >= MAX_PER_WINDOW) {
    const oldestInWindow = recentInWindow[0] || now;
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - oldestInWindow)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: retryAfterSeconds,
      retryAfterSeconds,
      reason: `Rate limit exceeded (max ${MAX_PER_WINDOW}/min). Cooldown for ${retryAfterSeconds}s.`,
    };
  }

  // Record this valid request
  record.timestamps.push(now);
  record.lastRequestTime = now;

  const remaining = Math.max(0, MAX_PER_WINDOW - (recentInWindow.length + 1));
  return {
    allowed: true,
    remaining,
    resetSeconds: Math.ceil(WINDOW_MS / 1000),
    retryAfterSeconds: 0,
  };
}

/**
 * Normalizes query string for cost-saving cache lookups.
 */
function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Retrieves a cached AI response if available and not expired.
 */
export function getCachedAiResponse(
  message: string
): { reply: string; diagnostic?: unknown; modelUsed: string } | null {
  const key = normalizeQuery(message);
  if (!key) return null;

  const entry = responseCache.get(key);
  if (entry && Date.now() < entry.expiresAt) {
    return {
      reply: entry.reply,
      diagnostic: entry.diagnostic,
      modelUsed: `${entry.modelUsed} (Cached)`,
    };
  }
  return null;
}

/**
 * Stores an AI response in cache to avoid repeat API costs.
 */
export function setCachedAiResponse(
  message: string,
  reply: string,
  modelUsed: string,
  diagnostic?: unknown
): void {
  const key = normalizeQuery(message);
  if (!key || reply.length < 10) return;

  responseCache.set(key, {
    reply,
    diagnostic,
    modelUsed,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}
