import type { ReactNode } from "react";

/** Auth route group (sign in, sign up, 2FA, recovery). Each page renders its own AuthShell. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
