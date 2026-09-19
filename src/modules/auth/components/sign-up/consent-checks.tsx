import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SoonLink } from "@/modules/relicto/components/shell/soon-link";

type ConsentChecksProps = {
  terms: boolean;
  webhooks: boolean;
  onTerms: (value: boolean) => void;
  onWebhooks: (value: boolean) => void;
};

const TEXT = "font-body-sm text-xs leading-normal font-normal text-text-secondary transition-colors group-hover:text-text-primary";
const BOX = "mt-0.5 rounded border-white/20 bg-surface-container-lowest data-checked:border-primary-container data-checked:bg-primary-container";

/** Terms + notification consent. */
export function ConsentChecks({ terms, webhooks, onTerms, onWebhooks }: ConsentChecksProps) {
  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <Label className="group cursor-pointer items-start gap-2.5">
        <Checkbox checked={terms} onCheckedChange={onTerms} className={BOX} />
        <span className={TEXT}>
          I agree to the Relicto{" "}
          <SoonLink label="Terms of Service" className="font-medium text-primary hover:underline" />,{" "}
          <SoonLink label="Privacy Policy" className="font-medium text-primary hover:underline" />, and Steam Trading Compliance
          Rules under Valve Subscriber Agreement.
        </span>
      </Label>
      <Label className="group cursor-pointer items-start gap-2.5">
        <Checkbox checked={webhooks} onCheckedChange={onWebhooks} className={BOX} />
        <span className={TEXT}>
          Enable instant price drop webhooks, tournament skin liquidations, & automated bot escrow sync notifications.
        </span>
      </Label>
    </div>
  );
}
