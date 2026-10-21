"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { submitVendorReview } from "../../actions/review";

type ReviewVendorCardProps = {
  code: string;
  vendorHandle: string;
};

export function ReviewVendorCard({ code, vendorHandle }: ReviewVendorCardProps) {
  const t = useTranslations("orderTracking");
  const quickTags = [
    t("tagFastDispatch"),
    t("tagTrustedMerchant"),
    t("tagLegitCache"),
    t("tagGreatComm"),
    t("tagAsDescribed"),
  ];

  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([quickTags[0]]);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    const feedback = quote.trim() || "Item received in perfect condition. Smooth trade!";
    startTransition(async () => {
      try {
        const res = await submitVendorReview({
          code,
          rating,
          quote: feedback,
          tags: selectedTags,
        });

        if (res.success) {
          toast.success(t("reviewPublishedToast"), { description: res.message });
          setSubmitted(true);
        } else {
          toast.error(t("reviewFailedToast"), { description: res.error });
        }
      } catch (err) {
        toast.error(t("reviewErrorToast"), {
          description: err instanceof Error ? err.message : "Internal error",
        });
      }
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-space-md text-emerald-300 shadow-md">
        <div className="flex items-center gap-2 font-headline-sm text-sm font-bold">
          <Icon name="check_circle" className="text-[18px] text-emerald-400" />
          <span>{t("feedbackRecorded", { vendor: vendorHandle })}</span>
        </div>
        <p className="font-body-sm text-xs text-text-secondary">
          {t("feedbackRecordedDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-amber-500/30 bg-surface-container-lowest/90 p-space-md shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
            <Icon name="star" className="text-[16px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-xs font-bold text-text-primary">
              {t("rateVendorTitle")}
            </span>
            <span className="text-[10px] text-text-muted">
              {t("rateVendorDesc", { vendor: vendorHandle })}
            </span>
          </div>
        </div>

        {/* 5-Star Interactive Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              type="button"
              variant={null}
              size={null}
              onClick={() => setRating(star)}
              className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
              title={`${star} Star${star > 1 ? "s" : ""}`}
            >
              <Icon
                name="star"
                filled={star <= rating}
                className={cn("text-[18px]", star <= rating ? "text-amber-400" : "text-text-muted/40")}
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Tag Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {quickTags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <Button
              key={tag}
              type="button"
              variant={null}
              size={null}
              onClick={() => toggleTag(tag)}
              className={cn(
                "h-auto rounded-md px-2 py-1 font-data-mono-md text-[10.5px] font-semibold transition-all",
                active
                  ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                  : "bg-surface-card text-text-muted border border-white/5 hover:text-text-primary"
              )}
            >
              {tag}
            </Button>
          );
        })}
      </div>

      {/* Feedback Text Input */}
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder={t("reviewPlaceholder", { vendor: vendorHandle })}
          className="h-10 w-full rounded-lg border border-white/10 bg-surface-card px-3 font-body-sm text-xs text-text-primary placeholder:text-text-muted/60 focus:border-amber-400/50 focus:outline-hidden"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="button"
          disabled={isPending}
          onClick={handleSubmit}
          className="h-8 gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 font-headline-sm text-xs font-bold text-black shadow-md hover:brightness-110"
        >
          <Icon name="star" className="text-[14px]" />
          <span>{isPending ? t("submittingReview") : t("submitReview", { rating })}</span>
        </Button>
      </div>
    </div>
  );
}
