export type DashboardTab =
  | "overview"
  | "orders"
  | "income"
  | "transactions"
  | "listings"
  | "catalog"
  | "tournaments"
  | "wiki"
  | "community"
  | "promotions"
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

export type DashboardCatalogItem = {
  id: string;
  slug: string;
  name: string;
  gameId: string;
  rarity?: string | null;
  slot?: string | null;
  imageUrl?: string | null;
  collection?: string | null;
  minFloat?: number | null;
  maxFloat?: number | null;
  activeListingsCount: number;
  floorPriceCents?: number | null;
  updatedAt: string;
};

export type DashboardTournament = {
  id: string;
  slug: string;
  name: string;
  gameId: string;
  prizePoolCents: number;
  status: "upcoming" | "live" | "completed";
  format?: string | null;
  entrantCount: number;
  featured: boolean;
  startsAt?: string | null;
};

export type DashboardMatch = {
  id: string;
  tournamentId: string;
  tournamentName: string;
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  status: "scheduled" | "live" | "completed";
  round?: string | null;
  startsAt?: string | null;
};

export type DashboardWikiGuide = {
  id: string;
  slug: string;
  gameId?: string | null;
  category: string;
  title: string;
  summary: string;
  kind: "phase" | "seed" | "gem" | "formula";
  readMinutes?: number | null;
  updatedAt: string;
};

export type DashboardCommunityPost = {
  id: string;
  authorId: string;
  authorHandle: string;
  guildName?: string | null;
  tag?: string | null;
  title: string;
  body: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};

export type DashboardPromoCode = {
  id: string;
  code: string;
  discountBps: number;
  gameId: string;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string | null;
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
  // Financial & Escrow economics
  platformFeeBps: number;
  vipFeeBps: number;
  minDepositUsd: number;
  maxDepositUsd: number;
  maxWithdrawalUsd: number;
  autoCancelTimeoutSeconds: number;
  tradeUpFeeBps: number;
  minTrustScoreCashout: number;

  // Game Ecosystem Switches
  enableCs2: boolean;
  enableDota2: boolean;
  enableTf2: boolean;
  enableRust: boolean;

  // Security, Automation & Emergency
  maintenanceMode: boolean;
  maintenanceNotice?: string | null;
  steamDaemonAutoDispatch: boolean;
  requireManualApprovalAboveUsd: number;
  restrictRegistrations: boolean;

  // Broadcast & Announcement
  activeAnnouncement?: string | null;
  announcementActive: boolean;
  announcementSeverity: "info" | "warning" | "critical" | "success";
  announcementLink?: string | null;

  // Identity & Support
  platformName: string;
  supportEmail: string;
  discordUrl: string;
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
  catalog: DashboardCatalogItem[];
  tournamentsList: DashboardTournament[];
  matchesList: DashboardMatch[];
  wikiGuides: DashboardWikiGuide[];
  communityPosts: DashboardCommunityPost[];
  promoCodes: DashboardPromoCode[];
  disputes: DashboardDispute[];
  settings: DashboardSettings;
  system: SystemStatusData;
  auditLogs: DashboardAuditLog[];
};
