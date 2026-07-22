"use client";

import * as React from "react";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export interface DocsBreadcrumbProps {
  category?: string;
  title: string;
}

export function DocsBreadcrumb({ category, title }: DocsBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4"
    >
      <Link
        href="/docs/components"
        className="hover:text-foreground transition-colors"
      >
        Components
      </Link>
      {category && (
        <>
          <IconChevronRight
            size={12}
            className="text-muted-foreground/40 shrink-0"
          />
          <span className="text-muted-foreground/80">{category}</span>
        </>
      )}
      <IconChevronRight
        size={12}
        className="text-muted-foreground/40 shrink-0"
      />
      <span className="font-medium text-foreground">{title}</span>
    </nav>
  );
}
