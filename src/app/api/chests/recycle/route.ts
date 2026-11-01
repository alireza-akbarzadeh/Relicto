import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";
import { recycleChestItemInput } from "@/server/modules/chests/chests.schema";
import { verifyCsrf } from "@/server/modules/auth/csrf.guard";
import { applyRateLimit, economyRateLimiter } from "@/server/modules/security/rate-limiter";

export async function POST(req: Request) {
  try {
    const csrf = verifyCsrf(req);
    if (!csrf.valid) return csrf.response;

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = applyRateLimit(req, economyRateLimiter, userId);
    if (!rateLimit.allowed) return rateLimit.response;

    const body = await req.json().catch(() => null);
    const parsed = recycleChestItemInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid recycle payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const res = chestsService.recycleWonItem(userId, parsed.data.unboxId);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      newBalance: res.newBalance,
      creditedCoins: res.creditedCoins,
    });
  } catch (err) {
    console.error("[api/chests/recycle] Error:", err);
    return NextResponse.json({ error: "Failed to recycle item" }, { status: 500 });
  }
}
