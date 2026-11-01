import "server-only";

import * as fs from "node:fs";
import * as path from "node:path";
import type { ChestDefinition, ChestSkinItem, LiveDropItem, UnboxResult } from "@/modules/chests/types";
import { DEFAULT_CHESTS } from "./chests.presets";

export type UnboxRecord = {
  id: string;
  userId: string;
  chestId: string;
  wonItem: ChestSkinItem;
  recycleCoinsValue: number;
  recycled: boolean;
  createdAt: number;
};

const CHESTS_FILE_PATH = path.join(process.cwd(), ".chests-runtime.json");
const STREAKS_FILE_PATH = path.join(process.cwd(), ".chest-streaks-runtime.json");
const USER_COINS_FILE_PATH = path.join(process.cwd(), ".user-coins-runtime.json");
const LIVE_DROPS_FILE_PATH = path.join(process.cwd(), ".live-drops-runtime.json");
const UNBOX_RECORDS_FILE_PATH = path.join(process.cwd(), ".unbox-records-runtime.json");
const DAILY_BONUS_FILE_PATH = path.join(process.cwd(), ".daily-bonus-runtime.json");

export type DailyBonusRecord = {
  lastClaimAt: number;
  streak: number;
};

let memoryChests: ChestDefinition[] | null = null;
let memoryStreaks: Record<string, number> | null = null; // key: `${userId}:${chestId}`
let memoryCoins: Record<string, number> | null = null; // key: userId -> coin balance
let memoryLiveDrops: LiveDropItem[] | null = null;
let memoryUnboxRecords: Record<string, UnboxRecord> | null = null;
let memoryDailyBonus: Record<string, DailyBonusRecord> | null = null;

function readJsonSafe<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as T;
    }
  } catch (err) {
    console.warn(`[ChestsRepo] Error reading ${filePath}:`, err);
  }
  return fallback;
}

function writeJsonSafe(filePath: string, data: unknown) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`[ChestsRepo] Error writing ${filePath}:`, err);
  }
}

