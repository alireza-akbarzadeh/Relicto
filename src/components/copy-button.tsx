"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CopyButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  /** Text placed on the clipboard. */
  value: string;
  /** Toast shown after copying. */
  notice: string;
};

/** shadcn Button that copies a value and confirms with a toast. */
export function CopyButton({ value, notice, variant = null, size = null, ...props }: CopyButtonProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(notice);
    } catch {
      toast.error("Clipboard blocked", { description: "Your browser denied clipboard access." });
    }
  };

  return <Button type="button" variant={variant} size={size} onClick={copy} {...props} />;
}
