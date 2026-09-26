import { z } from "zod";

export const makeOfferInput = z.object({
  listingId: z.string().min(1).max(64),
  amountUsd: z.number().positive().max(1_000_000),
  note: z.string().trim().max(200).default(""),
});

export const offerIdInput = z.object({ offerId: z.string().min(1).max(80) });
