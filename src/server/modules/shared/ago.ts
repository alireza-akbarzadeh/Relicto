const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "14m ago", "1h 42m ago", "3d ago" — the feed's relative stamp. */
export function ago(at: Date, now = new Date()): string {
  const elapsed = Math.max(0, now.getTime() - at.getTime());

  if (elapsed < HOUR) return `${Math.max(1, Math.round(elapsed / MINUTE))}m ago`;

  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    const minutes = Math.round((elapsed % HOUR) / MINUTE);
    return minutes > 0 ? `${hours}h ${minutes}m ago` : `${hours}h ago`;
  }

  return `${Math.round(elapsed / DAY)}d ago`;
}
