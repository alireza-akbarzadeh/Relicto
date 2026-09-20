"use client";

import { useState } from "react";
import { NoticeButton } from "@/components/notice-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import type { WalletRail as WalletRailType } from "../types";
import { WalletRail } from "./wallet-rail";

const MAX = 3140;

export function WalletCashout({ rails }: { rails: WalletRailType[] }) {
  const [rail, setRail] = useState("usdt");
  const [amount, setAmount] = useState("850.00");
  const [token, setToken] = useState("");
  return (
    <section className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-xs"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-tertiary"><Icon name="bolt" className="text-[20px]" /></div><div className="flex flex-col"><h3 className="font-headline-sm text-headline-sm text-text-primary">Instant Egress &amp; Cashout</h3><span className="font-label-badge text-label-badge text-text-muted">AUTOMATED DISPATCH VIA BOT ESCROW CLUSTER</span></div></div><span className="flex items-center gap-1 rounded bg-surface-container-lowest px-2 py-1 font-data-mono-md text-[11px] text-text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live" />SLA: &lt; 120s Guarantee</span></div>
        <WalletRail rails={rails} value={rail} onChange={setRail} />
        <div className="flex flex-col gap-space-xs"><div className="flex items-center justify-between"><span className="font-label-caps text-label-caps text-text-secondary uppercase">Destination Vault / Address</span><Button variant={null} size={null} onClick={() => undefined} className="h-auto rounded-none border-0 p-0 font-label-badge text-label-badge text-primary hover:underline">+ New Address</Button></div><div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-lowest p-space-sm"><div className="flex min-w-0 items-center gap-space-sm"><Icon name="account_balance_wallet" className="text-[20px] text-tertiary" /><div className="flex min-w-0 flex-col"><span className="truncate font-body-sm text-body-sm text-text-primary">Binance Treasury Vault #1 (TRC-20)</span><span className="truncate font-data-mono-md text-[11px] text-text-muted">TQ7sWk8X19B4gZ9xKLmP2xRa8v4e...99La</span></div></div><span className="shrink-0 rounded bg-surface-container-high px-2 py-1 font-label-badge text-[10px] text-status-upcoming uppercase">Verified Whitelist</span></div></div>
        <label className="flex flex-col gap-space-xs font-label-caps text-label-caps text-text-secondary uppercase"><span className="flex justify-between">Withdrawal Amount <span className="font-data-mono-md text-[11px] normal-case text-text-muted">Max Withdrawable: <strong className="text-text-primary">$3,140.00</strong></span></span><div className="flex items-center rounded-lg bg-surface-container-lowest px-space-md"><span className="font-data-mono-lg text-text-muted">$</span><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-auto border-0 bg-transparent p-space-sm font-data-mono-lg text-text-primary focus-visible:ring-0" /><span className="font-data-mono-md text-text-secondary">USD</span></div></label>
        <div className="grid grid-cols-4 gap-space-xs">{[0.25, 0.5, 0.75, 1].map((percent) => <Button key={percent} variant={null} size={null} onClick={() => setAmount((MAX * percent).toFixed(2))} className="h-auto rounded bg-surface-container-high py-1 font-data-mono-md text-[12px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary">{percent === 1 ? "100% MAX" : `${percent * 100}%`}</Button>)}</div>
        <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md"><div className="flex items-center justify-between gap-2 text-text-primary"><span className="flex items-center gap-space-xs font-label-caps text-label-caps uppercase"><Icon name="security" className="text-[18px] text-primary" />Steam Guard Mobile 2FA Authentication</span><span className="font-label-badge text-[10px] text-primary uppercase">Required</span></div><p className="text-[12px] text-text-muted">Enter the 5-character alphanumeric token currently active in your Steam Mobile App.</p><div className="flex items-center gap-space-sm"><Input maxLength={5} value={token} onChange={(event) => setToken(event.target.value.toUpperCase())} placeholder="R7X9K" className="h-auto w-36 rounded-lg border-0 bg-surface-card p-2 text-center font-data-mono-lg tracking-widest text-primary uppercase focus-visible:bg-surface-container-high" /><span className="flex items-center gap-space-xs font-data-mono-md text-[11px] text-text-secondary"><Icon name="timer" className="text-[16px] text-status-upcoming" />Tokens refresh every 30 seconds</span></div></div>
        <div className="flex items-center justify-between gap-space-sm font-data-mono-md text-[11px] text-text-muted"><span>24h Limit: <strong className="text-text-primary">$16,860</strong> / $20,000 USD remaining</span><span>Network Mining Fee: <strong className="text-tertiary">$1.00 USDT</strong></span></div>
      </div>
      <NoticeButton notice={{ title: "Cashout authorization requested", description: `${amount || "0.00"} USD is waiting for Steam Guard verification.` }} className="h-auto w-full gap-space-xs rounded-lg border-0 bg-surface-container-high py-space-md font-headline-sm text-[14px] text-text-primary uppercase shadow-md hover:bg-primary hover:text-on-primary"><Icon name="lock_reset" className="text-[18px]" /><span>Authorize Instant Cashout</span></NoticeButton>
    </section>
  );
}
