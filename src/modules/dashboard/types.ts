export type DashboardTab = "overview" | "orders" | "income" | "transactions" | "monitoring" | "users" | "wallet";

export type DashboardKpis = {
  liquidBalanceCents: number;
  escrowLockedCents: number;
  totalIncomeCents: number;
  totalVolumeCents: number;
  ordersCount: number;
  activeEscrowCount: number;
  escrowSuccessRate: number;
  disputesCount: number;
  dailyYieldPct: number;
};

export type IncomeChartPoint = {
  label: string;
  volumeUsd: number;
  incomeUsd: number;
  orders: number;
};

export type GameDistribution = {
  game: string;
  label: string;
  volumeUsd: number;
  count: number;
  color: string;
};

export type DashboardOrder = {
  id: string;
  code: string;
  flow: "buy" | "sell" | "liquidate";
  state: "escrow" | "completed" | "disputed" | "cancelled";
  itemName: string;
  detailSnapshot?: string | null;
  thumbnailUrl?: string | null;
  totalCents: number;
  feeCents: number;
  counterpartyKind?: string | null;
  counterpartyName?: string | null;
  fundingLabel?: string | null;
  placedAt: string;
  completedAt?: string | null;
};

export type DashboardTransaction = {
  id: string;
  kind: "deposit" | "withdrawal" | "purchase" | "sale" | "fee" | "refund" | "promo";
  direction: "credit" | "debit";
  status: "pending" | "settled" | "failed";
  amountCents: number;
  balanceAfterCents: number;
  title: string;
  detailLabel?: string | null;
  venue: string;
  hash?: string | null;
  occurredAt: string;
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar?: string | null;
  role: string;
  roleTone: string;
  tier?: string | null;
  level: number;
  trustScore: number;
  balanceCents: number;
  isFrozen: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
};

export type SystemStatusData = {
  daemonStatus: "online" | "degraded" | "offline";
  activeBots: number;
  pendingSteamOffers: number;
  avgHandoffSeconds: number;
  systemUptimePct: number;
  lastHeartbeat: string;
  escrowVaultHealth: "healthy" | "warning";
};

export type DashboardData = {
  user: {
    id: string;
    name: string;
    handle: string;
    avatarUrl?: string | null;
    role: string;
  };
  kpis: DashboardKpis;
  chartData: IncomeChartPoint[];
  gameBreakdown: GameDistribution[];
  orders: DashboardOrder[];
  transactions: DashboardTransaction[];
  users: DashboardUser[];
  system: SystemStatusData;
};
