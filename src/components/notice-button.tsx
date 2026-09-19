"use client";

import type { ComponentProps } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type NoticeButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  /** Toast shown on click, for actions whose backend isn't wired yet. */
  notice: { title: string; description?: string };
};

/** shadcn Button that confirms a mock action with a toast. */
export function NoticeButton({ notice, variant = null, size = null, ...props }: NoticeButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={() => toast(notice.title, { description: notice.description })}
      {...props}
    />
  );
}
