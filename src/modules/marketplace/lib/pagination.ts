export type PageEntry = number | "gap";

/**
 * Page buttons around the current page: first pages, a gap, and the last page.
 * `pageWindow(1, 64)` → [1, 2, 3, "gap", 64] (as on the designed screen).
 */
export function pageWindow(current: number, total: number, span = 1): PageEntry[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total]);
  const start = Math.max(1, Math.min(current - span, total - 2 * span - 1));
  for (let p = start; p <= Math.min(total, start + 2 * span); p++) pages.add(p);
  if (current <= 2) [1, 2, 3].forEach((p) => pages.add(p));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? (["gap", page] as PageEntry[]) : [page]));
}
