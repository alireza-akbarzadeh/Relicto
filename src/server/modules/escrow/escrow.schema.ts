import { z } from "zod";

export const orderCode = z.string().trim().regex(/^#?LT-\d{5}-[A-Z]{2}$/i, "Expected a tracking code like LT-89410-ES");

export const offerSent = z.object({
  steamOfferId: z.string().min(1).max(32),
  botName: z.string().min(1).max(80),
  botSteamId: z.string().max(32).optional(),
  /** The security code the buyer must see in Steam Mobile before confirming. */
  token: z.string().max(32).optional(),
  offerUrl: z.string().url().max(300).optional(),
});

export type OfferSent = z.infer<typeof offerSent>;

/** What escrow bots (and later the Steam/payment callbacks) report about an order. */
export const escrowEvent = z.discriminatedUnion("type", [
  offerSent.extend({ type: z.literal("offer_sent"), orderCode }),
  z.object({ type: z.literal("delivered"), orderCode }),
  z.object({ type: z.literal("cancelled"), orderCode, reason: z.string().trim().min(1).max(200) }),
]);

export type EscrowEvent = z.infer<typeof escrowEvent>;

/** A trader acting on one of their own orders. */
export const orderCodeInput = z.object({ code: orderCode });

/** The seller reporting the trade offer they sent: its Steam link or bare id. */
export const dispatchInput = z.object({ code: orderCode, offer: z.string().trim().min(6).max(300) });
