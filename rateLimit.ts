/** Simple in-memory limiter (per server instance): 20 generations per user per hour. Use Redis/Upstash for multi-instance hosting. */
const hits = new Map<string, number[]>();
export function allow(uid: string, max = 20, windowMs = 3_600_000): boolean {
  const now = Date.now(), list = (hits.get(uid) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= max) { hits.set(uid, list); return false; }
  list.push(now); hits.set(uid, list); return true;
}
