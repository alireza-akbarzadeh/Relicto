import { z } from "zod";

export const predictMatchInput = z.object({
  matchId: z.string().min(1, "Match ID is required"),
  teamId: z.string().min(1, "Team ID is required"),
  stakeCents: z.number().int().min(0).max(100_000_00).default(0),
});
