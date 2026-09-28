import type { Metadata } from "next";
import { HubView } from "@/modules/hub/components/hub-view";
import { HubMobile } from "@/modules/hub/components/mobile/hub-mobile";
import { getHub, getHubMobile } from "@/modules/hub/data/get-hub";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { JsonLd } from "@/modules/seo/components/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/modules/seo/lib/json-ld";
import { pageMetadata } from "@/modules/seo/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}, Prices & Esports Meta`,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
});

/** Separate mobile and desktop compositions; CSS picks one at `md`. */
export default async function HomePage() {
  const [hub, mobile] = await Promise.all([getHub(), getHubMobile()]);
  return (
    <>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      {/* The designs open on a spotlight carousel, not a headline; this names the page for search and screen readers. */}
      <h1 className="sr-only">
        {SITE_NAME}: {SITE_TAGLINE}
      </h1>
      <div className="md:hidden">
        <HubMobile data={mobile} />
      </div>
      <div className="hidden md:block">
        <HubView hub={hub} />
      </div>
    </>
  );
}
