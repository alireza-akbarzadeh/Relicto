import { z } from "zod";

/** Cashout rails the desktop and mobile egress panels offer. */
export const CASHOUT_RAILS = ["usdt", "sepa", "keys", "visa"] as const;
export type CashoutRail = (typeof CASHOUT_RAILS)[number];

/** Multi-chain crypto networks supported for Web3 liquidity. */
export const CRYPTO_NETWORKS = ["trc20", "arbitrum", "base", "solana", "polygon", "ethereum"] as const;
export type CryptoNetwork = (typeof CRYPTO_NETWORKS)[number];

export interface CryptoNetworkConfig {
  id: CryptoNetwork;
  name: string;
  chain: string;
  feeUsd: number;
  eta: string;
  addressPattern: RegExp;
  placeholder: string;
}

export const CRYPTO_NETWORK_CONFIGS: Record<CryptoNetwork, CryptoNetworkConfig> = {
  trc20: {
    id: "trc20",
    name: "TRON (TRC-20)",
    chain: "Tron",
    feeUsd: 1.0,
    eta: "< 60s",
    addressPattern: /^T[a-km-zA-HJ-NP-Z1-9]{33}$/,
    placeholder: "T...",
  },
  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum One (L2)",
    chain: "Arbitrum",
    feeUsd: 0.2,
    eta: "< 30s",
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    placeholder: "0x...",
  },
  base: {
    id: "base",
    name: "Base (L2)",
    chain: "Base",
    feeUsd: 0.15,
    eta: "< 15s",
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    placeholder: "0x...",
  },
  solana: {
    id: "solana",
    name: "Solana",
    chain: "Solana",
    feeUsd: 0.05,
    eta: "< 10s",
    addressPattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    placeholder: "Solana address...",
  },
  polygon: {
    id: "polygon",
    name: "Polygon (PoS)",
    chain: "Polygon",
    feeUsd: 0.1,
    eta: "< 30s",
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    placeholder: "0x...",
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum (ERC-20)",
    chain: "Ethereum",
    feeUsd: 3.5,
    eta: "2-5m",
    addressPattern: /^0x[a-fA-F0-9]{40}$/,
    placeholder: "0x...",
  },
};

/** Liquidation rate: $2.05 USD per TF2 Mann Co. Supply Crate Key. */
export const TF2_KEY_RATE_USD = 2.05;

export function calculateKeysFromUsd(amountUsd: number): number {
  if (amountUsd <= 0) return 0;
  return Math.floor(amountUsd / TF2_KEY_RATE_USD);
}

export function validateCryptoAddress(network: CryptoNetwork, address: string): { valid: boolean; error?: string } {
  const trimmed = address.trim();
  if (!trimmed) return { valid: false, error: "Address cannot be empty" };
  const config = CRYPTO_NETWORK_CONFIGS[network];
  if (!config) return { valid: true };
  if (!config.addressPattern.test(trimmed)) {
    return { valid: false, error: `Invalid ${config.name} format. Expected format like ${config.placeholder}` };
  }
  return { valid: true };
}

export const cashoutInput = z.object({
  rail: z.enum(CASHOUT_RAILS),
  network: z.enum(CRYPTO_NETWORKS).optional(),
  amountUsd: z.number().positive().max(20_000),
  destinationAddress: z.string().trim().max(256).optional(),
  steamGuardCode: z.string().trim().max(16).optional(),
});
export type CashoutInput = z.infer<typeof cashoutInput>;

export const freezeInput = z.object({ frozen: z.boolean() });
export type FreezeInput = z.infer<typeof freezeInput>;

/** Money rails the deposit panel offers. "skins" is liquidation, which the sell studio handles. */
export const DEPOSIT_RAILS = ["crypto", "cards", "bank"] as const;
export type DepositRail = (typeof DEPOSIT_RAILS)[number];

export const depositInput = z.object({
  rail: z.enum(DEPOSIT_RAILS),
  network: z.enum(CRYPTO_NETWORKS).optional(),
  amountUsd: z.number().positive().max(10_000),
  txHash: z.string().trim().max(128).optional(),
});
export type DepositInput = z.infer<typeof depositInput>;

