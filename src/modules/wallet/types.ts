import type { IconName } from "@/components/ui/icon";

export type WalletTone = "primary" | "amber" | "cyan" | "muted";

export type WalletMetric = {
  id: string;
  label: string;
  icon: IconName;
  value: string;
  description: string;
  foot: string;
  tone: WalletTone;
  live?: boolean;
};

export type WalletRail = { id: string; label: string; icon: IconName };

export type WalletTransaction = {
  id: string;
  icon: IconName;
  title: string;
  hash: string;
  asset: string;
  detail: string;
  node: string;
  amount: string;
  amountTone: "primary" | "amber";
  status: string;
  statusTone: "live" | "cyan" | "amber";
  action: string;
  actionIcon: IconName;
};

export type WalletData = {
  netEquity: string;
  equityChange: string;
  equityNote: string;
  metrics: WalletMetric[];
  depositRails: WalletRail[];
  cashoutRails: WalletRail[];
  transactions: WalletTransaction[];
  /** What can leave the vault right now; the cashout panel's maximum. */
  liquidUsd?: number;
  /** The emergency lock is on. */
  frozen?: boolean;
};
