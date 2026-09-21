import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatMoney } from "@/lib/format";
import type { ContractItem } from "../../mobile.types";

type SlotDeckProps = {
  slots: (ContractItem | null)[];
  fillable: number;
  onToggle: (index: number) => void;
  onSmartFill: () => void;
};

/** The ten contract slots: tap a skin to pull it, tap an empty slot to add the next eligible one. */
export function SlotDeck({ slots, fillable, onToggle, onSmartFill }: SlotDeckProps) {
  const full = slots.every(Boolean);

  return (
    <div className="flex flex-col gap-1.5 pt-1">
      <div className="flex items-center justify-between">
        <span className="font-label-caps text-label-caps text-text-secondary uppercase">Committed Arsenal</span>
        <Button
          variant={null}
          size={null}
          onClick={onSmartFill}
          disabled={full || fillable === 0}
          className="h-auto gap-1 border-0 font-label-badge text-label-badge font-semibold text-primary-fixed transition-colors hover:text-text-primary disabled:text-status-upcoming disabled:opacity-100"
        >
          {!full && <Icon name="magic_button" className="text-[14px]" />}
          {full ? "Arsenal Full" : `Smart Fill (${fillable})`}
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-2 pt-1">
        {slots.map((item, index) =>
          item ? (
            <Button
              key={`${index}-${item.id}`}
              variant={null}
              size={null}
              aria-label={`Remove ${item.imageAlt} from the contract`}
              onClick={() => onToggle(index)}
              className="relative h-auto min-w-0 flex-col justify-start rounded-lg border-0 bg-surface-container-low p-1.5 text-body-md font-normal whitespace-normal shadow-xs"
            >
              <Image src={item.image} alt={item.imageAlt} width={96} height={80} sizes="48px" className="h-10 w-12 rounded object-contain" />
              <span className="mt-1 w-full truncate text-center font-label-badge text-[9px] text-text-primary">{item.name}</span>
              <span className="font-data-mono-md text-[10px] text-tertiary">{formatMoney(item.priceUsd)}</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-surface-container-highest font-label-badge text-[10px] text-primary-container">
                ✓
              </span>
            </Button>
          ) : (
            <Button
              key={`${index}-empty`}
              variant={null}
              size={null}
              aria-label={`Fill slot ${index + 1}`}
              onClick={() => onToggle(index)}
              className="group h-20 min-w-0 flex-col rounded-lg border-0 bg-surface-container-lowest p-1.5 text-body-md font-normal shadow-inner transition-colors hover:bg-surface-container"
            >
              <Icon name="add_circle" className="text-[20px] text-text-muted group-hover:text-primary-container" />
              <span className="mt-1 font-label-badge text-[8px] text-text-muted uppercase">Slot {index + 1}</span>
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
