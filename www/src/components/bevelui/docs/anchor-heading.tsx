"use client";

import { IconLink } from "@tabler/icons-react";
import { toast } from "sonner";
import { DocsTypography } from "./docs-typography";

interface AnchorHeadingProps {
  id: string;
  title: string;
}

/**
 * Client component so we can use navigator.clipboard + toast.
 * The static <a href="#id"> is fully crawlable; the click handler
 * is a progressive enhancement for the copy-to-clipboard UX.
 */
export function AnchorHeading({ id, title }: AnchorHeadingProps) {
  return (
    <a
      href={`#${id}`}
      className="group flex items-center gap-2 w-fit -ml-5 pl-5"
      onClick={(e) => {
        // Don't prevent default — browser still navigates to the anchor.
        navigator.clipboard
          .writeText(
            `${window.location.origin}${window.location.pathname}#${id}`,
          )
          .catch(() => {});
        toast.success("Link copied to clipboard", { duration: 1500 });
      }}
    >
      <IconLink
        size={16}
        className="text-muted-foreground/0 group-hover:text-muted-foreground/60 transition-colors -ml-6 absolute"
      />
      <DocsTypography as="h2">{title}</DocsTypography>
    </a>
  );
}
