"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  calculateCryptoAmount,
  CRYPTO_NETWORKS,
  type CryptoNetwork,
} from "@/lib/crypto/networks";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalUsd: number;
  onConfirm: (data: { network: CryptoNetwork; txHash: string }) => void;
  isPending: boolean;
};

export function CryptoModal({ open, onOpenChange, totalUsd, onConfirm, isPending }: Props) {
  const [network, setNetwork] = useState<CryptoNetwork>(CRYPTO_NETWORKS[0]);
  const [txHash, setTxHash] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(899);
  const [dedicatedAddress, setDedicatedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch(`/api/crypto/address?network=${network.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.depositAddress) {
          setDedicatedAddress(data.depositAddress);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [open, network.id]);

  const activeAddress = dedicatedAddress || network.depositAddress;

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [open]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const cryptoAmount = calculateCryptoAmount(totalUsd, network);

  const copyAddress = () => {
    void navigator.clipboard.writeText(activeAddress);
    toast.success("Deposit Address Copied", { description: activeAddress });
  };

  const handleSimulateBroadcast = () => {
    const mockHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    setTxHash(mockHash);
    toast.info("Wallet Broadcast Simulated", { description: `Hash: ${mockHash.slice(0, 18)}...` });
  };

  const handleSubmit = () => {
    const hash = txHash.trim() || `0xauto_${Date.now()}`;
    onConfirm({ network, txHash: hash });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-white/10 bg-surface-card/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <DialogHeader className="border-b border-white/6 pb-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 font-headline-sm text-base font-bold text-white">
              <Icon name="currency_bitcoin" className="text-[20px] text-tertiary" />
              <span>Web3 Escrow Settlement</span>
            </DialogTitle>
            <span className="font-data-mono-md text-xs font-semibold text-tertiary">
              Lock Expires: {mins}:{secs}
            </span>
          </div>
        </DialogHeader>

        {/* Network / Token Selector */}
        <div className="flex flex-col gap-3 pt-1">
          <label className="font-data-mono-md text-[11px] text-text-muted uppercase">Select Settlement Chain</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {CRYPTO_NETWORKS.map((net) => (
              <Button
                key={net.id}
                type="button"
                variant={null}
                size={null}
                onClick={() => setNetwork(net)}
                className={`flex h-auto flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all ${
                  network.id === net.id
                    ? "border-amber-400/60 bg-amber-400/10 text-white shadow-xs"
                    : "border-white/6 bg-surface-container-lowest/80 text-text-muted hover:border-white/15"
                }`}
              >
                <span className="font-data-mono-md text-xs font-bold">{net.symbol}</span>
                <span className="truncate text-[10px] text-text-secondary">{net.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Amount & Address Card */}
        <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-surface-container-lowest p-4">
          <div className="flex items-baseline justify-between border-b border-white/6 pb-2">
            <span className="font-data-mono-md text-xs text-text-muted">Exact Due Amount:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-data-mono-lg text-xl font-bold text-tertiary">{cryptoAmount}</span>
              <span className="font-data-mono-md text-xs font-semibold text-white">{network.symbol}</span>
              <span className="font-data-mono-md text-[11px] text-text-muted">(${totalUsd.toFixed(2)})</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-data-mono-md text-[11px] text-text-muted">Relicto Escrow Vault Address</span>
            <div className="flex items-center gap-2">
              <span className="flex-1 truncate rounded-lg border border-white/6 bg-black/40 px-3 py-2 font-data-mono-md text-xs text-slate-200">
                {activeAddress}
              </span>
              <Button type="button" size="sm" variant="outline" onClick={copyAddress} className="h-9 gap-1 border-white/10 px-3 text-xs">
                <Icon name="content_copy" className="text-[14px]" />
                <span>Copy</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tx Hash / Web3 Confirmation */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-data-mono-md text-[11px] text-text-muted uppercase">Transaction Hash / Proof</label>
            <Button
              type="button"
              variant={null}
              size={null}
              onClick={handleSimulateBroadcast}
              className="h-auto border-0 p-0 font-data-mono-md text-[11px] text-cyan-400 hover:underline"
            >
              Simulate Instant Broadcast
            </Button>
          </div>
          <Input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="0x... or on-chain tx signature"
            className="h-10 rounded-lg border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-white"
          />
        </div>

        {/* Submit */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-headline-sm text-sm font-bold text-black shadow-lg transition-all hover:brightness-110"
        >
          <Icon name="bolt" className="text-[18px]" />
          <span>{isPending ? "Confirming On-Chain..." : `Confirm Payment (${cryptoAmount} ${network.symbol})`}</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
