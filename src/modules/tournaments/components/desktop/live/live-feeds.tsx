import Link from "next/link";
import type { FeedMatch } from "../../../types";
import { FeedMatchCard } from "./feed-match-card";

export function LiveFeeds({ matches }: { matches: FeedMatch[] }) {
  return (
    <div className="flex flex-col gap-space-md lg:col-span-5">
      <div className="flex items-center justify-between">
        <h2 className="font-headline-sm text-headline-sm tracking-wide text-text-primary uppercase">
          Live Tournament Feeds
        </h2>
        <Link href="#" className="font-label-caps text-label-caps text-primary uppercase hover:underline">
          View All Matches
        </Link>
      </div>
      <div className="flex flex-col gap-space-sm">
        {matches.map((match) => (
          <FeedMatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
