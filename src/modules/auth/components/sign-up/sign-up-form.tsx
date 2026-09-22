"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { authClient } from "@/lib/auth-client";
import { SIGN_UP_DEFAULTS } from "../../data/sign-up.mock";
import { passwordStrength } from "../../lib/password-strength";
import { AuthField } from "../ui/auth-field";
import { ArenaPicker, type Arena } from "./arena-picker";
import { ConsentChecks } from "./consent-checks";
import { EntropyMeter } from "./entropy-meter";

const LABEL = "font-label-caps text-xs font-semibold tracking-wider text-text-secondary uppercase";
const INPUT =
  "rounded-lg border-white/10 bg-surface-container-lowest px-3.5 py-2.5 font-body-md text-sm text-text-primary placeholder:text-gray-400 focus-visible:border-primary-container focus-visible:ring-0";

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState(SIGN_UP_DEFAULTS);
  const [pending, setPending] = useState(false);
  const set = <K extends keyof typeof form>(key: K) => (value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const strength = useMemo(() => passwordStrength(form.password), [form.password]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.gamertag.trim()) {
      toast.error("Pick a trader handle first");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (!form.acceptTerms) {
      toast.error("Accept the Terms of Service to continue");
      return;
    }

    setPending(true);
    const { error } = await authClient.signUp.email({
      name: form.gamertag,
      email: form.email,
      password: form.password,
    });
    setPending(false);

    if (error) {
      toast.error("Couldn't create your account", { description: error.message ?? "Try a different email." });
      return;
    }

    toast.success("Trader profile created", { description: "Welcome to Relicto." });
    router.push("/marketplace");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 lg:gap-3">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-3">
        <AuthField
          id="gamertag" label="Trader Gamertag / Handle" labelClassName={LABEL} inputClassName={INPUT}
          value={form.gamertag} onChange={(e) => set("gamertag")(e.target.value)} placeholder="e.g. s1mple_trader"
          icon="tag" iconPosition="right"
          aside={<span className="flex items-center gap-1 font-data-mono-md text-[11px] font-medium text-status-upcoming"><Icon name="check_circle" className="text-[13px]" /> Available</span>}
        />
        <AuthField
          id="email" type="email" label="Corporate / Email" labelClassName={LABEL} inputClassName={INPUT}
          value={form.email} onChange={(e) => set("email")(e.target.value)} placeholder="alex@majorops.gg"
          icon="alternate_email" iconPosition="right"
          aside={<span className="font-data-mono-md text-[10px] text-tertiary">Requires 2FA Confirmation</span>}
        />
        <AuthField
          id="password" label="Escrow Master Password" labelClassName={LABEL} inputClassName={INPUT} revealable
          value={form.password} onChange={(e) => set("password")(e.target.value)} placeholder="Min. 12 characters" autoComplete="new-password"
        />
        <AuthField
          id="confirm-password" type="password" label="Confirm Master Password" labelClassName={LABEL} inputClassName={INPUT}
          value={form.confirm} onChange={(e) => set("confirm")(e.target.value)} placeholder="Re-enter password" autoComplete="new-password"
          icon="lock_reset" iconPosition="right" iconClassName="text-primary"
        />
      </div>
      <EntropyMeter strength={strength} />
      <ArenaPicker value={form.arena} onChange={set("arena") as (v: Arena) => void} />
      <AuthField
        id="referral" label="Trader Referral Code (Optional)" labelClassName={LABEL}
        inputClassName="rounded-lg border-white/10 bg-surface-container-lowest px-3.5 py-2.5 font-data-mono-md text-sm tracking-wider text-text-primary uppercase placeholder:text-gray-400 focus-visible:border-tertiary focus-visible:ring-0"
        value={form.referral} onChange={(e) => set("referral")(e.target.value)} placeholder="e.g. RADIANT-PRO"
        icon="verified" iconPosition="right" iconClassName="text-tertiary"
        aside={<span className="flex items-center gap-1 rounded border border-tertiary/20 bg-tertiary/10 px-2 py-0.5 font-label-badge text-[10px] font-semibold text-tertiary shadow-xs"><Icon name="stars" className="text-[13px]" /> +500 AEGIS BONUS POINTS</span>}
      />
      <ConsentChecks terms={form.acceptTerms} webhooks={form.webhooks} onTerms={set("acceptTerms")} onWebhooks={set("webhooks")} />
      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-auto w-full gap-2 rounded-xl bg-linear-to-r/srgb from-primary-container to-brand-signup-end px-6 py-3 font-headline-sm text-sm font-bold tracking-wider text-white uppercase shadow-[0_0_24px_rgba(255,81,106,0.45)] hover:shadow-[0_0_36px_rgba(255,81,106,0.7)] hover:brightness-110 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
      >
        <span>{pending ? "Creating Account..." : "Create Relicto Trader Account"}</span>
        <Icon name={pending ? "progress_activity" : "arrow_forward"} className={pending ? "animate-spin text-[18px]" : "text-[18px]"} />
      </Button>
    </form>
  );
}
