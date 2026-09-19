import type { Metadata } from "next";
import { ResetView } from "@/modules/auth/components/reset/reset-view";

export const metadata: Metadata = { title: "Reset Password" };

export default function Page() {
  return <ResetView />;
}
