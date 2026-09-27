"use client";

import { useState, useRef, type RefObject } from "react";

import { StudioFooter } from "@/modules/relicto/components/shell/footers";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";

import type { WalletData } from "../types";
import { WalletAuditLedger } from "./wallet-audit-ledger";
import { WalletCashout } from "./wallet-cashout";
import { WalletCompliance } from "./wallet-compliance";
import { WalletDeposit } from "./wallet-deposit";
import { WalletIntro } from "./wallet-intro";
import { WalletOverview } from "./wallet-overview";

type WalletAction = "deposit" | "cashout" | "steam";

export function WalletView({ data }: { data: WalletData }) {
  const [activeAction, setActiveAction] =
    useState<WalletAction>("deposit");

  const depositRef = useRef<HTMLDivElement>(null);
  const cashoutRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollTo = (
    ref: RefObject<HTMLDivElement | null>,
    action: WalletAction,
  ) => {
    setActiveAction(action);

    requestAnimationFrame(() => {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleDeposit = () => {
    scrollTo(depositRef, "deposit");
    inputRef.current?.focus()
  };

  const handleCashout = () => {
    scrollTo(cashoutRef, "cashout");
    inputRef.current?.focus()
  };

  const handleToSteam = () => {
    setActiveAction("steam");

    // TODO: Open Steam transfer flow/modal.
  };

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      <StudioHeader />

      <main className="w-full bg-canvas-base pt-20">
        <div className="relative flex w-full flex-col gap-space-lg overflow-hidden px-margin-desktop py-space-lg">
          {/* Ambient background */}
          <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />

          <div className="pointer-events-none absolute top-48 right-10 h-72 w-72 rounded-full bg-glow-indigo blur-3xl" />

          {/* Intro */}
          <WalletIntro />

          {data.isPreview ? (
            <div className="flex items-center gap-space-sm rounded-xl border border-status-upcoming/30 bg-status-upcoming/10 px-space-md py-space-sm font-body-sm text-body-sm text-status-upcoming">
              <span className="font-label-badge text-label-badge uppercase">Preview vault</span>
              <span className="text-text-secondary">
                Balances are at zero until your first deposit. Deposits credit instantly in test mode; cashout unlocks once you have a balance.
              </span>
            </div>
          ) : null}

          {/* Overview + actions */}
          <WalletOverview
            data={data}
            activeAction={activeAction}
            onDeposit={handleDeposit}
            onCashout={handleCashout}
            onToSteam={handleToSteam}
          />

          {/* Operations */}
          <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-2">
            <div
              ref={depositRef}
              id="deposit"
              className="scroll-mt-24"
            >
              <WalletDeposit
                activeAction={activeAction}
                inputRef={inputRef}
                rails={data.depositRails}
                testMode={data.testDeposits}
              />
            </div>

            <div
              ref={cashoutRef}
              id="cashout"
              className="scroll-mt-24"
            >
              <WalletCashout
                rails={data.cashoutRails}
                maxUsd={data.liquidUsd ?? 0}
              />
            </div>
          </div>

          {/* Ledger */}
          <WalletAuditLedger transactions={data.transactions} />

          {/* Compliance */}
          <WalletCompliance />
        </div>
      </main>

      <StudioFooter />
    </div>
  );
}