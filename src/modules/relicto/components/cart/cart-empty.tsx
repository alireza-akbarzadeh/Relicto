import { Icon } from "@/components/ui/icon";
import { LinkButton } from "@/components/ui/link-button";

/** Nothing reserved yet — send them somewhere rather than showing a blank panel. */
export function CartEmpty({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-subtle bg-surface-container-low text-text-muted">
        <Icon name="shopping_bag" className="text-[32px]" />
      </div>
      <div className="flex max-w-[240px] flex-col gap-1">
        <span className="font-headline-sm text-sm font-bold text-text-primary">Your trade basket is empty</span>
        <span className="font-body-sm text-xs text-text-muted">
          Browse verified Counter-Strike 2 and Dota 2 skins to start instant settlement.
        </span>
      </div>
      <LinkButton href="/marketplace" onClick={onNavigate} className="mt-1">
        Browse the marketplace
      </LinkButton>
    </div>
  );
}
