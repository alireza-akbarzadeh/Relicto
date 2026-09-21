"use client";

import { useQueryState } from "nuqs";
import { phaseSearchParam } from "../lib/mobile-market";
import type { DopplerPhase } from "../mobile.types";

/** The Doppler phase being tracked (`?phase=`); every panel that prices the knife reads it. */
export function useDopplerPhase(phases: DopplerPhase[], fallback: string) {
  const [phase, setPhase] = useQueryState("phase", phaseSearchParam.withOptions({ history: "replace", clearOnDefault: true }));
  const active = phases.find((entry) => entry.id === phase) ?? phases.find((entry) => entry.id === fallback) ?? phases[0];

  return {
    active,
    select: (id: string) => void setPhase(id === fallback ? null : id),
  };
}
