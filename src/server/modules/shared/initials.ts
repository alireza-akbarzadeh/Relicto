/** "Kuro Skins" → "KS", "NyxTrader" → "NY" — the avatar monogram for a trader. */
export function initials(name: string) {
  const parts = name.split(/[\s_]+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}
