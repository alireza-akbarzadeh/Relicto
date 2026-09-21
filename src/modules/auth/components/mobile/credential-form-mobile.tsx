"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

const LABEL = "font-label-badge text-label-badge tracking-wider text-text-secondary uppercase";
const FIELD =
  "h-auto rounded-lg border-0 bg-surface-deep py-3 pl-10 font-body-md text-body-md text-text-primary shadow-inner transition-colors placeholder:text-text-muted focus-visible:bg-surface-container-high focus-visible:ring-0 md:text-body-md dark:bg-surface-deep";

/** "Or Relicto Trader ID": handle, passkey (revealable), remember-device switch and submit. */
export function CredentialFormMobile({ uid }: { uid: string }) {
  const router = useRouter();
  const [identity, setIdentity] = useState("");
  const [secret, setSecret] = useState("");
  const [reveal, setReveal] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!identity.trim() || !secret) {
      toast.error("Enter your trader handle and passkey");
      return;
    }
    toast.success("Session authenticated", { description: remember ? "Remembered on this device for 30 days." : "Session ends when you close the app." });
    router.push("/marketplace");
  };

  return (
    <>
      <div className="relative flex items-center justify-center">
        <div className="h-px w-full bg-surface-container-highest" />
        <span className="absolute bg-surface px-3 font-label-badge text-label-badge tracking-widest whitespace-nowrap text-text-muted uppercase">or Relicto Trader ID</span>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-space-md">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="trader-identity" className={LABEL}>
              Trader Handle / Email
            </label>
            <span className="font-label-badge text-label-badge text-text-muted">{uid}</span>
          </div>
          <div className="relative flex items-center">
            <Icon name="badge" className="absolute left-3.5 text-[18px] text-text-muted" />
            <Input id="trader-identity" value={identity} onChange={(e) => setIdentity(e.target.value)} autoComplete="username" placeholder="user@relicto.gg or alias" className={cn(FIELD, "pr-4")} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="trader-secret" className={LABEL}>
              Master Passkey
            </label>
            <Link href="/reset-password" className="font-label-badge text-label-badge text-tertiary hover:underline">
              RECOVER KEY
            </Link>
          </div>
          <div className="relative flex items-center">
            <Icon name="lock" className="absolute left-3.5 text-[18px] text-text-muted" />
            <Input
              id="trader-secret"
              type={reveal ? "text" : "password"}
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter credential"
              className={cn(FIELD, "pr-11")}
            />
            <Button
              type="button"
              variant={null}
              size={null}
              aria-label={reveal ? "Hide passkey" : "Show passkey"}
              onClick={() => setReveal((on) => !on)}
              className="absolute right-3.5 h-auto border-0 text-text-muted transition-colors hover:text-text-primary"
            >
              <Icon name={reveal ? "visibility_off" : "visibility"} className="text-[20px]" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-surface-container-low p-space-sm">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-deep text-tertiary">
              <Icon name="verified_user" className="text-[16px]" />
            </div>
            <div>
              <div className="font-body-sm text-body-sm font-medium text-text-primary">Remember on this device</div>
              <div className="font-label-badge text-label-badge text-text-muted">30-day tactical session token</div>
            </div>
          </div>
          <Button
            type="button"
            variant={null}
            size={null}
            role="switch"
            aria-checked={remember}
            aria-label="Remember on this device"
            onClick={() => setRemember((on) => !on)}
            className={cn("relative h-6 w-12 justify-start rounded-full border-0 p-0.5 transition-colors", remember ? "bg-secondary-container" : "bg-surface-container-highest")}
          >
            <span className={cn("h-5 w-5 rounded-full shadow-md transition-transform", remember ? "translate-x-6 bg-on-secondary" : "translate-x-0 bg-text-muted")} />
          </Button>
        </div>

        <Button
          type="submit"
          variant={null}
          size={null}
          className="group h-auto w-full gap-2 rounded-lg border-0 bg-primary-container py-4 font-headline-sm text-headline-sm font-semibold tracking-wider text-text-primary uppercase shadow-[0_0_24px_rgba(244,63,94,0.4)] transition-all active:scale-[0.98]"
        >
          <Icon name="key" className="text-[20px] transition-transform group-hover:rotate-12" />
          <span>Authenticate Session</span>
        </Button>
      </form>
    </>
  );
}
