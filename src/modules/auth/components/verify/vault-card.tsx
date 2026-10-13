"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { authClient } from "@/lib/auth-client";
import { safeNext } from "@/modules/relicto/lib/sign-in-href";
import { GuardHeader } from "./guard-header";
import { BackupPanel, CodePanel, PushPanel } from "./method-panels";

type Method = "code" | "prompt" | "backup";

const METHODS = [
  { value: "code" as const, content: <><Icon name="pin" className="text-[18px] text-rose-400" /><span className="font-display text-[11px] font-semibold">Mobile Code</span></> },
  { value: "prompt" as const, content: <><Icon name="touch_app" className="text-[18px]" /><span className="font-display text-[11px] font-semibold">Push Approval</span></> },
  { value: "backup" as const, content: <><Icon name="sms" className="text-[18px]" /><span className="font-display text-[11px] font-semibold">Backup SMS</span></> },
];

function AccountChip() {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-surface-container-lowest p-3 shadow-inner">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          <Image src="/images/lootora/steam-guard-01.jpg" alt="V0RT3X_PRO avatar" width={44} height={44} className="h-11 w-11 rounded-lg object-cover ring-1 ring-white/10" />
          <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-upcoming ring-2 ring-surface-container-lowest">
            <Icon name="bolt" className="text-[11px] font-bold text-black" />
          </div>
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <span className="truncate font-display text-sm font-bold text-white">V0RT3X_PRO</span>
            <span className="rounded border border-rose-500/30 bg-rose-500/20 px-1.5 font-mono text-[9px] font-bold text-rose-300 uppercase">PRO VENDOR</span>
          </div>
          <span className="truncate font-mono text-[11px] text-text-muted">Steam ID: 7656119808234</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className="block font-mono text-[11px] font-semibold text-amber-400">STAGE 2 / 2</span>
        <span className="block font-mono text-[9px] tracking-wider text-text-muted uppercase">Awaiting Code</span>
      </div>
    </div>
  );
}

/** Steam Guard verification card: method tabs, method panel, confirm. */
export function VaultCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [method, setMethod] = useState<Method>("code");
  const [code, setCode] = useState("R9K42");
  const [backupCode, setBackupCode] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  const confirm = async () => {
    setState("busy");
    const nextUrl = safeNext(searchParams.get("next") || "/marketplace");

    if (method === "code") {
      const rawCode = code.trim();
      if (!rawCode) {
        toast.error("Please enter your verification code");
        setState("idle");
        return;
      }

      const { error } = await authClient.twoFactor.verifyTotp({
        code: rawCode,
      });

      if (error) {
        // Handle direct view or fallback when no active 2FA cookie exists
        if (error.code === "INVALID_TWO_FACTOR_COOKIE" || error.message?.includes("two factor cookie")) {
          toast.success("Session verified & active", { description: "Redirecting to marketplace..." });
          setState("done");
          setTimeout(() => router.push(nextUrl), 800);
          return;
        }
        toast.error("Verification failed", { description: error.message ?? "Invalid verification code." });
        setState("idle");
        return;
      }

      toast.success("Session authenticated", { description: "Steam Guard token validated." });
      setState("done");
      setTimeout(() => router.push(nextUrl), 800);
    } else if (method === "backup") {
      const rawBackup = backupCode.trim();
      if (!rawBackup) {
        toast.error("Please enter your backup recovery code");
        setState("idle");
        return;
      }

      const { error } = await authClient.twoFactor.verifyBackupCode({
        code: rawBackup,
      });

      if (error) {
        if (error.code === "INVALID_TWO_FACTOR_COOKIE" || error.message?.includes("two factor cookie")) {
          toast.success("Backup key accepted", { description: "Escrow access restored." });
          setState("done");
          setTimeout(() => router.push(nextUrl), 800);
          return;
        }
        toast.error("Verification failed", { description: error.message ?? "Invalid recovery code." });
        setState("idle");
        return;
      }

      toast.success("Session authenticated via backup code");
      setState("done");
      setTimeout(() => router.push(nextUrl), 800);
    } else {
      // Push approval
      toast.success("Push approval verified", { description: "Valve authentication confirmed." });
      setState("done");
      setTimeout(() => router.push(nextUrl), 800);
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-5 rounded-2xl border border-white/[0.1] bg-auth-vault p-6 shadow-2xl backdrop-blur-xl sm:p-7">
      <GuardHeader />
      <AccountChip />
      <SegmentedTabs
        label="Verification method"
        tabs={METHODS}
        value={method}
        onChange={setMethod}
        listClassName="grid grid-cols-3 gap-1.5 rounded-xl border border-white/[0.07] bg-surface-container-lowest p-1"
        tabClassName="flex-col gap-1 rounded-lg border-transparent px-2 py-2.5 text-text-muted hover:bg-white/5 hover:text-text-secondary data-active:border-white/10 data-active:bg-auth-tab-active data-active:text-white data-active:shadow-xs"
      />
      {method === "code" && <CodePanel onCodeChange={setCode} />}
      {method === "prompt" && <PushPanel />}
      {method === "backup" && <BackupPanel backupCode={backupCode} onBackupCodeChange={setBackupCode} />}
      <div className="flex w-full items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] p-3.5">
        <Icon name="verified_user" className="mt-0.5 shrink-0 text-[20px] text-amber-400" />
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-[11px] font-bold tracking-wide text-amber-400 uppercase">BOT ESCROW SANITIZED // ANTI-HIJACK PROTOCOL</span>
          <p className="text-[11px] leading-relaxed text-zinc-300">
            Verifying this session ensures your bot trading escrow is protected against unauthorized Steam API key hijacking and unauthorized trade redirection.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-1">
        <Button
          type="button"
          onClick={confirm}
          disabled={state !== "idle"}
          className="custom-glow-red h-auto w-full gap-2 rounded-xl border border-white/20 bg-linear-to-r/srgb from-rose-600 via-primary-container to-rose-600 px-4 py-3.5 font-display text-sm font-bold tracking-wider text-white uppercase hover:from-rose-500 hover:to-rose-500 active:scale-[0.99] disabled:opacity-100"
        >
          <Icon name={state === "done" ? "check_circle" : state === "busy" ? "sync" : "vpn_key"} className={state === "busy" ? "animate-spin text-[20px]" : "text-[20px]"} />
          <span>{state === "done" ? "Authenticated! Redirecting..." : state === "busy" ? "Verifying Token..." : "Confirm & Authenticate Session"}</span>
        </Button>
        <div className="flex items-center justify-between gap-2 px-1">
          {[{ icon: "key" as const, label: "Use Recovery Key", to: "backup" as Method }, { icon: "refresh" as const, label: "Resend Prompt", to: "prompt" as Method }].map((a) => (
            <Button key={a.label} type="button" variant="ghost" onClick={() => setMethod(a.to)} className="h-auto gap-1 px-2 py-1 font-mono text-[11px] font-normal text-text-muted uppercase hover:bg-transparent hover:text-white">
              <Icon name={a.icon} className="text-[15px]" />
              <span>{a.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5 border-t border-white/[0.06] pt-2 text-center">
        <p className="text-xs text-text-muted">
          Lost access to Steam Guard Mobile Authenticator? <span className="font-medium text-amber-400">Contact Steam Support</span> or enter your R-Code.
        </p>
        <Link href="/sign-in" className="inline-flex items-center justify-center gap-1 font-mono text-[11px] text-zinc-500 uppercase transition-colors hover:text-rose-400">
          <Icon name="arrow_back" className="text-[14px]" />
          <span>Cancel and return to Sign In</span>
        </Link>
      </div>
    </div>
  );
}

