"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DividerLabel } from "../ui/divider-label";
import { SignUpForm } from "./sign-up-form";

function OnboardingSteps() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-surface-container-high p-3 shadow-[0_0_15px_rgba(255,81,106,0.12)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container font-headline-sm text-sm font-bold text-on-primary shadow-sm">1</div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-label-caps text-xs font-bold tracking-wider text-text-primary uppercase">Step 1: Account Setup</span>
          <span className="font-data-mono-md text-[11px] font-semibold text-primary">In Progress</span>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-deep p-3 opacity-70">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-variant font-headline-sm text-sm font-semibold text-text-muted">2</div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-label-caps text-xs tracking-wider text-text-secondary uppercase">Step 2: Steam Trade Bind</span>
          <span className="font-data-mono-md text-[11px] text-text-muted">Escrow Key Pending</span>
        </div>
      </div>
    </div>
  );
}

function FastTrackBanner() {
  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-status-upcoming/30 bg-surface-deep/95 p-4 shadow-[0_4px_20px_rgba(6,182,212,0.08)] transition-all hover:border-status-upcoming/50 sm:flex-row">
      <div className="flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-status-upcoming/40 bg-surface-card shadow-md">
          <Icon name="sports_esports" className="text-[26px] text-status-upcoming" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-sm font-bold tracking-tight text-text-primary uppercase">Fast-Track Onboarding</span>
            <span className="rounded border border-status-upcoming/30 bg-status-upcoming/15 px-2 py-0.5 font-label-badge text-[10px] font-bold text-status-upcoming">
              RECOMMENDED
            </span>
          </div>
          <p className="mt-0.5 font-body-sm text-xs text-text-secondary">
            Sync your trade inventory & Valve SteamID64 in 1 click without entering a password.
          </p>
        </div>
      </div>
      <Button
        type="button"
        onClick={() => toast("Steam OpenID", { description: "The Steam gateway connects in the backend phase." })}
        className="h-auto w-full shrink-0 gap-2 rounded-lg border border-[#66c0f4]/40 bg-linear-to-r/srgb from-[#171a21] to-[#2a475e] px-4 py-2.5 font-headline-sm text-xs tracking-wider text-white uppercase shadow-[0_0_15px_rgba(102,192,244,0.25)] hover:from-[#2a475e] hover:to-[#3b6282] active:scale-[0.98] sm:w-auto"
      >
        <Icon name="bolt" className="text-[18px] text-[#66c0f4]" />
        <span className="font-bold">Connect with Steam</span>
      </Button>
    </div>
  );
}

/** Registration card: onboarding steps, Steam fast-track, manual form. */
export function RegistrationCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-card/90 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-8">
      <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r/srgb from-primary-container via-tertiary to-status-upcoming" />
      <OnboardingSteps />
      <FastTrackBanner />
      <DividerLabel className="my-6" labelClassName="rounded font-label-badge text-[11px] text-text-muted">
        or register manual credentials
      </DividerLabel>
      <SignUpForm />
      <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 border-t border-white/5 pt-4 text-center">
        <span className="font-body-sm text-xs text-text-muted">Already registered on Relicto Escrow?</span>
        <Link href="/sign-in" className="font-headline-sm text-xs font-semibold tracking-wider text-primary uppercase hover:text-primary-fixed hover:underline">
          Sign In to Exchange Desk
        </Link>
      </div>
    </div>
  );
}
