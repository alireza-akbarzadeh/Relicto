"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { addPostComment, getPostComments } from "../actions/community";
import type { CommunityComment } from "../types";

export function PostCommentsThread({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded: () => void;
}) {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    getPostComments({ postId })
      .then((res) => {
        if (active) {
          setComments(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const handleSend = () => {
    if (!replyText.trim()) return;
    const body = replyText.trim();
    startTransition(async () => {
      try {
        await addPostComment({ postId, body });
        setComments((curr) => [
          ...curr,
          {
            id: `comm-temp-${Date.now()}`,
            postId,
            authorId: "current",
            handle: "@You",
            initials: "YO",
            body,
            age: "just now",
          },
        ]);
        setReplyText("");
        onCommentAdded();
        toast.success("Reply posted");
      } catch {
        toast.error("Failed to post comment");
      }
    });
  };

  return (
    <div className="flex flex-col gap-space-sm border-t border-white/6 pt-space-sm">
      {loading ? (
        <div className="flex items-center gap-2 py-2 text-label-badge text-text-muted">
          <Icon name="progress_activity" className="animate-spin text-[14px]" />
          <span>Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <p className="py-1 text-label-badge text-text-muted">
          No replies yet. Be the first to comment.
        </p>
      ) : (
        <div className="flex max-h-56 flex-col gap-space-xs overflow-y-auto pr-1">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex flex-col rounded bg-surface-container/60 p-2 text-body-sm"
            >
              <div className="flex items-center justify-between text-label-badge">
                <span className="font-bold text-text-primary">{c.handle}</span>
                <span className="text-text-muted">{c.age}</span>
              </div>
              <p className="mt-0.5 text-text-secondary">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-space-xs pt-1">
        <Input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a reply..."
          className="h-8 text-body-sm bg-surface-container text-text-primary placeholder:text-text-muted"
        />
        <Button
          onClick={handleSend}
          disabled={isPending || !replyText.trim()}
          className="h-8 rounded bg-primary-container px-3 text-label-badge font-bold uppercase text-on-primary-container"
        >
          {isPending ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
