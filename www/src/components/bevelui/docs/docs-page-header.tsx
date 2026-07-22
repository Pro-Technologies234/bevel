"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DocsBreadcrumb } from "./docs-breadcrumb";
import { IconTerminal2, IconCopy, IconCheck } from "@tabler/icons-react";

export interface DocsPageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  category?: string;
  useCases?: string[];
  tier?: "free" | "pro" | "beta" | "new" | "updated";
  features?: string[];
  registryName?: string;
  className?: string;
}

export function DocsPageHeader({
  title,
  description,
  badge,
  category,
  useCases,
  tier,
  features,
  registryName,
  className,
}: DocsPageHeaderProps) {
  const [copied, setCopied] = React.useState(false);

  const installCmd = registryName
    ? `npx shadcn@latest add https://bevelui.vercel.app/r/${registryName}.json`
    : "";

  function handleCopy() {
    if (!installCmd) return;
    navigator.clipboard.writeText(installCmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className={cn("flex flex-col gap-3 pb-2", className)}>
      <DocsBreadcrumb category={category} title={title} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          {tier && tier !== "free" && (
            <Badge
              variant={tier === "beta" ? "destructive" : "default"}
              className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            >
              {tier}
            </Badge>
          )}

          {badge && !tier && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              {badge}
            </span>
          )}
        </div>

        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-3xl">
          {description}
        </p>
      </div>

      {/* Category Pill & Use-Case Tags (AI Canvas style) */}
      {((useCases && useCases.length > 0) || category) && (
        <div className="flex items-center gap-2 flex-wrap pt-2">
          {category && (
            <span className="px-3 py-1 rounded-md text-xs font-semibold bg-primary text-primary-foreground shadow-xs">
              {category}
            </span>
          )}

          {useCases?.map((useCase) => (
            <span
              key={useCase}
              className="px-3 py-1 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-border/50"
            >
              {useCase}
            </span>
          ))}
        </div>
      )}

      {features && features.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {features.map((f, i) => (
            <Badge
              key={i}
              variant={"secondary"}
              className="flex items-center gap-1.5 text-[11px] bg-secondary/60 text-foreground/80 font-mono rounded-md px-2.5 py-1"
            >
              {f}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

DocsPageHeader.displayName = "DocsPageHeader";
