"use client";

import * as React from "react";
import { IconSparkles } from "@tabler/icons-react";
import { getRelatedSystems } from "@/content/docs/manifest";
import { DocsComponentCard } from "./docs-component-card";

export interface DocsRelatedProps {
  currentRoute: string;
}

export function DocsRelated({ currentRoute }: DocsRelatedProps) {
  const relatedSystems = getRelatedSystems(currentRoute);

  if (!relatedSystems || relatedSystems.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 my-10 pt-8 border-t border-border/40">
      <div className="flex items-center gap-2">
        <IconSparkles size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          More like this
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {relatedSystems.map((system) => (
          <DocsComponentCard key={system.route} system={system} />
        ))}
      </div>
    </div>
  );
}
