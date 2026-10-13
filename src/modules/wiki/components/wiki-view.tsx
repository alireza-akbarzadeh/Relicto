"use client";

import { useMemo, useState } from "react";
import { useQueryStates } from "nuqs";
import { SiteFooter } from "@/modules/relicto/components/shell/site-footer";
import { StudioHeader } from "@/modules/relicto/components/shell/studio-header";
import { wikiSearchParams } from "../lib/search-params";
import type { WikiData } from "../types";
import { ApiBand } from "./api-band";
import { GuideCard } from "./guide-card";
import { RevisionLedger } from "./revision-ledger";
import { WikiIntro } from "./wiki-intro";
import { SectionTitle, WIKI_FILTERS, WikiSearch } from "./wiki-search";
import { WikiSimulator } from "./wiki-simulator";

export function WikiView({ data }: { data: WikiData }) {
  const [{ q: query, topic: filter }, setParams] = useQueryStates(wikiSearchParams, {
    history: "replace",
    clearOnDefault: true,
  });
  const setQuery = (value: string) => void setParams({ q: value });
  const setFilter = (value: string) => void setParams({ topic: value as (typeof wikiSearchParams.topic)["defaultValue"] });
  const [float, setFloat] = useState("0.02840000");

  const guides = useMemo(
    () =>
      data.guides.filter(
        (guide) =>
          `${guide.title} ${guide.summary} ${guide.category}`
            .toLowerCase()
            .includes(query.toLowerCase()) &&
          (filter === WIKI_FILTERS[0] ||
            guide.category.toLowerCase().includes(filter.split(" ")[0].toLowerCase()) ||
            (filter.includes("Gems") && guide.kind === "gem")),
      ),
    [data.guides, filter, query],
  );

  const computed = (Number(float) * 0.92 + 0.0024).toFixed(8);

  return (
    <div className="min-h-screen bg-canvas-base font-body-md text-body-md text-on-surface antialiased">
      <StudioHeader />
      <main className="w-full bg-canvas-base pt-20">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-32 -left-40 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
          <div className="pointer-events-none absolute top-48 right-0 h-125 w-125 rounded-full bg-secondary-container/15 blur-3xl" />
          <WikiIntro />
          <WikiSearch
            query={query}
            setQuery={setQuery}
            filter={filter}
            setFilter={setFilter}
          />
          <section className="px-margin-desktop py-space-lg">
            <div className="mx-auto flex max-w-7xl flex-col gap-space-md">
              <SectionTitle title="Core Field Research & Master Protocols" />
              <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
                {guides.map((guide, index) => (
                  <GuideCard key={guide.id} guide={guide} wide={index === 0} />
                ))}
              </div>
            </div>
          </section>
          <WikiSimulator float={float} setFloat={setFloat} computed={computed} />
          <RevisionLedger revisions={data.revisions} />
          <ApiBand />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
