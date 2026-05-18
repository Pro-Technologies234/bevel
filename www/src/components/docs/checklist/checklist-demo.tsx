"use client";

import * as React from "react";
import {
  ChecklistRoot,
  ChecklistItem,
  ChecklistProgressRing,
  useChecklist,
  type ChecklistStep,
} from "@/components/bevelui/checklist";

const STEPS: ChecklistStep[] = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Add your name, avatar, and timezone.",
    cta: "Edit profile",
    onAction: () => {},
  },
  {
    id: "project",
    title: "Create your first project",
    description: "Start building something real.",
    cta: "New project",
    onAction: () => {},
  },
  {
    id: "invite",
    title: "Invite a teammate",
    description: "Collaborate from day one.",
    cta: "Send invite",
    requires: ["project"],
    onAction: () => {},
  },
  {
    id: "deploy",
    title: "Deploy to production",
    description: "Ship your first version.",
    cta: "Deploy now",
    requires: ["project"],
    optional: true,
    onAction: () => {},
  },
];

function ChecklistDemoInner() {
  const {
    steps, progress, completedCount, requiredCount, isComplete,
  } = useChecklist();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
      {/* Progress widget simulation */}
      <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-card/40 flex-1">
        <ChecklistProgressRing progress={progress} size={64} strokeWidth={3} />
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            {completedCount} of {requiredCount} complete
          </p>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">
            {isComplete ? "You're all set ✦" : "Keep going"}
          </p>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground/30 text-center">
          Floating trigger (bottom-right in production)
        </p>
      </div>

      {/* Inline checklist panel */}
      <div className="w-full sm:w-72 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <span className="text-[13px] font-semibold text-foreground">Get started</span>
          <span className="text-[10px] font-mono text-primary/60">{progress}%</span>
        </div>
        <div className="h-1 bg-muted/40">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex flex-col divide-y divide-border/40 py-1 max-h-72 overflow-y-auto">
          {steps.map(step => <ChecklistItem key={step.id} step={step} />)}
        </div>
      </div>
    </div>
  );
}

export function ChecklistDemo() {
  return (
    <ChecklistRoot steps={STEPS} config={{ storageKey: "demo-checklist-v1" }}>
      <ChecklistDemoInner />
    </ChecklistRoot>
  );
}