import * as React from "react";
import { cn } from "@/lib/utils";

export interface DocsInlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function DocsInlineCode({ children, className, ...props }: DocsInlineCodeProps) {
  return (
    <code
      className={cn(
        "text-[12px] font-mono px-1.5 py-0.5 rounded-md",
        "bg-muted border border-border/60 text-foreground/85",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}

DocsInlineCode.displayName = "DocsInlineCode";
