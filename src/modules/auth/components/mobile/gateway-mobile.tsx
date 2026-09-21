import { NoticeButton } from "@/components/notice-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { GatewayMobile as GatewayMobileData } from "../../data/gateway-mobile.mock";
import { AuthMobileHeader } from "./auth-mobile-header";
import { CredentialFormMobile } from "./credential-form-mobile";
import { GuardTokenCard } from "./guard-token-card";
import { SteamFastTrack } from "./steam-fast-track";

/** Mobile sign-in (Stitch: "Lootora Mobile — Steam Auth & Security Gateway"). */
export function GatewayMobile({ data }: { data: GatewayMobileData }) {
  return (
    <div className="stitch-heavy-grotesk stitch-medium-mono stitch-lite-geist flex min-h-screen flex-col bg-surface font-body-md text-body-md text-on-surface">
      <AuthMobileHeader section="Steam Auth" />
      <main className="relative flex w-full flex-col bg-surface pt-16">
        {/* pt-space-lg: the export's space-y-space-lg also offsets the first block below the two absolute glows. */}
        <div className="pb-safe relative flex w-full flex-col gap-space-lg overflow-hidden px-space-md pt-space-lg">
          <div className="pointer-events-none absolute -top-12 -left-20 h-56 w-56 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute top-80 -right-24 h-60 w-60 rounded-full bg-secondary-container/15 blur-3xl" />
          <SteamFastTrack data={data} />
          <CredentialFormMobile uid={data.uid} />
          <GuardTokenCard guard={data.guard} />

          <div className="flex flex-col gap-space-sm">
            <div className="text-center font-label-caps text-label-caps tracking-widest text-text-muted uppercase">Alternative Hardware &amp; Credentials</div>
            <div className="grid grid-cols-3 gap-space-sm">
              {data.alternatives.map((option) => (
                <NoticeButton
                  key={option.id}
                  notice={{ title: option.label, description: "Hardware and partner sign-in arrive with the Better Auth rollout." }}
                  className="h-auto flex-col rounded-xl border-0 bg-surface-container p-3 text-text-secondary shadow-xs transition-colors hover:bg-surface-bright hover:text-text-primary"
                >
                  <Icon name={option.icon} className={cn("text-[24px]", option.tone)} />
                  <span className="mt-1 font-label-badge text-label-badge font-semibold uppercase">{option.label}</span>
                </NoticeButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md text-center shadow-inner">
            <div className="flex items-center justify-center gap-2 text-text-primary">
              <Icon name="verified" className="text-[18px] text-primary-container" />
              <span className="font-headline-sm text-headline-sm tracking-tight uppercase">Valve API Direct Partner</span>
            </div>
            <p className="mx-auto max-w-xs font-body-sm text-body-sm text-text-muted">
              256-bit escrow encryption. We never hold or store user Steam credentials, master guards, or recovery keys.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2 font-label-badge text-label-badge text-text-secondary">
              <span>{data.audit[0]}</span>
              <span>•</span>
              <span>{data.audit[1]}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
