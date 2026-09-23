"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { cancelOrder, disputeOrder } from "../actions/escrow";

const failed = () => toast.error("Couldn't reach the escrow desk", { description: "Check your connection and try again." });

/** The trader's own escrow controls: cancel before a trade offer is out, or freeze the trade for review. */
export function useEscrowActions(code: string) {
  const [pending, startTransition] = useTransition();
  const bare = code.replace(/^#/, "");

  const cancel = () =>
    startTransition(async () => {
      try {
        const { status } = await cancelOrder({ code: bare });
        if (status === "applied") {
          toast.success("Order cancelled", { description: "Your vault was refunded and the item is back on the market." });
        } else if (status === "offer-sent") {
          toast.error("A trade offer is already out", {
            description: "Decline it in Steam. The bot reports the cancellation and your vault is refunded.",
          });
        } else if (status === "unchanged") {
          toast("This order is already settled");
        } else {
          toast.error("Order not found");
        }
      } catch {
        failed();
      }
    });

  /** Asks first — cancelling can't be undone. */
  const confirmCancel = () =>
    toast("Cancel this order?", {
      description: "The escrow is refunded to your vault and the listing goes back on sale.",
      action: { label: "Cancel order", onClick: cancel },
    });

  const dispute = () =>
    startTransition(async () => {
      try {
        const { status } = await disputeOrder({ code: bare });
        if (status === "applied") {
          toast.error("Escrow frozen for review", {
            description: `Funds for ${code} stay locked while Relicto reviews the trade. The other side has been told.`,
          });
        } else if (status === "unchanged") {
          toast("This order is already settled or under review");
        } else {
          toast.error("Order not found");
        }
      } catch {
        failed();
      }
    });

  return { pending, confirmCancel, dispute };
}
