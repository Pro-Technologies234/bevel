"use client";

import * as React from "react";
import { IconCpu } from "@tabler/icons-react";

export interface DocsBuiltWithProps {
  techs: string[];
}

export function DocsBuiltWith({ techs }: DocsBuiltWithProps) {
  if (!techs || techs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border/50 bg-muted/20 my-6">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <IconCpu size={14} className="text-primary" />
        <span>Built with</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {techs.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-md bg-background border border-border/60 text-xs font-mono text-foreground font-medium shadow-xs"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
