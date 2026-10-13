import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { OUTAGE } from "../data/status.mock";
import { GatewayDiagnostic } from "./gateway-diagnostic";
import { GatewayMonitors } from "./gateway-monitors";
import { GatewayRetryControls } from "./gateway-retry-controls";

/** Stitch: 502/503 Valve API gateway outage with live infrastructure monitor. */
export function GatewayErrorView({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="bg-canvas-base font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <div className="relative flex w-full flex-col overflow-hidden text-on-surface">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(244,63,94,0.18),transparent)]" />
          <div className="pointer-events-none absolute -top-32 right-12 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-tertiary-container/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col gap-space-xl px-margin-desktop py-space-lg">
            <div className="flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm font-label-badge text-label-badge tracking-widest text-text-muted">
                <span className="text-text-secondary">PORTAL</span>
                <span>{"//"}</span>
                <span className="text-text-secondary">INFRASTRUCTURE SENTINEL</span>
                <span>{"//"}</span>
                <span className="font-bold text-primary">VALVE_API_GATEWAY_OUTAGE</span>
              </div>
              <div className="flex items-center gap-space-sm rounded bg-surface-container-high px-space-md py-space-xs shadow-md">
                <Icon name="satellite_alt" className="text-[18px] text-tertiary" />
                <span className="font-label-badge text-label-badge text-text-secondary uppercase">UPSTREAM SYNC:</span>
                <span className="animate-pulse font-data-mono-md text-data-mono-md font-bold text-tertiary">DEGRADED / DESYNC</span>
              </div>
            </div>

            <div className="grid grid-cols-1 items-center gap-space-lg lg:grid-cols-12">
              <div className="flex flex-col gap-space-md lg:col-span-7">
                <div className="flex flex-wrap items-center gap-space-sm">
                  <div className="inline-flex items-center gap-space-xs rounded bg-error-container/40 px-space-sm py-space-xs text-error shadow-sm">
                    <span className="h-2 w-2 animate-ping rounded-full bg-status-live" />
                    <span className="font-label-badge text-label-badge font-bold tracking-wider uppercase">{OUTAGE.incident}</span>
                  </div>
                  <div className="inline-flex items-center gap-space-xs rounded bg-surface-container px-space-sm py-space-xs text-text-secondary">
                    <Icon name="timer" className="text-[14px]" />
                    <span className="font-label-badge text-label-badge">OUTAGE DURATION: {OUTAGE.duration}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-space-md">
                  <h1 className="font-display-hero text-display-hero tracking-tighter text-text-primary drop-shadow-[0_0_35px_rgba(244,63,94,0.35)]">
                    502 <span className="align-middle font-body-sm font-normal text-primary opacity-50">/</span> 503
                  </h1>
                  <span className="font-headline-md text-headline-md font-bold tracking-wider text-primary uppercase">Engine Desync</span>
                </div>
                <div className="w-fit rounded bg-surface-card px-space-md py-space-xs font-label-badge text-label-badge text-tertiary shadow-sm">{OUTAGE.kicker}</div>
                <h2 className="font-headline-lg text-headline-lg text-text-primary">{OUTAGE.title}</h2>
                <p className="max-w-2xl font-body-lg text-body-lg leading-relaxed text-text-secondary">
                  {OUTAGE.body} <span className="font-semibold text-text-primary">{OUTAGE.secure}</span> {OUTAGE.bodyTail}
                </p>
                <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                  <GatewayRetryControls onRetry={onRetry} />
                  <LinkButton
                    href="https://steamstat.us"
                    className="inline-flex h-auto gap-space-sm rounded border-0 bg-surface-container px-space-lg py-space-md font-label-caps text-label-caps text-text-primary uppercase shadow-sm transition-colors hover:bg-surface-container-high"
                  >
                    <Icon name="monitor_heart" className="text-[18px] text-tertiary" />
                    <span>Valve Server Status Monitor</span>
                  </LinkButton>
                  <LinkButton
                    href="/community"
                    className="inline-flex h-auto gap-space-sm rounded border-0 bg-surface-container-low px-space-md py-space-md font-label-caps text-label-caps text-text-secondary uppercase transition-colors hover:bg-surface-container hover:text-text-primary"
                  >
                    <Icon name="forum" className="text-[18px]" />
                    <span>X &amp; Discord Alerts</span>
                  </LinkButton>
                </div>
              </div>

              <GatewayDiagnostic />
            </div>

            <GatewayMonitors />

            <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
              <div className="flex flex-col gap-space-sm lg:col-span-8">
                <div className="flex items-center justify-between px-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <Icon name="terminal" className="text-[18px] text-primary" />
                    <span className="font-label-caps text-label-caps text-text-primary uppercase">Real-Time Incident Stream &amp; Error Trace</span>
                  </div>
                  <span className="font-data-mono-md text-data-mono-md text-text-muted">HOST: valve-relay-ord.relicto.internal</span>
                </div>
                <div className="flex flex-col gap-space-xs overflow-x-auto rounded-xl bg-surface-container-lowest p-space-md font-data-mono-md text-data-mono-md text-text-secondary shadow-2xl">
                  <div className="text-text-muted">{"// Relicto Edge Gateway Heartbeat Trace (ISO 8601 UTC)"}</div>
                  {OUTAGE.incidentLog.map((line, index) => (
                    <div key={index} className={cn("flex gap-space-sm", line.indent && "pl-space-md")}>
                      {line.time && <span className="text-text-muted">{line.time}</span>}
                      {line.level && <span className={line.levelClass}>{line.level}</span>}
                      <span className={line.levelClass.includes("text-text-muted") ? line.levelClass : undefined}>{line.message}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-space-sm pt-space-xs">
                    <span className="text-tertiary">&gt;&gt;</span>
                    <span className="animate-pulse text-text-primary">Awaiting upstream Valve coordinator TCP syn-ack packet...</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-md shadow-md lg:col-span-4">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-sm text-tertiary">
                    <Icon name="verified_user" className="text-[20px]" />
                    <span className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">Protection Protocol</span>
                  </div>
                  <p className="font-body-md text-body-md text-text-secondary">
                    Your open trades, deposit balances, and active high-tier skins are cryptographically locked. No malicious rollback or phantom cancellations can occur while Valve clusters are unreachable.
                  </p>
                </div>
                <div className="flex flex-col gap-space-xs rounded bg-surface-container p-space-sm">
                  <div className="flex justify-between font-label-badge text-label-badge">
                    <span className="text-text-muted uppercase">Cold Vault Multi-Sig</span>
                    <span className="font-bold text-status-upcoming">VERIFIED SOLVENT</span>
                  </div>
                  <div className="flex justify-between font-data-mono-md text-data-mono-md">
                    <span className="text-text-secondary">Signature Quorum</span>
                    <span className="font-bold text-text-primary">5 of 7 Keys Online</span>
                  </div>
                  <div className="flex justify-between font-data-mono-md text-data-mono-md">
                    <span className="text-text-secondary">Smart Contract Guard</span>
                    <span className="font-bold text-tertiary">Active (Immutable)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-xs font-label-badge text-label-badge text-text-muted">
                  <span>STATUS PAGE: status.relicto.io</span>
                  <span className="text-text-secondary">OPS CHANNEL #61</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
