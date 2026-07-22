"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { motion, useScroll } from "motion/react";

export interface DocsCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  /** @deprecated TOC has been removed. This prop is kept for backward compatibility. */
  tocs?: unknown[];
}

export const DocsCanvas = React.forwardRef<HTMLDivElement, DocsCanvasProps>(
  ({ asChild, children, className, tocs: _tocs, ...props }, ref) => {
    const Component = asChild ? (Slot as any) : "div";
    const { scrollYProgress } = useScroll();

    return (
      <Component
        ref={ref}
        className={cn(
          "flex justify-center flex-1 min-w-0 relative items-start  mx-auto",
          className,
        )}
        {...props}
      >
        {/* Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
        <div className="w-full flex justify-center">{children}</div>
        <div className="-z-1 opacity-50 absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </Component>
    );
  },
);

DocsCanvas.displayName = "DocsCanvas";
