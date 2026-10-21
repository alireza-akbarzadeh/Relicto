"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { submitTraderKycAction } from "../actions/kyc";

export function KycForm({
  initialHandle = "",
  initialTradeUrl = "",
  initialRealName = "",
}: {
  initialHandle?: string;
  initialTradeUrl?: string;
  initialRealName?: string;
}) {
  const [fullName, setFullName] = useState(initialRealName);
  const [nationalId, setNationalId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [payoutAddress, setPayoutAddress] = useState("");
  const [tradeUrl, setTradeUrl] = useState(initialTradeUrl);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !nationalId.trim() || !phoneNumber.trim()) {
      toast.error("لطفاً تمامی فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    startTransition(async () => {
      const res = await submitTraderKycAction({
        fullName: fullName.trim(),
        nationalId: nationalId.trim(),
        phoneNumber: phoneNumber.trim(),
        payoutAddress: payoutAddress.trim() || undefined,
        tradeUrl: tradeUrl.trim() || undefined,
      });

      if (res.success) {
        toast.success(res.message);
        setIsSuccess(true);
      } else {
        toast.error(res.error);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-status-live/40 bg-status-live/10 p-8 text-center backdrop-blur-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-status-live/20 text-status-live shadow-lg">
          <Icon name="verified_user" className="text-[36px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-headline-lg text-lg font-bold text-text-primary uppercase">
            احراز هویت با موفقیت تایید شد!
          </span>
          <span className="max-w-md font-body-sm text-xs leading-relaxed text-text-secondary">
            حساب کاربری شما به سطح معامله‌گر تایید شده ارتقا یافت. اکنون می‌توانید آیتم‌های خود را در استودیو فروش قرار داده و تسویه آنی دریافت کنید.
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sell"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 font-headline-sm text-xs font-bold text-white uppercase shadow-md transition hover:bg-primary/90"
          >
            <Icon name="storefront" className="text-[16px]" />
            <span>ورود به استودیو فروش و لیست آیتم‌ها</span>
          </Link>
          <Link
            href="/profile"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface-container-lowest px-4 font-headline-sm text-xs font-bold text-text-primary uppercase hover:bg-surface-container"
          >
            <span>مشاهده پروفایل</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="full-name" className="font-label-caps text-[11px] font-bold text-text-secondary uppercase">
            نام و نام خانوادگی کامل (مطابق کارت شناسایی) *
          </label>
          <Input
            id="full-name"
            placeholder="مثال: علیرضا اکبرزاده"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-10 border-white/10 bg-surface-container-lowest font-body-sm text-xs text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="national-id" className="font-label-caps text-[11px] font-bold text-text-secondary uppercase">
            کد ملی / شماره گذرنامه *
          </label>
          <Input
            id="national-id"
            placeholder="۱۰ رقم کد ملی یا شماره پاسپورت"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
            className="h-10 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone-number" className="font-label-caps text-[11px] font-bold text-text-secondary uppercase">
            شماره موبایل فعال (جهت اطلاع‌رسانی ترید) *
          </label>
          <Input
            id="phone-number"
            placeholder="۰۹۱۲..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="h-10 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="payout-address" className="font-label-caps text-[11px] font-bold text-text-secondary uppercase">
            آدرس تتر TRC-20 یا شبا جهت تسویه (اختیاری)
          </label>
          <Input
            id="payout-address"
            placeholder="T... یا IR..."
            value={payoutAddress}
            onChange={(e) => setPayoutAddress(e.target.value)}
            className="h-10 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="trade-url-input" className="font-label-caps text-[11px] font-bold text-text-secondary uppercase">
            لینک ترید استیم (Steam Trade URL)
          </label>
          <a
            href="https://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-headline-sm text-[11px] text-tertiary hover:underline"
          >
            <span>دریافت لینک از استیم</span>
            <Icon name="open_in_new" className="text-[11px]" />
          </a>
        </div>
        <Input
          id="trade-url-input"
          placeholder="https://steamcommunity.com/tradeoffer/new/?partner=...&token=..."
          value={tradeUrl}
          onChange={(e) => setTradeUrl(e.target.value)}
          className="h-10 border-white/10 bg-surface-container-lowest font-data-mono-md text-xs text-text-primary placeholder:text-text-muted"
        />
        <span className="font-body-sm text-[11px] text-text-muted">
          برای اتصال شناسه {initialHandle ? `@${initialHandle}` : "کاربری"} به شبکه ترید خودکار Sentinel Bots.
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-white/[0.08] pt-4">
        <Link href="/sell" className="font-headline-sm text-xs font-semibold text-text-muted hover:text-text-primary">
          انصراف و بازگشت
        </Link>
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={pending}
          className="h-10 gap-2 rounded-lg bg-primary px-6 font-headline-sm text-xs font-bold text-white uppercase shadow-lg hover:bg-primary/90"
        >
          {pending ? <Icon name="sync" className="animate-spin text-[16px]" /> : <Icon name="verified" className="text-[16px]" />}
          <span>{pending ? "در حال ثبت احراز هویت..." : "تایید و ارسال احراز هویت"}</span>
        </Button>
      </div>
    </form>
  );
}
