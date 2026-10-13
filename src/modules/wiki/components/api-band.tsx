"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function ApiBand() {
  return (
    <section className="px-margin-desktop pb-space-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-space-md rounded-lg bg-surface-container-lowest p-space-md">
        <div className="flex items-center gap-space-sm">
          <Icon name="token" className="text-[20px] text-secondary" />
          <div>
            <h3 className="font-headline-sm text-sm text-text-primary">
              Valve Economy REST &amp; GraphQL API Available
            </h3>
            <p className="font-body-sm text-[11px] text-text-muted">
              Query live seed coordinates, Doppler tables, and float calculus
              programmatically via the Relicto CLI.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText("relicto_live_pk_9f83a201b4c74892e319");
            toast.success("API key copied to clipboard", {
              description: "relicto_live_pk_9f83a... (Rate Limit: 120 req/min)",
            });
          }}
          className="inline-flex h-auto cursor-pointer items-center justify-center rounded bg-surface-container-high px-3 py-2 font-label-caps text-[10px] text-text-primary uppercase transition-colors hover:bg-surface-container-highest"
        >
          Copy Key
        </Button>
      </div>
    </section>
  );
}
