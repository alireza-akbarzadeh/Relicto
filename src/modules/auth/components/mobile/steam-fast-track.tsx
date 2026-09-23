"use client";

import { useSteamSignIn } from "@/modules/auth/hooks/use-steam-sign-in";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { GatewayMobile } from "../../data/gateway-mobile.mock";
import { SteamLogo } from "../ui/steam-logo";

/** Sync status, the gateway title and the Steam OpenID fast-track card. */
export function SteamFastTrack({ data }: { data: GatewayMobile }) {
  const signInWithSteam = useSteamSignIn();
  return (
    <>
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-high px-2.5 py-1 text-tertiary shadow-xs">
            <Icon name="shield" filled className="animate-pulse text-[16px] text-primary-container" />
            <span className="font-label-badge text-label-badge tracking-wider text-text-primary uppercase">{data.sync}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded bg-surface-container px-2 py-0.5 font-label-badge text-label-badge text-text-secondary">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
            <span>{data.latency}</span>
          </div>
        </div>
        <div>
          <h2 className="font-headline-xl-mobile text-headline-xl-mobile font-bold tracking-tight text-text-primary uppercase">{data.title}</h2>
          <p className="mt-0.5 font-body-sm text-body-sm text-text-secondary">{data.lede}</p>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl bg-surface-card p-space-md shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br/srgb from-primary-container/5 via-transparent to-secondary/5" />
        <div className="relative z-10 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-deep text-primary-container shadow-inner">
                <SteamLogo className="h-5 w-5 fill-current" />
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm leading-none tracking-tight text-text-primary">{data.steam.title}</div>
                <div className="mt-1 font-label-badge text-label-badge text-tertiary">{data.steam.badge}</div>
              </div>
            </div>
            <Icon name="bolt" className="text-[20px] text-text-muted" />
          </div>
          <p className="font-body-sm text-body-sm leading-relaxed text-text-secondary">{data.steam.body}</p>
          <Button
            variant={null}
            size={null}
            onClick={signInWithSteam}
            className="h-auto w-full justify-between rounded-lg border-0 bg-linear-to-r/srgb from-surface-bright to-surface-container-highest px-4 py-3.5 text-text-primary shadow-md transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5">
              <SteamLogo className="h-5 w-5 fill-primary" />
              <span className="font-headline-sm text-headline-sm tracking-wide uppercase">Sign in through Steam</span>
            </span>
            <Icon name="arrow_forward" className="text-[20px] text-primary" />
          </Button>
        </div>
      </div>
    </>
  );
}
