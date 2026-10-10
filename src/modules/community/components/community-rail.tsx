"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { CommunityData, CommunityTone } from "../types";

const TONE: Record<CommunityTone, string> = {
  primary: "text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
  muted: "text-text-muted",
};

export function ChannelRail({
  channels,
  active,
  setActive,
  guilds,
}: {
  channels: string[];
  active: string;
  setActive: (value: string) => void;
  guilds: CommunityData["guilds"];
}) {
  return (
    <aside className="flex flex-col gap-space-md xl:col-span-3">
      <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">Tactical Dispatch</span>
          <span className="font-label-badge text-label-badge text-primary uppercase">6 Channels</span>
        </div>
        <nav className="flex flex-col gap-1">
          {channels.map((item, index) => (
            <Button
              key={item}
              variant={null}
              size={null}
              onClick={() => setActive(item)}
              className={cn(
                "h-auto w-full justify-between rounded px-space-sm py-space-xs text-left font-headline-sm text-headline-sm",
                active === item ? "bg-surface-container text-text-primary" : "text-text-secondary hover:bg-surface-container hover:text-text-primary",
              )}
            >
              <span className="flex items-center gap-space-sm">
                <span className={cn("text-lg", index === 0 ? "text-primary" : index === 1 ? "text-tertiary" : "text-status-upcoming")}>
                  {index === 0 ? "◈" : index === 1 ? "🚀" : index === 2 ? "◒" : index === 3 ? "♛" : index === 4 ? "◉" : "◆"}
                </span>
                {item}
              </span>
              <span className="font-data-mono-md text-[11px] text-text-muted">{index === 0 ? "820" : index === 1 ? "+140" : "95"}</span>
            </Button>
          ))}
        </nav>
      </section>
      <section className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps tracking-wider text-text-muted uppercase">Apex Guilds</span>
          <Link href="/community" className="font-label-badge text-label-badge text-primary uppercase hover:underline">
            Explore All
          </Link>
        </div>
        {guilds.map((guild) => (
          <div key={guild.name} className="flex items-center justify-between rounded bg-surface-container p-space-sm hover:bg-surface-container-high">
            <div className="flex items-center gap-space-sm">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded bg-surface-container-highest text-xl", TONE[guild.tone])}>
                {guild.symbol}
              </div>
              <div>
                <span className="block font-headline-sm text-headline-sm text-text-primary">{guild.name}</span>
                <span className="font-label-badge text-label-badge text-text-muted">{guild.detail}</span>
              </div>
            </div>
            <Icon name="chevron_right" className="text-[18px] text-text-muted" />
          </div>
        ))}
        <button
          type="button"
          onClick={() => toast.info("Guild registration", { description: "Guild creation requires Prime Tier 5 verification." })}
          className="flex h-auto w-full cursor-pointer items-center justify-center gap-1 rounded bg-surface-container-highest py-space-xs font-label-caps text-label-caps text-text-primary uppercase transition-colors hover:bg-surface-bright focus-visible:outline-hidden"
        >
          <Icon name="add_circle" className="text-[16px]" />
          <span>Register Guild</span>
        </button>
      </section>
      <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
        <div className="flex justify-between">
          <span className="font-label-caps text-label-caps text-text-muted uppercase">Valve Steam Sentinel</span>
          <span className="font-label-badge text-label-badge text-status-upcoming">Operational</span>
        </div>
        <p className="mt-2 text-[12px] text-text-secondary">CS2 Inventory API latency is 38ms. Trade offers are executing smoothly without queue backpressure.</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded bg-surface-container">
          <div className="h-full w-[94%] bg-status-upcoming" />
        </div>
      </section>
    </aside>
  );
}
