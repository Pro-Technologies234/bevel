"use client";

import * as React from "react";
import { ChecklistCtx } from "./checklist-context";
import { ChecklistWidget } from "./checklist-widget";
import type { ChecklistStep, ChecklistConfig, ChecklistContextValue, ChecklistStepStatus } from "./types";

export interface ChecklistRootProps {
  steps:     ChecklistStep[];
  config?:   ChecklistConfig;
  children?: React.ReactNode;
}

export function ChecklistRoot({ steps, config = {}, children }: ChecklistRootProps) {
  const key = config.storageKey ?? "bevel-checklist";

  const [statuses, setStatuses] = React.useState<Record<string, ChecklistStepStatus>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(key) ?? "{}");
    } catch { return {}; }
  });

  const [isOpen, setIsOpen] = React.useState(false);

  // Persist on every change
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(statuses)); } catch {}
  }, [statuses, key]);

  const requiredCount  = steps.filter(s => !s.optional).length;
  const completedCount = steps.filter(s => statuses[s.id] === "complete").length;
  const progress       = requiredCount === 0 ? 100 : Math.round((completedCount / requiredCount) * 100);
  const isComplete     = completedCount >= requiredCount;

  function canActivate(id: string): boolean {
    const step = steps.find(s => s.id === id);
    if (!step?.requires?.length) return true;
    return step.requires.every(rid => statuses[rid] === "complete");
  }

  function complete(id: string) {
    setStatuses(p => ({ ...p, [id]: "complete" }));
  }

  function skip(id: string) {
    setStatuses(p => ({ ...p, [id]: "skipped" }));
  }

  function undo(id: string) {
    setStatuses(p => ({ ...p, [id]: "idle" }));
  }

  const ctx: ChecklistContextValue = {
    steps, statuses, isOpen, completedCount, requiredCount,
    progress, isComplete,
    complete, skip, undo,
    open:   () => setIsOpen(true),
    close:  () => setIsOpen(false),
    toggle: () => setIsOpen(p => !p),
    canActivate,
  };

  return (
    <ChecklistCtx.Provider value={ctx}>
      {children}
      {config.position !== "inline" && <ChecklistWidget config={config} />}
    </ChecklistCtx.Provider>
  );
}

ChecklistRoot.displayName = "ChecklistRoot";