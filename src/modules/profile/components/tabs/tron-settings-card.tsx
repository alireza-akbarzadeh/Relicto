"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { isValidTronAddress } from "@/lib/tron/tron-address";
import { saveTronAddress } from "../../actions/tron";

type Props = {
  initialTronAddress?: string;
};

export function TronSettingsCard({ initialTronAddress = "" }: Props) {
  const [address, setAddress] = useState(initialTronAddress);
  const [isEditing, setIsEditing] = useState(!initialTronAddress);
  const [isSaving, startSaving] = useTransition();

  const isValid = !address || isValidTronAddress(address);

  const handleConnectTronLink = async () => {
    if (typeof window === "undefined") return;
    const tronWeb = (window as unknown as { tronWeb?: { defaultAddress?: { base58?: string } } }).tronWeb;

    if (tronWeb?.defaultAddress?.base58) {
      const detected = tronWeb.defaultAddress.base58;
      setAddress(detected);
      setIsEditing(true);
      toast.success("TronLink Address Detected", {
        description: `Imported ${detected.slice(0, 6)}...${detected.slice(-4)}`,
      });
    } else {
      window.open(
        "https://chromewebstore.google.com/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec",
        "_blank"
      );
      toast.info("Please install or unlock your TronLink Chrome extension");
    }
  };

  const handleSave = () => {
    if (address && !isValidTronAddress(address)) {
      toast.error("Invalid TRON Address", {
        description: "Address must be a 34-character base58 string starting with 'T'.",
      });
      return;
    }

    startSaving(async () => {
      const res = await saveTronAddress(address);
      if (res.success) {
        toast.success("TRON Wallet Saved", {
          description: address
            ? "Your TRON address will receive instant USDT/TRX payouts."
            : "TRON wallet removed.",
        });
        setIsEditing(false);
      } else {
        toast.error("Failed to save TRON wallet", { description: res.error });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/8 bg-surface-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <Icon name="currency_exchange" className="text-[18px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-sm font-bold text-text-primary">
                TRON (TRC-20) Settlement &amp; Wallet Routing
              </h3>
              <span className="rounded bg-rose-500/15 px-1.5 py-0.2 font-data-mono-md text-[9px] font-semibold text-rose-300 border border-rose-500/30">
                Web3 Rails
              </span>
            </div>
            <p className="font-data-mono-md text-[11px] text-text-muted">
              Fast Sub-Cent Gas • 3-Second Finality • USDT TRC-20 &amp; TRX
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleConnectTronLink}
          className="h-8 gap-1.5 rounded-lg border-rose-500/30 bg-rose-950/20 px-3 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 hover:text-white"
        >
          <Icon name="account_balance_wallet" className="text-[14px]" />
          <span>Connect TronLink</span>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="tron-wallet-address-input" className="font-medium text-text-secondary">
            Default TRON Payout Address
          </label>
          <span className="font-data-mono-md text-[10px] text-text-muted">
            Format: T... (34 characters)
          </span>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Input
                id="tron-wallet-address-input"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value.trim())}
                placeholder="T... (e.g. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)"
                className="h-10 rounded-lg border-white/10 bg-surface-container-lowest pr-8 font-data-mono-md text-xs text-text-primary placeholder:text-text-muted focus:border-rose-400/50"
              />
              {address && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Icon
                    name={isValid ? "check_circle" : "error"}
                    className={`text-[16px] ${isValid ? "text-status-upcoming" : "text-rose-400"}`}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || (address !== "" && !isValid)}
                className="h-10 rounded-lg bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-500"
              >
                {isSaving ? "Saving..." : "Save Address"}
              </Button>
              {initialTronAddress && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setAddress(initialTronAddress);
                    setIsEditing(false);
                  }}
                  className="h-10 rounded-lg px-3 text-xs text-text-muted hover:text-white"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-white/6 bg-surface-container-lowest px-3.5 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate font-data-mono-md text-xs text-text-secondary">
                {address || "No TRON address configured"}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-7 text-xs font-medium text-rose-400 hover:bg-surface-container hover:text-rose-300"
            >
              Change
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
