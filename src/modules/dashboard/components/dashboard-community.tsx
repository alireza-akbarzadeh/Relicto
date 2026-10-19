"use client";

import * as React from "react";
import { MessageSquare, Trash2, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { DashboardCommunityPost } from "../types";
import { deleteCommunityPostAction } from "../actions/admin-community";

export function DashboardCommunity({ posts: initialPosts }: { posts: DashboardCommunityPost[] }) {
  const [posts, setPosts] = React.useState(initialPosts);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to remove this community post?")) return;
    setDeletingId(postId);
    try {
      const res = await deleteCommunityPostAction(postId);
      if (res.success) {
        toast.success(res.message);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } else {
        toast.error(res.error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="bg-surface-card border-border-subtle">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold text-text-primary flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              Community Forum & Content Moderation
            </CardTitle>
            <CardDescription className="text-xs text-text-muted mt-0.5">
              Review public trading discussions, guild showcases, and remove violating or spam posts
            </CardDescription>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Active Posts: <strong className="text-text-primary">{posts.length}</strong>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
              <tr>
                <th className="pb-3 font-semibold">Post Title & Body Preview</th>
                <th className="pb-3 font-semibold">Author</th>
                <th className="pb-3 font-semibold">Guild / Tag</th>
                <th className="pb-3 font-semibold text-center">Engagement</th>
                <th className="pb-3 font-semibold text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/40">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="py-3">
                    <div className="flex flex-col max-w-md">
                      <span className="font-semibold text-text-primary leading-tight">{post.title}</span>
                      <span className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{post.body}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-cyan-400 font-medium">@{post.authorHandle}</span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container border border-border-subtle">
                      {post.guildName ?? post.tag ?? "General"}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-3 text-text-muted font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <Heart className="size-3 text-rose-400" />
                        {post.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="size-3 text-cyan-400" />
                        {post.commentCount}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      size="xs"
                      variant="ghost"
                      disabled={deletingId === post.id}
                      onClick={() => handleDelete(post.id)}
                      className="text-rose-400 hover:text-rose-300 gap-1 font-mono text-xs"
                    >
                      <Trash2 className="size-3" />
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
