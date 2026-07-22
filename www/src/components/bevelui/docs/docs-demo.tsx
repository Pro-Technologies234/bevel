"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DocsCodeBlock } from "./docs-code-block";
import {
  IconEye,
  IconCode,
  IconMoon,
  IconSun,
  IconRefresh,
  IconMaximize,
  IconMinimize,
  IconWindowMaximize,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export interface DocsDemoProps {
  /** The live preview */
  children: React.ReactNode;
  /** Source code shown in the code tab */
  code?: string;
  language?: string;
  filename?: string;
  /** Label shown above the demo */
  label?: string;
  /** Extra padding in the preview pane */
  padded?: boolean;
  /** Dark background for demos that need it */
  dark?: boolean;
  className?: string;
}

export function DocsDemo({
  children,
  code,
  language = "tsx",
  filename,
  label,
  padded = true,
  dark = false,
  className,
}: DocsDemoProps) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [expanded, setExpanded] = React.useState(false);
  const [darkCanvas, setDarkCanvas] = React.useState(dark);
  const [resetKey, setResetKey] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const showTabs = !!code;

  function handleTab(t: "preview" | "code") {
    setTab(t);
    setExpanded(false);
  }

  function handleRefresh() {
    setResetKey((prev) => prev + 1);
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 overflow-hidden bg-card/80 transition-all my-6",
        isFullscreen && "fixed inset-4 z-50 shadow-2xl flex flex-col my-0 border-border bg-black",
        className
      )}
    >
      {/* Header Toolbar (AI Canvas style) */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/30 backdrop-blur-xs shrink-0">
        <div className="flex items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center rounded-lg border border-border/50 overflow-hidden bg-background p-1 gap-1">
            <button
              onClick={() => handleTab("preview")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors rounded-md",
                tab === "preview"
                  ? "bg-muted text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <IconEye size={14} />
              <span>Preview</span>
            </button>
            {showTabs && (
              <button
                onClick={() => handleTab("code")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors rounded-md",
                  tab === "code"
                    ? "bg-muted text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconCode size={14} />
                <span>Code</span>
              </button>
            )}
          </div>

          {label && (
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              {label}
            </span>
          )}
        </div>

        {/* Action Controls: Theme toggle, Refresh, Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDarkCanvas(!darkCanvas)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title={darkCanvas ? "Light canvas mode" : "Dark canvas mode"}
          >
            {darkCanvas ? <IconSun size={15} /> : <IconMoon size={15} />}
          </button>

          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Reset component state"
          >
            <IconRefresh size={15} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen preview"}
          >
            {isFullscreen ? <IconMinimize size={15} /> : <IconMaximize size={15} />}
          </button>
        </div>
      </div>

      {/* Preview Container */}
      {(!showTabs || tab === "preview") && (
        <div
          key={resetKey}
          className={cn(
            "w-full flex items-center justify-center min-h-[360px] transition-colors relative overflow-auto flex-1",
            padded && "p-6 sm:p-10",
            darkCanvas ? "bg-black text-white" : "bg-muted/10 text-foreground"
          )}
        >
          {/* Canvas grid background effect */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="relative z-10 w-full flex items-center justify-center">
            {children}
          </div>
        </div>
      )}

      {/* Code Container */}
      {showTabs && tab === "code" && code && (
        <div className="relative flex-1 overflow-auto bg-black">
          <div
            className={cn(
              "overflow-hidden transition-all",
              !expanded && !isFullscreen && "max-h-[420px]"
            )}
          >
            <DocsCodeBlock
              code={code}
              language={language}
              filename={filename}
              className="rounded-none border-0"
            />
          </div>

          {!expanded && !isFullscreen && (
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent flex items-end justify-center pb-3">
              <Button
                variant={"inverted"}
                onClick={() => setExpanded(true)}
                className="rounded-md"
              >
                <IconWindowMaximize size={12} />
                Show more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

DocsDemo.displayName = "DocsDemo";
