"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const ROW = "flex items-center justify-between rounded-lg p-space-sm text-text-primary transition-colors hover:bg-surface-container-high";

/** Settings, OLED night mode, persona switch and token revoke. */
export function AccountControls({ savedAccounts }: { savedAccounts: number }) {
  const router = useRouter();
  const [oled, setOled] = useState(true);

  const signOut = () => {
    toast.success("Steam token revoked", { description: "This device was signed out of Relicto." });
    router.push("/sign-in");
  };

  return (
    <div className="mb-2 flex flex-col gap-1 rounded-xl bg-surface-card p-space-sm shadow-md">
      <Link href="/verify" className={ROW}>
        <span className="flex items-center gap-2.5">
          <Icon name="settings" className="text-[19px] text-text-muted" />
          <span className="font-headline-sm text-[14px]">General Settings</span>
        </span>
        <Icon name="chevron_right" className="text-[18px] text-text-muted" />
      </Link>

      <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-space-sm">
        <div className="flex items-center gap-2.5">
          <Icon name="dark_mode" className="text-[19px] text-secondary" />
          <div className="flex flex-col">
            <span className="font-headline-sm text-[14px] text-text-primary">Apex Aegis Obsidian</span>
            <span className="font-body-sm text-[11px] text-text-muted">OLED Zero-Bleed Night Mode</span>
          </div>
        </div>
        <Button
          variant={null}
          size={null}
          role="switch"
          aria-checked={oled}
          aria-label="OLED night mode"
          onClick={() => setOled((on) => !on)}
          className={cn(
            "h-5 w-10 rounded-full border-0 p-0.5 shadow-inner transition-colors",
            oled ? "justify-end bg-secondary-container" : "justify-start bg-surface-container-highest",
          )}
        >
          <span className={cn("h-4 w-4 rounded-full shadow-md transition-colors", oled ? "bg-secondary" : "bg-text-muted")} />
        </Button>
      </div>

      <Button
        variant={null}
        size={null}
        onClick={() => toast("Switch persona", { description: `${savedAccounts} saved Steam accounts on this device.` })}
        className={cn(ROW, "h-auto w-full border-0 text-body-md font-normal")}
      >
        <span className="flex items-center gap-2.5">
          <Icon name="switch_account" className="text-[19px] text-text-muted" />
          <span className="font-headline-sm text-[14px]">Switch Account / Persona</span>
        </span>
        <span className="font-data-mono-md text-[11px] text-text-muted">{savedAccounts} SAVED</span>
      </Button>

      <Button
        variant={null}
        size={null}
        onClick={signOut}
        className="mt-1 h-auto w-full justify-between rounded-lg border-0 p-space-sm text-body-md font-normal text-error transition-colors hover:bg-error-container/20"
      >
        <span className="flex items-center gap-2.5">
          <Icon name="logout" className="text-[19px] text-error" />
          <span className="font-headline-sm text-[14px] font-bold">Disconnect &amp; Revoke Token</span>
        </span>
        <span className="font-label-badge text-label-badge tracking-wider text-error uppercase opacity-70">TERMINATE</span>
      </Button>
    </div>
  );
}
