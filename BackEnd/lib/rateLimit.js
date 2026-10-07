export function createLimiter({ limit, windowMs, now = Date.now, maxKeys = 10_000 }) {
  const hits = new Map(); // key -> timestamps[]

  function sweep(t) {
    for (const [k, v] of hits) {
      if (v.every((x) => t - x >= windowMs)) hits.delete(k);
    }
  }

  return {
    hit(key) {
      const t = now();
      if (hits.size >= maxKeys) sweep(t);
      const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
    size: () => hits.size,
  };
}
