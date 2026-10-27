import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { coinsValue } = await req.json();
    if (typeof coinsValue !== "number" || coinsValue <= 0) {
      return NextResponse.json({ error: "Invalid coin amount" }, { status: 400 });
    }

    const newBalance = chestsService.recycleWonItem(userId, coinsValue);
    return NextResponse.json({ success: true, newBalance });
  } catch (err) {
    console.error("[api/chests/recycle] Error:", err);
    return NextResponse.json({ error: "Failed to recycle item" }, { status: 500 });
  }
}
