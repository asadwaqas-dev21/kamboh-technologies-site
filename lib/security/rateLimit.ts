type RateLimitRecord = {
  count: number;
  resetAt: number;
};

// In-memory store for IP rate limiting
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    ipStore.forEach((val, key) => {
      if (now > val.resetAt) {
        ipStore.delete(key);
      }
    });
  }, 300000);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export type RateLimitOptions = {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
};

/**
 * Checks if the request exceeds rate limits.
 * Returns { allowed: boolean, remaining: number, retryAfterSeconds: number }
 */
export function checkRateLimit(
  request: Request,
  options: RateLimitOptions = { maxRequests: 5, windowMs: 600000 }
) {
  const ip = getClientIp(request);
  const key = `${options.keyPrefix || "general"}:${ip}`;
  const now = Date.now();

  const record = ipStore.get(key);

  if (!record || now > record.resetAt) {
    ipStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      retryAfterSeconds: 0,
    };
  }

  if (record.count >= options.maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: retryAfter > 0 ? retryAfter : 1,
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    retryAfterSeconds: 0,
  };
}
