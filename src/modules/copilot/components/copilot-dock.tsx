"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CopilotTrigger } from "./copilot-trigger";
import { CopilotWindow } from "./copilot-window";

export function CopilotDock() {
  const t = useTranslations("copilot.dock");
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Global hotkey & event listeners (Alt+C, Cmd+J, or custom dispatch)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAltC = e.altKey && e.key.toLowerCase() === "c";
      const isCmdJ = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j";

      if (isAltC || isCmdJ) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    const handleCustomTrigger = () => {
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("relicto:open-copilot", handleCustomTrigger);
    window.addEventListener("relicto:open-copilot-query", handleCustomTrigger);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("relicto:open-copilot", handleCustomTrigger);
      window.removeEventListener("relicto:open-copilot-query", handleCustomTrigger);
    };
  }, []);

  return (
    <>
      {/* Mobile Experience: Bottom Drawer */}
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
          <DrawerContent className="h-[92vh] max-h-[92vh] bg-[#0e121b] border-t border-rose-500/30 p-0 overflow-hidden flex flex-col">
            <DrawerTitle className="sr-only">{t("drawerTitle")}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {t("drawerDesc")}
            </DrawerDescription>
            <CopilotWindow onClose={() => setOpen(false)} isMobile />
          </DrawerContent>
        </Drawer>
      ) : (
        /* Desktop Experience: Fixed Floating Tactical Window */
        open && (
          <div className="fixed bottom-24 end-6 z-50 w-[540px] max-w-[calc(100vw-3rem)] h-[780px] max-h-[calc(100vh-7.5rem)] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <CopilotWindow onClose={() => setOpen(false)} />
          </div>
        )
      )}

      {/* Floating launcher action button */}
      <CopilotTrigger open={open} onClick={() => setOpen((prev) => !prev)} />
    </>
  );
}
