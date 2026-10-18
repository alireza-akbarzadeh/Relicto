import type { Metadata } from "next";
import { Suspense } from "react";
import { forbidden } from "next/navigation";
import { getSession } from "@/modules/relicto/data/get-session";
import { getDashboardData } from "@/modules/dashboard/data/get-dashboard";
import { DashboardShell } from "@/modules/dashboard/components/dashboard-shell";

export const metadata: Metadata = {
  title: "Admin Operations Dashboard | Relicto",
  description: "Restricted command terminal for verified administrators, order monitoring, and treasury telemetry.",
};

export default async function DashboardPage() {
  const session = await getSession();
  const userRole = session?.user?.role?.toLowerCase() ?? "";

  // Strictly restrict dashboard access to users with the Admin role
  if (userRole !== "admin") {
    forbidden();
  }

  const data = await getDashboardData();

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background text-text-muted font-mono text-xs">
          Loading Operations Telemetry...
        </div>
      }
    >
      <DashboardShell data={data} />
    </Suspense>
  );
}
