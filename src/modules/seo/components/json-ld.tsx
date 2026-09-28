import type { JsonLdObject } from "../lib/json-ld";

/**
 * Structured data as Next recommends: a server-rendered `ld+json` script.
 * `<` is escaped so catalog text can never close the tag (XSS).
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
