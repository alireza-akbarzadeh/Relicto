"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/modules/relicto/lib/sign-in-href";
import { AuthField } from "../ui/auth-field";

import { resolveAccountEmail } from "@/server/modules/auth/auth.identity";

const LABEL = "font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase";
const INPUT =
  "rounded-xl border-white/10 bg-surface-container-lowest pl-10 py-3 text-sm text-white shadow-inner placeholder:text-slate-600 focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container";

/** Relicto credentials form (identity + password + remember me). */
export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!identity.trim()) {
      toast.error("Please enter your email or trader handle");
      return;
    }

    setPending(true);
    const resolvedEmail = await resolveAccountEmail(identity);
    const { error } = await authClient.signIn.email({
      email: resolvedEmail,
      password,
      rememberMe: remember,
    });
    setPending(false);

    if (error) {
      toast.error("Sign-in failed", { description: error.message ?? "Check your email and password." });
      return;
    }

    toast.success("Session authenticated");
    router.push(safeNext(searchParams.get("next")));
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <AuthField
        id="identity"
        name="identity"
        type="text"
        label={t("accountIdentity")}
        aside={<span className="font-mono text-[11px] text-text-muted">{t("emailOrHandle")}</span>}
        icon="badge"
        placeholder="user@domain.com or @handle"
        autoComplete="username"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
        labelClassName={LABEL}
        inputClassName={`${INPUT} pr-4`}
      />
      <AuthField
        id="password"
        name="password"
        label={t("securityKey")}
        aside={
          <Link href="/reset-password" className="text-xs font-medium text-primary-container transition-colors hover:text-brand-rose-hover">
            {t("forgotPassword")}
          </Link>
        }
        icon="key"
        revealable
        placeholder="••••••••••••••••"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        labelClassName={LABEL}
        inputClassName={`${INPUT} pr-12`}
      />
      <div className="flex items-center justify-between pt-1">
        <Label className="cursor-pointer gap-2 text-xs font-medium text-slate-300">
          <Checkbox
            checked={remember}
            onCheckedChange={setRemember}
            className="rounded border-white/20 bg-surface-container-lowest"
          />
          {t("rememberMe")}
        </Label>
        <div className="inline-flex items-center gap-1 rounded-full border border-status-amber/20 bg-surface-container px-2 py-0.5 text-tertiary">
          <Icon name="security" className="text-[13px]" />
          <span className="font-mono text-[10px] font-bold tracking-wider uppercase">{t("trustedNode")}</span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-auto w-full gap-2 rounded-xl bg-primary-container py-3.5 font-display text-sm font-bold tracking-wider text-white uppercase shadow-[0_0_24px_rgba(244,63,94,0.4)] duration-200 hover:bg-rose-500 hover:shadow-[0_0_32px_rgba(244,63,94,0.6)] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
      >
        <span>{pending ? t("authenticating") : t("authenticate")}</span>
        <Icon name={pending ? "progress_activity" : "lock_open"} className={pending ? "animate-spin text-[18px]" : "text-[18px]"} />
      </Button>
    </form>
  );
}
