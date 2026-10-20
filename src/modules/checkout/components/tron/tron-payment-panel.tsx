"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/format";
import { useTronWallet } from "@/lib/tron/use-tron-wallet";
import { formatTronAddress } from "@/lib/tron/tron-address";
import { getActiveTronConfig } from "@/lib/tron/tron-config";

type TronPaymentPanelProps = {
  totalUsd: number;
  depositAddress: string;
  onPaymentSuccess: (txHash: string) => void;
  isPending: boolean;
};

export function TronPaymentPanel({
  totalUsd,
  depositAddress,
  onPaymentSuccess,
  isPending,
}: TronPaymentPanelProps) {
  const [manualTxHash, setManualTxHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const { isInstalled, connectedAddress, isPending: walletPending, sendTronPayment } = useTronWallet();
  const config = getActiveTronConfig();

  const handle1ClickPay = async () => {
    const txid = await sendTronPayment({
      toAddress: depositAddress,
      amountUsd: totalUsd,
      token: "USDT",
    });

    if (txid) {
      onPaymentSuccess(txid);
    }
  };

  const handleVerifyManual = async () => {
    const hash = manualTxHash.trim();
    if (!hash) {
      toast.error("Please enter a transaction hash");
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch("/api/crypto/tron/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: hash, amountUsd: totalUsd, expectedRecipient: depositAddress }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("TRON Payment Confirmed On-Chain", {
          description: `Block #${data.blockNumber} • Settled in Vault`,
        });
        onPaymentSuccess(data.txid);
      } else {
        toast.error("Verification Failed", { description: data.message || data.error });
      }
    } catch {
      toast.error("Network error communicating with TRON FullNode");
    } finally {
      setVerifying(false);
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(depositAddress);
    toast.success("TRON Address Copied", { description: depositAddress });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-surface-container-lowest p-4">
      {/* TRON Header Badge */}
      <div className="flex items-center justify-between gap-2 border-b border-white/6 pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-rose-500/20 text-rose-400 font-bold text-xs">
            TRX
          </span>
          <span className="truncate font-headline-sm text-xs font-bold text-white">TRON Network (TRC-20 USDT)</span>
        </div>
        <span className="shrink-0 rounded bg-rose-500/15 px-2 py-0.5 font-data-mono-md text-[10px] font-semibold text-rose-400">
          3s Finality · 0% Gas
        </span>
      </div>

      {/* 1-Click Pay with TronLink (if detected) */}
      {isInstalled && (
        <div className="flex flex-col gap-2 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-headline-sm font-semibold text-rose-300">TronLink Extension Active</span>
            {connectedAddress && (
              <span className="font-data-mono-md text-[11px] text-text-muted">
                Connected: {formatTronAddress(connectedAddress)}
              </span>
            )}
          </div>
          <Button
            type="button"
            onClick={handle1ClickPay}
            disabled={walletPending || isPending}
            className="h-10 w-full gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 font-headline-sm text-xs font-bold text-white shadow-md hover:from-rose-500 hover:to-rose-400"
          >
            <Icon name="bolt" className="text-[16px]" />
            <span>
              {walletPending ? "Confirming in TronLink..." : `1-Click Pay ${formatMoney(totalUsd)} USDT`}
            </span>
          </Button>
        </div>
      )}

      {/* Address & Copy */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-data-mono-md text-[10px] text-text-muted uppercase">Escrow Vault TRON Address</span>
          <a
            href={`${config.explorerTx}${depositAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-data-mono-md text-[10px] text-rose-400 hover:underline"
          >
            <span>TronScan Explorer</span>
            <Icon name="open_in_new" className="text-[11px]" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex-1 truncate rounded-lg border border-white/6 bg-black/40 px-3 py-2 font-data-mono-md text-xs text-slate-200">
            {depositAddress}
          </span>
          <Button type="button" size="sm" variant="outline" onClick={copyAddress} className="h-9 gap-1 border-white/10 px-3 text-xs">
            <Icon name="content_copy" className="text-[14px]" />
            <span>Copy</span>
          </Button>
        </div>
      </div>

      {/* Manual Verification Bar */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-white/6">
        <span className="font-data-mono-md text-[10px] text-text-muted uppercase">Verify Mobile / External Transfer</span>
        <div className="flex items-center gap-2">
          <Input
            value={manualTxHash}
            onChange={(e) => setManualTxHash(e.target.value)}
            placeholder="TRON TxID / hash (e.g. 7f8a...)"
            className="h-9 rounded-lg border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-white"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleVerifyManual}
            disabled={verifying || isPending || !manualTxHash.trim()}
            className="h-9 shrink-0 gap-1 rounded-lg bg-surface-container-high px-3 font-headline-sm text-xs font-semibold text-text-primary hover:bg-surface-bright"
          >
            <Icon name="search" className="text-[14px]" />
            <span>{verifying ? "Checking..." : "Verify"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
