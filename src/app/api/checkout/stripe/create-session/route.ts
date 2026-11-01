import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { createStripeSession } from "@/server/modules/checkout/checkout.stripe";
import { createCheckoutStripeSessionInput } from "@/server/modules/checkout/checkout.schema";
import { verifyCsrf } from "@/server/modules/auth/csrf.guard";

export async function POST(req: NextRequest) {
  try {
    const csrf = verifyCsrf(req);
    if (!csrf.valid) return csrf.response;

    const userId = await requireUserId();
    const body = await req.json().catch(() => null);
    const parsed = createCheckoutStripeSessionInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout session request", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const origin = req.nextUrl.origin;
    const result = await createStripeSession(userId, {
      promo: parsed.data.promo,
      cartIds: parsed.data.cartIds,
      origin,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/checkout/stripe/create-session] error:", error);
    return NextResponse.json({ error: "unauthorized_or_failed" }, { status: 401 });
  }
}
