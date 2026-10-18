"use server";

import { revalidatePath } from "next/cache";
import { getUserId } from "@/modules/relicto/data/get-session";
import { deposit } from "@/server/modules/wallet/wallet.deposit";
import type { DepositRail } from "@/server/modules/wallet/wallet.schema";

export type ChargeWalletInput = {
  rail: DepositRail;
  amountUsd: number;
};

export type ChargeWalletResult =
  | { success: true; balanceCents: number; message: string }
  | { success: false; error: string };

export async function chargeWalletAction(input: ChargeWalletInput): Promise<ChargeWalletResult> {
  const userId = await getUserId();
  if (!userId) {
    return { success: false, error: "Authentication required to fund vault." };
  }

  if (typeof input.amountUsd !== "number" || input.amountUsd <= 0 || input.amountUsd > 10_000) {
    return { success: false, error: "Amount must be between $1 and $10,000 USD." };
  }

  try {
    const result = await deposit(userId, {
      rail: input.rail,
      amountUsd: input.amountUsd,
    });

    if (result.status === "credited") {
      revalidatePath("/dashboard");
      revalidatePath("/wallet");
      revalidatePath("/orders");
      return {
        success: true,
        balanceCents: result.balanceCents,
        message: `Successfully credited $${input.amountUsd.toFixed(2)} USD to vault.`,
      };
    }

    if (result.status === "vault-frozen") {
      return { success: false, error: "Your vault is currently locked. Unfreeze it from security settings." };
    }

    return { success: false, error: "Selected funding rail is currently unavailable in this environment." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error occurred while processing deposit.";
    return { success: false, error: message };
  }
}
