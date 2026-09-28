import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Forms, not content: kept out of the index, links still followed. */
export const metadata: Metadata = { robots: { index: false, follow: true } };

/** Auth route group (sign in, sign up, 2FA, recovery). Each page renders its own AuthShell. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
