import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { verifyAndSettleCryptoDeposit } from "@/server/modules/crypto/crypto-gateway.service";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();

    const { networkId, txHash, amountUsd } = body || {};
    if (!networkId || !txHash || typeof amountUsd !== "number") {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const result = await verifyAndSettleCryptoDeposit(userId, {
      networkId,
      txHash,
      amountUsd,
    });

    if (result.status === "settled") {
      return NextResponse.json({
        success: true,
        balanceCents: result.balanceCents,
        confirmations: result.confirmations,
        txHash: result.txHash,
        venue: result.venue,
      });
    }

    return NextResponse.json({ error: result.status }, { status: 400 });
  } catch (error) {
    console.error("[api/crypto/verify] error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
