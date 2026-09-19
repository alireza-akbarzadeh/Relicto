import { Icon, type IconName } from "@/components/ui/icon";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type Arena = "dota2" | "cs2" | "multi";

const ARENAS: { value: Arena; label: string; hint: string; icon: IconName; tone: string }[] = [
  { value: "dota2", label: "Dota 2", hint: "Immortal & Arcana", icon: "shield", tone: "text-primary" },
  { value: "cs2", label: "Counter-Strike 2", hint: "Knives & Gloves", icon: "military_tech", tone: "text-status-upcoming" },
  { value: "multi", label: "Both / Multi-Game", hint: "Aggregated Portfolio", icon: "hub", tone: "text-tertiary" },
];

type ArenaPickerProps = { value: Arena; onChange: (value: Arena) => void };

/** "Preferred primary intel arena" — radio cards. */
export function ArenaPicker({ value, onChange }: ArenaPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-label-caps text-xs font-semibold tracking-wider text-text-secondary uppercase">Preferred Primary Intel Arena</span>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as Arena)} className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {ARENAS.map((arena) => (
          <Label
            key={arena.value}
            className="group flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-surface-deep p-3 leading-normal font-normal text-text-secondary transition-all group-hover:border-white/25 hover:border-white/25 has-[[data-checked]]:border-primary-container has-[[data-checked]]:bg-primary-container/15 has-[[data-checked]]:shadow-[0_0_15px_rgba(255,81,106,0.2)]"
          >
            <RadioGroupItem value={arena.value} className="sr-only" />
            <Icon name={arena.icon} className={`text-[20px] ${arena.tone}`} />
            <span className="flex flex-col">
              <span className="font-headline-sm text-xs font-bold tracking-tight text-text-primary uppercase">{arena.label}</span>
              <span className="font-data-mono-md text-[10px] text-text-muted">{arena.hint}</span>
            </span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
