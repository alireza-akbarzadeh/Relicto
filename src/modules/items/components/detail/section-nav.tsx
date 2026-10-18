"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { SectionLink } from "../../types";

interface SectionNavProps {
  sections: SectionLink[];
}

/** Sticky anchor nav under the hero with active state and smooth scroll tracking. */
export function SectionNav({ sections }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(() => sections[0]?.id ?? "");
  const isManualNavigation = useRef(false);

  useEffect(() => {
    if (sections.length === 0) return;

    const updateActiveSection = () => {
      if (isManualNavigation.current) return;

      // Bottom of page check
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (atBottom) {
        const last = sections[sections.length - 1];
        if (last) setActiveId(last.id);
        return;
      }

      // Find the last section whose top has reached or passed the sticky header threshold
      const threshold = 160;
      let currentActive = sections[0]?.id ?? "";

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentActive = section.id;
          }
        }
      }

      setActiveId(currentActive);
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveSection);
    };

    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && sections.some((s) => s.id === hash)) {
        setActiveId(hash);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);

    // Initial check in an animation frame so it avoids synchronous setState inside effect body
    rafId = requestAnimationFrame(() => {
      const initialHash = window.location.hash.replace(/^#/, "");
      if (initialHash && sections.some((s) => s.id === initialHash)) {
        setActiveId(initialHash);
      } else {
        updateActiveSection();
      }
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
    };
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    isManualNavigation.current = true;

    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `#${id}`);
    }

    setTimeout(() => {
      isManualNavigation.current = false;
    }, 800);
  };

  return (
    <section className="sticky top-20 z-40 w-full border-y border-border-subtle bg-surface-deep/95 shadow-md backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center overflow-x-auto px-4 lg:px-8">
        <nav className="flex items-center gap-2 py-2.5">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "rounded px-3 py-1.5 font-label-caps text-xs whitespace-nowrap transition-all",
                  isActive
                    ? "border border-border-tactical bg-surface-container-high font-bold tracking-wider text-tertiary"
                    : "border border-transparent text-text-muted hover:bg-surface-container hover:text-text-primary",
                )}
              >
                {section.label}
              </a>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
