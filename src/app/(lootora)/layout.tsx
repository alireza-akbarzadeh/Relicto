import { getSession } from "@/modules/lootora/data/get-session";
import { SessionProvider } from "@/modules/lootora/state/session-provider";
import {TooltipProvider} from "@/components/ui/tooltip";

/** Signed-in Lootora app: shares the session (user, notifications) across pages. */
export default async function LootoraLayout({ children }: LayoutProps<"/">) {
  const { user, notifications } = await getSession();
  return (
    <SessionProvider user={user} notifications={notifications}>
      <TooltipProvider>
      {children}
      </TooltipProvider>
    </SessionProvider>
  );
}
