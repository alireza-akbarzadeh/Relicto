import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { createStripeSession } from "@/server/modules/checkout/checkout.stripe";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();
    const { promo, cartIds } = body ?? {};

    if (!Array.isArray(cartIds) || cartIds.length === 0) {
      return NextResponse.json({ error: "cart_empty" }, { status: 400 });
    }

    const origin = req.nextUrl.origin;
    const result = await createStripeSession(userId, {
      promo: Boolean(promo),
      cartIds,
      origin,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/checkout/stripe/create-session] error:", error);
    return NextResponse.json({ error: "unauthorized_or_failed" }, { status: 401 });
  }
}
