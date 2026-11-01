import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";
import { chestSlugSchema, simulateChestInput } from "@/server/modules/chests/chests.schema";

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

    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = simulateChestInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid simulation parameters", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const stats = chestsService.simulateRolls(slug, parsed.data.count);

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error("[api/chests/[slug]/simulate] Error:", err);
    return NextResponse.json({ error: "Failed to simulate rolls" }, { status: 500 });
  }
}
