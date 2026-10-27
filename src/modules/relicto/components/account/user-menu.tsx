"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSession, useViewer } from "../../state/session-provider";
import { GuestActions } from "./guest-actions";
import { UserMenuInnerContent } from "./user-menu-content";
import { USER_TRIGGERS } from "./user-triggers";

type UserMenuProps = { trigger: keyof typeof USER_TRIGGERS };

/** The avatar menu for a signed-in trader; sign-in and create-account for a guest. */
export function UserMenu({ trigger }: UserMenuProps) {
  return useViewer() ? <SignedInUserMenu trigger={trigger} /> : <GuestActions />;
}

function SignedInUserMenu({ trigger }: UserMenuProps) {
  const { user } = useSession();
  const [open, setOpen] = React.useState(false);
  const Trigger = USER_TRIGGERS[trigger];
  const isMobile = useMediaQuery("(max-width: 768px)");

  const renderTrigger = (props: React.ComponentPropsWithoutRef<"button">) => (
    <Button
      {...props}
      type="button"
      variant={null}
      size={null}
      aria-label="Account menu"
      className="group rounded-xl border-0 bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-tertiary/50 transition-transform active:scale-95"
    >
      <Trigger user={user} />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen} showSwipeHandle>
        <DrawerTrigger render={renderTrigger} />
        <DrawerContent className="bg-menu-panel border-t border-white/10 p-2">
          <UserMenuInnerContent onClose={() => setOpen(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger render={renderTrigger} />
      <DropdownMenuContent
        align="end"
        className="w-80 border border-white/10 bg-menu-panel/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden p-0"
      >
        <UserMenuInnerContent onClose={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}