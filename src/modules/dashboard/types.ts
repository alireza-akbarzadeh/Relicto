export type DashboardTab =
  | "overview"
  | "orders"
  | "income"
  | "transactions"
  | "listings"
  | "disputes"
  | "users"
  | "monitoring"
  | "settings"
  | "audit"
  | "wallet";

export type DashboardAuditLog = {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details: string;
  severity: "info" | "warning" | "critical";
  createdAt: string;
};

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

export type DashboardListing = {
  id: string;
  itemName: string;
  category: string;
  gameId: string;
  sellerId: string;
  sellerHandle: string;
  priceCents: number;
  status: "active" | "reserved" | "sold" | "cancelled";
  wear?: string | null;
  float?: number | null;
  paintSeed?: number | null;
  stattrak: boolean;
  listedAt: string;
  floorCents?: number | null;
};

export type DashboardDispute = {
  id: string;
  orderCode: string;
  itemName: string;
  buyerName: string;
  sellerName: string;
  amountCents: number;
  reason: string;
  status: "open" | "under_review" | "resolved_buyer" | "resolved_seller";
  openedAt: string;
  evidenceCount: number;
};

export type DashboardSettings = {
  platformFeeBps: number;
  vipFeeBps: number;
  maxWithdrawalUsd: number;
  autoCancelTimeoutSeconds: number;
  maintenanceMode: boolean;
  activeAnnouncement?: string | null;
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
  listings: DashboardListing[];
  disputes: DashboardDispute[];
  settings: DashboardSettings;
  system: SystemStatusData;
  auditLogs: DashboardAuditLog[];
};
