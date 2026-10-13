"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import {
  addCommentInput,
  broadcastPostInput,
  getCommentsInput,
  toggleLikeInput,
} from "@/server/modules/community/community.schema";
import { communityService } from "@/server/modules/community/community.service";

/** Authenticated trader publishes a broadcast post to the community feed. */
export async function broadcastPost(input: z.input<typeof broadcastPostInput>) {
  const userId = await requireUserId();
  const parsed = broadcastPostInput.parse(input);
  const post = await communityService.broadcastPost(userId, parsed);
  revalidatePath("/community");
  return { status: "created", post };
}

/** Authenticated trader toggles like on a community post. */
export async function togglePostLike(input: z.input<typeof toggleLikeInput>) {
  const userId = await requireUserId();
  const { postId } = toggleLikeInput.parse(input);
  const result = await communityService.toggleLike(userId, postId);
  revalidatePath("/community");
  return result;
}

/** Authenticated trader submits a reply comment to a post. */
export async function addPostComment(input: z.input<typeof addCommentInput>) {
  const userId = await requireUserId();
  const { postId, body } = addCommentInput.parse(input);
  const result = await communityService.addComment(userId, postId, body);
  revalidatePath("/community");
  return result;
}

/** Fetch all comments for a community post. */
export async function getPostComments(input: z.input<typeof getCommentsInput>) {
  const { postId } = getCommentsInput.parse(input);
  return await communityService.comments(postId);
}
