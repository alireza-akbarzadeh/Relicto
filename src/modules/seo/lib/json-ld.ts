import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export type JsonLdObject = { "@context": "https://schema.org"; "@type": string } & Record<string, unknown>;

export type Crumb = { name: string; path: string };

/** The site itself — rendered once, on the home page. */
export function websiteJsonLd(): JsonLdObject {
  return { "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, description: SITE_DESCRIPTION };
}

export function organizationJsonLd(): JsonLdObject {
  return { "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: absoluteUrl("/icons/icon-512.png") };
}

/** The page's place in the catalog, root first. Every crumb must be a real, crawlable URL. */
export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  };
}
