"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { orders, profiles, reviews } from "@/lib/db/schema";
import { requireUserId } from "@/modules/relicto/data/get-session";

export type SubmitVendorReviewInput = {
  code: string;
  rating: number; // 1 to 5
  quote: string;
  tags?: string[];
};

export type SubmitVendorReviewResult =
  | { success: true; message: string; reviewId: string }
  | { success: false; error: string };

export async function submitVendorReview(
  input: SubmitVendorReviewInput
): Promise<SubmitVendorReviewResult> {
  const userId = await requireUserId();
  const rawCode = input.code.replace(/^#/, "").trim();
  const rating = Math.min(5, Math.max(1, Math.round(input.rating || 5)));
  const quote = input.quote.trim();

  if (!quote) {
    return { success: false, error: "Please enter feedback for the vendor." };
  }

  // 1. Find the order
  const [order] = await db
    .select({
      id: orders.id,
      code: orders.code,
      buyerId: orders.buyerId,
      sellerId: orders.sellerId,
      state: orders.state,
    })
    .from(orders)
    .where(eq(orders.code, rawCode))
    .limit(1);

  if (!order) {
    return { success: false, error: "Order not found." };
  }

  if (order.buyerId !== userId) {
    return { success: false, error: "Only the buyer can review the vendor for this order." };
  }

  if (order.state !== "completed") {
    return { success: false, error: "You can only review vendors after an order is completed & delivered." };
  }

  if (!order.sellerId) {
    return { success: false, error: "This order was fulfilled by an automated bot node without a vendor profile." };
  }

  // 2. Find seller profile & buyer profile
  const [[sellerProfile], [buyerProfile]] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, order.sellerId)).limit(1),
    db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1),
  ]);

  if (!sellerProfile) {
    return { success: false, error: "Vendor profile not found." };
  }

  const tagPrefix = input.tags && input.tags.length > 0 ? `[${input.tags.join(", ")}] ` : "";
  const fullQuote = `${tagPrefix}${quote}`;

  // 3. Insert review
  const [newReview] = await db
    .insert(reviews)
    .values({
      profileId: sellerProfile.id,
      authorId: userId,
      authorHandle: buyerProfile?.handle ?? "Verified Trader",
      quote: fullQuote,
      rating,
    })
    .returning({ id: reviews.id });

  // 4. Update vendor reputation aggregates
  const [agg] = await db
    .select({
      count: sql<number>`count(*)::int`,
      avgRating: sql<number>`coalesce(avg(${reviews.rating}), 5.0)::float`,
    })
    .from(reviews)
    .where(eq(reviews.profileId, sellerProfile.id));

  const count = agg?.count ?? 1;
  const ratingHundredths = Math.round((agg?.avgRating ?? 5.0) * 100);
  const trustScore = Math.min(1000, Math.round((ratingHundredths / 500) * 1000));

  await db
    .update(profiles)
    .set({
      reviewCount: count,
      ratingHundredths,
      trustScore,
    })
    .where(eq(profiles.id, sellerProfile.id));

  // 5. Revalidate relevant pages
  revalidatePath(`/orders/${rawCode}`);
  revalidatePath(`/traders/${sellerProfile.handle}`);
  revalidatePath("/profile");

  return {
    success: true,
    message: `Review submitted for @${sellerProfile.handle}! Thank you for strengthening community trust.`,
    reviewId: newReview.id,
  };
}
