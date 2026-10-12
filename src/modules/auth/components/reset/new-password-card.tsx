"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { authClient } from "@/lib/auth-client";
import { passwordStrength } from "../../lib/password-strength";
import { EntropyMeter } from "../sign-up/entropy-meter";
import { AuthField } from "../ui/auth-field";

const CTA =
  "group h-auto w-full gap-2 rounded-xl border border-brand-rose/30 bg-linear-to-r/srgb from-brand-crimson to-brand-crimson-deep px-4 py-3.5 font-display text-xs font-bold tracking-widest text-white uppercase shadow-[0_0_24px_rgba(255,59,92,0.4)] hover:shadow-[0_0_32px_rgba(255,59,92,0.6)] hover:brightness-110 active:scale-[0.99] disabled:opacity-60";

const LABEL = "font-mono text-xs font-semibold tracking-wider text-slate-300 uppercase";
const INPUT =
  "rounded-xl border-white/10 bg-surface-container-lowest pl-10 py-3 text-sm text-white shadow-inner placeholder:text-slate-600 focus-visible:border-primary-container focus-visible:ring-1 focus-visible:ring-primary-container";

/** Card rendered when arriving at /reset-password?token=... with an authorized reset token. */
export function NewPasswordCard({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const strength = useMemo(() => passwordStrength(password), [password]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setPending(true);
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setPending(false);

    if (error) {
      toast.error("Password reset failed", {
        description: error.message ?? "The reset token may have expired or already been used.",
      });
      return;
    }

    toast.success("Password updated successfully", {
      description: "Sign in with your new password to resume trading.",
    });
    router.push("/sign-in");
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-white/10 bg-surface-card/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-6">
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-emerald-400">
        <Icon name="verified_user" className="text-[18px]" />
        <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
          Recovery Token Verified • Authorized Session
        </span>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <AuthField
          id="new-password"
          name="new-password"
          label="New Master Password"
          icon="key"
          revealable
          placeholder="Min. 12 characters"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelClassName={LABEL}
          inputClassName={`${INPUT} pr-12`}
        />

        <EntropyMeter strength={strength} />

        <AuthField
          id="confirm-password"
          name="confirm-password"
          label="Confirm Master Password"
          icon="lock_reset"
          revealable
          placeholder="Re-enter new password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          labelClassName={LABEL}
          inputClassName={`${INPUT} pr-12`}
        />

        <Button type="submit" disabled={pending} className={CTA}>
          <span>{pending ? "Updating Master Password..." : "Update Master Password"}</span>
          <Icon
            name={pending ? "progress_activity" : "lock_reset"}
            className={pending ? "animate-spin text-[18px]" : "text-[18px] transition-transform group-hover:rotate-45"}
          />
        </Button>
      </form>
    </div>
  );
}
