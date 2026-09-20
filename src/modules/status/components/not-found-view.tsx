import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { DesyncEmblem } from "./desync-emblem";
import { PopularRelicsSection } from "./popular-relics-section";
import { StatusSearch } from "./status-search";
import { TELEMETRY } from "../data/status.mock";

const COPY = {
  page: {
    banner: "PORTAL // ERROR DIAGNOSTICS // PROTOCOL_ERR_404_PAGE_MISSING",
    chip: "Sector Uncharted or Asset Purged",
    title: "Drop Not Found — Inventory Entropy Desync",
    body: "The skin pattern, inventory seed, or market route you are seeking has been traded away, deleted, or never existed in the Steam mempool.",
    error: "ERR_RELICTO_NODE_DESYNC_404",
    defaultRoute: TELEMETRY.route,
  },
  item: {
    banner: "PORTAL // ERROR DIAGNOSTICS // PROTOCOL_ERR_404_ASSET_MISSING",
    chip: "Listing Delisted or Vault Purged",
    title: "Asset Not Found — Listing Hash Mismatch",
    body: "This item slug does not resolve in the Relicto catalog. The listing may have sold, been delisted, or the URL may reference a retired inventory seed.",
    error: "ERR_RELICTO_ASSET_DESYNC_404",
    defaultRoute: TELEMETRY.route,
  },
} as const;

type NotFoundViewProps = {
  /** Shown in the telemetry box (e.g. current path or item slug). */
  route?: string;
  variant?: keyof typeof COPY;
};

