"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  getWhitelistedVaultsForRail,
  validateCryptoAddress,
  type CashoutRail,
  type CryptoNetwork,
} from "@/server/modules/wallet/wallet.schema";

interface Props {
  rail: string;
  network: CryptoNetwork;
  isCustomAddress: boolean;
  onToggleCustom: () => void;
  customAddress: string;
  onCustomAddressChange: (val: string) => void;
  selectedVaultId: string;
  onSelectVaultId: (id: string) => void;
}

export function WalletCashoutDestination({
  rail,
  network,
  isCustomAddress,
  onToggleCustom,
  customAddress,
  onCustomAddressChange,
  selectedVaultId,
  onSelectVaultId,
}: Props) {
  const currentRail = rail as CashoutRail;
  const vaults = useMemo(
    () => getWhitelistedVaultsForRail(currentRail, currentRail === "usdt" ? network : undefined),
    [currentRail, network],
  );

  const activeVault = vaults.find((v) => v.id === selectedVaultId) ?? vaults[0];

  const validation =
    isCustomAddress && currentRail === "usdt" && customAddress.trim().length > 0
      ? validateCryptoAddress(network, customAddress)
      : null;

  const copyAddress = async (addr: string) => {
    await navigator.clipboard.writeText(addr);
    toast.success("Destination copied", { description: addr });
  };

  const getPlaceholder = () => {
    if (rail === "keys") return "https://steamcommunity.com/tradeoffer/new/?partner=...";
    if (rail === "sepa") return "LT60 3250 0123 4567 8901 (IBAN)...";
    if (rail === "visa") return "4000 1234 5678 9010 (Card number)...";
    return network === "trc20" ? "T... (TRC-20 Address)" : "0x... (EVM Address)";
  };

  return (
    <div className="flex flex-col gap-space-xs">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-text-secondary uppercase">
          {rail === "keys" ? "Steam Trade URL / Escrow Profile" : "Destination Vault / Address"}
        </span>
        <Button
          variant={null}
          size={null}
          onClick={onToggleCustom}
          className="h-auto rounded-none border-0 p-0 font-label-badge text-label-badge text-primary hover:underline"
        >
          {isCustomAddress ? "Use Whitelist" : "+ Custom Address"}
        </Button>
      </div>

      {isCustomAddress ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-space-sm rounded-lg bg-surface-container-lowest p-space-sm">
            <Icon name="account_balance_wallet" className="text-[20px] text-primary" />
            <Input
              value={customAddress}
              onChange={(e) => onCustomAddressChange(e.target.value)}
              placeholder={getPlaceholder()}
              className="h-auto flex-1 border-0 bg-transparent p-0 font-data-mono-md text-[12px] text-text-primary focus-visible:ring-0"
            />
            {validation && (
              <span
                className={`font-label-badge text-[10px] ${validation.valid ? "text-status-live" : "text-status-offline"}`}
              >
                {validation.valid ? "Format OK" : "Invalid Format"}
              </span>
            )}
          </div>
          {validation && !validation.valid && (
            <p className="text-[11px] text-status-offline px-1">{validation.error}</p>
          )}
        </div>
      ) : activeVault ? (
        <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-lowest p-space-sm">
          <div className="flex min-w-0 items-center gap-space-sm">
            <Icon name="account_balance_wallet" className="text-[20px] text-tertiary" />
            <div className="flex min-w-0 flex-col">
              {vaults.length > 1 ? (
                <Select
                  value={activeVault.id}
                  onValueChange={onSelectVaultId}
                  options={vaults.map((v) => ({
                    value: v.id,
                    label: `${v.label} (${v.address.slice(0, 6)}...${v.address.slice(-4)})`,
                  }))}
                  label="Whitelisted Vault"
                  triggerClassName="text-left font-body-sm text-body-sm text-text-primary border-0 bg-transparent p-0"
                />
              ) : (
                <span className="truncate font-body-sm text-body-sm text-text-primary">
                  {activeVault.label}
                </span>
              )}
              <span className="truncate font-data-mono-md text-[11px] text-text-muted">
                {activeVault.address}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={null}
              size="icon-xs"
              onClick={() => copyAddress(activeVault.address)}
              className="text-text-muted hover:text-text-primary"
            >
              <Icon name="content_copy" className="text-[16px]" />
            </Button>
            <span className="rounded bg-surface-container-high px-2 py-1 font-label-badge text-[10px] text-status-upcoming uppercase">
              Verified
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container-lowest p-space-sm">
          <span className="text-[12px] text-text-muted">No whitelisted vault for {rail}. Using default treasury address.</span>
        </div>
      )}
    </div>
  );
}
