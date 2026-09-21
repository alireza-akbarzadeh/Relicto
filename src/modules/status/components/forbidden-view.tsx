import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/cn";
import { LOCKDOWN, type LockdownRow } from "../data/status.mock";
import { VaultLockEmblem } from "./vault-lock-emblem";

const ROW_TONE: Record<LockdownRow["tone"], string> = {
  code: "font-data-mono-md text-data-mono-md font-bold text-primary",
  primary: "font-data-mono-md text-data-mono-md font-semibold text-text-primary",
  amber: "font-headline-sm text-body-sm font-bold tracking-wide text-tertiary",
  plain: "font-data-mono-md text-body-sm font-medium text-error",
  cyan: "font-data-mono-md text-data-mono-md font-semibold text-status-upcoming",
};

/** Stitch: 403 vault lockdown / Steam Guard clearance required. */
export function ForbiddenView() {
  return (
    <main className="flex min-h-screen w-full grow items-center justify-center bg-canvas-base p-space-md md:p-space-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-space-sm py-space-md md:px-space-lg">
        <div className="mb-space-lg flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs rounded-full bg-surface-deep px-space-md py-space-xs shadow-sm">
            <Icon name="shield" className="animate-pulse text-body-sm text-status-live" filled />
            <span className="font-data-mono-md text-label-badge tracking-widest text-text-muted uppercase">
              PORTAL <span className="font-bold text-on-surface-variant">{"//"}</span> SECURITY SENTINEL{" "}
              <span className="font-bold text-on-surface-variant">{"//"}</span>{" "}
              <span className="font-semibold tracking-wider text-primary">PERMISSION_CHALLENGE_403</span>
            </span>
          </div>
          <div className="flex items-center gap-space-sm rounded-full bg-surface-container-low px-space-md py-space-xs shadow-sm">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-status-live" />
            <span className="font-data-mono-md text-label-badge text-primary uppercase">VAULT_LOCK_ENGAGED</span>
            <span className="font-data-mono-md text-label-badge tracking-tighter text-text-muted">NODE_ID: {LOCKDOWN.nodeId}</span>
          </div>
        </div>

        <div className="relative mb-space-lg overflow-hidden rounded-xl bg-surface-deep p-space-md shadow-xl md:p-space-xl">
          <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-linear-to-br/srgb from-primary/10 via-error-container/20 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-linear-to-tl/srgb from-tertiary/10 via-primary-container/10 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffb2b7_1px,transparent_1px)] [background-size:24px_24px] opacity-5" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-space-lg lg:grid-cols-12">
            <div className="relative flex flex-col items-center justify-center py-space-sm text-center lg:col-span-5">
              <VaultLockEmblem />
              <p className="mt-space-md font-data-mono-md text-label-badge tracking-widest text-text-muted uppercase">STEAM_MOBILE_AUTHENTICATOR // 0x403_ENCLAVE</p>
            </div>
            <div className="flex flex-col justify-center lg:col-span-7">
              <div className="mb-space-sm flex flex-wrap items-center gap-space-sm">
                <span className="font-headline-xl font-display-hero leading-none tracking-tighter text-primary drop-shadow-[0_0_24px_rgba(244,63,94,0.35)]">403</span>
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-space-xs rounded-md bg-surface-container-highest px-space-sm py-1">
                    <span className="h-2 w-2 rounded-full bg-status-live" />
                    <span className="font-data-mono-md text-label-badge font-bold tracking-wider text-primary-fixed uppercase">VAULT RESTRICTED // CLEARANCE REQUIRED</span>
                  </div>
                  <span className="mt-1 font-data-mono-md text-label-badge text-text-muted uppercase">{LOCKDOWN.protocol}</span>
                </div>
              </div>
              <h1 className="mb-space-sm font-headline-lg text-headline-lg leading-tight tracking-tight text-text-primary">
                Access to this High-Frequency Liquidity Vault or Arbitrage Terminal is Restricted
              </h1>
              <p className="mb-space-lg max-w-2xl font-body-lg text-body-lg leading-relaxed text-text-secondary">
                This trading terminal requires active{" "}
                <span className="font-semibold text-text-primary">Steam Guard Mobile 2FA confirmation</span> (minimum 7-day cooldown cleared),{" "}
                <span className="font-semibold text-tertiary">Tier 1 Trader Identity verification</span>, or authenticated Guild Membership credentials to interact with
                real-time liquidity pools.
              </p>
              <div className="flex flex-wrap items-center gap-space-sm">
                <LinkButton
                  href="/verify"
                  className="inline-flex h-auto gap-space-sm rounded-lg border-0 bg-primary-container px-space-lg py-space-sm font-headline-sm text-headline-sm tracking-wider text-text-primary uppercase shadow-[0_0_20px_rgba(244,63,94,0.4)] transition duration-200 hover:brightness-110"
                >
                  <Icon name="lock_open" className="text-body-lg" />
                  <span>Authenticate via Steam Mobile Guard</span>
                </LinkButton>
                <LinkButton
                  href="/profile"
                  className="inline-flex h-auto gap-space-sm rounded-lg border-0 bg-surface-card px-space-md py-space-sm font-headline-sm text-headline-sm tracking-wide text-on-surface uppercase shadow-sm transition duration-150 hover:bg-surface-container-high"
                >
                  <Icon name="verified_user" className="text-body-lg text-secondary" />
                  <span>Verify Trader Identity / 2FA</span>
                </LinkButton>
                <LinkButton
                  href="/marketplace"
                  className="inline-flex h-auto gap-space-xs rounded-lg border-0 bg-transparent px-space-md py-space-sm font-label-caps text-label-caps text-text-muted uppercase transition hover:bg-surface-container-low hover:text-text-primary"
                >
                  <Icon name="storefront" className="text-body-md" />
                  <span>Switch to Public Marketplace</span>
                </LinkButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-space-lg grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-xl bg-surface-container p-space-lg shadow-lg lg:col-span-7">
            <div className="-mx-space-lg -mt-space-lg mb-space-md flex items-center justify-between bg-surface-container-low px-space-lg pt-space-md pb-space-md">
              <div className="flex items-center gap-space-sm">
                <Icon name="terminal" className="text-headline-sm text-primary" />
                <span className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">Live Diagnostic Security Card</span>
              </div>
              <span className="rounded bg-surface-container-highest px-space-xs py-1 font-data-mono-md text-label-badge text-text-muted uppercase">{LOCKDOWN.hash}</span>
            </div>
            <div className="flex flex-col gap-space-sm">
              {LOCKDOWN.rows.map((row) => (
                <div key={row.label} className="flex flex-col justify-between gap-space-xs rounded-lg bg-surface-deep px-space-md py-space-sm md:flex-row md:items-center">
                  <div className="flex items-center gap-space-xs">
                    <Icon name={row.icon} className={cn("text-body-md", row.tone === "code" && "text-status-live", row.tone === "primary" && "text-secondary", row.tone === "amber" && "text-tertiary", row.tone === "cyan" && "text-status-upcoming", row.tone === "plain" && "text-text-muted")} />
                    <span className="font-data-mono-md text-label-badge text-text-muted uppercase">{row.label}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className={cn(ROW_TONE[row.tone], row.tone === "code" && "rounded bg-surface-container-highest px-space-sm py-0.5")}>{row.value}</span>
                    {row.note ? <span className="rounded bg-surface-container-low px-space-xs py-0.5 font-data-mono-md text-label-badge text-tertiary">{row.note}</span> : null}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-space-md rounded-lg bg-surface-deep p-space-md">
              <div className="mb-space-xs flex items-center justify-between">
                <span className="font-data-mono-md text-label-badge text-text-muted uppercase">{LOCKDOWN.cooldown.label}</span>
                <span className="font-data-mono-md text-label-badge font-bold text-tertiary">{LOCKDOWN.cooldown.value}</span>
              </div>
              <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full bg-surface-container-highest p-0.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-full w-1/7 rounded-full bg-status-live" />
                ))}
                {[3, 4, 5, 6].map((i) => (
                  <div key={i} className={cn("h-full w-1/7 rounded-full bg-surface-container-low", i === 3 && "opacity-60", i === 4 && "opacity-40", i === 5 && "opacity-20", i === 6 && "opacity-10")} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-surface-card p-space-lg shadow-lg lg:col-span-5">
            <div>
              <div className="mb-space-md flex items-center gap-space-sm">
                <Icon name="task_alt" className="text-headline-sm text-tertiary" filled />
                <h2 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">Access Recovery Protocol</h2>
              </div>
              <p className="mb-space-md font-body-sm text-body-sm text-text-secondary">
                Complete the following Valve Steam Guard criteria to automatically elevate your access level to the live Liquidity Terminal:
              </p>
              <ul className="flex flex-col gap-space-sm">
                {LOCKDOWN.steps.map((step) => (
                  <li key={step.title} className="flex items-start gap-space-sm rounded-lg bg-surface-deep p-space-sm">
                    <Icon name={step.icon} className={cn("mt-0.5 text-body-md", step.icon === "timelapse" ? "text-tertiary" : "text-primary")} />
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-body-sm font-semibold text-text-primary">{step.title}</span>
                      <span className="font-body-sm text-body-sm text-text-muted">{step.body}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mx-space-lg -mb-space-lg mt-space-lg flex flex-wrap items-center justify-between gap-space-sm rounded-b-xl bg-surface-deep p-space-lg pt-space-md">
              <div className="flex items-center gap-space-xs">
                <Icon name="support_agent" className="text-body-lg text-status-live" />
                <span className="font-body-sm text-body-sm text-text-secondary">Suspect an unauthorized lockout?</span>
              </div>
              <LinkButton href="/wiki" className="h-auto border-0 bg-transparent p-0 font-headline-sm text-label-caps tracking-wider text-primary uppercase underline underline-offset-4 hover:text-primary-fixed">
                Contact 24/7 Security Escrow Arbiter →
              </LinkButton>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-space-sm py-space-sm font-data-mono-md text-label-badge text-text-muted">
          <div className="flex flex-wrap items-center gap-space-md">
            {LOCKDOWN.footer.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-status-live" />
            <span>{LOCKDOWN.auditId}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
