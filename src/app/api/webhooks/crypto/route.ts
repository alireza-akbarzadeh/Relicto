import { NextRequest, NextResponse } from "next/server";
import { bearerMatches } from "@/server/modules/shared/bearer";
import { verifyAndSettleCryptoDeposit } from "@/server/modules/crypto/crypto-gateway.service";
import { cryptoWebhookInputSchema } from "@/server/modules/crypto/crypto.schema";
import { securityLog } from "@/server/modules/security/security-logger";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRYPTO_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "crypto_webhook_unconfigured" }, { status: 503 });
  }

  if (!bearerMatches(authHeader, secret)) {
    securityLog.warn("AUTH_FAILURE", "Crypto webhook authentication failure", {
      endpoint: "/api/webhooks/crypto",
    });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = cryptoWebhookInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_payload", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { userId, networkId, txHash, amountUsd } = parsed.data;

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
