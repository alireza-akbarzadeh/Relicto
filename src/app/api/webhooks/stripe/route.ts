import { NextRequest, NextResponse } from "next/server";
import { processStripeWebhook } from "@/server/modules/checkout/checkout.stripe";
import { securityLog } from "@/server/modules/security/security-logger";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    securityLog.warn("AUTH_FAILURE", "Missing stripe-signature header on webhook endpoint", {
      endpoint: "/api/webhooks/stripe",
    });
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "stripe_webhook_unconfigured" }, { status: 503 });
  }

  try {
    const rawBody = await req.text();
    const result = await processStripeWebhook(rawBody, signature);

    if (result.status === "error") {
      securityLog.warn("AUTH_FAILURE", `Stripe webhook signature validation failed: ${result.error}`, {
        endpoint: "/api/webhooks/stripe",
      });
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ received: true, status: result.status });
  } catch (err: unknown) {
    console.error("[stripe-webhook] unexpected error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
