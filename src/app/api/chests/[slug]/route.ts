import { NextResponse } from "next/server";
import { getUserId } from "@/modules/relicto/data/get-session";
import { chestsService } from "@/server/modules/chests/chests.service";
import { requireAdminRole } from "@/server/modules/auth/auth.guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const userId = await getUserId();
    const data = await chestsService.getChestWithUserOdds(slug, userId);

    if (!data) {
      return NextResponse.json({ error: "Chest not found" }, { status: 404 });
    }

    const conversion = await chestsService.getCurrencyConversion();
    const userCoins = userId ? chestsService.getUserCoins(userId) : 0;

    return NextResponse.json({
      ...data,
      conversion,
      userCoins,
    });
  } catch (err) {
    console.error("[api/chests/[slug]] Error:", err);
    return NextResponse.json({ error: "Failed to get chest" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminRole();
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const { slug } = await params;
    const body = await req.json();
    chestsService.adminUpdateChest(slug, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/chests/[slug]] Admin update error:", err);
    return NextResponse.json({ error: "Failed to update chest" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminRole();
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const { slug } = await params;
    chestsService.adminDeleteChest(slug);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/chests/[slug]] Admin delete error:", err);
    return NextResponse.json({ error: "Failed to delete chest" }, { status: 500 });
  }
}
