"use client";

import { useState } from "react";
import { toast } from "sonner";
import { NoticeButton } from "@/components/notice-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import type { WalletRail as WalletRailType } from "../types";
import { WalletRail } from "./wallet-rail";

export function WalletDeposit({ rails }: { rails: WalletRailType[] }) {
  const [rail, setRail] = useState("crypto");
  const [amount, setAmount] = useState("250.00");
  const numericAmount = Number(amount) || 0;
  const credited = (numericAmount * 1.02).toFixed(2);
  const copyAddress = async () => {
    await navigator.clipboard.writeText("0x71C92a46B9f76D2189CB91823B492");
    toast.success("Deposit address copied");
  };
  return (
    <section className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="flex flex-col gap-space-md">
        <StationTitle icon="account_balance" title="Deposit & Influx Hub" subtitle="ZERO INGRESS FEES ON CRYPTO & STEAM LIQUIDATION" badge="PROMO: +2.0% SKINS" />
        <WalletRail rails={rails} value={rail} onChange={setRail} />
        <div className="flex flex-col items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md md:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-text-primary p-2 text-canvas-base"><Icon name="qr_code_2" className="text-[96px]" /></div>
          <div className="flex w-full flex-1 flex-col gap-space-xs">
            <div className="flex items-center justify-between gap-space-sm"><span className="font-label-badge text-label-badge text-text-muted">TRC-20 DEPOSIT ADDRESS</span><span className="font-data-mono-md text-[11px] text-tertiary">1/12 Confirmations</span></div>
            <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-card px-space-md py-2"><span className="truncate font-data-mono-md text-body-sm text-text-primary">0x71C92a46B9f76D2189CB91823B492</span><Button variant={null} size="icon-xs" onClick={copyAddress} aria-label="Copy deposit address" className="text-text-muted hover:text-text-primary"><Icon name="content_copy" className="text-[18px]" /></Button></div>
            <div className="flex items-center gap-space-xs text-[11px] text-text-muted"><Icon name="info" className="text-[14px] text-tertiary" /><span>Minimum deposit: $10.00 USDT. Funds settle after 12 block validations.</span></div>
          </div>
        </div>
        <label className="flex flex-col gap-space-xs font-label-caps text-label-caps text-text-secondary uppercase">Deposit Amount (USD)<div className="flex items-center rounded-lg bg-surface-container-lowest px-space-md"><span className="font-data-mono-lg text-text-muted">$</span><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} className="h-auto border-0 bg-transparent p-space-sm font-data-mono-lg text-text-primary focus-visible:ring-0" /><span className="font-data-mono-md text-text-secondary">USD</span></div></label>
        <div className="flex flex-wrap items-center gap-space-xs">{[50, 100, 250, 500, 1000].map((value) => <Button key={value} variant={null} size={null} onClick={() => setAmount(value.toFixed(2))} className="h-auto rounded bg-surface-container-high px-2 py-1 font-data-mono-md text-[12px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary">+${value}</Button>)}</div>
        <div className="flex flex-col gap-1 rounded-lg bg-surface-container-lowest/70 p-space-sm font-data-mono-md text-body-sm"><div className="flex justify-between text-text-muted"><span>Subtotal</span><span>${numericAmount.toFixed(2)} USD</span></div><div className="flex justify-between text-text-muted"><span>Network Protocol Ingress Fee</span><span className="text-tertiary">0.00 USD (PROMO)</span></div><div className="flex justify-between text-text-muted"><span>Liquidation Booster Tier</span><span className="text-primary">+2.0% (${(numericAmount * 0.02).toFixed(2)} USD)</span></div><div className="flex justify-between border-t border-surface-variant pt-1 font-bold text-text-primary"><span>Total Balance Credited</span><span className="text-tertiary">${credited} USD</span></div></div>
      </div>
      <NoticeButton notice={{ title: "Ingress queued", description: `A ${credited} USD deposit confirmation is ready for the wallet API.` }} className="h-auto w-full gap-space-xs rounded-lg border-0 bg-primary py-space-md font-headline-sm text-[14px] text-on-primary uppercase shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:bg-primary/90"><Icon name="verified" className="text-[18px]" /><span>Confirm &amp; Execute Ingress</span></NoticeButton>
    </section>
  );
}

function StationTitle({ icon, title, subtitle, badge }: { icon: "account_balance" | "bolt"; title: string; subtitle: string; badge: string }) {
  return <div className="flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-xs"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-primary"><Icon name={icon} className="text-[20px]" /></div><div className="flex flex-col"><h3 className="font-headline-sm text-headline-sm text-text-primary">{title}</h3><span className="font-label-badge text-label-badge text-text-muted">{subtitle}</span></div></div><span className="rounded bg-primary-container/20 px-2 py-1 font-label-badge text-[11px] text-primary-container">{badge}</span></div>;
}
