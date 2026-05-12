"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconBrain, IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function AIChatThinking({
  text,
  title = "Thinking",
  collapsed,
  isStreaming,
  onToggle,
}: {
  text: string;
  title?: string;
  collapsed?: boolean;
  isStreaming?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className=" border-l border-border text-sm">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex  bg-muted/60 rounded-full items-center gap-2 w-full px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        <IconBrain
          size={13}
          strokeWidth={1.8}
          className={cn(
            "shrink-0 text-muted-foreground/50",
            isStreaming && "text-primary/60 animate-pulse",
          )}
        />
        <span className="text-[11px] font-medium text-muted-foreground/60 flex-1">
          {title}
        </span>
        {isStreaming ? (
          <span className="text-[10px] font-mono text-primary/50">
            generating…
          </span>
        ) : (
          <IconChevronDown
            size={12}
            strokeWidth={2}
            className={cn(
              "text-muted-foreground/30 transition-transform",
              collapsed && "-rotate-90",
            )}
          />
        )}
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            <p className="px-3 pb-3 pt-1 text-[11px] font-mono text-muted-foreground/50 leading-relaxed whitespace-pre-wrap border-t border-border/30">
              {text}
              {isStreaming && (
                <span className="inline-block w-0.5 h-3 bg-muted-foreground/30 animate-pulse ml-0.5 align-middle" />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

AIChatThinking.displayName = "AIChatThinking";
