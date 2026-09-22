import type { Metadata } from "next";
import { Suspense } from "react";
import { GatewayMobile } from "@/modules/auth/components/mobile/gateway-mobile";
import { SignInView } from "@/modules/auth/components/sign-in/sign-in-view";
import { gatewayMobile } from "@/modules/auth/data/gateway-mobile.mock";

export const metadata: Metadata = { title: "Sign In", description: "Sign in with Steam or your Relicto credentials." };

/** Separate mobile and desktop compositions; CSS picks one at `md`. Wrapped in Suspense: the forms read `?next=` via useSearchParams. */
export default function SignInPage() {
  return (
    <Suspense>
      <div className="md:hidden">
        <GatewayMobile data={gatewayMobile} />
      </div>
      <div className="hidden md:block">
        <SignInView />
      </div>
    </Suspense>
  );
}
