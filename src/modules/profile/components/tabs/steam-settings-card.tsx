"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { isValidTradeUrl } from "@/lib/steam/trade-url";
import { saveSteamTradeUrl, triggerManualSteamSync } from "../../actions/steam";

type Props = {
  initialTradeUrl: string;
  steamId: string;
  openId: string;
};

export function SteamSettingsCard({ initialTradeUrl, steamId, openId }: Props) {
  const [tradeUrl, setTradeUrl] = useState(initialTradeUrl);
  const [isEditing, setIsEditing] = useState(!initialTradeUrl);
  const [isSaving, startSaving] = useTransition();
  const [isSyncing, startSyncing] = useTransition();

  const isValid = isValidTradeUrl(tradeUrl);

  const handleSave = () => {
    if (!isValid) {
      toast.error("Invalid Steam Trade URL", {
        description: "Please check the URL format with partner ID and token.",
      });
      return;
    }

    startSaving(async () => {
      const res = await saveSteamTradeUrl(tradeUrl);
      if (res.success) {
        toast.success("Steam Trade URL Saved", {
          description: "Your escrow bots can now route direct P2P delivery.",
        });
        setIsEditing(false);
      } else {
        toast.error("Failed to save", { description: res.error });
      }
    });
  };

  const handleSync = () => {
    startSyncing(async () => {
      const res = await triggerManualSteamSync();
      if (res.success) {
        toast.success("Steam Inventory Synced", { description: res.message });
      } else {
        toast.error("Sync Notice", { description: res.error });
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/8 bg-surface-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-status-upcoming/30 bg-status-upcoming/10 text-status-upcoming">
            <Icon name="verified_user" className="text-[18px]" />
          </div>
          <div>
            <h3 className="font-headline-sm text-sm font-bold text-text-primary">
              Steam OpenID 2.0 & Escrow Routing
            </h3>
            <p className="font-data-mono-md text-[11px] text-text-muted">
              {openId} • SteamID64: {steamId || "Not Linked"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="h-8 gap-1.5 rounded-lg border-white/10 bg-surface-container-low px-3 text-xs font-semibold text-text-secondary hover:text-white"
          >
            <Icon name="sync" className={`text-[15px] ${isSyncing ? "animate-spin text-tertiary" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Steam Now"}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="steam-trade-url-input" className="font-medium text-text-secondary">
            Steam Trade Offer URL
          </label>
          <a
            href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-data-mono-md text-[11px] text-cyan-400 hover:underline"
          >
            <span>Find my Trade URL</span>
            <Icon name="open_in_new" className="text-[13px]" />
          </a>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Input
                id="steam-trade-url-input"
                type="url"
                value={tradeUrl}
                onChange={(e) => setTradeUrl(e.target.value)}
                placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
                className="h-10 rounded-lg border-white/10 bg-surface-container-lowest pr-8 font-data-mono-md text-xs text-text-primary placeholder:text-text-muted focus:border-cyan-400/50"
              />
              {tradeUrl && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Icon
                    name={isValid ? "check_circle" : "error"}
                    className={`text-[16px] ${isValid ? "text-status-upcoming" : "text-primary-container"}`}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isValid}
                className="h-10 rounded-lg bg-status-upcoming/20 px-4 text-xs font-bold text-status-upcoming hover:bg-status-upcoming/30"
              >
                {isSaving ? "Saving..." : "Save URL"}
              </Button>
              {initialTradeUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setTradeUrl(initialTradeUrl);
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
            <span className="truncate font-data-mono-md text-xs text-text-secondary">
              {tradeUrl || "No trade URL configured"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-7 text-xs font-medium text-cyan-400 hover:bg-surface-container hover:text-cyan-300"
            >
              Change
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
