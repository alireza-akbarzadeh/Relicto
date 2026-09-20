import { getSession } from "@/modules/relicto/data/get-session";
import { SessionProvider } from "@/modules/relicto/state/session-provider";
import { CartProvider } from "@/modules/relicto/state/cart-provider";
import { checkout } from "@/modules/checkout/data/checkout.mock";
import {TooltipProvider} from "@/components/ui/tooltip";

/** Signed-in Relicto app: shares the session (user, notifications) across pages. */
export default async function RelictoLayout({ children }: LayoutProps<"/">) {
  const { user, notifications } = await getSession();
  return (
    <SessionProvider user={user} notifications={notifications}>
      <CartProvider initialItems={checkout.items}>
        <TooltipProvider>{children}</TooltipProvider>
      </CartProvider>
    </SessionProvider>
  );
}
