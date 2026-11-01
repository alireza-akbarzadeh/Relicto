/**
 * Safely escapes characters that have special meaning in SQL LIKE / ILIKE clauses:
 * - `%` (matches any sequence of zero or more characters)
 * - `_` (matches any single character)
 * - `\` (escape character itself)
 *
 * Prevents wildcard injection attacks where users craft queries like `%_%`
 * to bypass intended search filters or cause high CPU consumption / sequential scans.
 */
export function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Returns an escaped substring pattern for ILIKE: `%<escaped>%`
 */
export function containsPattern(term: string): string {
  return `%${escapeLike(term)}%`;
}

/**
 * Returns an escaped prefix pattern for ILIKE: `<escaped>%`
 */
export function startsWithPattern(term: string): string {
  return `${escapeLike(term)}%`;
}

