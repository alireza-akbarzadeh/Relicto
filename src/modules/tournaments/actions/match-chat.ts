"use server";

import { revalidatePath } from "next/cache";
import { getSession, requireUserId } from "@/modules/relicto/data/get-session";
import { tournamentService } from "@/server/modules/tournaments/tournaments.service";

export type ChatMessageDto = {
  id: string;
  matchId: string;
  userId: string;
  userHandle: string;
  userAvatar: string | null;
  message: string;
  teamTag?: string | null;
  createdAt: Date;
};

export async function sendMatchChatMessage(input: {
  matchId: string;
  message: string;
  teamTag?: string;
}): Promise<ChatMessageDto> {
  const userId = await requireUserId();
  const session = await getSession();
  const handle = session?.user?.handle ?? "Trader";
  const avatar = session?.user?.avatar ?? "/avatars/trader-1.png";

  const row = await tournamentService.postChatMessage(
    input.matchId,
    userId,
    handle,
    avatar,
    input.message,
    input.teamTag,
  );

  revalidatePath("/tournaments");
  return {
    id: row.id,
    matchId: row.matchId,
    userId: row.userId,
    userHandle: row.userHandle,
    userAvatar: row.userAvatar,
    message: row.message,
    teamTag: row.teamTag,
    createdAt: row.createdAt,
  };
}

export async function loadMatchChatMessages(matchId: string): Promise<ChatMessageDto[]> {
  const rows = await tournamentService.getMatchChat(matchId);
  return rows.map((r) => ({
    id: r.id,
    matchId: r.matchId,
    userId: r.userId,
    userHandle: r.userHandle,
    userAvatar: r.userAvatar,
    message: r.message,
    teamTag: r.teamTag,
    createdAt: r.createdAt,
  }));
}
