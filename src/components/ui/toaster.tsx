"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "@/hooks/use-theme";

/** App-wide toast host, styled with the design tokens. */
export function Toaster() {
  const { theme } = useTheme();
  return (
    <Sonner
      theme={theme}
      position="bottom-right"
      offset={24}
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface-card !border !border-border-subtle !text-on-surface !rounded-xl !shadow-[0_16px_48px_rgba(0,0,0,0.55)] !font-body-md",
          title: "!font-headline-sm !text-[14px] !text-text-primary",
          description: "!font-body-sm !text-body-sm !text-text-secondary",
          actionButton: "!bg-primary-container !text-on-primary-container !font-label-caps",
          success: "[&_[data-icon]]:!text-status-upcoming",
          error: "[&_[data-icon]]:!text-status-live",
        },
      }}
    />
  );
}

