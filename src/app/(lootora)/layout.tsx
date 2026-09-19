import { getSession } from "@/modules/relicto/data/get-session";
import { SessionProvider } from "@/modules/relicto/state/session-provider";
import {TooltipProvider} from "@/components/ui/tooltip";

/** Signed-in Relicto app: shares the session (user, notifications) across pages. */
export default async function RelictoLayout({ children }: LayoutProps<"/">) {
  const { user, notifications } = await getSession();
  return (
    <SessionProvider user={user} notifications={notifications}>
      <TooltipProvider>
      {children}
      </TooltipProvider>
    </SessionProvider>
  );
}
