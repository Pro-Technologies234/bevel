"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { cn } from "@/lib/utils";

export interface TimelineTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  controls?: React.ReactNode;
}

export const TimelineTrack = React.forwardRef<
  HTMLDivElement,
  TimelineTrackProps
>(
  (
    {
      className,
      title,
      icon,
      actions,
      selected,
      onSelect,
      controls,
      children,
      ...props
    },
    ref,
  ) => {
    const { config } = useTimeline();
    const headerWidth = config.headerWidth ?? 100;
    const trackHeight = config.trackHeight ?? 48;

    return (
      <div
        ref={ref}
        onClick={onSelect}
        className={cn(
          "flex items-stretch border-b border-neutral-800/60 bg-[#202020]/40 group select-none transition-colors",
          selected && "bg-primary/5 border-l-2 border-l-primary/70",
          className,
        )}
        style={{ height: trackHeight }}
        {...props}
      >
        {/* Track Control Header Area (Pinned Left) */}
        <div
          className="sticky left-0 z-10 flex items-center justify-between px-2 bg-[#232323] border-r border-neutral-800/80 shrink-0 text-[11px] font-medium"
          style={{ width: headerWidth }}
          onClick={(e) => {
            // Prevent deselecting if clicking inside header controls
            if (onSelect) {
              e.stopPropagation();
              onSelect();
            }
          }}
        >
          {controls}
          <div className="flex items-center gap-1.5 min-w-0 truncate text-neutral-300">
            {icon && <div className="text-neutral-500 shrink-0">{icon}</div>}
            <span className="truncate">{title}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions}
          </div>
        </div>

        {/* Content Lane Layer where Clips & Keyframes live */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{ width: "var(--tl-width)" }}
        >
          {children}
        </div>
      </div>
    );
  },
);

TimelineTrack.displayName = "TimelineTrack";
