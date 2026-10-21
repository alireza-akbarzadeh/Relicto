"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/cn";
import { MAIN_NAV, ownsPath, type MainNavLink } from "../../data/main-nav";

const TOP = "h-9 gap-2 rounded-lg bg-transparent px-3 font-label-caps text-xs font-semibold tracking-wider text-on-surface-variant uppercase transition-colors hover:bg-surface-container/70 hover:text-text-primary";
const CURRENT = "bg-surface-container text-text-primary shadow-xs ring-1 ring-white/5";

function PanelLink({
  link,
  current,
  label,
  description,
}: {
  link: MainNavLink;
  current: boolean;
  label: string;
  description: string;
}) {
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
          <span className={cn("font-headline-sm text-sm font-semibold", current ? "text-primary" : "text-text-primary")}>{label}</span>
          <span className="font-body-sm text-xs leading-snug text-text-muted">{description}</span>
        </span>
      </NavigationMenuLink>
    </li>
  );
}

/**
 * The desktop header navigation: four sections, each opening its own panel.
 * The section holding the current page reads as current, so the trader always
 * sees where they are even when the page itself sits inside a panel.
 */
export function MainNav({ className }: { className?: string }) {
  const path = usePathname();
  const t = useTranslations("nav");

  const sectionLabels: Record<string, string> = {
    market: t("market"),
    trade: t("trade"),
    community: t("community"),
  };

  const linkMeta: Record<string, { label: string; description: string }> = {
    "/marketplace": { label: t("marketplace"), description: t("marketplaceDesc") },
    "/tracker": { label: t("priceTracker"), description: t("priceTrackerDesc") },
    "/alerts": { label: t("priceAlerts"), description: t("priceAlertsDesc") },
    "/wiki": { label: t("wiki"), description: t("wikiDesc") },
    "/sell": { label: t("sellItems"), description: t("sellItemsDesc") },
    "/orders": { label: t("ordersEscrow"), description: t("ordersEscrowDesc") },
    "/profile": { label: t("inventory"), description: t("inventoryDesc") },
    "/community": { label: t("community"), description: t("communityDesc") },
    "/tournaments": { label: t("tournaments"), description: t("tournamentsDesc") },
    "/": { label: t("gameHub"), description: t("gameHubDesc") },
  };

  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="gap-1">
        {MAIN_NAV.map((section) => {
          const sectionLabel = sectionLabels[section.id] ?? section.label;

          if ("href" in section) {
            const current = ownsPath(section.href, path);
            return (
              <NavigationMenuItem key={section.id}>
                <NavigationMenuLink active={current} render={<Link href={section.href} />} className={cn(TOP, "inline-flex items-center", current && CURRENT)}>
                  <Icon name={section.icon} className="text-[16px]" />
                  {sectionLabel}
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          const current = section.links.some((link) => ownsPath(link.href, path));
          return (
            <NavigationMenuItem key={section.id}>
              <NavigationMenuTrigger className={cn(TOP, current && CURRENT)}>
                <Icon name={section.icon} className="text-[16px]" />
                {sectionLabel}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[520px] grid-cols-2 gap-1 p-2">
                  {section.links.map((link) => {
                    const itemMeta = linkMeta[link.href] ?? { label: link.label, description: link.description };
                    return (
                      <PanelLink
                        key={link.href}
                        link={link}
                        current={ownsPath(link.href, path)}
                        label={itemMeta.label}
                        description={itemMeta.description}
                      />
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
