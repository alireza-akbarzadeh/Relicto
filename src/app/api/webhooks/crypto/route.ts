import { NextRequest, NextResponse } from "next/server";
import { bearerMatches } from "@/server/modules/shared/bearer";
import { verifyAndSettleCryptoDeposit } from "@/server/modules/crypto/crypto-gateway.service";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRYPTO_WEBHOOK_SECRET;

  // In production, ensure bearer matches the secret if configured
  if (secret && !bearerMatches(authHeader, secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, networkId, txHash, amountUsd } = body || {};

    if (!userId || !networkId || !txHash || typeof amountUsd !== "number") {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    const result = await verifyAndSettleCryptoDeposit(userId, {
      networkId,
      txHash,
      amountUsd,
    });

    if (result.status === "settled" || result.status === "already_claimed") {
      return NextResponse.json({ received: true, status: result.status });
    }

    return NextResponse.json({ error: result.status }, { status: 400 });
  } catch (err: unknown) {
    console.error("[crypto-webhook] unexpected error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
