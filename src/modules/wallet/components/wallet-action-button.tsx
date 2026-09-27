import { Icon, IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const ACTION_STYLES = {
  deposit: {
    active:
      "bg-primary text-on-primary shadow-[0_0_16px_rgba(244,63,94,0.28)]",
    icon: "text-on-primary",
    hover: "hover:bg-primary/90",
  },
  cashout: {
    active:
      "bg-tertiary/10 text-tertiary ring-1 ring-inset ring-tertiary/30",
    icon: "text-tertiary",
    hover: "hover:bg-tertiary/10",
  },
  steam: {
    active:
      "bg-secondary/10 text-secondary ring-1 ring-inset ring-secondary/30",
    icon: "text-secondary",
    hover: "hover:bg-secondary/10",
  },
} as const;


export type WalletAction = keyof typeof ACTION_STYLES;

export function WalletActionButton({
  action,
  icon,
  children,
  active,
  onClick,
}: {
  action: WalletAction;
  icon: IconName;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  const style = ACTION_STYLES[action];

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-space-xs py-space-sm",
        "font-headline-sm text-[13px]",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-card",
        active
          ? style.active
          : cn(
              "bg-surface-container-high text-text-primary",
              "hover:bg-surface-container-highest",
            ),
      )}
    >
      <Icon
        name={icon}
        className={cn(
          "text-[16px] transition-colors",
          active ? style.icon : style.icon,
        )}
      />

      <span className="truncate">{children}</span>
    </button>
  );
}