/**
 * Simple in-memory rate limiting
 * Note: For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration
 */
const RATE_LIMITS = {
  default: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  ai: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 AI requests per minute
};

/**
 * Check if request is within rate limit
 */
export function checkRateLimit(
  userId: string,
  type: 'default' | 'ai' = 'default'
): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = RATE_LIMITS[type];
  const key = `${userId}:${type}`;
  const now = Date.now();

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + limit.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    return {
      allowed: true,
      remaining: limit.maxRequests - 1,
      resetAt: newEntry.resetTime,
    };
  }

  if (entry.count >= limit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limit.maxRequests - entry.count,
    resetAt: entry.resetTime,
  };
}

/**
 * Clean up expired entries (run periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

