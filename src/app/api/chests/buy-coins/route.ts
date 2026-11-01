import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";
import { buyCoinsInput } from "@/server/modules/chests/chests.schema";
import { verifyCsrf } from "@/server/modules/auth/csrf.guard";

export async function POST(req: Request) {
  try {
    const csrf = verifyCsrf(req);
    if (!csrf.valid) return csrf.response;

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to buy coins" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = buyCoinsInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid coin purchase parameters", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const res = chestsService.buyCoinPackage(userId, parsed.data.packageId);

    return NextResponse.json({
      success: true,
      newBalance: res.newBalance,
      currency: parsed.data.currency,
    });
  } catch (err) {
    console.error("[api/chests/buy-coins] Error:", err);
    return NextResponse.json({ error: "Failed to purchase coins" }, { status: 500 });
  }
}
