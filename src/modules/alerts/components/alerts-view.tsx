"use client";

import { useState } from "react";
import { NoticeButton } from "@/components/notice-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { StudioFooter } from "@/modules/relicto/components/shell/footers";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import type { AlertStatus, PriceAlert } from "../types";
import { CommunityTone } from "@/modules/community/types";

const STATUS: Record<
  AlertStatus,
  { label: string; tone: string; dot: string }
> = {
  armed: {
    label: "ARMED / PERSIST",
    tone: "text-status-upcoming",
    dot: "bg-status-upcoming",
  },
  triggered: {
    label: "ACTIVE (8/10 UNITS)",
    tone: "text-primary",
    dot: "bg-primary",
  },
  paused: { label: "PAUSED", tone: "text-text-muted", dot: "bg-text-muted" },
};

const TONE: Record<CommunityTone, string> = {
  primary: "text-primary",
  cyan: "text-secondary",
  amber: "text-tertiary",
  muted: "text-text-muted",
  indigo: "text-indigo-500", // or your project's equivalent token class
};
export function AlertsView({ alerts: initial }: { alerts: PriceAlert[] }) {
  const [alerts, setAlerts] = useState(initial);
  const [paused, setPaused] = useState(false);
  const toggle = (id: string) =>
    setAlerts((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "paused" ? "armed" : "paused" }
          : item,
      ),
    );
  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <div className="mx-auto flex max-w-[1780px] flex-col gap-space-lg px-margin-desktop py-space-lg">
          <TriggerTelemetry paused={paused} setPaused={setPaused} />
          <RuleBuilder />
          <TriggerGrid alerts={alerts} onToggle={toggle} />
          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
            <ExecutionTerminal />
            <Performance />
          </div>
        </div>
      </main>
      <StudioFooter />
    </div>
  );
}

