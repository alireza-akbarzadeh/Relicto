import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { getDepositAddressForUser } from "@/server/modules/crypto/crypto-gateway.service";

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const networkId = req.nextUrl.searchParams.get("network") || "usdt-trc20";

    const data = getDepositAddressForUser(userId, networkId);
    if (!data) {
      return NextResponse.json({ error: "network_not_found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/crypto/address] error:", error);
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
}
