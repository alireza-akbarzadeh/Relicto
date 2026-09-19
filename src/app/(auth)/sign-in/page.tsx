import type { Metadata } from "next";
import { SignInView } from "@/modules/auth/components/sign-in/sign-in-view";

export const metadata: Metadata = { title: "Sign In", description: "Sign in with Steam or your Relicto credentials." };

export default function SignInPage() {
  return <SignInView />;
}
