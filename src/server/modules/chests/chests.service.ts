import "server-only";
import {
  COIN_PACKAGES,
  type ChestDefinition,
  type CoinPackage,
  type CurrencyConversion,
  type DailyBonusState,
  type EscalatingOddsState,
  type LiveDropItem,
  type PaymentMethodOption,
  type UnboxResult,
} from "@/modules/chests/types";
import { settingsService } from "../settings/settings.service";
import { calculateEscalatingOdds, executeChestRoll } from "./chests.algorithm";
import { chestsRepository } from "./chests.repository";
import { walletService } from "../wallet/wallet.service";

export class ChestsService {
  async getCurrencyConversion(): Promise<CurrencyConversion> {
    const settings = await settingsService.getSettings();
    const coinRatePerUsd = (settings as unknown as { coinRatePerUsd?: number }).coinRatePerUsd ?? 100;
    const tomanRatePerUsd = (settings as unknown as { tomanRatePerUsd?: number }).tomanRatePerUsd ?? 95_000;
    const coinRateToman = Math.round(tomanRatePerUsd / coinRatePerUsd);

    return {
      coinRatePerUsd,
      tomanRatePerUsd,
      coinRateToman,
    };
  }

  async listChests(includeInactive: boolean = false): Promise<ChestDefinition[]> {
    const chests = chestsRepository.getChests();
    if (includeInactive) return chests;
    return chests.filter((c) => c.isActive);
  }

  async getChestWithUserOdds(slug: string, userId?: string | null): Promise<{
    chest: ChestDefinition;
    streak: number;
    escalatingOdds: EscalatingOddsState[];
  } | null> {
    const chest = chestsRepository.getChestBySlug(slug);
    if (!chest) return null;

    const streak = userId ? chestsRepository.getStreak(userId, chest.id) : 0;

    const escalatingOdds: EscalatingOddsState[] = chest.items
      .filter((it) => it.isEscalatingBonus)
      .map((it) => {
        const tier = it.escalatingTier || "rare";
        const currentOdds = calculateEscalatingOdds(it.baseOddsPct, streak, tier);
        return {
          tier,
          label: `${it.name} (${tier.replace("_", " ").toUpperCase()})`,
          baseOddsPct: it.baseOddsPct,
          currentOddsPct: currentOdds,
          streak,
        };
      });

    return { chest, streak, escalatingOdds };
  }

  getUserCoins(userId: string): number {
    return chestsRepository.getUserCoins(userId);
  }

  addCoins(userId: string, amount: number, reason?: string): number {
    const current = chestsRepository.getUserCoins(userId);
    const updated = current + amount;
    chestsRepository.setUserCoins(userId, updated);
    return updated;
  }

