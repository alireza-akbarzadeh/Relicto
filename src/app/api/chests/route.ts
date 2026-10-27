import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";

export async function GET() {
  try {
    const [chests, conversion, liveDrops] = await Promise.all([
      chestsService.listChests(false),
      chestsService.getCurrencyConversion(),
      chestsService.getLiveDrops(12),
    ]);

    return NextResponse.json({
      chests,
      conversion,
      liveDrops,
    });
  } catch (err) {
    console.error("[api/chests] Error:", err);
    return NextResponse.json({ error: "Failed to load chests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    chestsService.adminCreateChest(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/chests] Admin create error:", err);
    return NextResponse.json({ error: "Failed to create chest" }, { status: 500 });
  }
}
