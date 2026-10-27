"use client";

import Image from "next/image";
import { Play, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ChestDefinition } from "@/modules/chests/types";

export function ChestTableRow({
  chest,
  onToggleActive,
  onSimulate,
  onEdit,
  onDelete,
}: {
  chest: ChestDefinition;
  onToggleActive: (chest: ChestDefinition) => void;
  onSimulate: (chest: ChestDefinition) => void;
  onEdit: (chest: ChestDefinition) => void;
  onDelete: (id: string, slug: string) => void;
}) {
  return (
    <tr className="hover:bg-surface-container/50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-lg bg-surface-container border border-border-subtle">
            <Image
              src={chest.imageUrl || "/images/lootora/hub-01.jpg"}
              alt={chest.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <div>
            <div className="font-sans font-bold text-text-primary text-xs truncate max-w-[150px]">
              {chest.name}
            </div>
            <div className="text-[10px] text-text-muted font-mono">/{chest.slug}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-border-subtle bg-surface-container">
          {chest.rankBadge}
        </span>
      </td>
      <td className="py-3 px-4 text-text-primary">
        {chest.items.length} Skins
      </td>
      <td className="py-3 px-4 text-tertiary font-bold">
        {chest.priceCoins.toLocaleString()} RC
      </td>
      <td className="py-3 px-4 text-text-secondary">
        ${chest.priceUsd.toFixed(2)}
      </td>
      <td className="py-3 px-4 text-text-muted">
        {chest.openCount.toLocaleString()}
      </td>
      <td className="py-3 px-4">
        <Switch
          checked={chest.isActive}
          onCheckedChange={() => onToggleActive(chest)}
        />
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onSimulate(chest)}
            title="Simulate 1,000 Rolls"
            className="text-amber-400 hover:text-amber-300"
          >
            <Play className="size-3.5 fill-current" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onEdit(chest)}
            title="Edit Parameters"
          >
            <Edit3 className="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => onDelete(chest.id, chest.slug)}
            title="Delete Chest"
            className="text-rose-400 hover:text-rose-300"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
