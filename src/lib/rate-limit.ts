/**
 * Sliding-window rate limit. Uses Upstash REST when configured, otherwise an in-memory map
 * (adequate for a single serverless instance; Upstash makes it distributed).
 */
const memory = new Map<string, number[]>();

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const now = Date.now();
  if (url && token) {
    try {
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          ["ZREMRANGEBYSCORE", key, 0, now - windowMs],
          ["ZADD", key, now, `${now}-${Math.random()}`],
          ["ZCARD", key],
          ["PEXPIRE", key, windowMs],
        ]),
      });
      const json = (await res.json()) as { result: number }[];
      return (json[2]?.result ?? 0) <= limit;
    } catch {
      /* fall through to memory */
    }
  }
  const hits = (memory.get(key) ?? []).filter((t) => t > now - windowMs);
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.clear();
  return hits.length <= limit;
}
