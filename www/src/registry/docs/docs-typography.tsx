import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const docsTypographyVariants = cva("relative inline-block ", {
  variants: {
    as: {
      h1: "tracking-tight font-semibold",
      h2: "",
      h3: "",
      h4: "",
      h5: "",
      h6: "",
      span: "",
      p: "text-muted-foreground leading-relaxed ",
    },
    fSize: {
      "7xl": "text-7xl",
      "6xl": "text-6xl",
      "5xl": "text-5xl",
      "4xl": "text-4xl",
      "3xl": "text-3xl",
      "2xl": "text-2xl",
      "xl": "text-xl",
      "lg": "text-lg",
      "base": "text-base",
      "sm": "text-sm",
      "xs": "text-xs",
    }
  },
});



export interface DocsTypographyProps extends React.HTMLProps<HTMLElement> {
  asChild?: boolean;
}

export const DocsTypography = React.forwardRef<
  HTMLElement,
  DocsTypographyProps & VariantProps<typeof docsTypographyVariants>
>(
  (
    { asChild, children, className, as = "p", fSize = 'base', ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : as;

    return (
      <Component
        ref={ref as React.Ref<any>}
        className={cn(docsTypographyVariants({ as, fSize }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

DocsTypography.displayName = "DocsTypography";
