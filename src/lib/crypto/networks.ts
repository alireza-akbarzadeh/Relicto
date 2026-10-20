export type CryptoAsset = "usdt" | "usdc" | "eth" | "btc" | "sol";

export type CryptoNetwork = {
  id: string;
  name: string;
  asset: CryptoAsset;
  symbol: string;
  usdRate: number;
  decimals: number;
  depositAddress: string;
  type: "evm" | "solana" | "bitcoin" | "tron";
  badge: string;
  memoRequired?: boolean;
};

export const CRYPTO_NETWORKS: CryptoNetwork[] = [
  {
    id: "usdt-trc20",
    name: "Tron (TRC-20)",
    asset: "usdt",
    symbol: "USDT",
    usdRate: 1.0,
    decimals: 6,
    depositAddress: "TYDzsYUEpvnYmQk4zGP9sWWcTEd3YiAtW6",
    type: "tron",
    badge: "1-Click TronLink · 3s Finality",
  },
  {
    id: "usdt-arb",
    name: "Arbitrum One",
    asset: "usdt",
    symbol: "USDT",
    usdRate: 1.0,
    decimals: 6,
    depositAddress: "0x71C2B91979A464161B1B1556BFeA556cE518aB93",
    type: "evm",
    badge: "Lowest Gas (<$0.01)",
  },
  {
    id: "usdc-base",
    name: "Base",
    asset: "usdc",
    symbol: "USDC",
    usdRate: 1.0,
    decimals: 6,
    depositAddress: "0x71C2B91979A464161B1B1556BFeA556cE518aB93",
    type: "evm",
    badge: "Zero Gas Relayed",
  },
  {
    id: "eth-mainnet",
    name: "Ethereum",
    asset: "eth",
    symbol: "ETH",
    usdRate: 3450.0,
    decimals: 18,
    depositAddress: "0x71C2B91979A464161B1B1556BFeA556cE518aB93",
    type: "evm",
    badge: "Layer 1 Vault",
  },
  {
    id: "sol-mainnet",
    name: "Solana",
    asset: "sol",
    symbol: "SOL",
    usdRate: 168.0,
    decimals: 9,
    depositAddress: "7EYnhQoR9YM3N7UoaKRoA44BW8PYAK59GrnNnQQ2VoVL",
    type: "solana",
    badge: "400ms Finality",
  },
  {
    id: "btc-native",
    name: "Bitcoin (SegWit)",
    asset: "btc",
    symbol: "BTC",
    usdRate: 94500.0,
    decimals: 8,
    depositAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    type: "bitcoin",
    badge: "Deep Cold Storage",
  },
];

export function calculateCryptoAmount(usdTotal: number, network: CryptoNetwork): string {
  const raw = usdTotal / network.usdRate;
  if (network.usdRate === 1.0) return raw.toFixed(2);
  if (network.asset === "eth" || network.asset === "sol") return raw.toFixed(4);
  return raw.toFixed(6);
}

export function isValidCryptoTxHash(type: CryptoNetwork["type"], hash: string): boolean {
  const trimmed = hash.trim();
  if (!trimmed) return false;
  if (type === "evm") return /^0x[a-fA-F0-9]{64}$/.test(trimmed);
  if (type === "solana") return /^[1-9A-HJ-NP-za-km-z]{64,88}$/.test(trimmed);
  if (type === "bitcoin") return /^[a-fA-F0-9]{64}$/.test(trimmed);
  if (type === "tron") return /^[a-fA-F0-9]{64}$/.test(trimmed) || /^0x[a-fA-F0-9]{64}$/.test(trimmed);
  return trimmed.length >= 24;
}
