import { NextResponse } from "next/server";
import { chestsService } from "@/server/modules/chests/chests.service";
import { requireAdminRole } from "@/server/modules/auth/auth.guard";
import { verifyCsrf } from "@/server/modules/auth/csrf.guard";

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
  const csrf = verifyCsrf(req);
  if (!csrf.valid) return csrf.response;

  const guard = await requireAdminRole();
  if (!guard.authorized) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  try {
    const body = await req.json();
    chestsService.adminCreateChest(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/chests] Admin create error:", err);
    return NextResponse.json({ error: "Failed to create chest" }, { status: 500 });
  }
}
