"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { togglePostLike } from "../actions/community";
import type { CommunityPost, CommunityTone } from "../types";
import { PostCommentsThread } from "./community-comments";

export { Composer } from "./community-composer";

const TONE: Record<CommunityTone, string> = {
  primary: "text-primary",
  amber: "text-tertiary",
  cyan: "text-status-upcoming",
  indigo: "text-secondary",
  muted: "text-text-muted",
};

export function PostCard({ post }: { post: CommunityPost }) {
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(post.liked ?? false);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [, startTransition] = useTransition();

  const handleLike = () => {
    const nextLiked = !liked;
    const nextCount = nextLiked ? likes + 1 : Math.max(0, likes - 1);
    setLiked(nextLiked);
    setLikes(nextCount);

    startTransition(async () => {
      try {
        const res = await togglePostLike({ postId: post.id });
        setLiked(res.liked);
        setLikes(res.likeCount);
      } catch {
        // Revert on error
        setLiked(!nextLiked);
        setLikes(likes);
        toast.error("Sign in to like community posts");
      }
    });
  };

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
        <Button
          type="button"
          variant="ghost"
          onClick={handleLike}
          className={cn(
            "h-auto p-0 hover:bg-transparent focus-visible:outline-hidden",
            liked ? "font-bold text-primary" : "text-text-muted hover:text-primary",
          )}
        >
          <Icon name="favorite" className={cn("text-[14px] mr-1", liked ? "text-primary fill-current" : "text-text-muted")} />
          {likes}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="h-auto p-0 text-text-muted hover:bg-transparent hover:text-status-upcoming focus-visible:outline-hidden"
        >
          <Icon name="forum" className="text-[14px] mr-1" />
          {commentsCount}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (typeof window !== "undefined") navigator.clipboard.writeText(window.location.href);
            toast.success("Post link copied to clipboard");
          }}
          className="h-auto p-0 text-text-muted hover:bg-transparent hover:text-text-primary focus-visible:outline-hidden"
        >
          <Icon name="share" className="text-[14px] mr-1" />
          Share
        </Button>
      </div>

      {showComments && (
        <PostCommentsThread
          postId={post.id}
          onCommentAdded={() => setCommentsCount((c) => c + 1)}
        />
      )}
    </article>
  );
}
