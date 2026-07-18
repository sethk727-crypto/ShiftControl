import "server-only";

/**
 * Sliding-window login rate limiter, keyed by IP.
 * In-memory: correct for a single long-lived Node process. If you deploy
 * to serverless/multi-instance, back this with Redis/Upstash instead —
 * the call-site contract stays identical.
 */
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 10;

const attempts = new Map<string, number[]>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (attempts.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil(
      (timestamps[0] + WINDOW_MS - now) / 1000,
    );
    attempts.set(key, timestamps);
    return { allowed: false, retryAfterSeconds };
  }

  timestamps.push(now);
  attempts.set(key, timestamps);

  // Opportunistic GC so the map can't grow unbounded
  if (attempts.size > 10_000) {
    for (const [k, v] of attempts) {
      if (v.every((t) => t <= windowStart)) attempts.delete(k);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

export function clearRateLimit(key: string): void {
  attempts.delete(key);
}
