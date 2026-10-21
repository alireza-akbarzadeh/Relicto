"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { DividerLabel } from "../ui/divider-label";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { AltProviders } from "./alt-providers";
import { SignInForm } from "./sign-in-form";
import { SteamGatewayButton } from "./steam-gateway-button";

type Mode = "signin" | "register" | "fast";

/** The obsidian sign-in card: mode tabs, Steam gateway, credentials, alt providers. */
export function SignInCard() {
  const [mode, setMode] = useState<Mode>("signin");
  const router = useRouter();
  const t = useTranslations("auth");

  const tabs = [
    { value: "signin" as const, content: <><Icon name="login" className="text-[17px] text-primary-container" /><span>{t("tabSignIn")}</span></> },
    { value: "register" as const, content: <><Icon name="person_add" className="text-[17px]" /><span>{t("tabRegister")}</span></> },
    { value: "fast" as const, content: <><Icon name="bolt" className="text-[17px] text-tertiary" /><span>{t("tabFast")}</span></> },
  ];

  const change = (next: Mode) => {
    setMode(next);
    if (next === "register") router.push("/sign-up");
  };

  return (
    <div className="relative flex w-full flex-col gap-6 rounded-2xl border border-white/10 bg-surface-card/90 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-8">
      <SegmentedTabs
        label="Sign-in mode"
        tabs={tabs}
        value={mode}
        onChange={change}
        listClassName="grid grid-cols-3 gap-1 rounded-xl border border-white/5 bg-surface-container-lowest p-1"
        tabClassName="gap-1.5 rounded-lg py-2.5 font-display text-xs font-semibold text-text-secondary duration-200 hover:bg-white/5 hover:text-white data-active:border-white/10 data-active:bg-surface-container data-active:text-white data-active:shadow-xs data-active:hover:bg-surface-container"
      />
      <SteamGatewayButton />
      <DividerLabel className="my-1" labelClassName="rounded-full">
        {t("orCredentials")}
      </DividerLabel>
      <SignInForm />
      <AltProviders />
    </div>
  );
}
