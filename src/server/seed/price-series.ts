const DAY_MS = 86_400_000;
const POINTS = 30;

/** Deterministic pseudo-random in [0,1) so reseeding produces the same chart. */
function hashNoise(seed: string, index: number) {
  let hash = 2166136261;
  const input = `${seed}:${index}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 1000) / 1000;
}

/**
 * Walks backwards from today's price to where it sat before `changePercent`,
 * with small deterministic jitter so the detail chart has texture.
 */
export function buildPriceSeries(currentCents: number, changePercent: number, seed: string) {
  const startCents = Math.round(currentCents / (1 + changePercent / 100));
  const now = Date.now();

  return Array.from({ length: POINTS }, (_, index) => {
    const progress = index / (POINTS - 1);
    const trend = startCents + (currentCents - startCents) * progress;
    // ±2% wobble, flattening to zero on the final (live) point.
    const wobble = (hashNoise(seed, index) - 0.5) * 0.04 * (1 - progress);
    const priceCents = index === POINTS - 1 ? currentCents : Math.max(1, Math.round(trend * (1 + wobble)));

    return {
      priceCents,
      recordedAt: new Date(now - (POINTS - 1 - index) * DAY_MS),
    };
  });
}
