import { z } from "zod";

export const markReadInput = z.object({ id: z.string().min(1).max(64) });

/** `PushSubscription.toJSON()` from the browser, plus who is asking. */
export const pushSubscriptionInput = z.object({
  endpoint: z.string().url().max(1000),
  keys: z.object({ p256dh: z.string().min(1).max(200), auth: z.string().min(1).max(100) }),
});

export const endpointInput = z.object({ endpoint: z.string().url().max(1000) });
