import { z } from "zod";

export const broadcastPostInput = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(180, "Title is too long"),
  body: z.string().trim().max(2000, "Body cannot exceed 2000 characters").optional(),
  tag: z.string().trim().max(32).optional(),
  tagTone: z.enum(["primary", "amber", "cyan", "indigo", "muted"]).optional(),
  guildId: z.string().optional(),
});

export const toggleLikeInput = z.object({
  postId: z.string().min(1, "Post ID is required"),
});

export const addCommentInput = z.object({
  postId: z.string().min(1, "Post ID is required"),
  body: z.string().trim().min(1, "Comment cannot be empty").max(1000, "Comment cannot exceed 1000 characters"),
});

export const getCommentsInput = z.object({
  postId: z.string().min(1, "Post ID is required"),
});
