import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardData } from "@/modules/dashboard/data/get-dashboard";
import { DashboardShell } from "@/modules/dashboard/components/dashboard-shell";

export const metadata: Metadata = {
  title: "Operations Dashboard | Relicto",
  description: "Real-time monitoring of orders, income, audited treasury transactions, and wallet deposits.",
};

export default async function DashboardPage() {
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
