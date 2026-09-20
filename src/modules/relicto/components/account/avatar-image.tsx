import Image from "next/image";
import { cn } from "@/lib/cn";
import type { SessionUser } from "../../session-types";

/** The signed-in trader's portrait. Sized by the caller (headers use 32–36px). */
export function AvatarImage({ user, className, size = 36 }: { user: SessionUser; className?: string; size?: number }) {
  return (
    <Image
      src={user.avatar}
      alt={user.avatarAlt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
