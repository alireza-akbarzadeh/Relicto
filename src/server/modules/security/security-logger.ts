import "server-only";

export type SecuritySeverity = "info" | "warning" | "error" | "critical";

export type SecurityEventType =
  | "AUTH_FAILURE"
  | "AUTHZ_FAILURE"
  | "RATE_LIMIT_EXCEEDED"
  | "CSRF_VIOLATION"
  | "SSRF_BLOCKED"
  | "SENSITIVE_CONFIG_CHANGE"
  | "FINANCIAL_TRANSACTION"
  | "DISPUTE_EVENT"
  | "SECURITY_ALERT";

export interface SecurityLogPayload {
  event: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string | null;
  clientIp?: string | null;
  endpoint?: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

const SENSITIVE_KEY_PATTERN =
  /password|secret|token|authorization|cookie|seed|api_?key|private_?key|cvv|credit_?card/i;

function isPlainObject(item: unknown): item is Record<string, unknown> {
  return typeof item === "object" && item !== null && !Array.isArray(item);
}

/**
 * Recursively redacts passwords, tokens, auth headers, and crypto seeds from any object.
 */
export function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Redact Bearer tokens in raw strings
    let sanitized = data.replace(/Bearer\s+[a-zA-Z0-9_\-.]+/gi, "Bearer [REDACTED]");
    // Redact obvious token/password query params in URLs
    sanitized = sanitized.replace(/([?&](?:key|token|secret|password|api_?key)=)[^&]+/gi, "$1[REDACTED]");
    return sanitized;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item));
  }

  if (isPlainObject(data)) {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.toLowerCase().includes("email") && typeof value === "string") {
        output[key] = maskEmail(value);
      } else if (SENSITIVE_KEY_PATTERN.test(key) && !isPlainObject(value) && !Array.isArray(value)) {
        output[key] = "[REDACTED]";
      } else if (SENSITIVE_KEY_PATTERN.test(key) && Array.isArray(value)) {
        output[key] = value.map(() => "[REDACTED]");
      } else {
        output[key] = redactSensitiveData(value);
      }
    }
    return output;
  }

  return data;
}

/**
 * Masks an email address for privacy: user@example.com -> u***@example.com
 */
export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "[INVALID_EMAIL]";
  const name = parts[0] || "";
  const domain = parts[1] || "";
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0] || "*"}***`;
  return `${maskedName}@${domain}`;
}

/**
 * Strips internal stack traces and database paths when returning errors to clients in production.
 */
export function sanitizeErrorForClient(err: unknown, fallbackMessage = "An internal error occurred"): string {
  if (process.env.NODE_ENV === "production") {
    return fallbackMessage;
  }
  if (err instanceof Error) {
    // In dev, return clean message without full internal directory stack
    return err.message.replace(/[A-Z]:\\[^\n]+/g, "[internal path]");
  }
  return typeof err === "string" ? err : fallbackMessage;
}

class SecurityLogger {
  log(payload: SecurityLogPayload): void {
    const sanitizedMetadata = payload.metadata ? (redactSensitiveData(payload.metadata) as Record<string, unknown>) : undefined;

    const logEntry = {
      timestamp: payload.timestamp || new Date().toISOString(),
      level: payload.severity,
      event: payload.event,
      message: payload.message,
      userId: payload.userId || null,
      clientIp: payload.clientIp || null,
      endpoint: payload.endpoint || null,
      metadata: sanitizedMetadata,
    };

    const formatted = `[SECURITY][${logEntry.level.toUpperCase()}][${logEntry.event}] ${logEntry.message}`;

    if (payload.severity === "critical" || payload.severity === "error") {
      console.error(formatted, logEntry);
    } else if (payload.severity === "warning") {
      console.warn(formatted, logEntry);
    } else {
      console.info(formatted, logEntry);
    }
  }

  warn(event: SecurityEventType, message: string, details?: Partial<SecurityLogPayload>): void {
    this.log({
      event,
      severity: "warning",
      message,
      ...details,
    });
  }

  error(event: SecurityEventType, message: string, details?: Partial<SecurityLogPayload>): void {
    this.log({
      event,
      severity: "error",
      message,
      ...details,
    });
  }

  critical(event: SecurityEventType, message: string, details?: Partial<SecurityLogPayload>): void {
    this.log({
      event,
      severity: "critical",
      message,
      ...details,
    });
  }

  info(event: SecurityEventType, message: string, details?: Partial<SecurityLogPayload>): void {
    this.log({
      event,
      severity: "info",
      message,
      ...details,
    });
  }
}

export const securityLog = new SecurityLogger();
