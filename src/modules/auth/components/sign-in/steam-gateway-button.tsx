"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SteamLogo } from "../ui/steam-logo";

/** Primary "Sign In via Steam" OpenID call to action with its guarantees. */
export function SteamGatewayButton() {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        onClick={() => toast("Steam OpenID", { description: "The Steam gateway connects in the backend phase." })}
        className="group relative h-auto w-full justify-between overflow-hidden rounded-xl whitespace-normal border border-status-upcoming/30 bg-linear-to-r/srgb from-[#171a21] via-[#1b2838] to-[#2a475e] p-4 text-left shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.01] hover:border-[#22d3ee]/60 hover:shadow-[0_0_30px_rgba(42,71,94,0.6)]"
      >
        <div className="absolute inset-0 bg-linear-to-r/srgb from-primary-container/10 via-transparent to-status-upcoming/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/60 shadow-inner backdrop-blur-md transition-colors group-hover:border-[#22d3ee]/50">
            <SteamLogo className="size-7 fill-white drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold tracking-tight text-white transition-colors group-hover:text-[#a5f3fc]">
                Sign In via Steam
              </span>
              <span className="inline-flex items-center rounded border border-status-upcoming/30 bg-status-upcoming/20 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-status-upcoming uppercase">
                VERIFIED GATE
              </span>
            </div>
            <span className="mt-0.5 text-xs font-normal text-[#cbd5e1]">OpenID 2.0 Auth • Instant Vault Sync • Zero Credential Leak</span>
          </div>
        </div>
        <div className="relative z-10 hidden flex-col items-end pl-2 sm:flex">
          <Icon name="arrow_forward" className="text-[22px] text-status-upcoming transition-transform group-hover:translate-x-1" />
          <span className="font-mono text-[10px] font-medium text-text-secondary uppercase">12ms Handshake</span>
        </div>
      </Button>
      <div className="flex items-center justify-between px-2 pt-0.5 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#22d3ee]">
          <Icon name="verified_user" className="text-[14px]" /> No credentials shared with Relicto
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#fbbf24]">
          <Icon name="shield_with_heart" className="text-[14px]" /> Steam Guard Protected
        </span>
      </div>
    </div>
  );
}
