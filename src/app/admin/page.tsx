import { forbidden, redirect } from "next/navigation";
import { requireAdminRole } from "@/server/modules/auth/auth.guard";

export default async function AdminPage() {
  const guard = await requireAdminRole();

  if (!guard.authorized) {
    if (guard.status === 401) {
      redirect("/sign-in?next=/admin");
    }
    forbidden();
  }

  redirect("/dashboard");
}
