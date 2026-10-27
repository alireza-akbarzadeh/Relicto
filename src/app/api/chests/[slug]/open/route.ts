import { NextResponse } from "next/server";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const [userId, session] = await Promise.all([getUserId(), getSession()]);

    if (!userId) {
      return NextResponse.json({ error: "Please sign in to open chests" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentMethod = "coins", splitCoinAmount = 0, clientSeed } = body;

    const res = await chestsService.openChest(userId, slug, {
      paymentMethod,
      splitCoinAmount,
      clientSeed,
      traderHandle: session?.user?.handle,
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result: res.result,
      newCoinBalance: res.newCoinBalance,
    });
  } catch (err) {
    console.error("[api/chests/[slug]/open] Error:", err);
    return NextResponse.json({ error: "Failed to open chest" }, { status: 500 });
  }
}
