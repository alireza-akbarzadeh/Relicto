import type { LedgerEntry, WalletMobile } from "@/modules/wallet/mobile.types";
import type { findEntriesWithItems } from "./wallet.repository";

type Row = Awaited<ReturnType<typeof findEntriesWithItems>>[number];

/** Money that moved without an item behind it gets the rail artwork from the design. */
const MONEY_ART = { image: "/images/lootora/wallet-mobile-02.jpg", alt: "Wallet transfer" };
const GAME: Record<string, NonNullable<LedgerEntry["game"]>> = {
  cs2: { label: "CS2", tone: "crimson" },
  dota2: { label: "DOTA", tone: "indigo" },
};

const DAY = 24 * 60 * 60 * 1000;
const dayKey = (at: Date) => at.toISOString().slice(0, 10);

/** "Today, 14:22", "Yesterday", "Oct 28" — in UTC, like the rest of the ledger. */
function when(at: Date, now: Date): Pick<LedgerEntry, "when" | "whenTone"> {
  if (dayKey(at) === dayKey(now)) return { when: `Today, ${at.toISOString().slice(11, 16)}`, whenTone: "secondary" };
  if (dayKey(at) === dayKey(new Date(now.getTime() - DAY))) return { when: "Yesterday", whenTone: "secondary" };
  return { when: at.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }), whenTone: "muted" };
}

function status({ entry }: Row): LedgerEntry["status"] {
  if (entry.status === "failed") return { label: "Failed", tone: "error", strong: true };
  if (entry.status === "pending") {
    return entry.kind === "withdrawal"
      ? { label: "Processing", tone: "cyan", strong: false }
      : { label: "Pending Valve", tone: "cyan", strong: false };
  }
  if (entry.kind === "sale") return { label: "Escrow Cleared", tone: "amber", strong: false };
  if (entry.kind === "purchase") return { label: "Delivered", tone: "cyan", strong: false };
  return { label: "Completed", tone: "indigo", strong: true };
}

function category({ entry }: Row): LedgerEntry["category"] {
  if (entry.status === "pending") return "escrow";
  return entry.kind === "deposit" || entry.kind === "withdrawal" ? "deposits" : "trades";
}

export function toLedgerEntry(row: Row, now: Date): LedgerEntry {
  const { entry } = row;
  const credit = entry.direction === "credit";
  const game = row.gameId ? GAME[row.gameId] : undefined;

  return {
    id: entry.id,
    category: category(row),
    image: row.thumbnailUrl ?? MONEY_ART.image,
    imageAlt: row.thumbnailAlt ?? entry.assetLabel ?? MONEY_ART.alt,
    ...(game ? { game } : {}),
    title: entry.assetLabel && row.thumbnailUrl ? entry.assetLabel : (entry.title ?? entry.kind),
    status: status(row),
    ref: entry.hash ?? "—",
    refMono: true,
    // Signed: the component prints the sign, so a cashout reads as money out.
    amountUsd: ((credit ? 1 : -1) * entry.amountCents) / 100,
    amountTone: !credit ? "plain" : entry.kind === "deposit" ? "rose" : "amber",
    ...when(entry.occurredAt, now),
  };
}

export type MobileTotals = {
  liquidCents: number;
  escrowCents: number;
  escrowHolds: number;
  dayNetCents: number;
  changePct: number;
};

/** Balances and 24h movement are the desktop treasury's figures; vault chrome, actions and rails stay authored. */
export function toWalletMobile(
  chrome: Pick<WalletMobile, "vault" | "actions" | "rails">,
  totals: MobileTotals,
  rows: Row[],
  total: number,
  now = new Date(),
): WalletMobile {
  return {
    ...chrome,
    changePct: totals.changePct,
    pnlUsd: totals.dayNetCents / 100,
    // Read on this request, so it is exactly as fresh as the page.
    sync: "just now",
    availableUsd: totals.liquidCents / 100,
    escrowUsd: totals.escrowCents / 100,
    escrowNote: totals.escrowHolds === 0 ? "No open escrows" : `${totals.escrowHolds} open escrow${totals.escrowHolds === 1 ? "" : "s"}`,
    ledger: { total, entries: rows.map((row) => toLedgerEntry(row, now)) },
  };
}
