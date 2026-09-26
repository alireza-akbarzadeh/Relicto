import type { IconName } from "@/components/ui/icon";
import type { LedgerRow, OrderGame, RowAction } from "@/modules/orders/types";
import type { LedgerOrderRow } from "./orders.types";

/** Corner tag over the ledger thumbnail, keyed by the item's grade. */
const TAG: Record<string, LedgerRow["tag"]> = {
  arcana: { label: "ARC", variant: "indigo" },
  exalted: { label: "EXLT", variant: "indigo" },
  immortal: { label: "IMM", variant: "indigo" },
  ancient: { label: "ANC", variant: "indigo" },
  mythical: { label: "MYTH", variant: "indigo" },
  rare: { label: "RARE", variant: "indigo" },
  persona: { label: "PERS", variant: "indigo" },
  covert: { label: "SNIP", variant: "amber" },
  melee: { label: "KNIFE", variant: "amber" },
  cache: { label: "CACHE", variant: "amber" },
  helm: { label: "HELM", variant: "indigo" },
  gloves: { label: "GLOV", variant: "crimson" },
};

const PARTY: Record<string, { icon: IconName; iconTone: "cyan" | "muted" | "amber" }> = {
  bot: { icon: "smart_toy", iconTone: "cyan" },
  merchant: { icon: "account_balance", iconTone: "muted" },
  user: { icon: "person", iconTone: "muted" },
  pool: { icon: "bolt", iconTone: "amber" },
};

const GAME: Record<string, OrderGame> = { dota2: "DOTA 2", cs2: "CS2" };

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const utc = (at: Date) =>
  `${String(at.getUTCHours()).padStart(2, "0")}:${String(at.getUTCMinutes()).padStart(2, "0")} UTC`;

export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Recent trades read as a live feed ("2m ago"), yesterday's keep their clock,
 * and anything older collapses to a date — the ledger's existing rhythm.
 */
export function whenLabel(at: Date, now = new Date()): string {
  const elapsed = now.getTime() - at.getTime();
  const day = (d: Date) => d.toISOString().slice(0, 10);

  if (elapsed < HOUR) return `${Math.max(1, Math.round(elapsed / 60000))}m ago • ${utc(at)}`;
  if (day(at) === day(now)) return `${Math.round(elapsed / HOUR)}h ago • ${utc(at)}`;
  if (day(at) === day(new Date(now.getTime() - DAY))) return `Yesterday ${utc(at)}`;

  return at.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });
}

/** What a trader can still do with a settled row, by flow and ecosystem. */
function actionsFor(row: LedgerOrderRow): RowAction[] {
  if (row.state === "escrow") return ["track"];
  if (row.flow === "sell") return ["receipt", "inspect"];
  if (row.flow === "liquidate") return ["receipt", "fingerprint"];

  return ["receipt", row.gameId === "cs2" ? "inspect-label" : "sell-back"];
}

function stateLabel(row: LedgerOrderRow, sold: boolean): string {
  if (row.state === "escrow") return `In Escrow (Step ${row.escrowStep ?? 1}/4)`;
  if (row.state === "disputed") return "Disputed";
  if (row.state === "cancelled") return sold ? "Cancelled · Relisted" : "Cancelled · Refunded";
  return "Completed";
}

/**
 * Rebuilds the `LedgerRow` contract the trade-ledger table already renders,
 * from the viewer's side: a marketplace order reads as a purchase to its buyer
 * and as a sale — paid the agreed price, from that buyer — to its seller.
 */
export function toLedgerRow(row: LedgerOrderRow, viewerId: string, now = new Date()): LedgerRow {
  const sold = row.flow === "buy" && row.sellerId === viewerId;
  const inbound = sold || row.flow === "sell" || row.flow === "liquidate";
  const party = sold ? PARTY.user : (PARTY[row.counterpartyKind ?? "user"] ?? PARTY.user);
  // Authored rows name their counterparty; peer-to-peer orders leave it to the other side's name.
  const partyName = sold ? row.buyerName : (row.counterpartyName ?? row.sellerName);

  return {
    id: row.id,
    code: row.code.startsWith("#") ? row.code : `#${row.code}`,
    when: whenLabel(row.placedAt, now),
    game: GAME[row.gameId ?? ""] ?? "DOTA 2",
    image: row.thumbnailUrl ?? "",
    imageAlt: row.thumbnailAlt ?? row.nameSnapshot ?? "Traded item",
    tag: TAG[row.rarity ?? ""] ?? { label: "ITEM", variant: "indigo" },
    itemName: row.nameSnapshot ?? "",
    itemDetail: row.detailSnapshot ?? "",
    flow: sold ? "sell" : row.flow,
    flowNote: sold ? "Marketplace sale" : (row.fundingLabel ?? ""),
    party: { ...party, name: partyName ?? "Relicto", note: sold ? "Buyer" : (row.counterpartyNote ?? "") },
    settlement: {
      // A seller is paid the agreed price; basket discounts are Relicto's.
      amount: `${inbound ? "+" : ""}${money(sold ? row.subtotalCents : row.totalCents)}`,
      tone: inbound ? "amber" : "primary",
      note: row.state === "cancelled" ? "Not charged" : (row.settlementNote ?? ""),
    },
    state: row.state,
    stateLabel: stateLabel(row, sold),
    actions: actionsFor(row),
  };
}
