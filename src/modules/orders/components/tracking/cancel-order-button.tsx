"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useEscrowActions } from "../../hooks/use-escrow-actions";

/** The tracker's "Cancel Order" link: refunds the escrow while no trade offer is out. */
export function CancelOrderButton({ code }: { code: string }) {
  const { pending, confirmCancel } = useEscrowActions(code);

  return (
    <Button
      variant={null}
      size={null}
      disabled={pending}
      onClick={confirmCancel}
      className="inline-flex h-auto gap-1 rounded-none border-0 p-0 font-label-caps text-label-caps text-text-muted uppercase transition-colors hover:text-status-live"
    >
      <Icon name="cancel" className="text-[16px]" />
      <span>Cancel Order</span>
    </Button>
  );
}
