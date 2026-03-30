import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type TOC = {
  id?: string;
  label?: string;
  href?: string;
}

export interface DocsCanvasProps extends React.HTMLProps<HTMLElement> {
  asChild?: boolean;
  tocs?: TOC[]
}

export const DocsCanvas = React.forwardRef<HTMLElement, DocsCanvasProps>(
  ({ asChild, children, className, tocs, ...props }, ref) => {
    const Component = asChild ? Slot : "div";

    return (
      <Component
        ref={ref as React.Ref<any>}
        className={cn("flex flex-1 min-w-0 relative", className)}
        {...props}
      >
        {children}
        <aside className="hidden xl:flex sticky top-10 h-screen w-32 shrink-0 flex-col gap-2 py-12 pl-2 pr-6">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">
            On this page
          </span>
          {tocs?.map(
            (item,i) => (
              <a
                key={item.id ?? i}
                href={`#${item?.href}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
              >
                {item?.label}
              </a>
            ),
          )}
        </aside>
      </Component>
    );
  },
);

DocsCanvas.displayName = "DocsCanvas";
