import type { Metadata } from "next";
import { VerifyView } from "@/modules/auth/components/verify/verify-view";

export const metadata: Metadata = { title: "Steam Guard Verification" };

export default function Page() {
  return <VerifyView />;
}
