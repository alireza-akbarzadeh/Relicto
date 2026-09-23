"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useListingWrites } from "../hooks/use-listing-writes";

/** Pulls a listing back to inventory; each screen passes its own styling and label. */
export function DelistButton({ listingId, name, className, children, ...rest }: {
  listingId: string;
  name: string;
  className: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const { pending, delist } = useListingWrites();
  return (
    <Button variant={null} size={null} disabled={pending} onClick={() => delist(listingId, name)} className={className} {...rest}>
      {children}
    </Button>
  );
}
