const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

/**
 * Validates whether a given string is a plausible TRON Base58Check address.
 * Valid TRON addresses start with 'T', contain 34 Base58 characters.
 */
export function isValidTronAddress(address: string): boolean {
  if (typeof address !== "string") return false;
  const trimmed = address.trim();
  if (trimmed.length !== 34) return false;
  if (!trimmed.startsWith("T")) return false;
  for (let i = 0; i < trimmed.length; i++) {
    if (!ALPHABET.includes(trimmed[i])) return false;
  }
  return true;
}

/**
 * Validates whether a given string is a valid TRON transaction hash (64 hex characters).
 */
export function isValidTronTxId(txid: string): boolean {
  if (typeof txid !== "string") return false;
  const clean = txid.trim().replace(/^0x/, "");
  return /^[0-9a-fA-F]{64}$/.test(clean);
}

/**
 * Formats a TRON address for compact display (e.g. TR7N...6t).
 */
export function formatTronAddress(address: string, lead = 6, tail = 4): string {
  if (!address || address.length < lead + tail) return address;
  return `${address.slice(0, lead)}...${address.slice(-tail)}`;
}

/**
 * Normalizes hex address into 41-prefixed TRON format.
 */
export function normalizeTronHexAddress(hex: string): string {
  const clean = hex.replace(/^0x/, "").toLowerCase();
  if (clean.length === 42 && clean.startsWith("41")) return clean;
  if (clean.length === 40) return `41${clean}`;
  return clean;
}
