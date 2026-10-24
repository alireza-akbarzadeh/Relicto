"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { useCommandSearch } from "../../hooks/use-command-search";

export function MarketHeaderSearch() {
  const t = useTranslations("shell");
  const { trigger, input } = useCommandSearch();
  return (
    <div className="mx-space-md hidden max-w-md flex-1 lg:block">
      <div {...trigger} className="group min-w-48 cursor-pointer 2xl:min-w-64 relative flex h-10 items-center rounded-xl border border-white/10 bg-surface-container-low/80 px-3.5 backdrop-blur-md transition-all duration-200 focus-within:border-tertiary/50 focus-within:ring-1 focus-within:ring-tertiary/20 hover:border-white/20 hover:bg-surface-container-high">
        <Icon
          name="search"
          className="me-2.5 text-[18px] text-text-muted transition-colors group-focus-within:text-tertiary group-hover:text-text-primary"
        />
        <Input
          {...input}
          placeholder={t("searchMarket")}
          className="h-auto w-full border-0 bg-transparent p-0 font-body-sm text-xs font-medium text-text-primary placeholder:text-text-muted focus-visible:ring-0"
        />
        <kbd className="ms-2 flex h-5 items-center justify-center rounded-md border border-white/5 bg-white/10 px-1.5 font-data-mono-md text-[10px] font-bold text-text-muted shadow-xs">
          {t("searchShortcut")}
        </kbd>
      </div>
    </div>
  );
}

export function LedgerHeaderSearch() {
  const t = useTranslations("shell");
  const { trigger, input } = useCommandSearch();
  return (
    <div className="mx-space-sm hidden max-w-md flex-1 items-center gap-space-md lg:flex">
      <div {...trigger} className="group min-w-48 cursor-pointer 2xl:min-w-64 relative flex h-10 w-full items-center rounded-xl border border-white/10 bg-surface-container-low/80 px-3.5 backdrop-blur-md transition-all duration-200 focus-within:border-tertiary/50 focus-within:ring-1 focus-within:ring-tertiary/20 hover:border-white/20 hover:bg-surface-container-high">
        <Icon
          name="search"
          className="me-2.5 text-[18px] text-text-muted transition-colors group-focus-within:text-tertiary group-hover:text-text-primary"
        />
        <Input
          {...input}
          placeholder={t("searchLedger")}
          className="h-auto w-full border-0 bg-transparent p-0 font-body-sm text-xs font-medium text-text-primary placeholder:text-text-muted focus-visible:ring-0"
        />
        <kbd className="ms-2 flex h-5 items-center justify-center rounded-md border border-white/5 bg-white/10 px-1.5 font-data-mono-md text-[10px] font-bold text-text-muted shadow-xs">
          {t("searchShortcut")}
        </kbd>
      </div>
    </div>
  );
}

export function StudioHeaderSearch() {
  const t = useTranslations("shell");
  const { trigger, input } = useCommandSearch();
  return (
    <div className="relative hidden max-w-xs flex-1 lg:block">
      <div {...trigger} className="group min-w-48 cursor-pointer 2xl:min-w-64 flex h-10 items-center rounded-xl border border-white/10 bg-surface-container-low/80 px-3.5 backdrop-blur-md transition-all duration-200 focus-within:border-secondary/50 focus-within:ring-1 focus-within:ring-secondary/20 hover:border-white/20 hover:bg-surface-container-high">
        <Icon
          name="search"
          className="me-2 text-[18px] text-text-muted transition-colors group-focus-within:text-secondary group-hover:text-text-primary"
        />
        <Input
          {...input}
          placeholder={t("searchStudio")}
          className="h-auto w-full border-0 bg-transparent p-0 font-body-sm text-xs font-medium text-on-surface placeholder:text-text-muted focus-visible:ring-0"
        />
        <div className="ms-2 flex shrink-0 items-center gap-0.5 rounded-md border border-white/5 bg-white/10 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-text-muted">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>
    </div>
  );
}

export function HubHeaderSearch() {
  const t = useTranslations("shell");
  const { trigger, input } = useCommandSearch();
  return (
    <div {...trigger} className="group min-w-48 cursor-pointer 2xl:min-w-64 relative hidden items-center md:flex">
      <Search className="absolute start-3.5 size-4 text-text-muted transition-colors group-focus-within:text-primary group-hover:text-text-primary" />
      <Input
        {...input}
        placeholder={t("searchHub")}
        className="h-10 w-56 rounded-xl border-white/10 bg-surface-container-low/80 ps-9.5 pe-9 text-xs text-white backdrop-blur-md transition-all placeholder:text-text-muted focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/20 md:text-xs lg:w-64"
      />
      <kbd className="absolute end-2.5 rounded-md border border-white/5 bg-white/10 px-1.5 font-mono text-[10px] font-bold text-text-muted">
        /
      </kbd>
    </div>
  );
}

export function VaultHeaderSearch() {
  const t = useTranslations("shell");
  const { trigger, input } = useCommandSearch();
  return (
    <div className="mx-4 hidden max-w-md flex-1 items-center lg:flex">
      <div {...trigger} className="group min-w-48 cursor-pointer 2xl:min-w-64 relative w-full">
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
          <Icon
            name="search"
            className="text-[18px] text-text-muted transition-colors group-focus-within:text-tertiary group-hover:text-text-primary"
          />
        </span>
        <Input
          {...input}
          placeholder={t("searchVault")}
          className="h-10 w-full rounded-xl border-white/10 bg-surface-container-low/80 py-2 ps-9.5 pe-12 text-xs text-on-surface backdrop-blur-md transition-all placeholder:text-text-muted focus-visible:border-tertiary/50 focus-visible:ring-1 focus-visible:ring-tertiary/20 md:text-xs"
        />
        <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2.5">
          <kbd className="rounded-md border border-white/5 bg-white/10 px-1.5 py-0.5 font-data-mono-md text-[10px] font-bold text-text-muted shadow-xs">
            {t("searchShortcut")}
          </kbd>
        </span>
      </div>
    </div>
  );
}