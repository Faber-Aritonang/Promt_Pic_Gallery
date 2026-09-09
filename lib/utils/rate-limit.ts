// Simple in-memory rate limiter for API routes.
// For production, consider using Redis-backed rate limiting.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum requests per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key (e.g. IP address or user ID).
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get client IP from request headers.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Check rate limit and return error Response if exceeded.
 * Returns null if allowed.
 */
export function enforceRateLimit(
  request: Request,
  config: RateLimitConfig
): Response | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, config);

  if (!result.allowed) {
    return Response.json(
      {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Rate limit configs for different endpoints.
 */
export const RATE_LIMITS = {
  /** Chat endpoints — more generous for conversation flow */
  chat: { maxRequests: 30, windowMs: 60_000 } as RateLimitConfig,
  /** Image generation — expensive, limit tightly */
  generate: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
  /** Auth endpoints — protect against brute force */
  auth: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  /** General API — generous default */
  default: { maxRequests: 60, windowMs: 60_000 } as RateLimitConfig,
} as const;
