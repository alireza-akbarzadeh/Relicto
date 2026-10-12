"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/cn";
import type { CommunityPost, CommunityTone } from "../types";

const TONE: Record<CommunityTone, string> = {
  primary: "text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
  muted: "text-text-muted",
};

export function Composer({
  draft,
  setDraft,
  onBroadcast,
  initials = "TR",
}: {
  draft: string;
  setDraft: (value: string) => void;
  onBroadcast: () => void;
  initials?: string;
}) {
  return (
    <section className="rounded-xl bg-surface-container-low p-space-md shadow-lg">
      <div className="flex gap-space-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container font-headline-sm text-headline-sm text-on-primary-container">
          {initials}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-space-sm">
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Share a trade-up clip, market arbitrage theory, or broadcast a direct P2P offer..."
            rows={2}
            className="resize-none border-0 bg-surface-container text-text-primary placeholder:text-text-muted focus-visible:bg-surface-container-high"
          />
          <div className="flex flex-wrap items-center justify-between gap-space-xs">
            <div className="flex gap-space-xs">
              <Link
                href="/sell"
                className="flex h-auto cursor-pointer items-center gap-1 rounded bg-surface-container px-2 py-1 font-label-badge text-label-badge text-tertiary uppercase transition-colors hover:bg-surface-container-high"
              >
                <Icon name="monetization_on" className="text-[16px]" />
                <span>Attach Skin</span>
              </Link>
              <Link
                href="/tracker"
                className="flex h-auto cursor-pointer items-center gap-1 rounded bg-surface-container px-2 py-1 font-label-badge text-label-badge text-status-upcoming uppercase transition-colors hover:bg-surface-container-high"
              >
                <Icon name="query_stats" className="text-[16px]" />
                <span>Chart Signal</span>
              </Link>
            </div>
            <Button
              onClick={onBroadcast}
              className="h-auto rounded bg-primary-container px-space-md py-1.5 font-headline-sm text-headline-sm text-on-primary-container uppercase"
            >
              Broadcast <Icon name="send" className="text-[16px]" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post }: { post: CommunityPost }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  return (
    <article className="relative flex flex-col gap-space-md overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-surface-bright font-headline-sm text-headline-sm text-tertiary">
            {post.initials}
            <span className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full bg-status-live" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-text-primary">{post.handle}</span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 font-label-badge text-label-badge uppercase",
                  `bg-${post.roleTone === "amber" ? "tertiary" : post.roleTone === "cyan" ? "status-upcoming" : "primary"}/15`,
                  TONE[post.roleTone],
                )}
              >
                {post.role}
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-text-muted">{post.age}</span>
          </div>
        </div>
        <span
          className={cn(
            "rounded px-2 py-1 font-label-badge text-label-badge uppercase",
            post.tagTone === "primary" ? "bg-primary/10" : "bg-tertiary/10",
            TONE[post.tagTone],
          )}
        >
          {post.tag}
        </span>
      </div>
      <div>
        <h3 className="font-headline-md text-headline-md text-text-primary">{post.title}</h3>
        <p className="mt-1 text-text-secondary">{post.body}</p>
      </div>
      {post.image && (
        <div className="grid grid-cols-1 gap-space-md rounded-lg bg-surface-container p-space-md md:grid-cols-2">
          <div className="relative h-44 overflow-hidden rounded bg-surface-container-lowest">
            <Image src={post.image} alt={post.title} fill sizes="(min-width: 768px) 240px, 100vw" className="object-contain" />
          </div>
          <div className="flex flex-col justify-center gap-space-sm">
            <span className="font-label-caps text-label-caps text-text-muted uppercase">Outcome Analytics</span>
            <span className="font-headline-sm text-headline-sm text-text-primary">M4A1-S | Printstream (Factory New)</span>
            <div className="rounded bg-surface-container-lowest p-space-md">
              <span className="font-label-badge text-label-badge text-text-muted uppercase">Net Verified Yield</span>
              <b className="block font-data-mono-lg text-data-mono-lg text-status-upcoming">{post.metric?.value}</b>
              <span className="font-data-mono-md text-[11px] text-text-muted">{post.metric?.delta}</span>
            </div>
          </div>
        </div>
      )}
      {post.metric && !post.image && (
        <div className="flex items-center justify-between rounded bg-surface-container p-space-md">
          <div>
            <span className="font-label-badge text-label-badge text-text-muted uppercase">{post.metric.label}</span>
            <b className="block font-data-mono-lg text-2xl text-tertiary">{post.metric.value}</b>
          </div>
          <span className="font-data-mono-md text-status-upcoming">{post.metric.delta}</span>
        </div>
      )}
      <div className="flex items-center gap-space-md border-t border-white/6 pt-2 font-data-mono-md text-[11px] text-text-muted">
        <button
          type="button"
          onClick={() => {
            setLiked(!liked);
            setLikes(liked ? likes - 1 : likes + 1);
          }}
          className={cn(
            "cursor-pointer border-0 bg-transparent p-0 transition-colors focus-visible:outline-hidden",
            liked ? "font-bold text-primary" : "text-text-muted hover:text-primary",
          )}
        >
          ♡ {likes}
        </button>
        <button
          type="button"
          onClick={() => toast.info("Comments thread", { description: "Community replies load in real-time." })}
          className="cursor-pointer border-0 bg-transparent p-0 text-text-muted hover:text-status-upcoming focus-visible:outline-hidden"
        >
          ▢ {post.comments}
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
            toast.success("Post link copied to clipboard");
          }}
          className="cursor-pointer border-0 bg-transparent p-0 text-text-muted hover:text-text-primary focus-visible:outline-hidden"
        >
          Share
        </button>
      </div>
    </article>
  );
}