export const chestsRepository = {
  getChests(): ChestDefinition[] {
    if (memoryChests) return memoryChests;
    memoryChests = readJsonSafe<ChestDefinition[]>(CHESTS_FILE_PATH, DEFAULT_CHESTS);
    if (!memoryChests || memoryChests.length === 0) {
      memoryChests = [...DEFAULT_CHESTS];
      writeJsonSafe(CHESTS_FILE_PATH, memoryChests);
    }
    return memoryChests;
  },

  getChestBySlug(slug: string): ChestDefinition | null {
    const list = this.getChests();
    return list.find((c) => c.slug === slug || c.id === slug) ?? null;
  },

  saveChests(chests: ChestDefinition[]) {
    memoryChests = chests;
    writeJsonSafe(CHESTS_FILE_PATH, chests);
  },

  upsertChest(chest: ChestDefinition) {
    const list = this.getChests();
    const index = list.findIndex((c) => c.id === chest.id);
    if (index >= 0) {
      list[index] = chest;
    } else {
      list.push(chest);
    }
    this.saveChests(list);
  },

  deleteChest(id: string) {
    const list = this.getChests().filter((c) => c.id !== id);
    this.saveChests(list);
  },

  getStreak(userId: string, chestId: string): number {
    if (!memoryStreaks) {
      memoryStreaks = readJsonSafe<Record<string, number>>(STREAKS_FILE_PATH, {});
    }
    return memoryStreaks[`${userId}:${chestId}`] ?? 0;
  },

  setStreak(userId: string, chestId: string, streak: number) {
    if (!memoryStreaks) {
      memoryStreaks = readJsonSafe<Record<string, number>>(STREAKS_FILE_PATH, {});
    }
    memoryStreaks[`${userId}:${chestId}`] = streak;
    writeJsonSafe(STREAKS_FILE_PATH, memoryStreaks);
  },

  getUserCoins(userId: string): number {
    if (!memoryCoins) {
      memoryCoins = readJsonSafe<Record<string, number>>(USER_COINS_FILE_PATH, {
        "seed-trader-relicto": 2500, // starting balance for demo trader
      });
    }
    if (memoryCoins[userId] === undefined) {
      memoryCoins[userId] = 1500; // Welcome starting bonus coins
      writeJsonSafe(USER_COINS_FILE_PATH, memoryCoins);
    }
    return memoryCoins[userId];
  },

  setUserCoins(userId: string, amount: number) {
    if (!memoryCoins) {
      memoryCoins = readJsonSafe<Record<string, number>>(USER_COINS_FILE_PATH, {});
    }
    memoryCoins[userId] = Math.max(0, Math.round(amount));
    writeJsonSafe(USER_COINS_FILE_PATH, memoryCoins);
  },

  getLiveDrops(limit: number = 10): LiveDropItem[] {
    if (!memoryLiveDrops) {
      memoryLiveDrops = readJsonSafe<LiveDropItem[]>(LIVE_DROPS_FILE_PATH, [
        {
          id: "drop-init-1",
          traderHandle: "AegisHunter",
          traderAvatar: "/images/lootora/avatar.jpg",
          chestName: "Aegis Arcana Treasury",
          chestSlug: "arcana-treasury",
          item: DEFAULT_CHESTS[0].items[0],
          timeAgo: "2m ago",
        },
        {
          id: "drop-init-2",
          traderHandle: "RoshPitBoss",
          traderAvatar: "/images/lootora/avatar.jpg",
          chestName: "Divine Reliquary",
          chestSlug: "divine-reliquary",
          item: DEFAULT_CHESTS[1].items[3],
          timeAgo: "5m ago",
        },
        {
          id: "drop-init-3",
          traderHandle: "MiracleFan",
          traderAvatar: "/images/lootora/avatar.jpg",
          chestName: "Global Elite Arsenal",
          chestSlug: "global-elite",
          item: DEFAULT_CHESTS[2].items[1],
          timeAgo: "8m ago",
        },
      ]);
    }
    return memoryLiveDrops.slice(0, limit);
  },

  addLiveDrop(drop: LiveDropItem) {
    const drops = this.getLiveDrops(50);
    drops.unshift(drop);
    memoryLiveDrops = drops.slice(0, 50);
    writeJsonSafe(LIVE_DROPS_FILE_PATH, memoryLiveDrops);
  },

  saveUnboxRecord(record: UnboxRecord) {
    if (!memoryUnboxRecords) {
      memoryUnboxRecords = readJsonSafe<Record<string, UnboxRecord>>(UNBOX_RECORDS_FILE_PATH, {});
    }
    memoryUnboxRecords[record.id] = record;
    writeJsonSafe(UNBOX_RECORDS_FILE_PATH, memoryUnboxRecords);
  },

  getUnboxRecord(id: string): UnboxRecord | null {
    if (!memoryUnboxRecords) {
      memoryUnboxRecords = readJsonSafe<Record<string, UnboxRecord>>(UNBOX_RECORDS_FILE_PATH, {});
    }
    return memoryUnboxRecords[id] ?? null;
  },

  markUnboxRecycled(id: string): boolean {
    if (!memoryUnboxRecords) {
      memoryUnboxRecords = readJsonSafe<Record<string, UnboxRecord>>(UNBOX_RECORDS_FILE_PATH, {});
    }
    const record = memoryUnboxRecords[id];
    if (record && !record.recycled) {
      record.recycled = true;
      writeJsonSafe(UNBOX_RECORDS_FILE_PATH, memoryUnboxRecords);
      return true;
    }
    return false;
  },

  getDailyBonusRecord(userId: string): DailyBonusRecord | null {
    if (!memoryDailyBonus) {
      memoryDailyBonus = readJsonSafe<Record<string, DailyBonusRecord>>(DAILY_BONUS_FILE_PATH, {});
    }
    return memoryDailyBonus[userId] ?? null;
  },

  saveDailyBonusRecord(userId: string, record: DailyBonusRecord) {
    if (!memoryDailyBonus) {
      memoryDailyBonus = readJsonSafe<Record<string, DailyBonusRecord>>(DAILY_BONUS_FILE_PATH, {});
    }
    memoryDailyBonus[userId] = record;
    writeJsonSafe(DAILY_BONUS_FILE_PATH, memoryDailyBonus);
  },
};
