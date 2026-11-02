"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getUserId } from "@/modules/relicto/data/get-session";
import { deposit } from "@/server/modules/wallet/wallet.deposit";
import {
  DEPOSIT_RAILS,
  type DepositRail,
} from "@/server/modules/wallet/wallet.schema";

const chargeWalletSchema = z
  .object({
    rail: z.enum(DEPOSIT_RAILS),
    amountUsd: z.number().finite().positive().min(1).max(10_000),
  })
  .strict();

export type ChargeWalletInput = {
  rail: DepositRail;
  amountUsd: number;
};

export type ChargeWalletResult =
  | { success: true; balanceCents: number; message: string }
  | { success: false; error: string };

export async function chargeWalletAction(
  input: ChargeWalletInput,
): Promise<ChargeWalletResult> {
  const parsed = chargeWalletSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.issues[0]?.message ||
        "Amount must be between $1 and $10,000 USD.",
    };
  }

  const userId = await getUserId();
  if (!userId) {
    return { success: false, error: "Authentication required to fund vault." };
  }

  try {
    const result = await deposit(userId, {
      rail: parsed.data.rail,
      amountUsd: parsed.data.amountUsd,
    });

    if (result.status === "credited") {
      revalidatePath("/dashboard");
      revalidatePath("/wallet");
      revalidatePath("/orders");
      return {
        success: true,
        balanceCents: result.balanceCents,
        message: `Successfully credited $${parsed.data.amountUsd.toFixed(2)} USD to vault.`,
      };
    }

    if (result.status === "vault-frozen") {
      return {
        success: false,
        error:
          "Your vault is currently locked. Unfreeze it from security settings.",
      };
    }

    return {
      success: false,
      error:
        "Selected funding rail is currently unavailable in this environment.",
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Internal error occurred while processing deposit.";
    return { success: false, error: message };
  }
}
