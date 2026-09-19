import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AuthFooter } from "./auth-footer";
import { AuthHeader, type AuthNavId } from "./auth-header";

type AuthShellProps = {
  nav: AuthNavId;
  /** Per-screen token scope from styles/theme/scopes.css. */
  scope: "theme-auth-signin" | "theme-auth-signup" | "theme-auth-2fa" | "theme-auth-recovery";
  /** Classes for <main> (padding, background effects). */
  mainClassName?: string;
  /** Decorative layers behind the page (glows, grids). */
  backdrop?: ReactNode;
  children: ReactNode;
};

/** Page frame for every auth screen: scoped tokens, header, centered stage, footer. */
export function AuthShell({ nav, scope, mainClassName, backdrop, children }: AuthShellProps) {
  return (
    <div
      className={cn(
        "theme-auth relative flex min-h-screen flex-col justify-between bg-surface-container-lowest text-text-primary antialiased selection:bg-primary-container selection:text-white",
        scope,
      )}
    >
      {backdrop}
      <AuthHeader active={nav} />
      <main className={cn("relative w-full flex-1 px-4 sm:px-6", mainClassName)}>{children}</main>
      <AuthFooter />
    </div>
  );
}
