/**
 * Steam Trade Offer URL helpers.
 * Format: https://steamcommunity.com/tradeoffer/new/?partner=XXXXXXX&token=YYYYYYYY
 */

const STEAM_TRADE_URL_REGEX =
  /^https?:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=(\d+)&token=([a-zA-Z0-9_-]+)$/;

export type ParsedTradeUrl = {
  valid: boolean;
  partnerId?: string;
  token?: string;
  error?: string;
};

export function parseTradeUrl(url: string): ParsedTradeUrl {
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, error: "Trade URL cannot be empty" };
  }

  const match = trimmed.match(STEAM_TRADE_URL_REGEX);
  if (!match) {
    return {
      valid: false,
      error: "Invalid format. Expected: https://steamcommunity.com/tradeoffer/new/?partner=...&token=...",
    };
  }

  return {
    valid: true,
    partnerId: match[1],
    token: match[2],
  };
}

export function isValidTradeUrl(url: string): boolean {
  return STEAM_TRADE_URL_REGEX.test(url.trim());
}
