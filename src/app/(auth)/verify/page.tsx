import type { Metadata } from "next";
import { VerifyMobile } from "@/modules/auth/components/mobile/verify-mobile";
import { VerifyView } from "@/modules/auth/components/verify/verify-view";
import { verifyMobile } from "@/modules/auth/data/verify-mobile.mock";

export const metadata: Metadata = { title: "Steam Guard Verification" };

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default function Page() {
  return (
    <>
      <div className="md:hidden">
        <VerifyMobile data={verifyMobile} />
      </div>
      <div className="hidden md:block">
        <VerifyView />
      </div>
    </>
  );
}
