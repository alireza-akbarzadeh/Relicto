import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { GatewayMobile } from "@/modules/auth/components/mobile/gateway-mobile";
import { SignInView } from "@/modules/auth/components/sign-in/sign-in-view";
import { gatewayMobile } from "@/modules/auth/data/gateway-mobile.mock";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("signInTitle"),
    description: t("signInDesc"),
  };
}

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
