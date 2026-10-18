"use client";

import * as React from "react";
import { PlusCircle, Wallet, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { DashboardData, DashboardTab } from "../types";
import { DashboardNav } from "./dashboard-nav";
import { DashboardOverview } from "./dashboard-overview";
import { DashboardCharts } from "./dashboard-charts";
import { DashboardOrders } from "./dashboard-orders";
import { DashboardTransactions } from "./dashboard-transactions";
import { DashboardSystemMonitor } from "./dashboard-system-monitor";
import { ChargeWalletDialog } from "./charge-wallet-dialog";

export function DashboardShell({ data }: { data: DashboardData }) {
  const [tab, setTab] = React.useState<DashboardTab>("overview");
  const [chargeOpen, setChargeOpen] = React.useState(false);

  const TAB_TITLES: Record<DashboardTab, { title: string; desc: string }> = {
    overview: { title: "Operations Overview", desc: "Real-time KPIs, liquid balance, and treasury telemetry" },
    orders: { title: "Orders & Escrow Handoffs", desc: "Live tradebot execution and multi-sig escrow settlements" },
    income: { title: "Income & Revenue Telemetry", desc: "Platform escrow fee yield and game ecosystem distribution" },
    transactions: { title: "Treasury Ledger", desc: "Audited cryptographic transaction receipts and vault balance after" },
    monitoring: { title: "Steam Daemon & Fleet Health", desc: "Active Sentinel trade bot nodes and database synchronization" },
    wallet: { title: "Vault & Deposit Chamber", desc: "Top up and charge balance via crypto, card, or SEPA" },
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar collapsible="icon" variant="sidebar">
          <DashboardNav
            currentTab={tab}
            onTabChange={setTab}
            kpis={data.kpis}
            user={data.user}
          />
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="bg-background flex flex-col min-w-0">
          {/* Top Operational Bar */}
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border-subtle bg-background/80 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border-subtle" />
              <div>
                <h1 className="text-sm font-heading font-bold text-text-primary leading-tight">
                  {TAB_TITLES[tab].title}
                </h1>
                <p className="hidden sm:block text-[11px] text-text-muted leading-tight">
                  {TAB_TITLES[tab].desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/wallet">
                <Button size="xs" variant="ghost" className="gap-1.5 font-mono text-xs hidden md:flex">
                  <Wallet className="size-3.5 text-text-muted" />
                  Vault View
                  <ExternalLink className="size-3 text-text-muted" />
                </Button>
              </Link>

              <Button
                size="sm"
                variant="default"
                onClick={() => setChargeOpen(true)}
                className="gap-1.5 font-semibold text-xs shadow-sm"
              >
                <PlusCircle className="size-3.5" />
                Charge Wallet
              </Button>
            </div>
          </header>

          {/* Tab Content Canvas */}
          <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl w-full mx-auto">
            {tab === "overview" && (
              <>
                <DashboardOverview
                  kpis={data.kpis}
                  system={data.system}
                  onNavigateTab={setTab}
                />
                <DashboardCharts
                  chartData={data.chartData}
                  gameBreakdown={data.gameBreakdown}
                />
                <DashboardOrders orders={data.orders.slice(0, 8)} />
              </>
            )}

            {tab === "orders" && <DashboardOrders orders={data.orders} />}

            {tab === "income" && (
              <div className="space-y-6">
                <DashboardCharts
                  chartData={data.chartData}
                  gameBreakdown={data.gameBreakdown}
                />
                <DashboardTransactions
                  transactions={data.transactions.filter(
                    (t) => t.kind === "sale" || t.kind === "fee" || t.kind === "promo"
                  )}
                />
              </div>
            )}

            {tab === "transactions" && (
              <DashboardTransactions transactions={data.transactions} />
            )}

            {tab === "monitoring" && (
              <DashboardSystemMonitor system={data.system} />
            )}
          </main>
        </SidebarInset>
      </div>

      <ChargeWalletDialog open={chargeOpen} onOpenChange={setChargeOpen} />
    </SidebarProvider>
  );
}
