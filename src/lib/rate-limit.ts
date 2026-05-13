const requestMap = new Map<string, { count: number; windowStart: number }>();

export function checkRateLimit(params: {
  key: string;
  windowMs?: number;
  maxRequests?: number;
}) {
  const { key, windowMs = 60_000, maxRequests = 10 } = params;
  const now = Date.now();
  const current = requestMap.get(key);

  if (!current || now - current.windowStart > windowMs) {
    requestMap.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  requestMap.set(key, current);
  return { allowed: true, remaining: maxRequests - current.count };
}
