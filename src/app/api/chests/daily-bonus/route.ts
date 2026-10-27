import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";

export async function POST() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to claim daily bonus" }, { status: 401 });
    }

    const bonusState = chestsService.claimDailyBonus(userId);
    const newBalance = chestsService.getUserCoins(userId);

    return NextResponse.json({
      success: true,
      bonusState,
      newBalance,
    });
  } catch (err) {
    console.error("[api/chests/daily-bonus] Error:", err);
    return NextResponse.json({ error: "Failed to claim daily bonus" }, { status: 500 });
  }
}
