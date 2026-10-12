"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useSearchDialog } from "@/modules/search/state/search-provider";

export function MobileSearchButton() {
  const { open } = useSearchDialog();

  return (
    <Button
      variant={null}
      size={null}
      onClick={() => open()}
      aria-label="Search items, traders and tournaments"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface-container-low text-text-secondary transition-all hover:border-border-tactical hover:bg-surface-container-high hover:text-text-primary active:scale-95"
    >
      <Icon name="search" className="text-[18px]" />
    </Button>
  );
}
