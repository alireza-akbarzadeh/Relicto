"use client";

import { useRef, type RefObject } from "react";
import { StudioFooter } from "@/modules/relicto/components/shell/footers";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { WalletData } from "../types";
import { WalletAuditLedger } from "./wallet-audit-ledger";
import { WalletCashout } from "./wallet-cashout";
import { WalletDeposit } from "./wallet-deposit";
import { WalletOverview } from "./wallet-overview";

export function WalletView({ data }: { data: WalletData }) {
  const depositRef = useRef<HTMLDivElement>(null);
  const cashoutRef = useRef<HTMLDivElement>(null);
  const scrollTo = (ref: RefObject<HTMLDivElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <div className="relative flex w-full flex-col gap-space-lg overflow-hidden px-margin-desktop py-space-lg">
          <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute top-48 right-10 h-72 w-72 rounded-full bg-glow-indigo blur-3xl" />
          <WalletIntro />
          <WalletOverview data={data} onDeposit={() => scrollTo(depositRef)} onCashout={() => scrollTo(cashoutRef)} />
          <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-2">
            <div ref={depositRef} id="deposit"><WalletDeposit rails={data.depositRails} /></div>
            <div ref={cashoutRef}><WalletCashout rails={data.cashoutRails} maxUsd={data.liquidUsd ?? 0} /></div>
          </div>
          <WalletAuditLedger transactions={data.transactions} />
          <WalletCompliance />
        </div>
      </main>
      <StudioFooter />
    </div>
  );
}

function WalletIntro() {
  const badges = [
    ["verified_user", "SOLVENCY VAULT", "$1,489,200.00", "text-tertiary"],
    ["phonelink_ring", "STEAM GUARD 2FA", "Armed (>180d)", "text-primary"],
    ["lock", "COLD STORAGE", "94.2% Secured", "text-status-upcoming"],
    ["bolt", "DISPATCH SLA", "< 120s Auto", "text-primary-container"],
  ] as const;
  return (
    <section className="relative flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-md xl:flex-row xl:items-center">
      <div className="flex flex-col gap-space-xs">
        <div className="flex flex-wrap items-center gap-space-xs font-label-badge text-[11px] tracking-wider text-text-muted uppercase"><span>Portal</span><span>/</span><span>Financial Operations</span><span>/</span><span className="font-bold text-primary">Escrow Wallet &amp; Treasury</span></div>
        <div className="flex flex-wrap items-center gap-space-sm"><span className="h-2.5 w-2.5 animate-ping rounded-full bg-status-live" /><h1 className="font-headline-md text-headline-md tracking-tight text-text-primary">Treasury Operations &amp; Audited Ledger</h1><span className="rounded bg-surface-container-high px-2 py-0.5 font-data-mono-md text-body-sm text-tertiary">NODE #US-EAST-BOT-09</span></div>
      </div>
      <div className="grid grid-cols-2 gap-space-xs md:grid-cols-4">{badges.map(([icon, label, value, tone]) => <div key={label} className="flex items-center gap-space-xs rounded-lg bg-surface-card px-space-sm py-space-xs shadow-sm"><Icon name={icon} className={cn("text-[18px]", tone)} /><span className="flex flex-col"><span className="font-label-badge text-[10px] leading-tight text-text-muted">{label}</span><span className="font-data-mono-md text-body-sm font-bold leading-tight text-text-primary">{value}</span></span></div>)}</div>
    </section>
  );
}

function WalletCompliance() {
  const items = [["policy", "Anti-Money Laundering Safeguard", "All transactions undergo real-time heuristic risk audits compliant with FinCEN and EU 5AMLD protocols."], ["vpn_key", "Steam OpenID & API Key Isolation", "Our bot fleet operates within zero-trust secure enclaves. Credentials and trade URL tokens use hardware-backed encryption."], ["support_agent", "24/7 Priority Treasury Dispatch", "VIP desk resolves custom OTC liquidity and manual wire clearances in under 15 minutes."] ] as const;
  return <section className="grid grid-cols-1 gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-md md:grid-cols-3">{items.map(([icon, title, body]) => <div key={title} className="flex items-start gap-space-sm"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-card text-primary"><Icon name={icon} className="text-[20px]" /></div><div><h4 className="font-headline-sm text-body-sm text-text-primary">{title}</h4><p className="mt-1 text-[12px] leading-relaxed text-text-muted">{body}</p></div></div>)}</section>;
}
