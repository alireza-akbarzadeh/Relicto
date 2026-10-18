"use client";

import * as React from "react";
import { cn } from "cn";

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />;
}

export function SidebarMenuButton({
  isActive,
  className,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      data-sidebar="menu-button"
      data-active={isActive}
      className={cn(
        "peer/menu-button flex w-full items-center gap-2.5 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding,color,background-color] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        isActive && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground shadow-xs text-primary",
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none ml-auto flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1.5 text-xs font-mono font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
