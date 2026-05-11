"use client";

import * as React from "react";
import { usePalette } from "./palette-context";
import { hexToHsl, toRgbString } from "./palette-utils";
import { IconDownload, IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
type ExportFormat = "hex-array" | "css-vars" | "tailwind" | "hsl-array";

const FORMAT_LABELS: Record<ExportFormat, string> = {
  "hex-array": "Hex array",
  "css-vars": "CSS variables",
  tailwind: "Tailwind config",
  "hsl-array": "HSL array",
};

export function PaletteExport() {
  const { colors } = usePalette();
  const [format, setFormat] = React.useState<ExportFormat>("hex-array");
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  function generate(): string {
    if (colors.length === 0) return "";
    switch (format) {
      case "hex-array":
        return JSON.stringify(
          colors.map((c) => c.hex),
          null,
          2,
        );

      case "hsl-array":
        return JSON.stringify(
          colors.map((c) => {
            const [h, s, l] = hexToHsl(c.hex);
            return `hsl(${h}, ${s}%, ${l}%)`;
          }),
          null,
          2,
        );

      case "css-vars": {
        const lines = colors.map((c, i) => {
          const name = c.name
            ? c.name.toLowerCase().replace(/\s+/g, "-")
            : `color-${i + 1}`;
          return `  --color-${name}: ${c.hex};`;
        });
        return `:root {\n${lines.join("\n")}\n}`;
      }

      case "tailwind": {
        const entries = colors.map((c, i) => {
          const name = c.name
            ? `"${c.name.toLowerCase().replace(/\s+/g, "-")}"`
            : `"color-${i + 1}"`;
          return `  ${name}: "${c.hex}",`;
        });
        return `// tailwind.config.js\ncolors: {\n${entries.join("\n")}\n}`;
      }
    }
  }

  function copy() {
    const text = generate();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Popover>
      {" "}
      <PopoverTrigger>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium",
            "text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors",
          )}
        >
          <IconDownload size={13} strokeWidth={1.8} />
          Export
        </button>{" "}
      </PopoverTrigger>
      <PopoverContent align="start">
        {/* Format selector */}
        <div className="flex flex-col gap-1">
          {(Object.keys(FORMAT_LABELS) as ExportFormat[]).map((f) => (
            <Button
              key={f}
              onClick={() => setFormat(f)}
              variant={format === f ? "default" : "ghost"}
              className={cn()}
            >
              {FORMAT_LABELS[f]}
            </Button>
          ))}
        </div>

        {/* Preview */}
        <pre className=" bg-muted/40 rounded-lg p-2 overflow-x-auto max-h-32 border border-border/60">
          {generate() || "No colors"}
        </pre>

        {/* Copy button */}
        <Button onClick={copy} variant={copied ? "outline" : "secondary"}>
          {copied ? (
            <>
              <IconCheck size={12} /> Copied
            </>
          ) : (
            <>
              <IconDownload size={12} /> Copy to clipboard
            </>
          )}
        </Button>
      </PopoverContent>
    </Popover>
  );
}

PaletteExport.displayName = "PaletteExport";
