"use client";

import Image from "next/image";
import { useQueryState } from "nuqs";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { hubMobileSearchParams } from "../../lib/mobile-search-params";
import type { MetaHero } from "../../mobile.types";

const CHIP = { amber: "bg-tertiary-container/30 font-bold text-tertiary", crimson: "bg-primary-container/20 text-primary", muted: "bg-surface-container-highest text-text-muted" };
const DOT = { emerald: "bg-emerald-400", cyan: "bg-cyan-400", amber: "bg-tertiary" };
const ROLES = [
  { id: "support", label: "Pos 4/5" },
  { id: "core", label: "Core" },
] as const;

function Portrait({ hero, featured }: { hero: MetaHero; featured: boolean }) {
  const size = featured ? "h-11 w-11" : "h-10 w-10";
  return (
    <div className={cn("relative shrink-0 overflow-hidden rounded-lg bg-surface-container", size)}>
      {hero.image && featured ? (
        <Image src={hero.image} alt={hero.name} width={88} height={88} sizes="44px" className="h-full w-full object-cover" />
      ) : (
        <div className={cn("flex h-full w-full items-center justify-center bg-surface-container-high", hero.iconTone === "crimson" ? "text-primary" : "text-secondary")}>
          <Icon name={hero.icon} className="text-[24px]" />
        </div>
      )}
    </div>
  );
}

function HeroCard({ hero, featured }: { hero: MetaHero; featured: boolean }) {
  return (
    <div className={cn("flex flex-col rounded-xl bg-surface-card", featured ? "gap-3 p-3.5 shadow-md" : "gap-2 p-3 shadow-xs")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Portrait hero={hero} featured={featured} />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-headline-sm text-headline-sm text-text-primary">{hero.name}</p>
              <span className={cn("rounded px-1.5 font-label-badge text-label-badge", CHIP[hero.chipTone])}>{hero.chip}</span>
            </div>
            <p className="font-body-sm text-body-sm text-text-secondary">{hero.note}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("font-data-mono-md text-data-mono-md font-bold", hero.winTone === "emerald" ? "text-emerald-400" : "text-text-primary")}>{hero.winRate}</p>
          <span className="font-label-badge text-label-badge text-text-secondary">{hero.sample}</span>
        </div>
      </div>
      {featured && (
        <div className="flex flex-col gap-2 rounded-lg bg-surface-container-lowest p-2.5">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary uppercase">PRO SIGNATURE BUILDS</span>
            <span className="font-label-badge text-label-badge text-text-muted">{hero.buildsNote}</span>
          </div>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              {hero.builds.map((build) => (
                <span key={build.name} className="flex items-center gap-1 rounded bg-surface-container px-2 py-1 font-label-badge text-label-badge text-text-primary">
                  <span className={cn("h-2 w-2 rounded-full", DOT[build.dot])} /> {build.name}
                </span>
              ))}
            </div>
            <CopyButton
              value={`${hero.name}: ${hero.builds.map((build) => build.name).join(" → ")}`}
              notice={`${hero.name} build copied`}
              aria-label="Copy build"
              className="h-7 w-7 shrink-0 rounded border-0 bg-surface-container-high text-text-primary transition-colors hover:bg-surface-bright"
            >
              <Icon name="content_copy" className="text-[16px]" />
            </CopyButton>
          </div>
        </div>
      )}
    </div>
  );
}

/** Pro meta picks; the role switch (`?role=`) decides which pick is expanded with its builds. */
export function MetaIntel({ heroes }: { heroes: MetaHero[] }) {
  const [role, setRole] = useQueryState("role", hubMobileSearchParams.role.withOptions({ history: "replace", clearOnDefault: true }));
  const featured = heroes.find((hero) => hero.role === role) ?? heroes[0];
  const ordered = [featured, ...heroes.filter((hero) => hero.id !== featured.id)];

  return (
    <div className="flex flex-col gap-3 px-margin">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon name="analytics" className="text-[20px] text-secondary" />
          <h2 className="font-headline-sm text-headline-sm text-text-primary">Pro Meta Intelligence</h2>
        </div>
        <div className="flex gap-1">
          {ROLES.map((option) => (
            <Button
              key={option.id}
              variant={null}
              size={null}
              aria-pressed={role === option.id}
              onClick={() => void setRole(option.id)}
              className={cn(
                "h-auto rounded border-0 px-2 py-0.5 font-label-badge text-label-badge font-semibold",
                role === option.id ? "bg-primary-container text-on-primary" : "bg-surface-container text-text-secondary",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      {ordered.map((hero) => (
        <HeroCard key={hero.id} hero={hero} featured={hero.id === featured.id} />
      ))}
    </div>
  );
}
