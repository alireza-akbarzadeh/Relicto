"use client";

import { StudioFooter } from "@/modules/relicto/components/shell/footers";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { useRef, type RefObject } from "react";
import type { WalletData } from "../types";
import { WalletAuditLedger } from "./wallet-audit-ledger";
import { WalletCashout } from "./wallet-cashout";
import { WalletCompliance } from "./wallet-compliance";
import { WalletDeposit } from "./wallet-deposit";
import { WalletIntro } from "./wallet-intro";
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
            <div ref={depositRef} id="deposit"><WalletDeposit rails={data.depositRails} testMode={data.testDeposits} /></div>
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