function TriggerTelemetry({
  paused,
  setPaused,
}: {
  paused: boolean;
  setPaused: (value: boolean) => void;
}) {
  return (
    <section className="flex flex-col gap-space-md">
      <div className="flex flex-col justify-between gap-space-md xl:flex-row xl:items-center">
        <div className="flex flex-wrap items-center gap-space-sm font-label-badge text-label-badge text-text-muted">
          <span className="text-text-secondary uppercase">
            Portal / Telemetry /
          </span>
          <span className="font-bold tracking-wider text-primary uppercase">
            Advanced Trigger Engine [Algo V4.2]
          </span>
          <span className="flex items-center gap-1 rounded bg-surface-container-low px-space-sm py-space-xs font-data-mono-md text-data-mono-md font-bold text-primary">
            <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
            POL-STREAM ONLINE
          </span>
        </div>
        <div className="flex flex-wrap gap-space-sm">
          <Button
            variant={null}
            size={null}
            onClick={() => setPaused(!paused)}
            className="h-auto gap-1 rounded bg-surface-container px-space-md py-space-xs font-label-caps text-label-caps text-text-secondary uppercase"
          >
            <Icon
              name={paused ? "play_arrow" : "pause_circle"}
              className="text-[16px] text-tertiary"
            />
            {paused ? "Resume All Automations" : "Pause All Automations"}
          </Button>
          <NoticeButton
            notice={{
              title: "Webhook logs exported",
              description:
                "The latest automation logs are ready for the API exporter.",
            }}
            className="h-auto gap-1 rounded bg-surface-container px-space-md py-space-xs font-label-caps text-label-caps text-text-secondary uppercase"
          >
            <Icon
              name="download"
              className="text-[16px] text-status-upcoming"
            />
            Export Webhook Logs
          </NoticeButton>
          <a
            href="#rule-builder"
            className="flex items-center gap-1 rounded bg-primary-container px-space-md py-space-xs font-label-caps text-label-caps text-on-primary-container uppercase"
          >
            <Icon name="add_circle" className="text-[18px]" />
            Create Advanced Rule
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-space-sm md:grid-cols-3 xl:grid-cols-5">
        {[
          ["Active Rule Sets", "18", "All Verified", "text-text-primary"],
          ["Sniper Bots Armed", "4 UNITS", "P2P Escrow Ready", "text-primary"],
          [
            "Vault Liquidity Monitored",
            "$64,800.00",
            "USDT Pool",
            "text-tertiary",
          ],
          ["Steam WS Uptime", "99.99%", "Node SG-04", "text-text-primary"],
          ["Trigger Latency", "6ms", "High-Frequency", "text-tertiary"],
        ].map(([label, value, note, tone]) => (
          <div
            key={label}
            className="rounded-lg bg-surface-card p-space-md shadow-sm"
          >
            <span className="font-label-badge text-label-badge text-text-muted uppercase">
              {label}
            </span>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <b className={`font-data-mono-lg text-data-mono-lg ${tone}`}>
                {value}
              </b>
              <span className="rounded bg-surface-container-low px-1.5 py-0.5 font-label-badge text-[9px] text-text-secondary">
                {note}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          "ALL (18)",
          "SNIPER BOTS (4)",
          "SPREAD ARBITRAGE (6)",
          "FLOAT/PATTERN HUNTERS (5)",
          "VOLUME VOLATILITY (3)",
        ].map((item, index) => (
          <Button
            key={item}
            variant={null}
            size={null}
            className={cn(
              "h-auto shrink-0 rounded px-space-md py-space-xs font-label-caps text-label-caps uppercase",
              index === 0
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container text-text-secondary",
            )}
          >
            {item}
          </Button>
        ))}
      </div>
    </section>
  );
}
function RuleBuilder() {
  return (
    <section
      id="rule-builder"
      className="relative overflow-hidden rounded-xl bg-surface-card p-space-lg shadow-xl"
    >
      <div className="pointer-events-none absolute -top-16 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-col gap-space-lg">
        <div className="flex flex-col justify-between gap-space-md lg:flex-row lg:items-center">
          <div className="flex items-center gap-space-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-primary">
              <Icon name="precision_manufacturing" className="text-[24px]" />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-text-primary">
                Algorithmic Trigger Logic Studio
              </h2>
              <span className="font-label-badge text-label-badge text-text-secondary uppercase">
                Multi-layer IFTTT protocol // compiled v4.2
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="rounded bg-surface-container-low px-2 py-1 font-label-badge text-[10px] text-tertiary uppercase">
              Heuristic Evaluation: Active
            </span>
            <span className="rounded bg-surface-container px-2 py-1 font-label-badge text-[10px] text-status-upcoming uppercase">
              Instant Escrow Relay
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-space-md rounded-lg bg-surface-container-low p-space-md lg:grid-cols-12">
          <div className="flex items-center gap-space-md lg:col-span-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-surface-container">
              <div className="flex h-full items-center justify-center text-primary">
                <Icon name="diamond" className="text-[28px]" />
              </div>
              <span className="absolute right-0 bottom-0 bg-primary-container px-1 font-label-badge text-[9px] text-on-primary-container">
                ★ T1
              </span>
            </div>
            <div>
              <span className="font-label-badge text-[10px] text-text-muted uppercase">
                Target Essex Inventory Asset
              </span>
              <h3 className="font-headline-sm text-headline-sm text-text-primary">
                ★ Karambit | Case Hardened
              </h3>
              <span className="font-data-mono-md text-data-mono-md text-secondary">
                Factory New / Minimal Wear (#387 / #661)
              </span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">
              Asset Selection Preset
            </span>
            <Button
              variant={null}
              size={null}
              className="mt-1 h-auto w-full justify-between rounded bg-surface px-space-md py-space-sm text-left font-body-md text-text-primary"
            >
              ★ Karambit | Case Hardened{" "}
              <Icon
                name="expand_more"
                className="text-[16px] text-text-muted"
              />
            </Button>
          </div>
          <div className="text-right lg:col-span-3">
            <span className="font-label-badge text-[10px] text-text-muted uppercase">
              Global 24h Benchmark
            </span>
            <b className="block font-data-mono-lg text-data-mono-lg text-tertiary">
              $3,150.00
            </b>
            <span className="font-label-badge text-[10px] text-text-secondary">
              Steam Liquidity: High
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps text-text-primary uppercase">
            Execution Condition Matrix
          </span>
          <Condition
            letter="A"
            title="[PRICE INFLICTION METRIC]"
            detail="Execute on Steam Community Market or P2P Instant Ask"
            value="< LESS THAN · $3,050.00 USD · -3.17% SPREAD"
            tone="primary"
          />
          <Gate />
          <Condition
            letter="B"
            title="[WEAR / FLOAT & PATTERN SEED]"
            detail="Deep CS2 Valve protobuf item spec inspection"
            value="FLOAT ≤ 0.0150 · PATTERN ['#387', '#412', '#661', '#955']"
            tone="cyan"
          />
          <Gate />
          <Condition
            letter="C"
            title="[CROSS-MARKET NET ARBITRAGE]"
            detail="Buff163, CSFloat & DMarket spread differential"
            value="≥ +6.5% NET YIELD · AFTER 2.5% FEE"
            tone="amber"
          />
        </div>
        <div className="grid grid-cols-1 gap-space-md xl:grid-cols-3">
          <Action
            title="Action 1: Auto-Buy"
            icon="shopping_bag"
            body="Instant P2P Escrow Relay. Allocates monitored vault liquidity without manual two-factor challenge."
            meta="CAP CEILING $3,200.00 USDT"
            tone="primary"
          />
          <Action
            title="Action 2: Hot Webhook"
            icon="notifications_active"
            body="Immediate packet broadcast to Discord #snipes-vip, Telegram Private Bot & SMS priority failover."
            meta="DISPATCH PING < 12ms RELAY"
            tone="cyan"
          />
          <Action
            title="Action 3: Instant Re-List"
            icon="sync_alt"
            body="Automated marketplace relisting on the Liquidity order book directly following inventory custody confirmation."
            meta="MARKUP MARGIN +8.5% AUTO-BID"
            tone="amber"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
          <div className="flex flex-wrap gap-4 font-label-badge text-[10px] text-text-secondary">
            <span>☑ Strict Slippage Protection</span>
            <span>☑ Revocation Kill-Switch</span>
            <span className="text-tertiary">
              Protected by Steam Protobuf Guard
            </span>
          </div>
          <Button className="h-auto rounded bg-primary-container px-5 py-2 font-label-caps text-label-caps text-on-primary-container uppercase">
            Arm & Deploy Rule Engine
          </Button>
        </div>
      </div>
    </section>
  );
}
function Condition({
  letter,
  title,
  detail,
  value,
  tone,
}: {
  letter: string;
  title: string;
  detail: string;
  value: string;
  tone: CommunityTone;
}) {
  return (
    <div className="flex flex-col justify-between gap-space-md rounded-lg bg-surface-container-low p-space-md md:flex-row md:items-center">
      <div className="flex items-center gap-space-md">
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded bg-surface-container font-data-mono-md font-bold",
            TONE[tone],
          )}
        >
          {letter}
        </span>
        <div>
          <b className="block font-label-caps text-label-caps text-text-primary uppercase">
            {title}
          </b>
          <span className="text-xs text-text-secondary">{detail}</span>
        </div>
      </div>
      <span className={cn("font-data-mono-md text-xs font-bold", TONE[tone])}>
        {value}
      </span>
    </div>
  );
}
function Gate() {
  return (
    <div className="flex items-center justify-center gap-2 -my-1">
      <span className="h-px w-12 bg-surface-container-highest" />
      <span className="rounded bg-surface-container px-2 py-0.5 font-label-badge text-[10px] text-secondary">
        LOGIC GATE: [AND]
      </span>
      <span className="h-px w-12 bg-surface-container-highest" />
    </div>
  );
}
function Action({
  title,
  icon,
  body,
  meta,
  tone,
}: {
  title: string;
  icon: "shopping_bag" | "notifications_active" | "sync_alt";
  body: string;
  meta: string;
  tone: CommunityTone;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-surface-container-low p-space-md">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-label-caps text-label-caps text-text-primary uppercase">
          <Icon name={icon} className={cn("text-[20px]", TONE[tone])} />
          {title}
        </span>
        <span
          className={cn("font-label-badge text-[10px] uppercase", TONE[tone])}
        >
          Enabled
        </span>
      </div>
      <p className="text-xs text-text-secondary">{body}</p>
      <span className="mt-auto font-data-mono-md text-[10px] text-tertiary">
        {meta}
      </span>
    </div>
  );
}
function TriggerGrid({
  alerts,
  onToggle,
}: {
  alerts: PriceAlert[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="mb-space-md flex items-center justify-between">
        <div>
          <h2 className="font-headline-md text-headline-md text-text-primary">
            Active Algorithmic Trigger Grid
          </h2>
          <span className="font-label-badge text-[10px] text-text-muted uppercase">
            Real-time execution state & historical ML ledger
          </span>
        </div>
        <span className="font-label-badge text-[10px] text-status-live uppercase">
          High Concurrency
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left">
          <thead className="bg-surface-container-lowest font-label-caps text-[10px] text-text-muted uppercase">
            <tr>
              {[
                "Rule Name & Target",
                "Logic Profile",
                "Threshold vs Current",
                "Auto-Execution Status",
                "Historical ML / Yield",
                "Actions",
              ].map((head) => (
                <th key={head} className="px-3 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alerts.concat(alerts).map((alert, index) => (
              <tr
                key={`${alert.id}-${index}`}
                className="border-t border-white/6 text-xs hover:bg-surface-container-high/30"
              >
                <td className="px-3 py-3">
                  <b className="block text-text-primary">{alert.item}</b>
                  <span className="font-label-badge text-[10px] text-text-muted">
                    {alert.detail}
                  </span>
                </td>
                <td className="px-3 py-3 font-data-mono-md text-text-secondary">
                  Ask &lt; {alert.target} + Float &lt; 0.012
                </td>
                <td className="px-3 py-3">
                  <b className="font-data-mono-md text-tertiary">
                    {alert.target}
                  </b>
                  <span className="block font-label-badge text-[10px] text-text-muted">
                    vs {alert.current}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={cn(
                      "flex items-center gap-1 font-label-badge text-[10px] uppercase",
                      STATUS[alert.status].tone,
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        STATUS[alert.status].dot,
                      )}
                    />
                    {STATUS[alert.status].label}
                  </span>
                  <span className="font-label-badge text-[10px] text-text-muted">
                    6ms websocket latency
                  </span>
                </td>
                <td className="px-3 py-3 font-data-mono-md text-status-upcoming">
                  +${(alert.id === "a1" ? 1420 : 3250).toLocaleString()} NET
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <NoticeButton
                      notice={{
                        title: "Rule tested",
                        description: `${alert.item} passed the simulated trigger evaluation.`,
                      }}
                      className="h-auto rounded bg-surface-container-high px-2 py-1 font-label-caps text-[10px] text-text-primary uppercase"
                    >
                      Test
                    </NoticeButton>
                    <Button
                      variant={null}
                      size="icon-xs"
                      onClickCapture={() => onToggle(alert.id)}
                      aria-label={`Toggle ${alert.item}`}
                      className="bg-primary-container text-on-primary-container"
                    >
                      <Icon name="sync_alt" className="text-[13px]" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
function ExecutionTerminal() {
  return (
    <section className="rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">
          Autonomous Execution Terminal
        </h2>
        <span className="font-label-badge text-[10px] text-status-live">
          STREAMING
        </span>
      </div>
      <div className="mt-3 rounded bg-surface-container-lowest p-3 font-data-mono-md text-[11px] leading-relaxed text-text-secondary">
        <p>
          <b className="text-tertiary">[14:02:18]</b> WEBSOCKET_P2P: New listing
          detected: ★ Butterfly Knife | Doppler P4 at $3,075.00 USD.
        </p>
        <p>
          <b className="text-tertiary">[14:02:19]</b> AUTO_BOT_04: Initiated
          escrow lock via Steam API session token.
        </p>
        <p>
          <b className="text-tertiary">[14:02:21]</b> EXECUTION_SUCCESS: Order
          complete. Net Captured Yield: +$145.00 USD.
        </p>
        <p>
          <b className="text-tertiary">[14:03:04]</b> MEMPOOL_POLL: CS2 protobuf
          buffer synchronized.
        </p>
      </div>
    </section>
  );
}
function Performance() {
  return (
    <section className="rounded-xl bg-surface-card p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm text-text-primary">
          Algorithmic Performance
        </h2>
        <span className="font-data-mono-md text-primary">+14.2% ROI</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ["30D Captured Profit", "$4,892.40"],
          ["Escrow Handshake", "240ms"],
          ["Execution Success", "96.8%"],
          ["Max Monitored Vault", "$64,800"],
        ].map(([label, value]) => (
          <div key={label} className="rounded bg-surface-container-lowest p-3">
            <span className="block font-label-badge text-[10px] text-text-muted uppercase">
              {label}
            </span>
            <b className="font-data-mono-lg text-data-mono-lg text-tertiary">
              {value}
            </b>
          </div>
        ))}
      </div>
      <div className="mt-3 font-label-badge text-[10px] text-text-muted uppercase">
        Notification paths:{" "}
        <span className="text-status-upcoming">Discord</span> · Telegram · Web
        Push · Twilio SMS
      </div>
    </section>
  );
}
