import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const docsTypographyVariants = cva("", {
  variants: {
    as: {
      h1: "text-3xl font-semibold tracking-tight text-foreground",
      h2: "text-xl font-semibold tracking-tight text-foreground",
      h3: "text-base font-semibold text-foreground",
      h4: "text-sm font-semibold text-foreground",
      h5: "text-xs font-semibold text-foreground uppercase tracking-wider",
      h6: "text-xs font-medium text-foreground/80 uppercase tracking-wider",
      p: "text-sm text-foreground/80 leading-relaxed",
      span: "text-sm text-foreground",
    },
    fSize: {
      "7xl": "text-7xl",
      "6xl": "text-6xl",
      "5xl": "text-5xl",
      "4xl": "text-4xl",
      "3xl": "text-3xl",
      "2xl": "text-2xl",
      xl: "text-xl",
      lg: "text-lg",
      base: "text-base",
      sm: "text-sm",
      xs: "text-xs",
    },
  },
});

export interface DocsTypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof docsTypographyVariants> {
  asChild?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export const DocsTypography = React.forwardRef<
  HTMLElement,
  DocsTypographyProps
>(({ asChild, children, className, as = "p", fSize, ...props }, ref) => {
  const Component = asChild ? (Slot as any) : as;

  return (
    <Component
      ref={ref}
      className={cn(docsTypographyVariants({ as, fSize }), className)}
      {...props}
    >
      {children}
    </Component>
  );
});

DocsTypography.displayName = "DocsTypography";
