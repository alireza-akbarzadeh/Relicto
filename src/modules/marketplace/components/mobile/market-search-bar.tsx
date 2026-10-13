"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { useMobileMarket } from "../../state/mobile-market-provider";
import { MarketFilterSheet } from "./market-filter-sheet";

/** Live search (writes `q` as you type) plus the filter-matrix sheet. */
export function MarketSearchBar({ placeholder }: { placeholder: string }) {
  const { criteria, set } = useMobileMarket();

  const handleVoiceScan = () => {
    if (typeof window === "undefined") return;
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        onresult: (event: { results: { 0: { 0: { transcript: string } } } }) => void;
        onerror: () => void;
        start: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        onresult: (event: { results: { 0: { 0: { transcript: string } } } }) => void;
        onerror: () => void;
        start: () => void;
      };
    };

    const SpeechClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
    if (!SpeechClass) {
      toast.info("Voice recognition not supported in this browser", { description: "Type skin name directly into the search bar." });
      return;
    }

    try {
      const recognition = new SpeechClass();
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          set({ q: transcript });
          toast.success(`Voice search: "${transcript}"`);
        }
      };
      recognition.onerror = () => {
        toast.error("Could not capture audio from microphone");
      };
      recognition.start();
      toast.info("Listening... speak weapon or skin name");
    } catch {
      toast.error("Microphone access unavailable");
    }
  };

  return (
    <section className="flex w-full items-center gap-space-sm">
      <div role="search" className="relative flex flex-1 items-center">
        <Icon name="search" className="pointer-events-none absolute left-3 text-[20px] text-text-secondary" />
        <Input
          value={criteria.q}
          onChange={(event) => set({ q: event.target.value })}
          type="text"
          enterKeyHint="search"
          aria-label="Search the marketplace"
          placeholder={placeholder}
          className="h-11 rounded-xl border-0 bg-surface-container-low pr-9 pl-10 font-body-sm text-body-sm text-on-surface shadow-inner transition-all duration-200 placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-border-focus md:text-body-sm dark:bg-surface-container-low"
        />
        <Button
          type="button"
          variant={null}
          size={null}
          onClick={handleVoiceScan}
          aria-label="Voice scan search"
          className="absolute right-2.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-0 bg-transparent text-text-muted transition-colors hover:text-primary focus-visible:outline-hidden"
        >
          <Icon name="mic" className="text-[18px]" />
        </Button>
      </div>
      <MarketFilterSheet />
    </section>
  );
}
