"use client";

import { Ref, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PriceInput } from "@/components/ui/price-input";
import { isMoneyRail, useDeposit } from "../hooks/use-deposit";
import type { WalletRail as WalletRailType } from "../types";
import { CryptoModal } from "@/modules/checkout/components/crypto-modal";
import { StationTitle, TestModeStrip } from "./wallet-station-title";
import { WalletAction } from "./wallet-action-button";
import { WalletRail } from "./wallet-rail";
import { WalletSummary } from "./wallet-summary";
import { WalletDepositNetworkCard } from "./wallet-deposit-network-card";

export function WalletDeposit({
  rails,
  testMode = false,
  activeAction,
}: {
  rails: WalletRailType[];
  testMode?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  activeAction: WalletAction;
}) {
  const [rail, setRail] = useState("crypto");
  const [amount, setAmount] = useState("250.00");
  const [cryptoNetwork, setCryptoNetwork] = useState("usdt-trc20");
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const { pending, deposit } = useDeposit();
  const numericAmount = Number(amount) || 0;
  const skins = !isMoneyRail(rail);

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

        {rail === "crypto" && (
          <WalletDepositNetworkCard
            selectedNetworkId={cryptoNetwork}
            onNetworkChange={setCryptoNetwork}
          />
        )}

        {rail === "cards" && (
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon name="credit_card" className="text-[28px]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-headline-sm text-xs font-bold text-text-primary">Instant Card & Apple Pay</span>
              <span className="font-body-sm text-[11px] text-text-secondary">
                Protected by Stripe 3D-Secure 2.0. Instant settlement directly to your vault.
              </span>
            </div>
          </div>
        )}

        {rail === "bank" && (
          <div className="flex items-center gap-space-md rounded-xl bg-surface-container-lowest p-space-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Icon name="account_balance" className="text-[28px]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-headline-sm text-xs font-bold text-text-primary">SEPA Instant &amp; FedWire ACH</span>
              <span className="font-body-sm text-[11px] text-text-secondary">
                Direct bank wire with zero Relicto platform commission. Settles in 15–30 mins.
              </span>
            </div>
          </div>
        )}

        <label className="flex flex-col gap-space-xs font-label-caps text-label-caps text-text-secondary uppercase">
          Deposit Amount (USD)
          <PriceInput
            value={numericAmount}
            onChange={(val) => setAmount(val.toString())}
            placeholder="0.00"
            className="h-14 bg-surface-container-lowest px-space-md text-base"
          />
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
          onClick={() => {
            if (rail === "crypto") {
              setCryptoOpen(true);
              return;
            }
            deposit(rail, numericAmount);
          }}
          className="h-auto w-full gap-space-xs rounded-lg border-0 bg-primary py-space-md font-headline-sm text-[14px] text-on-primary uppercase shadow-[0_0_20px_rgba(244,63,94,0.35)] hover:bg-primary/90"
        >
          <Icon name="verified" className="text-[18px]" />
          <span>
            {pending
              ? "Crediting vault…"
              : skins
                ? "Liquidate in Sell Studio"
                : rail === "cards"
                  ? `Pay with Card / Stripe ($${numericAmount.toFixed(2)})`
                  : rail === "crypto"
                    ? `Open Web3 Deposit ($${numericAmount.toFixed(2)})`
                    : `Confirm & Execute Ingress ($${numericAmount.toFixed(2)})`}
          </span>
        </Button>
      </div>

      <CryptoModal
        open={cryptoOpen}
        onOpenChange={setCryptoOpen}
        totalUsd={numericAmount}
        isPending={pending}
        onConfirm={({ network, txHash }) => {
          setCryptoOpen(false);
          deposit("crypto", numericAmount, `${network.symbol}:${txHash}`);
        }}
      />
    </section>
  );
}
