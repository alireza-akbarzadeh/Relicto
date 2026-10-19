"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { formatMoney } from "@/lib/format";
import { DEFAULT_WHITELIST_VAULTS, type CryptoNetwork } from "@/server/modules/wallet/wallet.schema";
import { useCashout } from "../hooks/use-cashout";
import type { WalletRail as WalletRailType } from "../types";
import { WalletCashoutDestination } from "./wallet-cashout-destination";
import { WalletCashoutNetworkPicker } from "./wallet-cashout-network-picker";
import { WalletRail } from "./wallet-rail";

/** Egress panel: the maximum is the live spendable balance; submitting files a real cashout request. */
export function WalletCashout({
  rails,
  maxUsd,
}: {
  rails: WalletRailType[];
  maxUsd: number;
}) {
  const { pending, request } = useCashout();
  const [rail, setRail] = useState("usdt");
  const [network, setNetwork] = useState<CryptoNetwork>("trc20");
  const [amount, setAmount] = useState(() => (maxUsd > 0 ? Math.min(850, maxUsd).toFixed(2) : "0.00"));
  const [token, setToken] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [selectedVaultId, setSelectedVaultId] = useState("vault-binance-trc20");

  const numericAmount = Number(amount) || 0;

  const getEffectiveDestination = () => {
    if (isCustomAddress) return customAddress.trim();
    const vault = DEFAULT_WHITELIST_VAULTS.find((v) => v.id === selectedVaultId && v.rail === rail);
    return vault?.address ?? DEFAULT_WHITELIST_VAULTS[0].address;
  };

  return (
    <section className="flex h-full flex-col justify-between gap-space-md rounded-xl bg-surface-card p-space-lg shadow-xl">
      <div className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-high text-tertiary">
              <Icon name="bolt" className="text-[20px]" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-text-primary">
                Instant Egress &amp; Cashout
              </h3>
              <span className="font-label-badge text-label-badge text-text-muted">
                AUTOMATED DISPATCH VIA BOT ESCROW CLUSTER
              </span>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded bg-surface-container-lowest px-2 py-1 font-data-mono-md text-[11px] text-text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-status-live" />
            SLA: &lt; 120s Guarantee
          </span>
        </div>

        <WalletRail rails={rails} value={rail} onChange={setRail} />

        <WalletCashoutDestination
          rail={rail}
          network={network}
          isCustomAddress={isCustomAddress}
          onToggleCustom={() => setIsCustomAddress(!isCustomAddress)}
          customAddress={customAddress}
          onCustomAddressChange={setCustomAddress}
          selectedVaultId={selectedVaultId}
          onSelectVaultId={setSelectedVaultId}
        />

        <WalletCashoutNetworkPicker
          rail={rail}
          network={network}
          onNetworkChange={setNetwork}
          amountUsd={numericAmount}
          customAddress={customAddress}
          isCustomAddress={isCustomAddress}
        />

        <label className="flex flex-col gap-space-xs font-label-caps text-label-caps text-text-secondary uppercase">
          <span className="flex justify-between">
            Withdrawal Amount{" "}
            <span className="font-data-mono-md text-[11px] normal-case text-text-muted">
              Max Withdrawable: <strong className="text-text-primary">{formatMoney(maxUsd)}</strong>
            </span>
          </span>
          <PriceInput
            value={numericAmount}
            onChange={(val) => setAmount(val.toString())}
            max={maxUsd}
            className="h-12 bg-surface-container-lowest px-space-md text-base"
          />
        </label>
        <div className="grid grid-cols-4 gap-space-xs">
          {[0.25, 0.5, 0.75, 1].map((percent) => (
            <Button
              key={percent}
              variant={null}
              size={null}
              onClick={() => setAmount((maxUsd * percent).toFixed(2))}
              className="h-auto rounded bg-surface-container-high py-1 font-data-mono-md text-[12px] text-text-secondary hover:bg-surface-container-highest hover:text-text-primary"
            >
              {percent === 1 ? "100% MAX" : `${percent * 100}%`}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md">
          <div className="flex items-center justify-between gap-2 text-text-primary">
            <span className="flex items-center gap-space-xs font-label-caps text-label-caps uppercase">
              <Icon name="security" className="text-[18px] text-primary" />
              Steam Guard 2FA Authentication
            </span>
            <span className="font-label-badge text-[10px] text-primary uppercase">Required</span>
          </div>
          <div className="flex items-center gap-space-sm">
            <Input
              maxLength={5}
              value={token}
              onChange={(event) => setToken(event.target.value.toUpperCase())}
              placeholder="R7X9K"
              className="h-auto w-32 rounded-lg border-0 bg-surface-card p-2 text-center font-data-mono-lg tracking-widest text-primary uppercase focus-visible:bg-surface-container-high"
            />
            <span className="flex items-center gap-space-xs font-data-mono-md text-[11px] text-text-secondary">
              <Icon name="timer" className="text-[16px] text-status-upcoming" />
              Tokens refresh every 30s
            </span>
          </div>
        </div>
      </div>

      <Button
        variant={null}
        size={null}
        disabled={pending || maxUsd <= 0}
        onClick={() =>
          request(
            rail,
            numericAmount,
            maxUsd,
            token,
            getEffectiveDestination(),
            rail === "usdt" ? network : undefined,
          )
        }
        className="h-auto w-full gap-space-xs rounded-lg border-0 bg-surface-container-high py-space-md font-headline-sm text-[14px] text-text-primary uppercase shadow-md hover:bg-primary hover:text-on-primary disabled:opacity-50"
      >
        <Icon name="lock_reset" className="text-[18px]" />
        <span>{pending ? "Dispatching payout…" : maxUsd <= 0 ? "Deposit to enable cashout" : "Authorize Instant Cashout"}</span>
      </Button>
    </section>
  );
}

