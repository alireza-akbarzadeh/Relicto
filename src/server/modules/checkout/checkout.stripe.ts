import "server-only";

import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { quote } from "@/modules/checkout/lib/pricing";
import { findCartLines } from "./checkout.repository";
import { settle, type SettleResult } from "./checkout.settle";

export type StripeSessionResult =
  | { mode: "stripe"; url: string; sessionId: string }
  | { mode: "settled"; codes: string[] }
  | { mode: "error"; reason: string };

export async function createStripeSession(
  userId: string,
  input: { promo: boolean; cartIds: string[]; origin: string },
): Promise<StripeSessionResult> {
  const stripe = getStripe();
  const lines = await findCartLines(userId);
  if (lines.length === 0) return { mode: "error", reason: "empty" };

  const prices = lines.map((l) => l.listing.priceCents);
  const q = quote(prices, input.promo);

  if (isStripeConfigured() && stripe) {
    try {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lines.map((l) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: l.name,
              images: l.imageUrl ? [l.imageUrl] : [],
              description: `Escrow-protected peer-to-peer delivery • Item ID ${l.listing.id}`,
            },
            unit_amount: l.listing.priceCents,
          },
          quantity: 1,
        })),
        discounts:
          q.comboCents + q.promoCents > 0
            ? undefined
            : undefined,
        metadata: {
          userId,
          cartIds: input.cartIds.join(","),
          promo: String(input.promo),
          dueCents: String(q.dueCents),
        },
        success_url: `${input.origin}/checkout?stripe_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${input.origin}/checkout?stripe_cancel=true`,
      });

      if (!session.url) return { mode: "error", reason: "session_failed" };
      return { mode: "stripe", url: session.url, sessionId: session.id };
    } catch (err) {
      console.error("[stripe] checkout session error:", err);
      return { mode: "error", reason: "stripe_api_error" };
    }
  }

  // Developer / test environment fallback when no live Stripe keys are provided
  const result: SettleResult = await settle(userId, {
    rail: "card",
    promo: input.promo,
    cartIds: input.cartIds,
  });

  if (result.status === "placed") {
    return { mode: "settled", codes: result.codes };
  }
  return { mode: "error", reason: result.status };
}

export async function processStripeWebhook(
  payload: string,
  signature: string,
): Promise<{ status: "ignored" | "settled" | "error"; error?: string }> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return { status: "ignored" };

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (session.metadata?.kind === "wallet_deposit" && userId) {
        const amountCents = Number(session.metadata.amountCents) || 0;
        if (amountCents > 0) {
          const { deposit } = await import("@/server/modules/wallet/wallet.deposit");
          await deposit(userId, { rail: "cards", amountUsd: amountCents / 100 });
          return { status: "settled" };
        }
      }

      const cartIds = session.metadata?.cartIds?.split(",") ?? [];
      const promo = session.metadata?.promo === "true";

      if (userId && cartIds.length > 0) {
        await settle(userId, { rail: "card", promo, cartIds });
        return { status: "settled" };
      }
    }

    return { status: "ignored" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: "error", error: message };
  }
}
