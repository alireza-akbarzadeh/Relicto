"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { predictMatchInput } from "@/server/modules/tournaments/tournaments.schema";
import { tournamentService } from "@/server/modules/tournaments/tournaments.service";

/** Place or update an esports match winner prediction. */
export async function submitPrediction(input: z.input<typeof predictMatchInput>) {
  const userId = await requireUserId();
  const parsed = predictMatchInput.parse(input);
  const res = await tournamentService.predictMatch(userId, parsed);
  revalidatePath("/tournaments");
  return res;
}

/** Get existing predictions for the current user. */
export async function getUserPredictions() {
  const userId = await requireUserId();
  return await tournamentService.userPredictions(userId);
}
