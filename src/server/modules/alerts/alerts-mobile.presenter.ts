import type { alertRules, ItemPresentation } from "@/lib/db/schema";
import type { AlertRule, AlertsMobile, Tone } from "@/modules/alerts/mobile.types";

type Rule = typeof alertRules.$inferSelect;

export type MobileRuleRow = {
  rule: Rule;
  gameId: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  presentation: ItemPresentation | null;
  floorCents: number | undefined;
  /** Recent prices, oldest first, for the sparkline. */
  series: number[];
};

const usd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const GAME: Record<string, AlertRule["game"]> = {
  cs2: { label: "CS2", tone: "crimson" },
  dota2: { label: "DOTA 2", tone: "cyan" },
};

/** How each strategy names its threshold and its monitor. */
const KIND = {
  snipe: { target: "Target Snipe Threshold", icon: "smart_toy", iconTone: "crimson", monitor: "Auto-Buy Armed", category: null },
  dca: { target: "Execution Ceiling", icon: "add_shopping_cart", iconTone: "amber", monitor: "Batch DCA Armed", category: { label: "Batch DCA", tone: "muted" } },
  arb: { target: "Breakout Trigger", icon: "sync_alt", iconTone: "cyan", monitor: "Auto-Arbitrage Polling", category: { label: "Cross-Market Arb", tone: "amber" } },
} as const;

const STATUS_TAG: Record<Rule["status"], AlertRule["tags"][number]> = {
  armed: { label: "Armed", tone: "emerald" },
  triggered: { label: "Triggered", tone: "amber" },
  paused: { label: "Paused", tone: "muted" },
};

/** Recent prices as a 100×20 polyline, high at the top. */
function spark(series: number[]) {
  const points = series.slice(-7);
  if (points.length < 2) return "M0 10 L100 10";
  const high = Math.max(...points);
  const span = high - Math.min(...points) || 1;
  return points
    .map((cents, i) => `${i === 0 ? "M" : "L"}${Math.round((i / (points.length - 1)) * 100)} ${Math.round(2 + ((high - cents) / span) * 16)}`)
    .join(" ");
}

function toRule(row: MobileRuleRow, pushOn: boolean): AlertRule {
  const { rule } = row;
  const kind = KIND[rule.kind];
  const current = row.floorCents ?? rule.currentCents ?? 0;
  const gap = current - rule.targetCents;
  const rising = row.series.length > 1 && row.series[row.series.length - 1] >= row.series[0];
  const move = row.series.length > 1 ? ((row.series[row.series.length - 1] - row.series[0]) / row.series[0]) * 100 : 0;

  return {
    id: rule.id,
    kind: rule.kind,
    game: GAME[row.gameId ?? ""] ?? { label: "STEAM", tone: "muted" },
    category: kind.category ?? { label: row.presentation?.badge.label ?? "Price Snipe", tone: "amber" },
    name: rule.name,
    image: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? rule.name,
    armed: rule.status === "armed",
    target: { label: kind.target, value: `${rule.direction === "below" ? "<" : ">"} ${usd(rule.targetCents)}`, tone: "emerald" },
    current: { label: "Current Market", value: usd(current), tone: "plain", delta: `(${gap >= 0 ? "+" : "-"}${usd(Math.abs(gap))})` },
    monitor: {
      icon: kind.icon,
      iconTone: kind.iconTone as Tone,
      label: rule.status === "armed" ? kind.monitor : rule.status === "triggered" ? "Triggered · Awaiting Fill" : "Monitor Paused",
      labelTone: rule.status === "armed" ? "rose" : "plain",
      spark: spark(row.series),
      sparkTone: rising ? "emerald" : "crimson",
      stat: `30D ${move >= 0 ? "+" : ""}${move.toFixed(1)}%`,
    },
    tags: [
      ...(pushOn ? [{ label: "Push Alert", tone: "muted" as Tone, icon: "notifications_active" as const }] : []),
      ...(rule.maxFloat !== null ? [{ label: `Float ≤ ${rule.maxFloat}`, tone: "cyan" as Tone }] : []),
      // An armed auto-buy rule executes on its own; otherwise it only alerts.
      rule.autoBuy && rule.status === "armed" ? { label: "Auto-Exec", tone: "emerald" } : STATUS_TAG[rule.status],
    ],
    ping: `${rule.name} monitor online`,
  };
}

/** Plan limit on concurrent rules, which the header's capacity bar measures against. */
const RULE_SLOTS = 25;

export function toAlertsMobile(authored: AlertsMobile, rows: MobileRuleRow[], vaultCents: number, pushOn: boolean): AlertsMobile {
  const armed = rows.filter((row) => row.rule.status === "armed").length;
  return {
    ...authored,
    activeRules: armed,
    rulesCapacityPct: Math.round((armed / RULE_SLOTS) * 100),
    vaultUsd: vaultCents / 100,
    rules: rows.map((row) => toRule(row, pushOn)),
    // Web Push is real now; the chat relays aren't wired yet and keep their authored state.
    channels: authored.channels.map((channel) =>
      channel.id === "push" ? { ...channel, status: pushOn ? "ENABLED" : "OFF" } : channel,
    ),
  };
}
