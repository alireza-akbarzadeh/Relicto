const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "14m ago", "1h 42m ago", "2d 11h ago" — the relative stamp used across the
 * feed, the codex, alerts and the seller studio. Each unit carries the next one
 * down while it is non-zero, so nothing reads coarser than it needs to.
 */
export function ago(at: Date, now = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - at.getTime());

  if (elapsed < HOUR) return `${Math.max(1, Math.round(elapsed / MINUTE))}m ago`;

  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    const minutes = Math.round((elapsed % HOUR) / MINUTE);
    return minutes > 0 ? `${hours}h ${minutes}m ago` : `${hours}h ago`;
  }

  const days = Math.floor(elapsed / DAY);
  const hours = Math.floor((elapsed % DAY) / HOUR);
  return hours > 0 ? `${days}d ${hours}h ago` : `${days}d ago`;
}
