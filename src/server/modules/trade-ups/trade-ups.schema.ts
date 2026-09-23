import { z } from "zod";
import { CONTRACT_SLOTS } from "@/modules/sell/lib/trade-up";

/** The chamber as the client sees it: one inventory id (or an empty slot) per slot. */
const slots = z.array(z.string().min(1).max(64).nullable()).length(CONTRACT_SLOTS);

export const saveSlotsInput = z.object({ slots });

/** Ignite sends the slots it shows, so a chamber changed in another tab can't be burned blind. */
export const igniteInput = z.object({ slots });
