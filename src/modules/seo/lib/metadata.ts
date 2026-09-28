import type { Metadata } from "next";
import { INDEXABLE, SITE_NAME } from "@/lib/site";

type PageSeo = {
  /** Page title; the root template appends "| Relicto" unless `absoluteTitle`. */
  title: string;
  absoluteTitle?: boolean;
  description: string;
  /** Canonical path, e.g. "/items/manifold-paradox". */
  path: string;
  /** Social card image: an absolute URL or a site path. */
  image?: { url: string; alt: string };
  /** False keeps the page out of the index but lets crawlers follow its links. */
  index?: boolean;
};

/**
 * One place that turns a page's SEO facts into Next metadata: title,
 * description, canonical, Open Graph, Twitter and robots stay consistent.
 */
export function pageMetadata({ title, absoluteTitle, description, path, image, index = true }: PageSeo): Metadata {
  const images = image ? [{ url: image.url, alt: image.alt }] : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: "website", images },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: images?.map((entry) => entry.url) },
    robots: INDEXABLE && index ? { index: true, follow: true } : { index: false, follow: true },
  };
}
