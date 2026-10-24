"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CRYPTO_NETWORKS } from "@/lib/crypto/networks";

type WalletDepositNetworkCardProps = {
  selectedNetworkId: string;
  onNetworkChange: (networkId: string) => void;
};

export function WalletDepositNetworkCard({
  selectedNetworkId,
  onNetworkChange,
}: WalletDepositNetworkCardProps) {
  const t = useTranslations("wallet");
  const [address, setAddress] = useState("TYDzsYUEpvnYmQk4zGP9sWWcTEd3YiAtW6");
  const [confirmations, setConfirmations] = useState(12);
  const [badge, setBadge] = useState("12 Block Finality");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/crypto/address?network=${selectedNetworkId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        if (data?.depositAddress) {
          setAddress(data.depositAddress);
          setConfirmations(data.confirmationsRequired ?? 12);
          setBadge(data.badge ?? "Instant Finality");
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedNetworkId]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    toast.success(t("addressCopied"), { description: address });
  };

  const activeNetwork = CRYPTO_NETWORKS.find((n) => n.id === selectedNetworkId) || CRYPTO_NETWORKS[0];

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-space-md">
      {/* Network selection chips */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-label-badge text-[10px] text-text-muted uppercase">{t("selectDepositNetwork")}</span>
          <span className="rounded bg-tertiary/15 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-tertiary">
            {badge}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {CRYPTO_NETWORKS.map((n) => {
            const active = n.id === selectedNetworkId;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setLoading(true);
                  onNetworkChange(n.id);
                }}
                className={`flex flex-col items-center justify-center rounded-lg border px-2 py-1.5 text-center transition-all ${
                  active
                    ? "border-primary bg-primary/20 text-text-primary shadow-xs"
                    : "border-border-subtle bg-surface-card text-text-secondary hover:border-border-subtle hover:text-text-primary"
                }`}
              >
                <span className="font-data-mono-md text-[11px] font-bold text-text-primary">{n.symbol}</span>
                <span className="truncate text-[9px] text-text-muted">{n.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QR + Address Bar */}
      <div className="flex flex-col items-center gap-space-md rounded-xl bg-surface-card p-space-md md:flex-row">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-text-primary p-2 text-canvas-base shadow-sm">
          <Icon name="qr_code_2" className="text-[80px]" />
        </div>
        <div className="flex w-full flex-1 flex-col gap-space-xs">
          <div className="flex items-center justify-between gap-space-sm">
            <span className="font-label-badge text-label-badge text-text-muted">
              {activeNetwork.name.toUpperCase()} ADDRESS
            </span>
            <span className="font-data-mono-md text-[11px] text-tertiary">
              {confirmations} Block Confirmations
            </span>
          </div>
          <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-lowest px-space-md py-2 shadow-inner">
            <span className="truncate font-data-mono-md text-xs text-text-primary">
              {loading ? "Generating dedicated vault address..." : address}
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
              Minimum deposit: $10.00 {activeNetwork.symbol}. Settle automatically after {confirmations} confirmations.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
