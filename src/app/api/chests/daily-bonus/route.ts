import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";
import { verifyCsrf } from "@/server/modules/auth/csrf.guard";
import { applyRateLimit, economyRateLimiter } from "@/server/modules/security/rate-limiter";

export async function POST(req: Request) {
  try {
    const csrf = verifyCsrf(req);
    if (!csrf.valid) return csrf.response;

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to claim daily bonus" }, { status: 401 });
    }

    const rateLimit = applyRateLimit(req, economyRateLimiter, userId);
    if (!rateLimit.allowed) return rateLimit.response;

    const claimResult = chestsService.claimDailyBonus(userId);
    if (!claimResult.success) {
      return NextResponse.json(
        { error: claimResult.error, bonusState: claimResult.bonusState },
        { status: 400 }
      );
    }

    const newBalance = chestsService.getUserCoins(userId);

    return NextResponse.json({
      success: true,
      bonusState: claimResult.bonusState,
      newBalance,
    });
  } catch (err) {
    console.error("[api/chests/daily-bonus] Error:", err);
    return NextResponse.json({ error: "Failed to claim daily bonus" }, { status: 500 });
  }
}
