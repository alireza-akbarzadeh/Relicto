"use client";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import type { CommunityData } from "../types";
import { communitySearchParams } from "../lib/search-params";
import { ChannelRail } from "./community-rail";
import { CommunityAside } from "./community-aside";
import { authClient } from "@/lib/auth-client";
import { Composer, PostCard } from "./community-post-card";

const CHANNELS = [
  "All Discussions",
  "Trade-Up Brag & Rip",
  "Market Speculation",
  "Esports Banter & Drops",
  "Escrow Trust & Vouches",
  "P2P Direct Trade Proposals",
];

function CommunityTelemetry() {
  return (
    <section className="border-b border-white/6 bg-surface-container-lowest px-gutter-desktop py-space-sm">
      <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-space-sm lg:flex-row lg:items-center">
        <div className="flex items-center gap-space-sm font-label-caps text-label-caps tracking-wider text-text-muted uppercase">
          <Icon name="hub" className="text-[18px] text-primary" />
          Portal / Trader Community / Global Arbitrage &amp; Guild Lounge{" "}
          <span className="flex items-center gap-1 rounded bg-status-live/15 px-2 py-0.5 font-label-badge text-[10px] text-status-live">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-status-live" />
            Live Signal
          </span>
        </div>
        <div className="flex flex-wrap gap-space-md font-label-badge text-label-badge uppercase">
          <span><b className="text-status-upcoming">42,910</b> Traders Active</span>
          <span><b className="text-tertiary">$3,410,200</b> 24h P2P Vol</span>
          <span><b className="text-primary">1,240</b> Verified Vouches</span>
          <span className="text-secondary">0 Escrow Disputes</span>
        </div>
      </div>
    </section>
  );
}

export function CommunityView({ data }: { data: CommunityData }) {
  const [channel, setChannelParam] = useQueryState(
    "channel",
    communitySearchParams.channel.withOptions({ history: "replace", clearOnDefault: true }),
  );
  const setChannel = (value: string) => void setChannelParam(value);
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState(data.posts);
  const { data: session } = authClient.useSession();

  const userHandle = session?.user?.name ? `@${session.user.name}` : "@Trader";
  const userInitials = (session?.user?.name?.slice(0, 2) ?? "TR").toUpperCase();

  const visible = useMemo(
    () =>
      channel === CHANNELS[0]
        ? posts
        : posts.filter((post) =>
            channel.includes("Trade")
              ? post.tag.includes("TRADE")
              : channel.includes("Speculation")
                ? post.role.includes("Quant")
                : channel.includes("Escrow")
                  ? post.role.includes("Escrow")
                  : true,
          ),
    [channel, posts],
  );

  const broadcast = () => {
    if (!draft.trim()) return;
    setPosts((current) => [
      {
        id: `post-${Date.now()}`,
        initials: userInitials,
        handle: userHandle,
        role: "VERIFIED TRADER",
        roleTone: "primary",
        age: "now",
        tag: "BROADCAST",
        tagTone: "primary",
        title: draft.trim(),
        body: "Broadcast from the Relicto trader community feed.",
        likes: 0,
        comments: 0,
      },
      ...current,
    ]);
    setDraft("");
    toast.success("Broadcast published to live channel");
  };

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <CommunityTelemetry />
        <section className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-space-lg px-gutter-desktop py-space-lg xl:grid-cols-12">
          <ChannelRail channels={CHANNELS} active={channel} setActive={setChannel} guilds={data.guilds} />
          <div className="flex flex-col gap-space-md xl:col-span-6">
            <Composer
              draft={draft}
              setDraft={setDraft}
              onBroadcast={broadcast}
              initials={userInitials}
            />
            <div className="flex flex-col gap-space-md">
              {visible.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
          <CommunityAside />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
