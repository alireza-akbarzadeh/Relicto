"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { AuthField } from "../ui/auth-field";

const LABEL = "font-mono text-xs font-semibold tracking-wider text-[#cbd5e1] uppercase";
const INPUT =
  "rounded-xl border-white/10 bg-surface-container-lowest pl-10 py-3 text-sm text-white shadow-inner placeholder:text-[#475569] focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container";

/** Relicto credentials form (identity + password + remember me). */
export function SignInForm() {
  const [remember, setRemember] = useState(true);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    toast("Credential sign-in", { description: "Email & password sign-in is wired to Better Auth in the logic phase." });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <AuthField
        id="identity"
        name="identity"
        label="Account Identity"
        aside={<span className="font-mono text-[11px] text-text-muted">SteamID64 / Email</span>}
        icon="badge"
        placeholder="Relicto.trader or user@domain.com"
        autoComplete="username"
        labelClassName={LABEL}
        inputClassName={`${INPUT} pr-4`}
      />
      <AuthField
        id="password"
        name="password"
        label="Security Key / Password"
        aside={
          <Link href="/reset-password" className="text-xs font-medium text-primary-container transition-colors hover:text-[#ff8093]">
            Forgot password?
          </Link>
        }
        icon="key"
        revealable
        placeholder="••••••••••••••••"
        autoComplete="current-password"
        labelClassName={LABEL}
        inputClassName={`${INPUT} pr-12`}
      />
      <div className="flex items-center justify-between pt-1">
        <Label className="cursor-pointer gap-2 text-xs font-medium text-[#cbd5e1]">
          <Checkbox
            checked={remember}
            onCheckedChange={setRemember}
            className="rounded border-white/20 bg-surface-container-lowest"
          />
          Remember session for 30 days
        </Label>
        <div className="inline-flex items-center gap-1 rounded-full border border-status-amber/20 bg-surface-container px-2 py-0.5 text-tertiary">
          <Icon name="security" className="text-[13px]" />
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase">Trusted Node</span>
        </div>
      </div>
      <Button
        type="submit"
        className="mt-2 h-auto w-full gap-2 rounded-xl bg-primary-container py-3.5 font-display text-sm font-bold tracking-wider text-white uppercase shadow-[0_0_24px_rgba(244,63,94,0.4)] duration-200 hover:bg-[#f43f5e] hover:shadow-[0_0_32px_rgba(244,63,94,0.6)] active:scale-[0.99]"
      >
        <span>Authenticate Session</span>
        <Icon name="lock_open" className="text-[18px]" />
      </Button>
    </form>
  );
}
