import { NextRequest, NextResponse } from "next/server";
import { processStripeWebhook } from "@/server/modules/checkout/checkout.stripe";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  try {
    const rawBody = await req.text();
    const result = await processStripeWebhook(rawBody, signature);

    if (result.status === "error") {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ received: true, status: result.status });
  } catch (err: unknown) {
    console.error("[stripe-webhook] unexpected error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
