"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { cashoutInput, depositInput, freezeInput } from "@/server/modules/wallet/wallet.schema";
import { walletService } from "@/server/modules/wallet/wallet.service";

/** Holds the amount and files a payout request; the header balance and ledger move with it. */
export async function requestCashout(input: z.input<typeof cashoutInput>) {
  const result = await walletService.requestCashout(await requireUserId(), cashoutInput.parse(input));
  if (result.status === "requested") revalidatePath("/", "layout");
  return { status: result.status };
}

/** Sets or lifts the vault's emergency lock. */
export async function setVaultFrozen(input: z.input<typeof freezeInput>) {
  const { frozen } = freezeInput.parse(input);
  const ok = await walletService.setFrozen(await requireUserId(), frozen);
  if (ok) revalidatePath("/", "layout");
  return { ok };
}

/** Tops up the vault — simulated until a payment provider is connected, and refused in production. */
export async function depositFunds(input: z.input<typeof depositInput>) {
  const result = await walletService.deposit(await requireUserId(), depositInput.parse(input));
  if (result.status === "credited") revalidatePath("/", "layout");
  return result;
}
