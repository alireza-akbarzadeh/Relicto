"use client";

import { Icon, IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { SoonLink } from "./soon-link";

export type StudioFooterMode =
  | "directory"
  | "terminal"
  | "transaction";

type StudioFooterProps = {
  mode?: StudioFooterMode;
};

const DIRECTORY_COLUMNS = [
  {
    icon: "support_agent",
    title: "Marketplace",
    tone: "text-primary",
    links: [
      "CS2 Items",
      "Dota 2 Items",
      "New Listings",
      "Price Movers",
      "Trade History",
      "Sell Items",
    ],
  },
  {
    icon: "support_agent",
    title: "Game Intel",
    tone: "text-status-upcoming",
    links: [
      "Item Wiki",
      "Item Database",
      "Price History",
      "Patch Changes",
      "New Items",
      "Item Calculator",
    ],
  },
  {
    icon: "support_agent",
    title: "Market Data",
    tone: "text-secondary",
    links: [
      "Market Overview",
      "Top Movers",
      "Volume Tracker",
      "Price Alerts",
      "Market Changes",
      "API Reference",
    ],
  },
  {
    icon: "support_agent",
    title: "Trust & Security",
    tone: "text-tertiary",
    links: [
      "Steam Integration",
      "Escrow Security",
      "Anti-Fraud",
      "Security Policy",
      "Transaction Rules",
      "System Status",
    ],
  },
  {
    icon: "support_agent",
    title: "Relicto",
    tone: "text-text-secondary",
    links: [
      "About Relicto",
      "Documentation",
      "Changelog",
      "Support",
      "Terms",
      "Privacy",
    ],
  },
] as const;

const TERMINAL_LINKS = [
  "Order Book",
  "Float Index",
  "Price History",
  "Market API",
];

export function StudioFooter({
  mode = "directory",
}: StudioFooterProps) {
  return (
    <footer className="w-full border-t border-outline-variant/20 bg-surface-deep">
      <FooterStatusBar mode={mode} />

      {mode === "directory" && <DirectoryFooter />}

      {mode === "terminal" && <TradingFooter />}

      {mode === "transaction" && <TransactionFooter />}

      <FooterLegal />
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/* Status Bar                                                                 */
/* -------------------------------------------------------------------------- */

function FooterStatusBar({
  mode,
}: {
  mode: StudioFooterMode;
}) {
  return (
    <div className="border-b border-outline-variant/15 bg-surface-container-low">
      <div className="flex min-h-10 w-full items-center justify-between gap-space-md px-margin-desktop">
        <div className="flex min-w-0 items-center gap-space-md">
          <OperationalStatus />

          <FooterDivider />

          <FooterMetric
            icon="sync"
            label="STEAM API"
            value="99.99%"
            valueClassName="text-tertiary"
          />

          <FooterDivider className="hidden md:block" />

          <FooterMetric
            icon="timer"
            label="LATENCY"
            value="14ms"
            className="hidden md:flex"
          />

          {mode === "terminal" && (
            <>
              <FooterDivider className="hidden lg:block" />

              <FooterMetric
                icon="monitoring"
                label="MARKET"
                value="LIVE"
                valueClassName="text-status-live"
                className="hidden lg:flex"
              />
            </>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-space-md sm:flex">
          {mode === "terminal" && (
            <span className="font-data-mono-md text-[10px] text-text-muted">
              24H VOL <span className="text-text-primary">$1.84M</span>
            </span>
          )}

          {mode === "transaction" && (
            <span className="font-data-mono-md text-[10px] text-tertiary">
              ESCROW ACTIVE
            </span>
          )}

          <span className="font-data-mono-md text-[10px] text-text-muted">
            RELICTO // LIVE
          </span>
        </div>
      </div>
    </div>
  );
}

function OperationalStatus() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-upcoming opacity-60" />
        <span className="relative h-2 w-2 rounded-full bg-status-upcoming" />
      </span>

      <span className="font-label-badge text-label-badge tracking-wider text-text-primary uppercase">
        Operational
      </span>
    </div>
  );
}

function FooterMetric({
  icon,
  label,
  value,
  valueClassName,
  className,
}: {
  icon: IconName;
  label: string;
  value: string;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("items-center gap-1.5", className)}>
      <Icon
        name={icon}
        className="text-[13px] text-text-muted"
      />

      <span className="font-label-badge text-[9px] tracking-wider text-text-muted uppercase">
        {label}
      </span>

      <span
        className={cn(
          "font-data-mono-md text-[10px] text-text-secondary",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function FooterDivider({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "h-4 w-px bg-outline-variant/30",
        className,
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Directory Footer                                                           */
/* -------------------------------------------------------------------------- */

function DirectoryFooter() {
  return (
    <div className="px-margin-desktop py-space-xl">
      <div className="grid grid-cols-2 gap-space-xl md:grid-cols-3 lg:grid-cols-5">
        {DIRECTORY_COLUMNS.map((column) => (
          <DirectoryColumn
            key={column.title}
            icon={column.icon}
            title={column.title}
            tone={column.tone}
            links={column.links}
          />
        ))}
      </div>

      <div className="mt-space-xl flex flex-col gap-space-md border-t border-outline-variant/20 pt-space-md md:flex-row md:items-center md:justify-between">
        <DirectoryTelemetry />

        <FooterPreferences />
      </div>
    </div>
  );
}

function DirectoryColumn({
  icon,
  title,
  tone,
  links,
}: {
  icon: IconName;
  title: string;
  tone: string;
  links: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-space-sm">
      <div className="mb-1 flex items-center gap-2">
        <Icon
          name={icon}
          className={cn("text-[17px]", tone)}
        />

        <span className="font-headline-sm text-[13px] tracking-wider text-text-primary uppercase">
          {title}
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map((label) => (
          <SoonLink
            key={label}
            label={label}
            className="
              w-fit
              font-body-sm text-[12px]
              text-text-secondary
              transition-colors
              hover:text-text-primary
            "
          />
        ))}
      </nav>
    </div>
  );
}

function DirectoryTelemetry() {
  return (
    <div className="flex flex-wrap items-center gap-space-md font-data-mono-md text-[10px] text-text-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-status-upcoming" />
        Steam API Synced
      </span>

      <span className="text-outline-variant">/</span>

      <span>Market Operational</span>

      <span className="text-outline-variant">/</span>

      <span>42 Services Online</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Trading Footer                                                             */
/* -------------------------------------------------------------------------- */

function TradingFooter() {
  return (
    <div className="bg-surface-container-low">
      <div className="flex flex-col gap-space-sm px-margin-desktop py-space-sm">
        <TradingTicker />

        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rotate-45 rounded-sm bg-primary" />

              <span className="font-headline-sm text-[13px] tracking-wider text-text-primary uppercase">
                RELICTO // MARKET
              </span>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              {TERMINAL_LINKS.map((label) => (
                <SoonLink
                  key={label}
                  label={label}
                  className="
                    rounded
                    bg-surface-card
                    px-2 py-1
                    font-body-sm text-[11px]
                    text-text-secondary
                    transition-colors
                    hover:bg-surface-container-high
                    hover:text-text-primary
                  "
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <FooterAction
              icon="support_agent"
              label="SHORTCUTS"
            />

            <FooterAction
              icon="support_agent"
              label="SUPPORT"
              live
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TradingTicker() {
  return (
    <div className="flex items-center gap-space-lg overflow-x-auto border-b border-outline-variant/15 pb-space-sm">
      <FooterTickerItem
        label="API"
        value="14ms"
        valueClassName="text-primary"
      />

      <FooterTickerItem
        label="24H VOL"
        value="$1.84M"
      />

      <FooterTickerItem
        label="LISTINGS"
        value="18,492"
      />

      <FooterTickerItem
        label="TRADERS"
        value="2,481"
      />

      <FooterTickerItem
        label="BOTS"
        value="42/42"
        valueClassName="text-status-upcoming"
      />

      <FooterTickerItem
        label="MARKET"
        value="OPEN"
        valueClassName="text-status-live"
      />
    </div>
  );
}

function FooterTickerItem({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="font-label-badge text-[9px] tracking-wider text-text-muted uppercase">
        {label}
      </span>

      <span
        className={cn(
          "font-data-mono-md text-[10px] text-text-secondary",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

function FooterAction({
  icon,
  label,
  live = false,
}: {
  icon: IconName;
  label: string;
  live?: boolean;
}) {
  return (
    <button
      type="button"
      className="
        flex items-center gap-1.5
        rounded
        bg-surface-container-high
        px-2.5 py-1.5
        font-label-badge text-[10px]
        text-text-secondary
        transition-colors
        hover:bg-surface-container-highest
        hover:text-text-primary
      "
    >
      {live ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full animate-ping rounded-full bg-status-live opacity-60" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-status-live" />
        </span>
      ) : (
        <Icon
          name={icon}
          className="text-[14px]"
        />
      )}

      {label}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Transaction Footer                                                         */
/* -------------------------------------------------------------------------- */

function TransactionFooter() {
  return (
    <div className="bg-surface-container-low px-margin-desktop py-space-md">
      <div className="flex flex-col gap-space-md md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-space-md">
          <TrustIndicator />

          <FooterDivider />

          <div className="hidden items-center gap-2 sm:flex">
            <Icon
              name="sync"
              className="text-[14px] text-tertiary"
            />

            <span className="font-data-mono-md text-[10px] text-text-secondary">
              Steam identity verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          <TransactionRail
            label="USDT"
          />

          <TransactionRail
            label="BTC"
          />

          <TransactionRail
            label="ETH"
          />

          <FooterDivider className="hidden sm:block" />

          <SoonLink
            label="Terms"
            className="font-body-sm text-[11px] text-text-muted hover:text-text-primary"
          />

          <SoonLink
            label="Support"
            className="font-body-sm text-[11px] text-text-muted hover:text-text-primary"
          />
        </div>
      </div>
    </div>
  );
}

function TrustIndicator() {
  return (
    <div className="flex items-center gap-space-sm">
      <div className="flex h-8 w-8 items-center justify-center rounded bg-tertiary/10 text-tertiary">
        <Icon
          name="shield_lock"
          className="text-[17px]"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-label-badge text-[9px] tracking-wider text-text-muted uppercase">
          Transaction Security
        </span>

        <span className="font-data-mono-md text-[10px] text-text-primary">
          Escrow Operational
        </span>
      </div>
    </div>
  );
}

function TransactionRail({
  label,
}: {
  label: string;
}) {
  return (
    <span className="rounded bg-surface-card px-2 py-1 font-data-mono-md text-[10px] text-text-secondary">
      {label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Preferences                                                                */
/* -------------------------------------------------------------------------- */

function FooterPreferences() {
  return (
    <div className="flex items-center gap-space-sm">
      <FooterSelect
        icon="settings"
        value="EN"
      />

      <FooterSelect
        icon="payments"
        value="USD"
      />
    </div>
  );
}

function FooterSelect({
  icon,
  value,
}: {
  icon: IconName;
  value: string;
}) {
  return (
    <button
      type="button"
      className="
        flex items-center gap-1.5
        rounded
        bg-surface-card
        px-2.5 py-1.5
        font-label-badge text-[10px]
        text-text-secondary
        transition-colors
        hover:bg-surface-container-high
        hover:text-text-primary
      "
    >
      <Icon
        name={icon}
        className="text-[14px] text-text-muted"
      />

      {value}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Legal                                                                      */
/* -------------------------------------------------------------------------- */

function FooterLegal() {
  return (
    <div className="border-t border-outline-variant/15 bg-surface-container-lowest px-margin-desktop py-space-sm">
      <div className="flex flex-col gap-space-sm md:flex-row md:items-center md:justify-between">
        <p className="max-w-4xl font-body-sm text-[10px] leading-relaxed text-text-muted">
          Relicto is an independent gaming marketplace and is not affiliated
          with, sponsored by, or endorsed by Valve Corporation. Steam, Counter-Strike,
          Dota 2, and their respective logos are trademarks of Valve Corporation.
        </p>

        <div className="flex shrink-0 items-center gap-space-md">
          <span className="flex items-center gap-1.5 font-label-badge text-[9px] tracking-wider text-text-muted">
            <Icon
              name="lock"
              className="text-[13px] text-tertiary"
            />
            SECURE CONNECTION
          </span>

          <span className="font-data-mono-md text-[10px] text-text-muted">
            © 2026 RELICTO
          </span>
        </div>
      </div>
    </div>
  );
}