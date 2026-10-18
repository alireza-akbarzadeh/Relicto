"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  History,
  Activity,
  Users,
  PlusCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { DashboardTab, DashboardKpis } from "../types";
import { ChargeWalletDialog } from "./charge-wallet-dialog";

interface DashboardNavProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  kpis: DashboardKpis;
  user: { name: string; handle: string; role: string };
  usersCount?: number;
}

export function DashboardNav({ currentTab, onTabChange, kpis, user, usersCount }: DashboardNavProps) {
  const [chargeOpen, setChargeOpen] = React.useState(false);

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-1.5 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="size-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-heading font-black text-sm tracking-wider group-hover:bg-primary/20 transition-colors shrink-0 group-data-[collapsible=icon]:mx-auto">
              R
            </div>
            <div className="group-data-[collapsible=icon]:hidden overflow-hidden">
              <span className="font-heading font-bold text-sm tracking-wide text-text-primary block leading-none">
                RELICTO
              </span>
              <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                OPS TERMINAL
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container border border-border-subtle text-[10px] font-mono text-primary group-data-[collapsible=icon]:hidden">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            LIVE
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operations Telemetry</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentTab === "overview"} onClick={() => onTabChange("overview")}>
                  <LayoutDashboard />
                  <span>Overview & KPIs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentTab === "orders"} onClick={() => onTabChange("orders")}>
                  <Receipt />
                  <span>Orders & Escrow</span>
                  {kpis.activeEscrowCount > 0 && (
                    <SidebarMenuBadge className="bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {kpis.activeEscrowCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentTab === "income"} onClick={() => onTabChange("income")}>
                  <TrendingUp />
                  <span>Income & Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentTab === "transactions"} onClick={() => onTabChange("transactions")}>
                  <History />
                  <span>Transactions Ledger</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentTab === "users"} onClick={() => onTabChange("users")}>
                  <Users />
                  <span>User & Role Admin</span>
                  {usersCount !== undefined && (
                    <SidebarMenuBadge className="bg-cyan-500/10 text-cyan-400">
                      {usersCount}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={currentTab === "monitoring"} onClick={() => onTabChange("monitoring")}>
                  <Activity />
                  <span>Daemon Monitoring</span>
                  <SidebarMenuBadge className="bg-primary/10 text-primary">12 BOTS</SidebarMenuBadge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-1">
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setChargeOpen(true)}>
                  <PlusCircle className="text-primary" />
                  <span className="font-medium text-primary">Charge Vault</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/marketplace" className="w-full">
                  <SidebarMenuButton>
                    <ExternalLink />
                    <span>Live Marketplace</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2 rounded-lg bg-surface-container border border-border-subtle flex flex-col gap-2 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:items-center">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-bold text-xs text-primary shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-semibold text-text-primary block truncate">{user.name}</span>
              <span className="text-[10px] text-text-muted flex items-center gap-1 font-mono">
                <ShieldCheck className="size-3 text-primary inline" />
                {user.role}
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="default"
            onClick={() => setChargeOpen(true)}
            className="w-full gap-1.5 text-xs font-semibold group-data-[collapsible=icon]:hidden"
          >
            <PlusCircle className="size-3.5" />
            Charge Wallet
          </Button>
          <Button
            size="icon-sm"
            variant="default"
            onClick={() => setChargeOpen(true)}
            title="Charge Wallet"
            className="hidden group-data-[collapsible=icon]:flex size-8 mx-auto"
          >
            <PlusCircle className="size-4" />
          </Button>
        </div>
      </SidebarFooter>

      <ChargeWalletDialog open={chargeOpen} onOpenChange={setChargeOpen} />
    </>
  );
}
