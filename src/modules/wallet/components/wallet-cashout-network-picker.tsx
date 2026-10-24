"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import {
  CRYPTO_NETWORK_CONFIGS,
  CRYPTO_NETWORKS,
  TF2_KEY_RATE_USD,
  calculateKeysFromUsd,
  validateCryptoAddress,
  type CryptoNetwork,
} from "@/server/modules/wallet/wallet.schema";

interface Props {
  rail: string;
  network: CryptoNetwork;
  onNetworkChange: (net: CryptoNetwork) => void;
  amountUsd: number;
  customAddress: string;
  isCustomAddress: boolean;
}

export function WalletCashoutNetworkPicker({
  rail,
  network,
  onNetworkChange,
  amountUsd,
  customAddress,
  isCustomAddress,
}: Props) {
  const t = useTranslations("wallet");
  const netConfig = CRYPTO_NETWORK_CONFIGS[network];
  const feeUsd = rail === "usdt" ? netConfig.feeUsd : 0;
  const netUsd = Math.max(0, amountUsd - feeUsd);
  const keysCount = calculateKeysFromUsd(amountUsd);

  const validation = isCustomAddress && rail === "usdt" && customAddress.trim().length > 0
    ? validateCryptoAddress(network, customAddress)
    : null;

  return (
    <div className="flex flex-col gap-space-xs">
      {rail === "usdt" && (
        <div className="flex flex-col gap-1.5 rounded-xl bg-surface-container-lowest p-space-sm">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[10px] text-text-secondary uppercase">
              {t("selectBlockchain")}
            </span>
            <span className="font-data-mono-md text-[10px] text-tertiary">
              {t("fee")} {formatMoney(feeUsd)} · {t("sla")} {netConfig.eta}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {CRYPTO_NETWORKS.map((id) => {
              const cfg = CRYPTO_NETWORK_CONFIGS[id];
              const isSelected = network === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNetworkChange(id)}
                  className={`flex flex-col items-center justify-center rounded-lg border py-1.5 px-1 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border-subtle/50 bg-surface-card text-text-muted hover:border-border-subtle hover:text-text-primary"
                  }`}
                >
                  <span className="font-headline-sm text-[11px] font-bold">{cfg.chain}</span>
                  <span className="font-data-mono-md text-[9px] opacity-80">${cfg.feeUsd.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
          {validation && !validation.valid && (
            <p className="flex items-center gap-1 text-[11px] text-status-offline">
              <Icon name="error" className="text-[14px]" />
              {validation.error}
            </p>
          )}
        </div>
      )}

      {rail === "keys" && (
        <div className="flex items-center justify-between gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-status-live/20 text-status-live">
              <Icon name="key" className="text-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-sm text-[12px] text-text-primary">
                TF2 Mann Co. Supply Crate Keys
              </span>
              <span className="font-data-mono-md text-[10px] text-text-muted">
                {t("tf2Rate", { rate: TF2_KEY_RATE_USD.toFixed(2) })}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-data-mono-lg text-headline-sm font-bold text-primary">
              ~{keysCount} Keys
            </span>
            <span className="font-label-badge text-[9px] text-status-live uppercase">{t("instantBotOffer")}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-2 text-[11px]">
        <span className="font-label-caps text-text-secondary uppercase">{t("netReceivable")}</span>
        <div className="flex items-center gap-2">
          {rail === "keys" ? (
            <span className="font-data-mono-md font-bold text-primary">
              {keysCount} Keys ({formatMoney(amountUsd)})
            </span>
          ) : (
            <span className="font-data-mono-md font-bold text-tertiary">
              {formatMoney(netUsd)} <span className="font-normal text-text-muted">(-${feeUsd.toFixed(2)} fee)</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
