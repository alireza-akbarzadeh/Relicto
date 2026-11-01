import { z } from "zod";

export const ALLOWED_CRYPTO_NETWORK_IDS = [
  "usdt-trc20",
  "usdt-arb",
  "usdc-base",
  "eth-mainnet",
  "sol-mainnet",
  "btc-native",
] as const;

export const cryptoVerifyInputSchema = z
  .object({
    networkId: z.enum(ALLOWED_CRYPTO_NETWORK_IDS),
    txHash: z.string().trim().min(24).max(128).regex(/^[a-zA-Z0-9_-]+$/, "Invalid transaction hash format"),
    amountUsd: z.number().finite().positive().min(1, "Minimum deposit is $1 USD").max(100_000, "Maximum deposit is $100,000 USD"),
  })
  .strict();

export type CryptoVerifyInput = z.infer<typeof cryptoVerifyInputSchema>;

export const tronVerifyInputSchema = z
  .object({
    txHash: z
      .string()
      .trim()
      .min(32)
      .max(128)
      .regex(/^(0x)?[a-fA-F0-9]+$/, "Invalid TRON transaction hash hex format"),
    amountUsd: z.number().finite().positive().min(1, "Minimum deposit is $1 USD").max(100_000, "Maximum deposit is $100,000 USD"),
    expectedRecipient: z.string().trim().min(20).max(64).optional(),
  })
  .strict();

export type TronVerifyInput = z.infer<typeof tronVerifyInputSchema>;

