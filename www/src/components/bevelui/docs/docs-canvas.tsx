"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type DocsTOCItem = {
  id: string;
  label: string;
  href?: string;
  depth?: 1 | 2 | 3;
};

export interface DocsCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  tocs?: DocsTOCItem[];
}

export const DocsCanvas = React.forwardRef<HTMLDivElement, DocsCanvasProps>(
  ({ asChild, children, className, tocs, ...props }, ref) => {
    const Component = asChild ? (Slot as any) : "div";
    const [activeId, setActiveId] = React.useState<string>("");

    // Scroll spy — highlight the TOC item for the section in view
    React.useEffect(() => {
      if (!tocs?.length) return;
      const headings = tocs
        .map((t) => document.getElementById(t.id))
        .filter(Boolean) as HTMLElement[];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveId(entry.target.id);
          });
        },
        { rootMargin: "0px 0px -60% 0px", threshold: 0 },
      );

      headings.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, [tocs]);

    return (
      <Component
        ref={ref}
        className={cn(
          "flex justify-between flex-1 min-w-0 relative",
          className,
        )}
        {...props}
      >
        <div className=" w-full flex justify-center">{children}</div>

        {/* Right TOC */}
        {tocs && tocs.length > 0 && (
          <aside className="hidden xl:flex sticky top-14  w-56 shrink-0 flex-col py-12 pl-4 pr-6 overflow-y-auto">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
              On this page
            </span>
            <nav className="flex flex-col gap-0.5">
              {tocs.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.href ?? item.id}`}
                  className={cn(
                    "text-xs py-1 transition-colors leading-relaxed",
                    item.depth === 3 && "pl-3",
                    item.depth === 2 && "pl-1.5",
                    activeId === item.id
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
        )}
        <div className="-z-1 opacity-50 absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </Component>
    );
  },
);

DocsCanvas.displayName = "DocsCanvas";
