import type { Metadata } from "next";
import { SignUpView } from "@/modules/auth/components/sign-up/sign-up-view";

export const metadata: Metadata = { title: "Create Account" };

export default function Page() {
  return <SignUpView />;
}
