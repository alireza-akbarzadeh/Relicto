"use client";

import { useRef, useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent } from "react";

/** State + handlers for a segmented one-character-per-cell code input. */
export function useCodeCells(initial: string[]) {
  const [cells, setCells] = useState(initial);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => refs.current[Math.max(0, Math.min(cells.length - 1, i))]?.focus();

  const onChange = (i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1).toUpperCase();
    setCells((c) => c.map((v, idx) => (idx === i ? char : v)));
    if (char) focus(i + 1);
  };

  const onKeyDown = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !cells[i]) focus(i - 1);
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const chars = e.clipboardData.getData("text").replace(/\s/g, "").toUpperCase().slice(0, cells.length).split("");
    if (!chars.length) return;
    e.preventDefault();
    setCells((c) => c.map((v, idx) => chars[idx] ?? v));
    focus(chars.length);
  };

  const register = (i: number) => (el: HTMLInputElement | null) => {
    refs.current[i] = el;
  };

  /** Fill from a pasted or programmatic code ("VRTXP"). */
  const fill = (value: string) => {
    const chars = value.slice(0, cells.length).split("");
    setCells((c) => c.map((v, idx) => chars[idx] ?? v));
    focus(chars.length);
  };

  return { cells, code: cells.join(""), register, onChange, onKeyDown, onPaste, fill };
}
