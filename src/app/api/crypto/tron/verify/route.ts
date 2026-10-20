import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/modules/relicto/data/get-session";
import { verifyTronTransactionOnChain } from "@/server/modules/crypto/tron-verifier";
import { deposit } from "@/server/modules/wallet/wallet.deposit";
import { notificationService } from "@/server/modules/notifications/notifications.service";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    const body = await req.json();

    const { txHash, amountUsd, expectedRecipient } = body || {};
    if (!txHash || typeof amountUsd !== "number" || amountUsd <= 0) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    // 1. Verify transaction on-chain via TronGrid
    const verifyResult = await verifyTronTransactionOnChain({
      txid: txHash,
      expectedAmountUsd: amountUsd,
      expectedRecipient,
      allowSimulation: process.env.NODE_ENV !== "production",
    });

    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.error, message: verifyResult.message }, { status: 400 });
    }

    // 2. Settle funds into trader's vault
    const depositResult = await deposit(userId, {
      rail: "crypto",
      amountUsd: verifyResult.amountUsd,
      txHash: verifyResult.txid,
    });

    if (depositResult.status === "credited") {
      const notices = await notificationService.record(db, [
        {
          userId,
          kind: "system",
          icon: "currency_bitcoin",
          tone: "success",
          title: "TRON On-Chain Trade Settlement",
          body: `+$${verifyResult.amountUsd.toFixed(2)} USD settled via TRON (${verifyResult.token}) at block #${verifyResult.blockNumber}.`,
          href: "/wallet",
          dedupeKey: `tron_pay:${verifyResult.txid}:${userId}`,
        },
      ]);
      void notificationService.deliver(notices);

      return NextResponse.json({
        success: true,
        txid: verifyResult.txid,
        blockNumber: verifyResult.blockNumber,
        confirmations: verifyResult.confirmations,
        token: verifyResult.token,
        amountUsd: verifyResult.amountUsd,
        explorerUrl: verifyResult.explorerUrl,
        balanceCents: depositResult.balanceCents,
        isSimulated: verifyResult.isSimulated,
      });
    }

    if (depositResult.status === "vault-frozen") {
      return NextResponse.json({ error: "vault_frozen" }, { status: 403 });
    }

    return NextResponse.json({ error: "settlement_failed" }, { status: 500 });
  } catch (error) {
    console.error("[api/crypto/tron/verify] error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
