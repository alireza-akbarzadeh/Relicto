import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { verifyAndSettleCryptoDeposit } from "@/server/modules/crypto/crypto-gateway.service";
import { cryptoVerifyInputSchema } from "@/server/modules/crypto/crypto.schema";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json().catch(() => null);

    const parsed = cryptoVerifyInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_input", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { networkId, txHash, amountUsd } = parsed.data;

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
