import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { count = 1000 } = await req.json();
    const stats = chestsService.simulateRolls(slug, Math.min(10000, Math.max(10, count)));

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("[api/chests/[slug]/simulate] Error:", err);
    return NextResponse.json({ error: "Failed to simulate rolls" }, { status: 500 });
  }
}
