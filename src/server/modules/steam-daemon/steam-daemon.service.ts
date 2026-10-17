import "server-only";

import { randomInt } from "node:crypto";
import { and, eq, inArray, notExists } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orders, tradeOffers } from "@/lib/db/schema";
import { escrowService } from "../escrow/escrow.service";
import { notificationService } from "../notifications/notifications.service";

export type BotWorker = {
  id: string;
  name: string;
  steamId: string;
  avatarUrl: string;
  activeTrades: number;
};

export const SENTINEL_BOT_POOL: BotWorker[] = [
  {
    id: "sentinel-01",
    name: "Relicto Sentinel Node #01",
    steamId: "76561198012345671",
    avatarUrl: "/images/lootora/steam-guard-01.jpg",
    activeTrades: 2,
  },
  {
    id: "sentinel-02",
    name: "Relicto Sentinel Node #02",
    steamId: "76561198012345672",
    avatarUrl: "/images/lootora/steam-guard-01.jpg",
    activeTrades: 1,
  },
  {
    id: "sentinel-04",
    name: "Relicto Sentinel Node #04 (High-Tier Vault)",
    steamId: "76561198012345674",
    avatarUrl: "/images/lootora/steam-guard-01.jpg",
    activeTrades: 0,
  },
];

export function pickAvailableBot(): BotWorker {
  const sorted = [...SENTINEL_BOT_POOL].sort((a, b) => a.activeTrades - b.activeTrades);
  return sorted[0];
}

export function generateAntiPhishingToken(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "SEC-";
  for (let i = 0; i < 4; i++) {
    token += chars[randomInt(0, chars.length)];
  }
  return token;
}

export class SteamDaemonService {
  /**
   * Discovers orders in 'escrow' state that haven't received a trade offer yet.
   */
  async findPendingDispatches() {
    return db
      .select({
        id: orders.id,
        code: orders.code,
        buyerId: orders.buyerId,
        sellerId: orders.sellerId,
        placedAt: orders.placedAt,
        itemName: orderItems.nameSnapshot,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orders.state, "escrow"),
          notExists(
            db
              .select({ id: tradeOffers.id })
              .from(tradeOffers)
              .where(
                and(
                  eq(tradeOffers.orderId, orders.id),
                  inArray(tradeOffers.status, ["sent", "accepted"]),
                ),
              ),
          ),
        ),
      );
  }

  /**
   * Dispatches an automated Sentinel Trade Offer for an order.
   */
  async dispatchTradeOffer(orderCode: string) {
    const bot = pickAvailableBot();
    const steamOfferId = String(randomInt(6_000_000_000, 6_999_999_999));
    const token = generateAntiPhishingToken();
    const offerUrl = `https://steamcommunity.com/tradeoffer/${steamOfferId}/`;

    const result = await escrowService.offerSent(orderCode, {
      steamOfferId,
      botName: bot.name,
      botSteamId: bot.steamId,
      token,
      offerUrl,
    });

    if (result.status === "applied") {
      void notificationService.deliver(result.notices);
    }

    return {
      status: result.status,
      orderCode,
      steamOfferId,
      botName: bot.name,
      token,
      offerUrl,
    };
  }

  /**
   * Completes physical delivery confirmation for an order when Steam confirms asset handoff.
   */
  async confirmDelivery(orderCode: string) {
    const result = await escrowService.delivered(orderCode);
    if (result.status === "applied") {
      void notificationService.deliver(result.notices);
    }
    return { status: result.status, orderCode };
  }

  /**
   * Runs a complete autonomous daemon dispatch & reconcile cycle.
   */
  async runDaemonCycle() {
    const pending = await this.findPendingDispatches();
    const dispatched: string[] = [];

    for (const order of pending) {
      const outcome = await this.dispatchTradeOffer(order.code);
      if (outcome.status === "applied") {
        dispatched.push(order.code);
      }
    }

    return {
      scannedCount: pending.length,
      dispatchedCount: dispatched.length,
      dispatchedOrders: dispatched,
      timestamp: new Date().toISOString(),
    };
  }
}

export const steamDaemonService = new SteamDaemonService();
