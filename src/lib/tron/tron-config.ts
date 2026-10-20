export type TronNetworkType = "mainnet" | "nile";

export const TRON_CONFIG = {
  mainnet: {
    name: "TRON Mainnet",
    fullNode: "https://api.trongrid.io",
    explorerTx: "https://tronscan.org/#/transaction/",
    usdtContract: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    usdtContractHex: "41a614f803b6fd780986a42c78ec9c7f77e6ded13c",
    requiredConfirmations: 12,
  },
  nile: {
    name: "TRON Nile Testnet",
    fullNode: "https://nile.trongrid.io",
    explorerTx: "https://nile.tronscan.org/#/transaction/",
    usdtContract: "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
    usdtContractHex: "41ee07a0c10f81d8c1c4f526b7eebe21bc9e900c73",
    requiredConfirmations: 6,
  },
} as const;

export function getTronNetwork(): TronNetworkType {
  const env = (process.env.NEXT_PUBLIC_TRON_NETWORK || process.env.TRON_NETWORK || "mainnet").toLowerCase();
  return env === "nile" ? "nile" : "mainnet";
}

export function getActiveTronConfig() {
  return TRON_CONFIG[getTronNetwork()];
}

export const TRC20_TRANSFER_TOPIC = "ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
