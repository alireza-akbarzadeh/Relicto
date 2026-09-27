"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Ref, useState } from "react";
import { toast } from "sonner";
import { isMoneyRail, useDeposit } from "../hooks/use-deposit";
import type { WalletRail as WalletRailType } from "../types";
import { WalletAction } from "./wallet-action-button";
import { WalletRail } from "./wallet-rail";
import { WalletSummary } from "./wallet-summary";

export function WalletDeposit({
  rails,
  testMode = false,
  inputRef,
  activeAction,
}: {
  rails: WalletRailType[];
  testMode?: boolean;
  inputRef: Ref<HTMLInputElement>;
  activeAction: WalletAction;
}) {
  const [rail, setRail] = useState("crypto");
  const [amount, setAmount] = useState("250.00");
  const { pending, deposit } = useDeposit();
  const numericAmount = Number(amount) || 0;
  const skins = !isMoneyRail(rail);
  const copyAddress = async () => {
    await navigator.clipboard.writeText("0x71C92a46B9f76D2189CB91823B492");
    toast.success("Deposit address copied");
  };
  return (
    <section className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="flex flex-col gap-space-md">
        <StationTitle
          icon="account_balance"
          title="Deposit & Influx Hub"
          subtitle="ZERO INGRESS FEES ON CRYPTO & STEAM LIQUIDATION"
          badge="PROMO: +2.0% SKINS"
        />
        <WalletRail rails={rails} value={rail} onChange={setRail} />
        <div className="flex flex-col items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md md:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-text-primary p-2 text-canvas-base">
            <Icon name="qr_code_2" className="text-[96px]" />
          </div>
          <div className="flex w-full flex-1 flex-col gap-space-xs">
            <div className="flex items-center justify-between gap-space-sm">
              <span className="font-label-badge text-label-badge text-text-muted">
                TRC-20 DEPOSIT ADDRESS
              </span>
              <span className="font-data-mono-md text-[11px] text-tertiary">
                1/12 Confirmations
              </span>
            </div>
            <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-card px-space-md py-2">
              <span className="truncate font-data-mono-md text-body-sm text-text-primary">
                0x71C92a46B9f76D2189CB91823B492
              </span>
              <Button
                variant={null}
                size="icon-xs"
                onClick={copyAddress}
                aria-label="Copy deposit address"
                className="text-text-muted hover:text-text-primary"
              >
                <Icon name="content_copy" className="text-[18px]" />
              </Button>
            </div>
            <div className="flex items-center gap-space-xs text-[11px] text-text-muted">
              <Icon name="info" className="text-[14px] text-tertiary" />
              <span>
                Minimum deposit: $10.00 USDT. Funds settle after 12 block
                validations.
              </span>
            </div>
          </div>
        </div>
        <label className="flex flex-col gap-space-xs font-label-caps text-label-caps text-text-secondary uppercase">
          Deposit Amount (USD)
          <div className="group flex h-14 items-center rounded-lg border border-transparent bg-surface-container-lowest px-space-md transition-colors focus-within:border-primary/30 focus-within:bg-surface-container-low">
            <span className="mr-space-sm font-data-mono-xl text-text-muted">
              $
            </span>

            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              ref={inputRef}
              onChange={(event) => setAmount(event.target.value)}
              className="
                  h-full min-w-0 flex-1
                  border-0 bg-transparent p-0
                  font-data-mono-xl font-medium
                  text-text-primary
                  placeholder:text-text-muted
                  focus-visible:ring-0
                  focus-visible:ring-offset-0
                  [appearance:textfield]
                  [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                   "
              placeholder="0.00"
            />

            <span className="ml-space-sm font-data-mono-md text-text-secondary">
              USD
            </span>
          </div>
        </label>
        <div className="flex flex-wrap items-center gap-space-xs">
          {[50, 100, 250, 500, 1000].map((value) => (
            <Button
              key={value}
              variant={null}
              size={null}
              onClick={() => setAmount(value.toFixed(2))}
              className="h-auto rounded bg-surface-container-high px-2 py-1 font-data-mono-md text-[12px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary"
            >
              +${value}
            </Button>
          ))}
        </div>
       <WalletSummary activeAction={activeAction} numericAmount={numericAmount} skins={skins} />
      </div>
      <div className="flex flex-col gap-space-xs">
        {testMode && <TestModeStrip />}
        <Button
          variant={null}
          size={null}
          disabled={pending}
          onClick={() => deposit(rail, numericAmount)}
          className="h-auto w-full gap-space-xs rounded-lg border-0 bg-primary py-space-md font-headline-sm text-[14px] text-on-primary uppercase shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:bg-primary/90"
        >
          <Icon name="verified" className="text-[18px]" />
          <span>
            {pending
              ? "Crediting vault…"
              : skins
                ? "Liquidate in Sell Studio"
                : "Confirm & Execute Ingress"}
          </span>
        </Button>
      </div>
    </section>
  );
}

function StationTitle({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: "account_balance" | "bolt";
  title: string;
  subtitle: string;
  badge: string;
}) {
  return (
    <div className="flex items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-xs">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-primary">
          <Icon name={icon} className="text-[20px]" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-text-primary">
            {title}
          </h3>
          <span className="font-label-badge text-label-badge text-text-muted">
            {subtitle}
          </span>
        </div>
      </div>
      <span className="rounded bg-primary-container/20 px-2 py-1 font-label-badge text-[11px] text-primary-container">
        {badge}
      </span>
    </div>
  );
}

/** Says out loud that nothing is charged here — deposits are simulated until a payment provider is connected. */
function TestModeStrip() {
  return (
    <div className="flex items-center gap-space-xs rounded-lg bg-status-upcoming/10 px-space-sm py-2 font-body-sm text-[11px] text-status-upcoming">
      <Icon name="info" className="text-[14px]" />
      <span>
        Test mode: deposits are credited instantly and nothing is charged. No
        payment provider is connected yet.
      </span>
    </div>
  );
}
