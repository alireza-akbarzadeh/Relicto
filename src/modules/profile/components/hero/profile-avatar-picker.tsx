import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export const AVATAR_PRESETS = [
  "/images/lootora/avatar.jpg",
  "/images/lootora/items/butterfly-doppler.jpg",
  "/images/lootora/items/manifold-paradox.jpg",
  "/images/lootora/items/dark-artistry-cape.jpg",
  "/images/lootora/items/dragonclaw-hook.jpg",
  "/images/lootora/items/awp-fade.jpg",
];

export function ProfileAvatarPicker({
  avatar,
  setAvatar,
}: {
  avatar: string;
  setAvatar: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-label-caps text-[11px] font-bold tracking-wider text-text-muted uppercase">
        Profile Portrait / Avatar
      </label>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-primary/40 bg-surface-container-highest shadow-inner">
          <Image
            src={avatar || AVATAR_PRESETS[0]}
            alt="Avatar preview"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AVATAR_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={null}
              size={null}
              onClick={() => setAvatar(preset)}
              className={cn(
                "relative h-8 w-8 overflow-hidden rounded-lg border p-0 transition-all",
                avatar === preset
                  ? "scale-105 border-primary ring-2 ring-primary/40"
                  : "border-white/10 opacity-70 hover:opacity-100",
              )}
            >
              <Image src={preset} alt="Preset avatar" fill className="object-cover" />
            </Button>
          ))}
        </div>
      </div>
      <Input
        value={avatar}
        onChange={(e) => setAvatar(e.target.value)}
        placeholder="Or enter custom image URL"
        className="h-9 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary"
      />
    </div>
  );
}
