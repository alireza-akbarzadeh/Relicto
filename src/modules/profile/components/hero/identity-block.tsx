import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { TONE_BAR, TONE_TEXT } from "../../lib/tones";
import type { TraderIdentity } from "../../types";

const CHIP = "flex items-center gap-1.5 rounded bg-surface-container px-space-sm py-1 font-label-badge text-label-badge text-text-primary";

/** Handle, Steam identifiers and the rank / trust chip row. */
export function IdentityBlock({ identity }: { identity: TraderIdentity }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-space-xs">
        <span className="font-headline-xl text-headline-xl font-bold tracking-tight text-text-primary">{identity.handle}</span>
        <span className="font-body-lg text-body-lg font-medium text-text-secondary">{identity.realName}</span>
        <span className="rounded bg-primary-container px-2 py-0.5 font-label-caps text-label-caps text-on-primary-container uppercase">
          {identity.role}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-space-sm font-body-sm text-body-sm text-text-secondary">
        <span className="font-mono text-secondary">{identity.alias}</span>
        <span className="text-text-muted">•</span>
        <CopyButton
          value={identity.steamId}
          notice={`Steam ID copied: ${identity.steamId}`}
          className="group h-auto gap-1 rounded-none border-0 p-0 text-[length:inherit] leading-[inherit] font-normal text-text-secondary transition-colors hover:text-text-primary"
        >
          <Icon name="content_copy" className="text-[15px] text-text-muted group-hover:text-primary" />
          <span className="font-data-mono-md text-data-mono-md">{identity.steamId}</span>
        </CopyButton>
        <span className="text-text-muted">•</span>
        <span className="flex items-center gap-1 font-label-badge text-label-badge text-tertiary-fixed-dim">
          <Icon name="verified_user" className="text-[16px] text-tertiary-fixed-dim" />
          {identity.openId}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-space-xs pt-1">
        {identity.ranks.map((rank) => (
          <div key={rank.label} className={CHIP}>
            {rank.dot && <span className={cn("h-2 w-2 rounded-full", TONE_BAR[rank.tone])} />}
            {rank.icon && <Icon name={rank.icon} className={cn("text-[14px]", TONE_TEXT[rank.tone])} />}
            <span className="text-text-muted">{rank.label}</span>
            <span className={cn("font-bold", TONE_TEXT[rank.tone])}>{rank.value}</span>
          </div>
        ))}
        <div className={cn(CHIP, "bg-surface-container-high text-status-live")}>
          <Icon name="local_fire_department" className="text-[14px]" />
          <span className="font-bold text-text-primary">{identity.trust.score}</span>
          <span className="text-text-muted">{identity.trust.trades}</span>
        </div>
      </div>
    </div>
  );
}
