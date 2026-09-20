import Image from "next/image";
import { cn } from "@/lib/cn";
import { TONE_TEXT } from "../../lib/tones";
import type { TraderIdentity } from "../../types";
import { HeroActions } from "./hero-actions";
import { IdentityBlock } from "./identity-block";
import { TradeRail } from "./trade-rail";

function Avatar({ identity }: { identity: TraderIdentity }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-1 rounded-2xl bg-linear-to-tr/srgb from-tertiary via-primary-container to-secondary opacity-75 blur-sm transition duration-500 group-hover:opacity-100" />
      <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-surface-card p-1 shadow-2xl md:h-36 md:w-36">
        <Image
          src={identity.avatar}
          alt={identity.avatarAlt}
          width={512}
          height={512}
          className="h-full w-full rounded-xl object-cover"
          fetchPriority="high"
        />
        <span className="absolute right-2 bottom-2 left-2 rounded bg-surface-overlay py-0.5 text-center font-label-badge text-label-badge font-bold tracking-widest text-tertiary-fixed-dim uppercase backdrop-blur-md">
          {identity.tier}
        </span>
      </div>
      <span className="absolute top-1 right-1 h-4 w-4 rounded-full border-2 border-surface-deep bg-status-live shadow-[0_0_10px_var(--color-status-live)]" />
    </div>
  );
}

/** Banner, avatar, identity and the profile action hub. */
export function ProfileHero({ identity }: { identity: TraderIdentity }) {
  return (
    <section className="relative w-full overflow-hidden bg-surface-deep">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 h-80 w-80 rounded-full bg-glow-indigo blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-20 h-72 w-72 rounded-full bg-tertiary/10 blur-3xl" />
      <div className="relative h-72 w-full overflow-hidden md:h-80">
        <Image
          src={identity.banner}
          alt={identity.bannerAlt}
          fill
          sizes="100vw"
          className="object-cover opacity-45 contrast-125 mix-blend-luminosity"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-t/srgb from-surface-deep via-surface-deep/50 to-transparent" />
        <div className="absolute top-4 left-gutter-desktop hidden items-center gap-space-md font-label-badge text-label-badge tracking-widest text-text-muted uppercase opacity-80 sm:flex">
          {identity.telemetry.map((item, index) => (
            <span key={item.label} className="contents">
              {index > 0 && <span>•</span>}
              <span className={cn("flex items-center gap-1.5", item.tone && TONE_TEXT[item.tone])}>
                {item.pulse && <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />}
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 -mt-28 px-gutter-desktop pb-space-lg">
        <div className="flex flex-col items-start justify-between gap-space-lg lg:flex-row lg:items-end">
          <div className="flex flex-col items-start gap-space-lg sm:flex-row sm:items-end">
            <Avatar identity={identity} />
            <IdentityBlock identity={identity} />
          </div>
          <HeroActions />
        </div>
        <TradeRail tradeUrl={identity.tradeUrl} handshake={identity.handshake} />
      </div>
    </section>
  );
}
