"use client";

import type { ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SoonLinkProps = { label: string; className?: string; children?: ReactNode };

/** A link to a page that doesn't exist yet (legal, docs): explains instead of 404ing. */
export function SoonLink({ label, className, children }: SoonLinkProps) {
  return (
    <Button
      type="button"
      variant={null}
      size={null}
      className={className}
      onClick={() => toast(label, { description: "This page will be published before launch." })}
    >
      {children ?? label}
    </Button>
  );
}
