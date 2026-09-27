import type { IconName } from "@/components/ui/icon";
import type { ledgerEntries } from "@/lib/db/schema";
import type { WalletTransaction } from "@/modules/wallet/types";

type Entry = typeof ledgerEntries.$inferSelect;

/** Follow-up link per settlement venue — a TRC20 payout links to TronScan. */
const ACTION: Record<string, { action: string; actionIcon: IconName }> = {
  tron: { action: "TronScan", actionIcon: "open_in_new" },
  sepa: { action: "Tracker", actionIcon: "radar" },
  stripe: { action: "Invoice", actionIcon: "open_in_new" },
  "steam-escrow": { action: "Receipt", actionIcon: "receipt_long" },
  marketplace: { action: "Inspect", actionIcon: "visibility" },
  "market-maker": { action: "Logs", actionIcon: "receipt_long" },
  internal: { action: "Logs", actionIcon: "receipt_long" },
};

function iconFor(entry: Entry): IconName {
  if (entry.kind === "purchase") return "shopping_bag";
  if (entry.venue === "market-maker") return "finance_mode";
  if (entry.venue === "sepa") return "sync";
  if (entry.venue === "stripe") return "credit_card";
  if (entry.direction === "debit") return "arrow_outward";
  return "arrow_forward";
}

/** Settled money reads differently depending on what it bought. */
function statusFor(entry: Entry): Pick<WalletTransaction, "status" | "statusTone" | "statusHint"> {
  if (entry.status === "failed") {
    return { status: "FAILED", statusTone: "amber", statusHint: "Payout rejected — funds returned to vault" };
  }
  if (entry.status === "pending") {
    if (entry.kind === "withdrawal") {
      return { status: "PROCESSING", statusTone: "live", statusHint: "Held for rail dispatch — balance already debited" };
    }
    return { status: "PROCESSING", statusTone: "live", statusHint: "Awaiting settlement confirmation" };
  }
  if (entry.kind === "deposit") {
    return { status: "CREDITED", statusTone: "cyan", statusHint: "Available in your liquid balance" };
  }
  if (entry.kind === "withdrawal") {
    return { status: "DISPATCHED", statusTone: "live", statusHint: "Sent to destination rail" };
  }
  if (entry.kind === "purchase") return { status: "DELIVERED", statusTone: "cyan", statusHint: "Item released from escrow" };
  if (entry.kind === "sale") return { status: "SETTLED", statusTone: "live", statusHint: "Proceeds credited to vault" };
  return { status: "COMPLETED", statusTone: "live", statusHint: "Recorded on-chain audit log" };
}

export const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Rebuilds one audit-ledger row from the stored money movement. */
export function toWalletTransaction(entry: Entry): WalletTransaction {
  const credit = entry.direction === "credit";

  return {
    id: entry.id,
    icon: iconFor(entry),
    title: entry.title ?? entry.kind,
    hash: entry.hash ?? "—",
    asset: entry.assetLabel ?? "",
    detail: entry.detailLabel ?? "",
    node: entry.nodeLabel ?? "",
    amount: `${credit ? "+" : "-"}${usd(entry.amountCents)}`,
    amountTone: credit ? "amber" : "primary",
    kind: entry.kind as WalletTransaction["kind"],
    ...statusFor(entry),
    ...(ACTION[entry.venue] ?? ACTION.internal),
  };
}
