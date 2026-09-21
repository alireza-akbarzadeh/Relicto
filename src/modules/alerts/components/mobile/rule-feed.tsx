"use client";

import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { countFor, FILTER_LABEL, matchesFilter, ruleFilterParam } from "../../lib/mobile";
import { RULE_FILTERS } from "../../mobile.types";
import { useAlertRules } from "../../state/alert-rules-provider";
import { RuleCard } from "./rule-card";

/** Filter chips (`?kind=`, counts from the live rule book) and the trigger cards. */
export function RuleFeed({ onTune }: { onTune: () => void }) {
  const { rules } = useAlertRules();
  const [filter, setFilter] = useQueryState("kind", ruleFilterParam.withOptions({ history: "replace", clearOnDefault: true }));
  const shown = rules.filter((rule) => matchesFilter(rule, filter));

  return (
    <>
      <div className="flex items-center justify-between gap-space-sm">
        <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-1">
          {RULE_FILTERS.map((option) => (
            <Button
              key={option}
              variant={null}
              size={null}
              aria-pressed={filter === option}
              onClick={() => void setFilter(option)}
              className={cn(
                "h-auto shrink-0 rounded-full border-0 px-3 py-1.5 font-label-badge text-label-badge font-semibold tracking-wider uppercase",
                filter === option ? "bg-primary-container text-on-primary-container shadow-xs" : "bg-surface-container-low text-text-secondary hover:text-text-primary",
              )}
            >
              {FILTER_LABEL[option]} ({countFor(rules, option)})
            </Button>
          ))}
        </div>
        <Button
          variant={null}
          size={null}
          aria-label="New rule"
          onClick={onTune}
          className="h-8 w-8 shrink-0 rounded-lg border-0 bg-surface-container-low text-text-secondary hover:text-text-primary"
        >
          <Icon name="tune" className="text-[18px]" />
        </Button>
      </div>
      <div className="flex flex-col gap-space-md">
        {shown.map((rule) => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </div>
    </>
  );
}
