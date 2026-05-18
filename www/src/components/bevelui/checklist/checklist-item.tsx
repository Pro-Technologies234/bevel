"use client";

import * as React from "react";
import { useChecklist } from "./checklist-context";
import { Button } from "@/components/ui/button";
import {
  IconCheck,
  IconMinus,
  IconLock,
  IconRotate,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { ChecklistStep } from "./types";

export function ChecklistItem({ step }: { step: ChecklistStep }) {
  const { statuses, complete, skip, undo, canActivate } = useChecklist();
  const status = statuses[step.id] ?? "idle";
  const active = canActivate(step.id);
  const isDone = status === "complete";
  const isSkipped = status === "skipped";
  const isLocked = !active && status === "idle";

  function handleAction() {
    if (!active) return;
    if (step.onAction) {
      step.onAction();
      complete(step.id);
    } else if (step.href) {
      window.open(step.href, "_blank");
      complete(step.id);
    } else complete(step.id);
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-md transition-colors",
        !isDone && !isSkipped && active && "hover:bg-muted/30",
        (isDone || isSkipped) && "opacity-60",
      )}
    >
      {/* Status icon */}
      <button
        type="button"
        onClick={() =>
          isDone || isSkipped
            ? undo(step.id)
            : active
              ? complete(step.id)
              : undefined
        }
        disabled={isLocked}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
          isDone && "bg-primary border-primary",
          isSkipped && "border-muted-foreground/30",
          !isDone &&
            !isSkipped &&
            active &&
            "border-border hover:border-primary",
          isLocked && "border-muted/30 cursor-not-allowed",
        )}
      >
        {isDone && (
          <IconCheck size={11} strokeWidth={2.5} className="text-black" />
        )}
        {isSkipped && (
          <IconMinus
            size={11}
            strokeWidth={2}
            className="text-muted-foreground/50"
          />
        )}
        {isLocked && (
          <IconLock
            size={9}
            strokeWidth={2}
            className="text-muted-foreground/20"
          />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-[13px] font-medium leading-snug",
            isDone || isSkipped
              ? "line-through text-muted-foreground/50"
              : "text-foreground",
          )}
        >
          {step.title}
        </p>
        {step.description && !isDone && !isSkipped && (
          <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-relaxed">
            {step.description}
          </p>
        )}

        {/* Actions */}
        {!isDone &&
          !isSkipped &&
          active &&
          (step.cta || step.onAction || step.href) && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAction}
                className="h-7 text-[11px]"
              >
                {step.cta ?? "Get started"}
              </Button>
              {step.optional && (
                <button
                  type="button"
                  onClick={() => skip(step.id)}
                  className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          )}
      </div>

      {/* Undo for done */}
      {isDone && (
        <button
          type="button"
          onClick={() => undo(step.id)}
          className="text-muted-foreground/60 hover:text-muted-foreground transition-colors mt-0.5 shrink-0 cursor-pointer"
          title="Mark incomplete"
        >
          <IconRotate size={12} />
        </button>
      )}
    </div>
  );
}

ChecklistItem.displayName = "ChecklistItem";
