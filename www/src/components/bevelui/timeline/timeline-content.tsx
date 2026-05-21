// timeline-content.tsx
"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { TimelineRuler } from "./timeline-ruler";
import { TimelinePlayhead } from "./timeline-playhead";
import { cn } from "@/lib/utils";

export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TimelineContent = React.forwardRef<
  HTMLDivElement,
  TimelineContentProps
>(({ className, children, ...props }, forwardedRef) => {
  const { engine, config } = useTimeline();

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      engine.setContainer(node);
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [engine, forwardedRef],
  );

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      {/* The master viewport. This single box handles BOTH horizontal and vertical scrolling.
          CSS 'sticky' rules below will seamlessly orchestrate what moves and what stays.
        */}
      <div className="overflow-auto w-full max-h-[500px] relative">
        <div
          ref={setRefs}
          className="relative flex flex-col"
          style={{
            // Combined width = static controls width + dynamic clip width from engine
            width: `calc(${config.headerWidth}px + var(--tl-width))`,
            minWidth: "100%",
          }}
        >
          {/* Row 1: The Ruler Layer */}
          <TimelineRuler />

          {/* Row 2+: The Tracks Container Layer */}
          <div className="relative flex flex-col">{children}</div>

          {/* Global Playhead overlay */}
          <TimelinePlayhead />
        </div>
      </div>
    </div>
  );
});

TimelineContent.displayName = "TimelineContent";
