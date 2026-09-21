"use client";

import { useState } from "react";
import type { AlertsMobile } from "../../mobile.types";
import { AlertRulesProvider } from "../../state/alert-rules-provider";
import { DispatchChannels } from "./dispatch-channels";
import { NewRuleButton, NewRuleSheet } from "./new-rule-sheet";
import { RuleFeed } from "./rule-feed";
import { SniperDeck } from "./sniper-deck";

/** Page body: one rule book shared by the deck, the feed and the new-rule sheet. */
export function AlertsBody({ data }: { data: AlertsMobile }) {
  const [composing, setComposing] = useState(false);
  const open = () => setComposing(true);

  return (
    <AlertRulesProvider initial={data.rules}>
      <div className="flex w-full flex-col gap-space-md px-margin pb-12">
        <SniperDeck data={data} />
        <RuleFeed onTune={open} />
        <DispatchChannels channels={data.channels} />
        <NewRuleButton onClick={open} />
      </div>
      <NewRuleSheet open={composing} onOpenChange={setComposing} fallbackImage={data.rules[0].image} />
    </AlertRulesProvider>
  );
}
