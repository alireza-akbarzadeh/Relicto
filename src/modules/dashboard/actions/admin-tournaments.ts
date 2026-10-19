"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, tournaments } from "@/lib/db/schema";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { auditService } from "@/server/modules/audit/audit.service";

export async function createTournamentAction(input: {
  name: string;
  slug: string;
  gameId: string;
  prizePoolUsd: number;
  format?: string;
  status?: "upcoming" | "live" | "completed";
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const id = `tourn-${cleanSlug}`;

    await db.insert(tournaments).values({
      id,
      slug: cleanSlug,
      name: input.name.trim(),
      gameId: input.gameId,
      prizePoolCents: Math.round(input.prizePoolUsd * 100),
      format: input.format?.trim() || "5v5 DOUBLE ELIMINATION",
      status: input.status ?? "upcoming",
      capacity: 16,
      entrantCount: 8,
    });

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "tournament_create",
      targetType: "tournament",
      targetId: id,
      details: `Created tournament "${input.name}" with $${input.prizePoolUsd} prize pool`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/tournaments");

    return { success: true, message: `Tournament "${input.name}" created.` };
  } catch (error) {
    console.error("Failed to create tournament:", error);
    return { success: false, error: "Failed to create tournament." };
  }
}

export async function updateTournamentStatusAction(
  tournamentId: string,
  newStatus: "upcoming" | "live" | "completed"
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db.update(tournaments).set({ status: newStatus, updatedAt: new Date() }).where(eq(tournaments.id, tournamentId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "tournament_status_update",
      targetType: "tournament",
      targetId: tournamentId,
      details: `Status updated to ${newStatus}`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/tournaments");

    return { success: true, message: `Tournament status set to ${newStatus}.` };
  } catch (error) {
    console.error("Failed to update tournament status:", error);
    return { success: false, error: "Failed to update tournament status." };
  }
}

export async function updateMatchScoreAction(input: {
  matchId: string;
  scoreA: number;
  scoreB: number;
  status: "scheduled" | "live" | "completed";
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const [session, authedUserId] = await Promise.all([getSession(), getUserId()]);
    if (session?.user?.role?.toLowerCase() !== "admin") {
      return { success: false, error: "Unauthorized: Administrator privileges required." };
    }

    await db
      .update(matches)
      .set({
        scoreA: input.scoreA,
        scoreB: input.scoreB,
        status: input.status,
        updatedAt: new Date(),
      })
      .where(eq(matches.id, input.matchId));

    void auditService.record({
      adminId: authedUserId ?? "admin_root",
      adminName: session.user.handle,
      action: "match_score_update",
      targetType: "match",
      targetId: input.matchId,
      details: `Updated match score: ${input.scoreA} - ${input.scoreB} (${input.status})`,
      severity: "info",
    });

    revalidatePath("/dashboard");
    revalidatePath("/tournaments");

    return { success: true, message: `Match score updated: ${input.scoreA} - ${input.scoreB}.` };
  } catch (error) {
    console.error("Failed to update match score:", error);
    return { success: false, error: "Failed to update match score." };
  }
}
