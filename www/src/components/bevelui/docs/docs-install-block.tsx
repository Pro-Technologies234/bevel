"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy, IconTerminal } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export interface OptionalInstallStep {
  title: string;
  code?: string;
  note?: string;
}

export interface DocsInstallBlockProps {
  registryName: string;
  optionalSteps?: OptionalInstallStep[];
}

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export function DocsInstallBlock({
  registryName,
  optionalSteps,
}: DocsInstallBlockProps) {
  const [activeTab, setActiveTab] = useState<"cli" | "manual">("cli");
  const [pm, setPm] = useState<PackageManager>("npm");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getCliCommand = (pmType: PackageManager) => {
    const url = `https://bevelui.vercel.app/r/${registryName}.json`;
    switch (pmType) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${url}`;
      case "yarn":
        return `yarn dlx shadcn@latest add ${url}`;
      case "bun":
        return `bunx --bun shadcn@latest add ${url}`;
      case "npm":
      default:
        return `npx shadcn@latest add ${url}`;
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const mainCommand = getCliCommand(pm);

  return (
    <div className="flex flex-col gap-4 my-8 rounded-2xl border border-border/60 bg-muted/20 overflow-hidden">
      {/* Header with Title & Mode Tabs */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-muted/30">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            Add to your project
          </h3>
          <p className="text-xs text-muted-foreground">
            One command adds this component and its dependencies to your project.
          </p>
        </div>

        {/* CLI / Manual Tabs */}
        <div className="flex items-center gap-1 bg-background/80 p-1 rounded-lg border border-border/50">
          <button
            onClick={() => setActiveTab("cli")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              activeTab === "cli"
                ? "bg-muted text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            CLI
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all",
              activeTab === "manual"
                ? "bg-muted text-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Manual
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === "cli" ? (
          <div className="flex flex-col gap-6">
            {/* Step 1: CLI Install Command */}
            <div className="flex items-start gap-4">
              <div className="flex size-7 items-center justify-center rounded-full bg-muted border border-border text-xs font-semibold text-foreground shrink-0 mt-0.5">
                1
              </div>

              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-xs font-medium text-foreground">
                    Run the following command in your project root:
                  </p>

                  {/* Package Manager Selectors */}
                  <div className="flex items-center gap-1 bg-background p-0.5 rounded-md border border-border/40">
                    {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPm(p)}
                          className={cn(
                            "px-2 py-0.5 text-[11px] font-mono rounded transition-all",
                            pm === p
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Command Output Box */}
                <div className="relative group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-black border border-border/70 font-mono text-xs text-lime-400">
                  <div className="flex items-center gap-2 min-w-0">
                    <IconTerminal size={14} className="text-muted-foreground shrink-0" />
                    <span className="truncate">{mainCommand}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(mainCommand, 1)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
                    title="Copy command"
                  >
                    {copiedIndex === 1 ? (
                      <IconCheck size={14} className="text-emerald-400" />
                    ) : (
                      <IconCopy size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Steps */}
            {optionalSteps && optionalSteps.length > 0
              ? optionalSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex size-7 items-center justify-center rounded-full bg-muted border border-border text-xs font-semibold text-foreground shrink-0 mt-0.5">
                      {idx + 2}
                    </div>

                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium text-foreground">
                          {step.title}
                        </p>
                        <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
                          Optional
                        </Badge>
                      </div>

                      {step.note && (
                        <p className="text-xs text-muted-foreground">{step.note}</p>
                      )}

                      {step.code && (
                        <div className="relative flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-black border border-border/70 font-mono text-xs text-foreground">
                          <span className="truncate">{step.code}</span>
                          <button
                            onClick={() => handleCopy(step.code!, idx + 2)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors shrink-0"
                          >
                            {copiedIndex === idx + 2 ? (
                              <IconCheck size={14} className="text-emerald-400" />
                            ) : (
                              <IconCopy size={14} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              : (
                <div className="flex items-start gap-4">
                  <div className="flex size-7 items-center justify-center rounded-full bg-muted border border-border text-xs font-semibold text-foreground shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-foreground">
                        Import and compose in your application.
                      </p>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground font-normal">
                        Ready
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The files land directly in your <code className="font-mono text-primary">components/bevelui/</code> directory. You own the code completely.
                    </p>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
            <p>
              Prefer manual copy-paste? Copy the component source directly into your codebase under <code className="font-mono text-primary">components/bevelui/{registryName}/</code>.
            </p>
            <p>
              Check the <strong className="text-foreground">Source Code</strong> section below for exact file declarations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
