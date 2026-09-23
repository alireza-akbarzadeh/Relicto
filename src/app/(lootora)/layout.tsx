import { requireSession } from "@/modules/relicto/data/get-session";
import { SessionProvider } from "@/modules/relicto/state/session-provider";
import { CartProvider } from "@/modules/relicto/state/cart-provider";
import { getCartLines } from "@/modules/checkout/data/get-checkout";
import {TooltipProvider} from "@/components/ui/tooltip";

/** Signed-in Relicto app: shares the session (user, notifications) and the live basket across pages. */
export default async function RelictoLayout({ children }: LayoutProps<"/">) {
  const [{ user, notifications }, cart] = await Promise.all([requireSession(), getCartLines()]);
  return (
    <SessionProvider user={user} notifications={notifications}>
      <CartProvider initialItems={cart}>
        <TooltipProvider>{children}</TooltipProvider>
      </CartProvider>
    </SessionProvider>
  );
}
