import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { items, ledgerEntries, orderItems, orders, profiles, user, walletAccounts } from "@/lib/db/schema";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import type { DashboardData, DashboardOrder, DashboardTransaction, DashboardUser } from "../types";
import { buildChartSeries, buildGameDistribution, calculateKpis } from "./dashboard-aggregates";
import { getAdminListings } from "./get-admin-listings";
import { getAdminDisputes } from "./get-admin-disputes";
import { getAdminAuditLogs } from "./get-admin-audit-logs";
import { getAdminCatalog } from "./get-admin-catalog";
import { getAdminTournaments } from "./get-admin-tournaments";
import { getAdminWiki } from "./get-admin-wiki";
import { getAdminCommunity } from "./get-admin-community";
import { getAdminPromos } from "./get-admin-promos";
import { settingsService } from "@/server/modules/settings/settings.service";

export async function getDashboardData(): Promise<DashboardData> {
  const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
  const userId = authedUserId ?? "usr_demo";
  const userHandle = session?.user?.handle ?? "trader_one";
  const userAvatar = session?.user?.avatar ?? null;
  const userRole = session?.user?.role ?? "Verified Operator";

  // Fetch or create user wallet
  const [wallet] = await db.select().from(walletAccounts).where(eq(walletAccounts.userId, userId)).limit(1);
  const liquidBalanceCents = wallet?.balanceCents ?? 154000;

  // Fetch recent orders with items
  const rawOrders = await db
    .select({
      order: orders,
      item: orderItems,
      gameId: items.gameId,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .orderBy(desc(orders.placedAt))
    .limit(20);

  const mappedOrders: DashboardOrder[] = rawOrders.map((r) => ({
    id: r.order.id,
    code: r.order.code,
    flow: r.order.flow,
    state: r.order.state,
    itemName: r.item?.nameSnapshot ?? "Field Combat Asset",
    detailSnapshot: r.item?.detailSnapshot ?? "Factory New • Non-duped",
    thumbnailUrl: r.order.thumbnailUrl,
    totalCents: r.order.totalCents,
    feeCents: r.order.feeCents,
    counterpartyKind: r.order.counterpartyKind,
    counterpartyName: r.order.counterpartyName,
    fundingLabel: r.order.fundingLabel,
    placedAt: r.order.placedAt.toISOString(),
    completedAt: r.order.completedAt?.toISOString(),
  }));

  // Fetch recent ledger entries
  const rawEntries = wallet
    ? await db
        .select()
        .from(ledgerEntries)
        .where(eq(ledgerEntries.walletId, wallet.id))
        .orderBy(desc(ledgerEntries.occurredAt))
        .limit(25)
    : [];

  const mappedTransactions: DashboardTransaction[] = rawEntries.map((e) => ({
    id: e.id,
    kind: e.kind,
    direction: e.direction,
    status: e.status,
    amountCents: e.amountCents,
    balanceAfterCents: e.balanceAfterCents,
    title: e.title ?? `${e.kind.toUpperCase()} Transaction`,
    detailLabel: e.detailLabel,
    venue: e.venue,
    hash: e.hash,
    occurredAt: e.occurredAt.toISOString(),
  }));

  // Fetch users with profiles & wallets
  const rawUsers = await db
    .select({
      user,
      profile: profiles,
      wallet: walletAccounts,
    })
    .from(user)
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .leftJoin(walletAccounts, eq(walletAccounts.userId, user.id))
    .limit(50);

  const mappedUsers: DashboardUser[] = rawUsers.map((r) => ({
    id: r.user.id,
    name: r.user.name,
    email: r.user.email,
    handle: r.profile?.handle ?? r.user.name,
    avatar: r.profile?.avatar ?? r.user.image,
    role: r.profile?.role ?? "Trader",
    roleTone: r.profile?.roleTone ?? "muted",
    tier: r.profile?.tier ?? "Standard",
    level: r.profile?.level ?? 1,
    trustScore: r.profile?.trustScore ?? 98,
    balanceCents: r.wallet?.balanceCents ?? 0,
    isFrozen: Boolean(r.wallet?.frozenAt),
    emailVerified: r.user.emailVerified,
    twoFactorEnabled: Boolean(r.user.twoFactorEnabled),
    createdAt: r.user.createdAt.toISOString(),
  }));

  const activeEscrows = rawOrders.filter((r) => r.order.state === "escrow");
  const escrowLockedCents = activeEscrows.reduce((sum, r) => sum + r.order.totalCents, 0);

  const kpis = calculateKpis({
    liquidCents: liquidBalanceCents,
    escrowCents: escrowLockedCents,
    orders: rawOrders.map((r) => r.order),
  });

  const chartData = buildChartSeries(rawOrders.map((r) => r.order));
  const gameBreakdown = buildGameDistribution(
    rawOrders.map((r) => ({ gameId: r.gameId, priceCents: r.order.totalCents })),
  );

  const [
    listingsData,
    disputesData,
    auditLogsData,
    catalogData,
    tournamentsData,
    wikiData,
    communityData,
    promosData,
    liveSettings,
  ] = await Promise.all([
    getAdminListings(),
    getAdminDisputes(),
    getAdminAuditLogs(),
    getAdminCatalog(),
    getAdminTournaments(),
    getAdminWiki(),
    getAdminCommunity(),
    getAdminPromos(),
    settingsService.getSettings(),
  ]);

  return {
    user: {
      id: userId,
      name: userHandle,
      handle: userHandle,
      avatarUrl: userAvatar,
      role: userRole,
    },
    kpis,
    chartData,
    gameBreakdown,
    orders: mappedOrders,
    transactions: mappedTransactions,
    users: mappedUsers,
    listings: listingsData,
    catalog: catalogData,
    tournamentsList: tournamentsData.tournamentsList,
    matchesList: tournamentsData.matchesList,
    wikiGuides: wikiData,
    communityPosts: communityData,
    promoCodes: promosData,
    disputes: disputesData,
    settings: liveSettings,
    system: {
      daemonStatus: "online",
      activeBots: 12,
      pendingSteamOffers: activeEscrows.length,
      avgHandoffSeconds: 1.4,
      systemUptimePct: 99.98,
      lastHeartbeat: new Date().toISOString(),
      escrowVaultHealth: "healthy",
    },
    auditLogs: auditLogsData,
  };
}
