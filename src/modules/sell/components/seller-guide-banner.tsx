"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { SteamIcon } from "@/components/ui/steam-icon";
import type { SteamSync } from "../types";
import { SteamTutorialModal } from "./steam-tutorial-modal";

export function SellerGuideBanner({
  steam,
  tradeUrl,
  className,
}: {
  steam?: SteamSync;
  tradeUrl?: string | null;
  className?: string;
}) {
  const isLinked = steam?.linked ?? false;
  const isPrivate = steam?.status === "private";
  const hasTradeUrl = Boolean(tradeUrl && tradeUrl.includes("token="));

  return (
    <section className={cn("mx-auto w-full max-w-7xl px-margin-desktop pt-space-md", className)}>
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-surface-card p-4 shadow-xl backdrop-blur-md sm:p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-tertiary/40 bg-tertiary/15 px-2 py-0.5 font-label-badge text-[10px] font-bold tracking-widest text-tertiary uppercase">
                از Inventory تا بازار، فقط ۴ قدم
              </span>
              <span className="font-data-mono-md text-[10px] text-text-muted">
                SELLER PRE-FLIGHT CHECKLIST
              </span>
            </div>
            <h2 className="font-headline-md text-base font-bold text-text-primary uppercase sm:text-lg">
              آموزش و پیش‌نیازهای فروش آیتم و تسویه آنی
            </h2>
            <p className="max-w-2xl font-body-sm text-xs leading-relaxed text-text-secondary">
              آیتم‌های CS2 یا Dota 2 خود را با قیمت دلاری در رلیکتو بفروشید؛ برای ارسال و دریافت بدون مشکل پیشنهاد ترید، پیش‌نیازهای زیر را تکمیل کنید:
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SteamTutorialModal />
            <Link
              href="/user/kyc"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 font-headline-sm text-xs font-bold text-white uppercase shadow-md transition-all hover:bg-primary/90 hover:shadow-primary/20"
            >
              <Icon name="verified_user" className="text-[15px]" />
              <span>شروع احراز هویت</span>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1: Public Inventory */}
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary/15 text-tertiary">
                <SteamIcon className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  ۱. عمومی‌سازی Inventory
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  تنظیم اینونتوری روی Public جهت خواندن آیتم‌ها
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className={isPrivate ? "font-bold text-error" : isLinked ? "font-bold text-status-live" : "text-text-muted"}>
                {isPrivate ? "⚠️ اینونتوری خصوصی است" : isLinked ? "✓ متصل و فعال" : "در انتظار اتصال"}
              </span>
              <a
                href="https://steamcommunity.com/my/edit/settings"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-tertiary hover:underline"
              >
                <span>تنظیمات استیم</span>
                <Icon name="open_in_new" className="text-[11px]" />
              </a>
            </div>
          </div>

          {/* Step 2: Trade URL */}
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
                <Icon name="swap_horiz" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  ۲. ثبت Trade URL معتبر
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  لینک دریافت خودکار آفر از ربات‌های نگهبان
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className={hasTradeUrl ? "font-bold text-status-live" : "text-text-muted"}>
                {hasTradeUrl ? "✓ لینک ذخیره شده" : "ثبت در پروفایل"}
              </span>
              <Link href="/profile" className="inline-flex items-center gap-0.5 font-medium text-secondary hover:underline">
                <span>ویرایش لینک</span>
                <Icon name="arrow_forward" className="text-[11px]" />
              </Link>
            </div>
          </div>

          {/* Step 3: Steam Guard */}
          <div className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-surface-container-lowest p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-status-upcoming/15 text-status-upcoming">
                <Icon name="shield" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  ۳. استیم گارد موبایل
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  فعال حداقل ۱۵ روز جهت لغو Trade Hold
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className="font-bold text-status-live">✓ تایید ۲۴ساعته</span>
              <Link href="/verify" className="font-medium text-status-upcoming hover:underline">
                بررسی امنیت
              </Link>
            </div>
          </div>

          {/* Step 4: KYC Verification */}
          <div className="flex flex-col justify-between rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <Icon name="verified" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-xs font-bold text-text-primary">
                  ۴. احراز هویت (KYC)
                </span>
                <span className="mt-0.5 font-body-sm text-[11px] text-text-secondary">
                  تسویه آنی و دریافت نشان فروشنده معتبر
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px]">
              <span className="font-bold text-primary">احراز هویت سریع</span>
              <Link
                href="/user/kyc"
                className="inline-flex items-center gap-0.5 font-bold text-primary hover:underline"
              >
                <span>شروع احراز هویت</span>
                <Icon name="arrow_forward" className="text-[11px]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
