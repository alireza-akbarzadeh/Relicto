import type { Metadata } from "next";
import { ResetView } from "@/modules/auth/components/reset/reset-view";

export const metadata: Metadata = { title: "Reset Password" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  return <ResetView token={token} error={error} />;
}

