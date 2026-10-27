import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to buy coins" }, { status: 401 });
    }

    const { packageId, currency = "usd" } = await req.json();
    const res = chestsService.buyCoinPackage(userId, packageId);

    return NextResponse.json({
      success: true,
      newBalance: res.newBalance,
      currency,
    });
  } catch (err) {
    console.error("[api/chests/buy-coins] Error:", err);
    return NextResponse.json({ error: "Failed to purchase coins" }, { status: 500 });
  }
}
