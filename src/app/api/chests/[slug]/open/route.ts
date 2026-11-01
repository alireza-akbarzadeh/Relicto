import { NextResponse } from "next/server";
import { getSession, getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";
import { chestSlugSchema, openChestInput } from "@/server/modules/chests/chests.schema";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParams = await params;
    const slugParsed = chestSlugSchema.safeParse(rawParams.slug);
    if (!slugParsed.success) {
      return NextResponse.json({ error: "Invalid chest identifier" }, { status: 400 });
    }
    const slug = slugParsed.data;

    const [userId, session] = await Promise.all([getUserId(), getSession()]);
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to open chests" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = openChestInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid unboxing parameters", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const res = await chestsService.openChest(userId, slug, {
      paymentMethod: parsed.data.paymentMethod,
      splitCoinAmount: parsed.data.splitCoinAmount,
      clientSeed: parsed.data.clientSeed,
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