/** Stitch: route 404 and missing catalog item (same shell, different copy). */
export function NotFoundView({ route, variant = "page" }: NotFoundViewProps) {
  const copy = COPY[variant];

  return (
    <div className="flex min-h-screen flex-col justify-between bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <main className="flex w-full grow items-center justify-center bg-canvas-base p-space-md md:p-space-xl">
        <div className="relative flex w-full flex-col">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-96 w-full max-w-5xl -translate-x-1/2 rounded-full bg-primary-container/5 blur-[120px]" />
          <div className="pointer-events-none absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-secondary-container/10 blur-[90px]" />
          <div className="pointer-events-none absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-tertiary-container/10 blur-[100px]" />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center">
            <div className="mb-space-lg flex w-full flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-deep px-space-md py-space-sm shadow-md">
              <div className="flex items-center gap-space-sm">
                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-status-live" />
                <span className="font-label-badge text-label-badge tracking-widest text-primary uppercase">{copy.banner}</span>
              </div>
              <div className="flex items-center gap-4 font-data-mono-md text-body-sm text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Icon name="router" className="text-[14px] text-status-upcoming" /> RELAY: {TELEMETRY.relay}
                </span>
                <span className="hidden text-text-muted sm:inline-block">/</span>
                <span className="flex items-center gap-1.5">
                  <Icon name="memory" className="text-[14px] text-tertiary" /> TICKS: {TELEMETRY.ticks}
                </span>
              </div>
            </div>

            <div className="relative my-space-md flex w-full max-w-2xl flex-col items-center justify-center">
              <DesyncEmblem />
              <div className="relative -mt-6 flex flex-col items-center text-center select-none sm:-mt-8">
                <div className="relative flex items-center justify-center">
                  <span className="font-display-hero text-display-hero font-bold tracking-tighter text-on-surface drop-shadow-[0_0_35px_rgba(255,81,106,0.3)] sm:text-[104px] sm:leading-[104px]">
                    4<span className="inline-block transform text-primary-container transition-transform duration-200 hover:scale-105">0</span>4
                  </span>
                  <span className="absolute -top-3 -right-6 rotate-6 rounded bg-primary-container/20 px-space-xs py-0.5 font-data-mono-md text-label-badge tracking-widest text-primary-fixed uppercase sm:-right-12">
                    DESYNC
                  </span>
                </div>
                <div className="mb-space-sm inline-flex items-center gap-2 rounded-full bg-surface-container-high px-space-md py-1 font-label-caps text-label-caps tracking-wider text-tertiary-fixed uppercase shadow-inner">
                  <Icon name="explore_off" className="text-[14px] text-tertiary" />
                  {copy.chip}
                </div>
                <h1 className="mt-space-xs max-w-2xl px-4 font-headline-lg text-headline-lg tracking-tight text-text-primary sm:text-headline-xl">{copy.title}</h1>
                <p className="mt-space-sm max-w-xl px-4 font-body-lg text-body-lg text-text-secondary">{copy.body}</p>
              </div>
            </div>

            <div className="relative mt-space-md w-full max-w-3xl overflow-hidden rounded-xl bg-surface-card p-space-md shadow-xl sm:p-space-lg">
              <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r/srgb from-primary-container via-tertiary to-secondary" />
              <div className="mb-space-md flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-2 font-headline-sm text-headline-sm text-text-primary">
                  <Icon name="terminal" className="text-primary-container" />
                  Diagnostic Telemetry Box
                </div>
                <div className="flex items-center gap-2 font-data-mono-md text-label-badge text-text-muted">
                  <span className="inline-block h-2 w-2 rounded-full bg-tertiary" />
                  REALTIME INGESTION
                </div>
              </div>
              <div className="grid grid-cols-1 gap-space-sm font-data-mono-md text-body-sm sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-lg bg-surface-deep p-space-sm">
                  <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Target Hash Route</span>
                  <span className="mt-1 truncate text-primary-fixed">{route ?? copy.defaultRoute}</span>
                </div>
                <div className="flex flex-col justify-between rounded-lg bg-surface-deep p-space-sm">
                  <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Cluster Node</span>
                  <span className="mt-1 text-text-primary">{TELEMETRY.cluster}</span>
                </div>
                <div className="flex flex-col justify-between rounded-lg bg-surface-deep p-space-sm">
                  <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Internal Error Vector</span>
                  <span className="mt-1 text-error">{copy.error}</span>
                </div>
                <div className="flex flex-col justify-between rounded-lg bg-surface-deep p-space-sm">
                  <span className="font-label-badge text-label-badge tracking-wider text-text-muted uppercase">Mempool Timestamp</span>
                  <span className="mt-1 text-text-secondary">{TELEMETRY.timestamp}</span>
                </div>
              </div>
            </div>

            <StatusSearch />

            <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-md">
              <LinkButton
                href="/marketplace"
                className="h-auto gap-space-sm rounded-xl border-0 bg-primary-container px-space-lg py-space-md font-headline-sm text-headline-sm tracking-wider text-on-primary uppercase shadow-lg transition-all hover:brightness-110"
              >
                <span>Return to Marketplace</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </LinkButton>
              <LinkButton
                href="/tracker"
                className="h-auto gap-space-sm rounded-xl border-0 bg-surface-deep px-space-lg py-space-md font-headline-sm text-headline-sm tracking-wider text-text-primary uppercase shadow-md transition-colors hover:bg-surface-container"
              >
                <Icon name="monitoring" className="text-[18px] text-secondary" />
                <span>Inspect Live Tracker</span>
              </LinkButton>
              <LinkButton
                href="/wiki"
                className="h-auto gap-space-xs rounded-xl border-0 bg-surface-container-low px-space-md py-space-md font-body-md text-body-md font-normal text-text-secondary transition-colors hover:text-text-primary"
              >
                <Icon name="menu_book" className="text-[16px]" />
                <span>Valve Codex</span>
              </LinkButton>
            </div>

            <PopularRelicsSection />
          </div>
        </div>
      </main>

      <footer className="flex w-full flex-wrap items-center justify-between gap-2 border-t border-border-subtle px-space-xl py-space-md font-data-mono-md text-label-badge text-text-muted">
        <span className="flex items-center gap-2">
          <Icon name="smart_toy" className="text-[16px] text-primary" />
          Link fault? Ping sent to <span className="text-text-primary">Bot Sentinel #04</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          ESCROW NETWORK: 99.98% OPERATIONAL
        </span>
      </footer>
    </div>
  );
}
