"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconCheck, IconCopy, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import type { DocPage, DocPageMeta } from "@/content/docs/doc-schema";
import { CopyPageMarkdown } from "@/components/bevelui/docs/docs-content/copy-page-markdown";

const TIER_LABEL: Record<NonNullable<DocPageMeta["tier"]>, string> = {
  free: "Free",
  pro: "Pro",
  beta: "Beta",
};

const TIER_CLASS: Record<NonNullable<DocPageMeta["tier"]>, string> = {
  free: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  pro: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
  beta: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
};

function CopyInstallCommand({ registryName }: { registryName: string }) {
  const [copied, setCopied] = useState(false);
  const command = `npx shadcn@latest add https://bevelui.vercel.app/r/${registryName}.json`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API unavailable — fail silently, command is still selectable.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group flex w-full items-center gap-2 overflow-x-auto rounded-md border border-border/70",
        "bg-muted/40 px-3 py-2 text-left font-mono text-[12.5px] text-foreground/90",
        "hover:border-border hover:bg-muted/60 sm:w-fit sm:max-w-full",
      )}
    >
      <span className="select-none text-muted-foreground">$</span>
      <span className="whitespace-nowrap">{command}</span>
      <span className="ml-1 shrink-0 text-muted-foreground group-hover:text-foreground">
        {copied ? (
          <IconCheck size={14} strokeWidth={2} />
        ) : (
          <IconCopy size={14} strokeWidth={1.9} />
        )}
      </span>
    </button>
  );
}

export function DocsPageHeader({
  meta,
  page,
  className,
}: {
  meta: DocPageMeta;
  /** Full page data — pass this to enable the "Copy page" markdown button. */
  page?: DocPage;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-start justify-between gap-3">
        {meta.category && (
          <p className="font-mono text-[11px] font-medium uppercase tracking-wider text-primary/90">
            {meta.category}
          </p>
        )}
        {page && <CopyPageMarkdown page={page} className="ml-auto shrink-0" />}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <h1 className="text-[26px] font-semibold tracking-tight text-foreground sm:text-[30px]">
          {meta.title}
        </h1>
        {meta.tier && (
          <Badge
            className={cn(
              "rounded-[4px] border px-1.5 py-0 font-mono text-[10px] font-medium uppercase leading-[18px] tracking-wide",
              TIER_CLASS[meta.tier],
            )}
          >
            {TIER_LABEL[meta.tier]}
          </Badge>
        )}
        {meta.badge && (
          <Badge className="rounded-[4px] border border-border/70 bg-muted/60 px-1.5 py-0 font-mono text-[10px] font-medium uppercase leading-[18px] tracking-wide text-muted-foreground">
            {meta.badge}
          </Badge>
        )}
      </div>

      <p className="max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
        {meta.description}
      </p>

      {meta.registryName && (
        <CopyInstallCommand registryName={meta.registryName} />
      )}

      {meta.builtWith && meta.builtWith.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Built with
          </span>
          {meta.builtWith.map((tech) => (
            <span
              key={tech}
              className="rounded-[4px] border border-border/60 bg-card px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function DocsPageFooterNav({ meta }: { meta: DocPageMeta }) {
  if (!meta.prev && !meta.next) return null;

  return (
    <div className="mt-12 grid grid-cols-1 gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
      {meta.prev ? (
        <Link
          href={meta.prev.href}
          className="group flex flex-col gap-1 rounded-md border border-border/70 px-4 py-3 hover:border-border hover:bg-muted/40"
        >
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            <IconArrowLeft size={12} strokeWidth={2} /> Previous
          </span>
          <span className="text-[13.5px] font-medium text-foreground">
            {meta.prev.label}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {meta.next && (
        <Link
          href={meta.next.href}
          className="group flex flex-col items-end gap-1 rounded-md border border-border/70 px-4 py-3 text-right hover:border-border hover:bg-muted/40 sm:items-end"
        >
          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
            Next <IconArrowRight size={12} strokeWidth={2} />
          </span>
          <span className="text-[13.5px] font-medium text-foreground">
            {meta.next.label}
          </span>
        </Link>
      )}
    </div>
  );
}
