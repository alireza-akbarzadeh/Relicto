"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { createRuleInput, setArmedInput } from "@/server/modules/alerts/alerts.schema";
import { alertService } from "@/server/modules/alerts/alerts.service";
import { alertsMobile } from "../data/alerts-mobile.mock";

/** Deploys a snipe rule and answers with the trader's rule book as the server now holds it. */
export async function createAlertRule(input: z.input<typeof createRuleInput>) {
  const parsed = createRuleInput.parse(input);
  const userId = await requireUserId();
  const { matched } = await alertService.create(userId, parsed);
  revalidatePath("/alerts");
  return { matched, rules: (await alertService.mobile(userId, alertsMobile))?.rules ?? [] };
}

/** Arms or pauses one of the trader's rules. */
export async function setAlertArmed(input: z.input<typeof setArmedInput>) {
  const { id, armed } = setArmedInput.parse(input);
  const ok = await alertService.setArmed(await requireUserId(), id, armed);
  if (ok) revalidatePath("/alerts");
  return { ok };
}
