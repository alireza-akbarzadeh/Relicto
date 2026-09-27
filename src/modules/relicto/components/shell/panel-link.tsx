import { MainNavLink } from "../../data/main-nav";
import { Link } from "lucide-react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

export function PanelLink({ link, current }: { link: MainNavLink; current: boolean }) {
  return (
    <li>
      <NavigationMenuLink
        active={current}
        render={<Link href={link.href} />}
        className="group/link flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-surface-container-high data-active:bg-surface-container-high"
      >
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest transition-colors", current ? "text-primary" : "text-text-secondary group-hover/link:text-primary")}>
          <Icon name={link.icon} className="text-[18px]" />
        </span>
        <span className="flex flex-col gap-0.5">
          <span className={cn("font-headline-sm text-sm font-semibold", current ? "text-primary" : "text-text-primary")}>{link.label}</span>
          <span className="font-body-sm text-xs leading-snug text-text-muted">{link.description}</span>
        </span>
      </NavigationMenuLink>
    </li>
  );
}