  async openChest(
    userId: string,
    slug: string,
    options: {
      paymentMethod: PaymentMethodOption;
      splitCoinAmount?: number;
      clientSeed?: string;
      traderHandle?: string;
    }
  ): Promise<{ success: boolean; error?: string; result?: UnboxResult; newCoinBalance?: number }> {
    const chest = chestsRepository.getChestBySlug(slug);
    if (!chest) return { success: false, error: "Chest not found" };

    const conversion = await this.getCurrencyConversion();
    const userCoins = chestsRepository.getUserCoins(userId);
    const userWalletCents = await walletService.liquidCents(userId);

    // Validate payment
    if (options.paymentMethod === "coins") {
      if (userCoins < chest.priceCoins) {
        return { success: false, error: `Insufficient Relicto Coins. Need ${chest.priceCoins} RC, you have ${userCoins} RC.` };
      }
      chestsRepository.setUserCoins(userId, userCoins - chest.priceCoins);
    } else if (options.paymentMethod === "cash_usd") {
      const costCents = Math.round(chest.priceUsd * 100);
      if (userWalletCents < costCents) {
        return { success: false, error: `Insufficient Vault USD. Need $${chest.priceUsd.toFixed(2)}, you have $${(userWalletCents / 100).toFixed(2)}.` };
      }
      // Deduct from wallet if real, or handle simulation
    } else if (options.paymentMethod === "combination") {
      const coinsToUse = Math.min(userCoins, Math.max(0, options.splitCoinAmount ?? 0));
      const coinsValueUsd = coinsToUse / conversion.coinRatePerUsd;
      const remainingUsd = Math.max(0, chest.priceUsd - coinsValueUsd);
      const remainingCents = Math.round(remainingUsd * 100);

      if (remainingCents > 0 && userWalletCents < remainingCents) {
        return { success: false, error: `Insufficient split funds. Remaining balance is $${remainingUsd.toFixed(2)}.` };
      }
      chestsRepository.setUserCoins(userId, userCoins - coinsToUse);
    }

    // Execute Dota 2 style roll
    const currentStreak = chestsRepository.getStreak(userId, chest.id);
    const roll = executeChestRoll(chest.id, chest.items, currentStreak, options.clientSeed);

    // Update streak and chest statistics
    chestsRepository.setStreak(userId, chest.id, roll.newStreak);
    chest.openCount += 1;
    chestsRepository.upsertChest(chest);

    // Calculate recycle coin value (85% value in Relicto Coins)
    const recycleCoinsValue = Math.round(roll.wonItem.valueUsd * conversion.coinRatePerUsd * 0.85);

    const result: UnboxResult = {
      id: `unbox-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      chestId: chest.id,
      wonItem: roll.wonItem,
      bonusItem: roll.bonusItem,
      rollSeed: roll.rollSeed,
      rollHash: roll.rollHash,
      escalatingStreak: roll.newStreak,
      timestamp: new Date().toISOString(),
      reelItems: roll.reelItems,
      winningIndex: roll.winningIndex,
      recycleCoinsValue,
    };

    // Register live drop ticker
    chestsRepository.addLiveDrop({
      id: result.id,
      traderHandle: options.traderHandle || "Trader",
      traderAvatar: "/images/lootora/avatar.jpg",
      chestName: chest.name,
      chestSlug: chest.slug,
      item: roll.wonItem,
      timeAgo: "Just now",
    });

    return {
      success: true,
      result,
      newCoinBalance: chestsRepository.getUserCoins(userId),
    };
  }

  recycleWonItem(userId: string, coinsValue: number): number {
    return this.addCoins(userId, coinsValue, "Recycled unboxed item");
  }

  claimDailyBonus(userId: string): DailyBonusState {
    const currentCoins = chestsRepository.getUserCoins(userId);
    const bonusAmount = 100;
    chestsRepository.setUserCoins(userId, currentCoins + bonusAmount);

    return {
      canClaim: false,
      currentStreak: 1,
      bonusCoins: bonusAmount,
      nextBonusCoins: 150,
      timeUntilNextClaimSec: 86400,
    };
  }

  buyCoinPackage(userId: string, packageId: string): { success: boolean; newBalance: number } {
    const pkg = COIN_PACKAGES.find((p) => p.id === packageId) || COIN_PACKAGES[0];
    const totalGained = pkg.coins + pkg.bonusCoins;
    const newBalance = this.addCoins(userId, totalGained, `Purchased ${pkg.badge || "Coins"}`);
    return { success: true, newBalance };
  }

  simulateRolls(chestId: string, count: number = 1000): {
    totalRolls: number;
    itemHits: Record<string, { name: string; count: number; percentage: number; theoreticalPct: number }>;
    bonusHits: number;
    houseEdgePct: number;
  } {
    const chest = chestsRepository.getChestBySlug(chestId);
    if (!chest) throw new Error("Chest not found");

    const counts: Record<string, number> = {};
    chest.items.forEach((it) => (counts[it.id] = 0));
    let bonusHits = 0;
    let streak = 0;
    let totalOutputUsd = 0;

    for (let i = 0; i < count; i++) {
      const roll = executeChestRoll(chest.id, chest.items, streak);
      streak = roll.newStreak;
      counts[roll.wonItem.id] = (counts[roll.wonItem.id] || 0) + 1;
      totalOutputUsd += roll.wonItem.valueUsd;
      if (roll.bonusItem) {
        bonusHits++;
        totalOutputUsd += roll.bonusItem.valueUsd;
      }
    }

    const itemHits: Record<string, { name: string; count: number; percentage: number; theoreticalPct: number }> = {};
    for (const item of chest.items) {
      const c = counts[item.id] || 0;
      itemHits[item.id] = {
        name: item.name,
        count: c,
        percentage: Number(((c / count) * 100).toFixed(2)),
        theoreticalPct: item.baseOddsPct,
      };
    }

    const totalSpentUsd = chest.priceUsd * count;
    const houseEdgePct = Number((((totalSpentUsd - totalOutputUsd) / totalSpentUsd) * 100).toFixed(2));

    return { totalRolls: count, itemHits, bonusHits, houseEdgePct };
  }

  adminCreateChest(chest: ChestDefinition) {
    chestsRepository.upsertChest(chest);
  }

  adminUpdateChest(id: string, updates: Partial<ChestDefinition>) {
    const existing = chestsRepository.getChestBySlug(id);
    if (existing) {
      Object.assign(existing, updates);
      chestsRepository.upsertChest(existing);
    }
  }

  adminDeleteChest(id: string) {
    chestsRepository.deleteChest(id);
  }

  getLiveDrops(limit: number = 10): LiveDropItem[] {
    return chestsRepository.getLiveDrops(limit);
  }
}

export const chestsService = new ChestsService();
