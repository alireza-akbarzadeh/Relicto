import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { deposit } from "@/server/modules/wallet/wallet.deposit";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const amountUsd = Number(body?.amountUsd) || 0;

    if (amountUsd < 10 || amountUsd > 10_000) {
      return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }

    const stripe = getStripe();
    const amountCents = Math.round(amountUsd * 100);

    if (isStripeConfigured() && stripe) {
      const origin = req.nextUrl.origin;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Relicto Vault Direct Deposit",
                description: `Immediate $${amountUsd.toFixed(2)} USD liquidity ingress to Lootora Vault.`,
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          kind: "wallet_deposit",
          amountCents: String(amountCents),
        },
        success_url: `${origin}/wallet?stripe_deposit_success=true&amount=${amountUsd}`,
        cancel_url: `${origin}/wallet?stripe_deposit_cancel=true`,
      });

      if (!session.url) return NextResponse.json({ error: "session_failed" }, { status: 500 });
      return NextResponse.json({ mode: "stripe", url: session.url });
    }

    // Test mode fallback
    const result = await deposit(userId, { rail: "cards", amountUsd });
    if (result.status === "credited") {
      return NextResponse.json({ mode: "settled", balanceCents: result.balanceCents });
    }
    return NextResponse.json({ error: result.status }, { status: 400 });
  } catch (error) {
    console.error("[api/wallet/stripe/create-session] error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
